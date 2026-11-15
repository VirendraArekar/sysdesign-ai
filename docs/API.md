# System Design AI — REST API & WebSocket Specification

## Base URL
- REST API: `/api/v1`
- WebSocket: `/ws` (STOMP over SockJS)

All API responses follow the uniform standard:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2026-11-15T13:20:00Z"
}
```

---

## 1. Authentication & Users (`/api/v1/auth`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Register new user account | No |
| `POST` | `/api/v1/auth/login` | Authenticate & retrieve JWT | No |
| `POST` | `/api/v1/auth/refresh` | Refresh expired JWT token | No (Refresh Token) |
| `GET` | `/api/v1/auth/me` | Fetch authenticated user profile | Yes |
| `PUT` | `/api/v1/users/profile` | Update profile target role & companies | Yes |

---

## 2. Curriculum & Learning (`/api/v1/curriculum`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/v1/curriculum/modules` | List all 13 curriculum modules | No |
| `GET` | `/api/v1/curriculum/modules/{moduleId}` | Get module with topics & subtopics | No |
| `GET` | `/api/v1/curriculum/topics/{topicId}` | Get deep learning content for topic | No |
| `POST` | `/api/v1/curriculum/progress` | Mark topic progress (in_progress, completed) | Yes |
| `GET` | `/api/v1/curriculum/progress` | Get current user curriculum progress | Yes |
| `POST` | `/api/v1/curriculum/bookmarks` | Bookmark topic or problem | Yes |
| `POST` | `/api/v1/curriculum/notes` | Save private note for topic | Yes |

---

## 3. Practice Hub — HLD, LLD & Question Bank (`/api/v1/practice`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/v1/practice/hld` | List all 40+ HLD problems | No |
| `GET` | `/api/v1/practice/hld/{id}` | Get complete HLD design breakdown | No |
| `GET` | `/api/v1/practice/lld` | List all 20 LLD problems | No |
| `GET` | `/api/v1/practice/lld/{id}` | Get full LLD problem, UML & Java code | No |
| `GET` | `/api/v1/practice/questions` | Search question bank with company filters | No |

---

## 4. AI Mock Interview Simulator (`/api/v1/interviews`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/v1/interviews/start` | Start interview session (returns session UUID & first question) | Yes |
| `POST` | `/api/v1/interviews/{sessionId}/reply` | Submit answer & receive dynamic follow-up | Yes |
| `POST` | `/api/v1/interviews/{sessionId}/pause` | Pause active interview session | Yes |
| `POST` | `/api/v1/interviews/{sessionId}/resume` | Resume active interview session | Yes |
| `POST` | `/api/v1/interviews/{sessionId}/finish` | Complete interview & trigger 15-category evaluation | Yes |
| `GET` | `/api/v1/interviews/{sessionId}` | Get interview transcript & progress | Yes |
| `GET` | `/api/v1/interviews/{sessionId}/evaluation` | Fetch final evaluation report & score | Yes |
| `GET` | `/api/v1/interviews/history` | List all previous interview sessions | Yes |

### WebSocket Protocol (`/ws`)
- **Connection endpoint**: `/ws` (SockJS fallback enabled)
- **Subscribe to interview updates**: `/topic/interview/{sessionId}`
- **Send candidate answer**: `/app/interview/{sessionId}/message`
- **Stream AI tokens**: `/topic/interview/{sessionId}/stream`

---

## 5. Architecture Designer (`/api/v1/architecture`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/v1/architecture` | List user's saved architecture diagrams | Yes |
| `POST` | `/api/v1/architecture` | Save or update architecture diagram | Yes |
| `GET` | `/api/v1/architecture/{id}` | Load specific diagram canvas data | Yes |
| `DELETE` | `/api/v1/architecture/{id}` | Delete architecture diagram | Yes |
| `POST` | `/api/v1/architecture/ai-generate` | Generate architecture from problem statement | Yes |
| `POST` | `/api/v1/architecture/ai-review` | Analyze diagram for SPOF, bottlenecks, security | Yes |

---

## 6. Interactive Simulators & Calculators (`/api/v1/simulators`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/v1/simulators/qps-calculator` | Calculate QPS, peak QPS, read/write split | No |
| `POST` | `/api/v1/simulators/storage-calculator` | Calculate daily, monthly, 5-year storage | No |
| `POST` | `/api/v1/simulators/bandwidth-calculator` | Calculate ingress and egress bandwidth | No |
| `POST` | `/api/v1/simulators/availability-calculator` | Calculate uptime and downtime budgets (99.9% - 99.999%) | No |
| `POST` | `/api/v1/simulators/cache-calculator` | Calculate RAM sizing with 80/20 rule | No |
| `POST` | `/api/v1/simulators/consistent-hashing` | Simulate consistent hash ring token distribution | No |
| `POST` | `/api/v1/simulators/rate-limiter` | Simulate Token Bucket / Leaky Bucket algorithms | No |

---

## 7. Analytics & Dashboard (`/api/v1/analytics`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/v1/analytics/dashboard` | Aggregated user stats (streak, hours, score, radar) | Yes |
| `GET` | `/api/v1/analytics/readiness` | System design interview readiness breakdown | Yes |
| `GET` | `/api/v1/analytics/roadmap` | Personalized recommended next learning steps | Yes |

---

## 8. Admin & Monetization (`/api/v1/admin`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/v1/admin/stats` | System-wide statistics and active user count | ROLE_ADMIN |
| `GET` | `/api/v1/admin/ai-usage` | Token usage, API costs, model performance logs | ROLE_ADMIN |
| `GET` | `/api/v1/admin/users` | List and manage users & roles | ROLE_ADMIN |
| `PUT` | `/api/v1/admin/quotas/{userId}` | Update user AI quota limits | ROLE_ADMIN |
