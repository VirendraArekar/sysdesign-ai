import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 },  // Ramp-up to 20 virtual users
    { duration: '1m', target: 50 },   // Sustained load at 50 users
    { duration: '30s', target: 100 }, // Peak burst load at 100 users
    { duration: '30s', target: 0 },   // Ramp-down
  ],
  thresholds: {
    http_req_duration: ['p(95)<250'], // 95% of requests must complete below 250ms
    http_req_failed: ['rate<0.01'],   // Error rate must be under 1%
  },
};

const BASE_URL = __ENV.API_BASE_URL || 'http://localhost:8080/api/v1';

export default function () {
  // 1. Healthcheck probe
  const healthRes = http.get(`${BASE_URL}/health`);
  check(healthRes, {
    'healthcheck status is 200': (r) => r.status === 200,
  });

  // 2. Fetch 13 curriculum modules
  const curriculumRes = http.get(`${BASE_URL}/curriculum/modules`);
  check(curriculumRes, {
    'curriculum status is 200': (r) => r.status === 200,
    'has 13 modules': (r) => JSON.parse(r.body).data.length >= 13,
  });

  // 3. Fetch HLD blueprints
  const hldRes = http.get(`${BASE_URL}/practice/hld`);
  check(hldRes, {
    'hld list status is 200': (r) => r.status === 200,
  });

  // 4. Run distributed capacity estimation calculation
  const capacityPayload = JSON.stringify({
    dailyActiveUsers: 50000000,
    actionsPerUser: 25,
    readWriteRatio: 10,
    peakTrafficMultiplier: 2.5,
    avgPayloadBytes: 2048,
    retentionYears: 5,
    replicationFactor: 3,
  });

  const capacityRes = http.post(`${BASE_URL}/simulators/capacity`, capacityPayload, {
    headers: { 'Content-Type': 'application/json' },
  });

  check(capacityRes, {
    'capacity calculator status is 200': (r) => r.status === 200,
    'avgQps calculated': (r) => JSON.parse(r.body).data.avgQps > 0,
  });

  // 5. Test semantic RAG search
  const ragPayload = JSON.stringify({
    query: 'Consistent Hashing and Virtual Nodes',
    topK: 5,
    categoryFilter: 'ALL',
  });

  const ragRes = http.post(`${BASE_URL}/rag/search`, ragPayload, {
    headers: { 'Content-Type': 'application/json' },
  });

  check(ragRes, {
    'rag search status is 200': (r) => r.status === 200,
    'has search results': (r) => JSON.parse(r.body).data.length > 0,
  });

  sleep(1);
}
