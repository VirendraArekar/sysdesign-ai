#!/usr/bin/env python3
import json
import os
import re

# Read topic definitions from test_topics_count.py
with open("backend/src/main/resources/data/test_topics_count.py", "r", encoding="utf-8") as f:
    content = f.read()

# Extract topics list
content = content.replace("EOF", "")
local_env = {}
exec(content, {}, local_env)
topics_def = local_env["topics"]
print(f"Loaded {len(topics_def)} topic specifications.")

def generate_hld_diagram(t):
    title = t["title"]
    category = t["category"]
    service = t["service"]
    entity = t["entity"]

    if category in ["Social Media", "Gaming"]:
        return f"""flowchart TD
  Client([Client Device / Browser]) -->|WebSocket / HTTPS| EdgeCDN[Global Edge CDN / PoP]
  EdgeCDN -->|Cache Miss| LoadBalancer[Application Load Balancer]
  LoadBalancer --> AppFleet[{service} Pods]
  AppFleet -->|Hot State & PubSub| RedisCache[(Redis Cluster - Hot {entity}s)]
  AppFleet -->|Async Event Queue| Kafka[(Kafka Event Stream)]
  AppFleet -->|Persistent Storage| MainDB[(Distributed NoSQL / Sharded DB)]
  Kafka --> AnalyticsWorker[Async Analytics & Indexing]
  MainDB --> ReadReplica[(Read Replicas)]"""
    elif category == "Fintech":
        return f"""flowchart TD
  Client([Client Banking App]) -->|Mutual TLS| ApiGateway[API Gateway / Auth Router]
  ApiGateway --> RiskEngine[Real-Time Risk & Fraud Evaluator]
  RiskEngine -->|Approved| CoreService[{service}]
  CoreService -->|Double-Entry| LedgerDB[(Immutable General Ledger DB)]
  CoreService -->|Pessimistic Balance Lock| RedisLock[(Redis Distributed Lock)]
  CoreService -->|Payment Network / Clearing| ExternalBank[External Bank Clearing Rails]
  LedgerDB --> AuditStream[(Kafka Tamper-Proof Audit Log)]"""
    elif category in ["E-Commerce", "Mobility & IoT"]:
        return f"""flowchart TD
  Client([Client / Mobile App]) -->|HTTPS / GeoDNS| Route53[Anycast GeoDNS]
  Route53 --> EdgeCache[CloudFront CDN Edge]
  EdgeCache --> ALB[Application Load Balancer]
  ALB --> Fleet[{service} Fleet]
  Fleet -->|Atomic Inventory / Lock| Redis[(Redis Cluster)]
  Fleet -->|Order / Trip Persistence| ShardedDB[(Sharded PostgreSQL Cluster)]
  Fleet -->|Async Notification| Queue[(SQS / Kafka Queue)]
  Queue --> Dispatcher[Dispatch & Notification Worker]"""
    else:
        return f"""flowchart TD
  Client([Client Browser / App]) -->|HTTPS REST / gRPC| LB[Application Load Balancer]
  LB --> ServiceFleet[{service} Service Fleet]
  ServiceFleet -->|1. Check Cache| Cache[(Redis Cache Layer)]
  ServiceFleet -->|2. Query / Persist| DB[(Primary Database Cluster)]
  ServiceFleet -->|3. Event Stream| MessageQueue[(Kafka Message Log)]
  DB --> ReadReplicas[(Read Replicas)]
  MessageQueue --> WorkerFleet[Background Worker Fleet]"""

def generate_uml_class(t):
    service = t["service"]
    entity = t["entity"]
    return f"""classDiagram
  class {entity} {{
    -id: String
    -status: String
    -version: long
    -createdAt: Instant
    -updatedAt: Instant
    +getId(): String
    +getStatus(): String
    +validateState(): boolean
  }}
  class {service} {{
    -repository: DataRepository
    -cache: CacheService
    -lock: ReentrantLock
    +process({entity} item): boolean
    +getById(String id): Optional~{entity}~
    +updateStatus(String id, String newStatus): boolean
  }}
  class StrategyInterface {{
    <<interface>>
    +executeStrategy({entity} context): void
  }}
  class DefaultStrategy {{
    +executeStrategy({entity} context): void
  }}
  {service} --> {entity}
  {service} --> StrategyInterface
  DefaultStrategy ..|> StrategyInterface"""

def generate_uml_sequence(t):
    service = t["service"]
    entity = t["entity"]
    return f"""sequenceDiagram
  autonumber
  Client->>LoadBalancer: Request {title_to_action(t["title"])}
  LoadBalancer->>Service: Route to {service}
  Service->>Cache: Check In-Memory Cache ({entity})
  alt Cache Hit
    Cache-->>Service: Return Cached {entity}
  else Cache Miss
    Service->>Database: Query Persistent Database
    Database-->>Service: Return {entity} Record
    Service->>Cache: Asynchronously Populate Cache
  end
  Service->>Service: Execute Business Strategy & Concurrency Guard
  Service-->>Client: 200 OK Execution Success"""

def title_to_action(title):
    cleaned = re.sub(r"^Design (a|an) ", "", title)
    return cleaned.split("(")[0].strip()

def generate_code_options(t):
    service = t["service"]
    entity = t["entity"]
    pkg = t["id"].replace("-", "")

    java_code = f"""// Java 25 Thread-Safe Production Implementation
package com.sysdesign.modules.catalog.{pkg};

import java.time.Instant;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.concurrent.locks.ReentrantLock;

public record {entity}(
    String id,
    String payload,
    String status,
    long version,
    Instant createdAt
) {{
    public {entity} withStatus(String newStatus) {{
        return new {entity}(id, payload, newStatus, version + 1, createdAt);
    }}
}}

public class {service} {{
    private final ConcurrentHashMap<String, {entity}> storage = new ConcurrentHashMap<>();
    private final ReentrantLock mutationLock = new ReentrantLock();
    private final AtomicLong transactionCounter = new AtomicLong(0);

    public {entity} register(String id, String payload) {{
        mutationLock.lock();
        try {{
            {entity} item = new {entity}(id, payload, "ACTIVE", 1L, Instant.now());
            storage.put(id, item);
            transactionCounter.incrementAndGet();
            return item;
        }} finally {{
            mutationLock.unlock();
        }}
    }}

    public Optional<{entity}> getById(String id) {{
        return Optional.ofNullable(storage.get(id));
    }}

    public boolean updateStatus(String id, String newStatus) {{
        mutationLock.lock();
        try {{
            {entity} existing = storage.get(id);
            if (existing == null) return false;
            storage.put(id, existing.withStatus(newStatus));
            return true;
        }} finally {{
            mutationLock.unlock();
        }}
    }}
}}"""

    python_code = f"""# Python 3.12 Type-Annotated Implementation
import threading
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Dict, Optional

@dataclass(frozen=True)
class {entity}:
    id: str
    payload: str
    status: str
    version: int
    created_at: datetime

    def with_status(self, new_status: str) -> '{entity}':
        return {entity}(
            id=self.id,
            payload=self.payload,
            status=new_status,
            version=self.version + 1,
            created_at=self.created_at
        )

class {service}:
    def __init__(self) -> None:
        self._storage: Dict[str, {entity}] = {{}}
        self._lock = threading.Lock()
        self._counter: int = 0

    def register(self, item_id: str, payload: str) -> {entity}:
        with self._lock:
            item = {entity}(
                id=item_id,
                payload=payload,
                status="ACTIVE",
                version=1,
                created_at=datetime.now(timezone.utc)
            )
            self._storage[item_id] = item
            self._counter += 1
            return item

    def get_by_id(self, item_id: str) -> Optional[{entity}]:
        return self._storage.get(item_id)

    def update_status(self, item_id: str, new_status: str) -> bool:
        with self._lock:
            if item_id not in self._storage:
                return False
            existing = self._storage[item_id]
            self._storage[item_id] = existing.with_status(new_status)
            return True"""

    cpp_code = f"""// C++ 20 Modern Concurrency Implementation
#pragma once
#include <string>
#include <unordered_map>
#include <mutex>
#include <optional>
#include <chrono>

struct {entity} {{
    std::string id;
    std::string payload;
    std::string status;
    int64_t version;
    std::chrono::system_clock::time_point createdAt;
}};

class {service} {{
private:
    std::unordered_map<std::string, {entity}> storage_;
    mutable std::mutex mtx_;
    int64_t counter_ = 0;

public:
    {entity} registerItem(const std::string& id, const std::string& payload) {{
        std::lock_guard<std::mutex> lock(mtx_);
        {entity} item{{id, payload, "ACTIVE", 1, std::chrono::system_clock::now()}};
        storage_[id] = item;
        counter_++;
        return item;
    }}

    std::optional<{entity}> getById(const std::string& id) const {{
        std::lock_guard<std::mutex> lock(mtx_);
        auto it = storage_.find(id);
        if (it != storage_.end()) {{
            return it->second;
        }}
        return std::nullopt;
    }}
}};"""

    go_code = f"""// Go 1.23 High-Performance Implementation
package {pkg}

import (
	"sync"
	"time"
)

type {entity} struct {{
	ID        string    `json:"id"`
	Payload   string    `json:"payload"`
	Status    string    `json:"status"`
	Version   int64     `json:"version"`
	CreatedAt time.Time `json:"createdAt"`
}}

type {service} struct {{
	mu      sync.RWMutex
	storage map[string]{entity}
	counter int64
}}

func New{service}() *{service} {{
	return &{service}{{
		storage: make(map[string]{entity}),
	}}
}}

func (s *{service}) Register(id, payload string) {entity} {{
	s.mu.Lock()
	defer s.mu.Unlock()

	item := {entity}{{
		ID:        id,
		Payload:   payload,
		Status:    "ACTIVE",
		Version:   1,
		CreatedAt: time.Now().UTC(),
	}}
	s.storage[id] = item
	s.counter++
	return item
}}

func (s *{service}) GetByID(id string) (*{entity}, bool) {{
	s.mu.RLock()
	defer s.mu.RUnlock()

	item, exists := s.storage[id]
	if !exists {{
		return nil, false
	}}
	return &item, true
}}"""

    return {
        "java": java_code,
        "python": python_code,
        "cpp": cpp_code,
        "go": go_code
    }

def generate_working_steps(t):
    title = t["title"]
    service = t["service"]
    entity = t["entity"]
    return [
        {
            "stepNumber": 1,
            "component": "Client / Load Balancer Ingress",
            "action": f"Receives inbound request for {title} and terminates TLS.",
            "protocol": "HTTPS / HTTP/3",
            "latency": "5ms - 15ms",
            "interviewerTalkingPoint": "Always discuss DNS resolution, SSL handshakes, and edge CDN termination before core compute."
        },
        {
            "stepNumber": 2,
            "component": "API Gateway / Auth Router",
            "action": "Authenticates JWT claim, checks rate limit quotas, and routes request to microservice pod.",
            "protocol": "gRPC / HTTP/2",
            "latency": "2ms - 5ms",
            "interviewerTalkingPoint": "Mention stateless token verification and token bucket rate limiting at the gateway level."
        },
        {
            "stepNumber": 3,
            "component": f"{service} Compute Cluster",
            "action": f"Executes business validation rules, queries Redis cache for {entity}, and resolves state transitions.",
            "protocol": "Internal gRPC",
            "latency": "3ms - 8ms",
            "interviewerTalkingPoint": "Highlight in-memory cache lookup (cache-aside) and optimistic locking before database writes."
        },
        {
            "stepNumber": 4,
            "component": "Persistence & Replication Layer",
            "action": f"Persists mutated {entity} to sharded database with write-ahead logging (WAL) and primary-replica sync.",
            "protocol": "TCP / SQL Wire",
            "latency": "10ms - 25ms",
            "interviewerTalkingPoint": "Explain sharding key selection to prevent hot partitions and read/write replica isolation."
        },
        {
            "stepNumber": 5,
            "component": "Async Event Bus (Kafka / CDC)",
            "action": f"Publishes domain event for {entity} to Kafka topic for asynchronous indexing, analytics, and notification fan-out.",
            "protocol": "Kafka TCP Protocol",
            "latency": "1ms - 3ms (Async)",
            "interviewerTalkingPoint": "Decouple non-critical side effects using transactional outbox and event-driven consumer groups."
        }
    ]

def generate_related_answers(t):
    title = t["title"]
    service = t["service"]
    entity = t["entity"]
    return [
        {
            "question": f"How do you handle high-concurrency contention when millions of users interact with {entity} simultaneously?",
            "interviewerIntent": "Assessing candidate's deep knowledge of locking primitives, distributed concurrency, and database bottleneck prevention.",
            "modelAnswer": f"To prevent write contention on {entity}, we combine distributed caching with optimistic concurrency control (OCC). For reads, requests hit distributed Redis clusters with 99%+ cache hit rates. For writes, we utilize Redis Lua scripts or atomic CAS operations, with version-based optimistic locking at the database layer (UPDATE {entity} SET status = :status, version = version + 1 WHERE id = :id AND version = :version). If high contention creates write hot-spots, we introduce queue buffering with Kafka partition keys to serialize updates per entity ID.",
            "keyPoints": [
                "Optimistic locking using monotonically increasing version fields",
                "Redis distributed locks with fencing tokens for cross-node coordination",
                "Kafka topic partitioning by entity ID to serialize hot writes",
                "Circuit breakers to fast-fail traffic during downstream latency spikes"
            ],
            "tradeOffs": "Pessimistic locking guarantees strict serializability but limits throughput and introduces deadlock risks. Optimistic locking maximizes throughput under moderate contention but requires client retry strategies during collisions.",
            "edgeCases": "Clock drift between servers when using timestamps instead of monotonic version numbers; network partitions causing split-brain master elections."
        },
        {
            "question": f"What is your data partitioning and sharding strategy for {title} as data grows beyond single-node limits?",
            "interviewerIntent": "Evaluating horizontal scaling competence, sharding key selection, and avoidance of hotspot partitions.",
            "modelAnswer": f"We employ consistent hashing across database shards using MurmurHash3 on the entity ID. This ensures uniform data distribution across nodes. We configure virtual nodes (e.g. 256 vnodes per physical node) to avoid partition skew. For cross-entity queries, we maintain secondary global indexes asynchronously updated via Change Data Capture (CDC) pipelines like Debezium into Elasticsearch.",
            "keyPoints": [
                "Consistent hashing ring with 256 virtual nodes per physical machine",
                "MurmurHash3 / CityHash for uniform 64-bit key distribution",
                "Asynchronous CDC secondary indexing via Debezium and Elasticsearch",
                "Zero-downtime shard rebalancing with dual-write migration protocols"
            ],
            "tradeOffs": "Hash sharding provides uniform distribution but makes range queries expensive (requiring scatter-gather across all shards). Range-based sharding supports efficient range scans but creates hot shards on recent data.",
            "edgeCases": "Celebrity entities / hot keys overwhelming a single shard; handling network partitions during shard migration."
        }
    ]

catalog = []

for t in topics_def:
    hld_points = [
        f"High Throughput & Low Latency SLA: Engineered for peak QPS with sub-50ms p99 latency target and elastic horizontal auto-scaling.",
        f"Stateless Compute Fleet: Microservice pods for {t['service']} deployed across multiple Availability Zones behind L7 Application Load Balancers.",
        f"Distributed In-Memory Caching: Multi-tier Redis Cluster caching hot read paths ({t['entity']}) using cache-aside / write-through with LRU eviction.",
        f"Database Partitioning & Sharding: Sharded relational/NoSQL storage partitioned by consistent hash of entity ID, with primary-replica async replication.",
        f"Resilience & Fault Tolerance: Multi-AZ active-active deployment, circuit breaker fast-fail mechanisms, and dead-letter queue (DLQ) event handling."
    ]

    lld_points = [
        f"Strict SOLID Architecture: Single Responsibility Principle (SRP) isolating domain models ({t['entity']}) from service orchestration ({t['service']}).",
        f"Gang of Four Design Patterns: Implemented Strategy Pattern for swappable business algorithms, Factory Method for instantiation, and Observer for lifecycle events.",
        f"Thread-Safety & Synchronization: Constructed with atomic primitives, ReentrantLock, and ConcurrentHashMap for safe multi-threaded concurrency.",
        f"Extensible Domain Model: Clean interface contracts enabling polymorphic extensions without modifying tested production code."
    ]

    hld_explanation = f"The high-level architecture for {t['title']} is designed for global scale, zero single point of failure (SPOF), and high availability. Requests enter through Anycast DNS and edge CDN caching before hitting L7 Application Load Balancers. The stateless {t['service']} fleet inspects in-memory Redis caches before hitting partitioned database replicas, ensuring predictable low latency under high concurrency."

    lld_explanation = f"The low-level object-oriented architecture for {t['title']} decomposes domain requirements into clean, cohesive domain entities centered around {t['entity']}. The {t['service']} coordinates state transitions, validates business rules, and manages atomic locks to prevent race conditions during high-concurrency execution."

    detail = {
        "id": t["id"],
        "title": t["title"],
        "type": t["type"],
        "category": t["category"],
        "difficulty": t["difficulty"],
        "description": t["summary"],
        "hldPoints": hld_points,
        "systemDesignDiagram": generate_hld_diagram(t),
        "hldExplanation": hld_explanation,
        "lldPoints": lld_points,
        "umlClassDiagram": generate_uml_class(t),
        "umlSequenceDiagram": generate_uml_sequence(t),
        "lldExplanation": lld_explanation,
        "codeOptions": generate_code_options(t),
        "workingSteps": generate_working_steps(t),
        "relatedAnswers": generate_related_answers(t),
        "deepDiveTopics": t.get("tags", [
            "Throughput & QPS Scaling",
            "Cache Invalidation & LRU Eviction",
            "Sharding Key & Consistent Hashing",
            "Fault Tolerance & SPOF Elimination"
        ]),
        "tradeOffs": [
            "Consistency vs Availability (CAP Theorem): Choosing AP for high availability with eventual consistency vs CP for strict serializability.",
            "Cache-Aside vs Write-Through: Cache-aside minimizes stale writes and memory overhead, whereas write-through guarantees cache warmness.",
            "Pessimistic vs Optimistic Locking: Optimistic locking with versioning scales better under read-heavy traffic, while pessimistic locks prevent retry loops in high contention."
        ]
    }
    catalog.append(detail)

output_path = "backend/src/main/resources/data/topics-catalog.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(catalog, f, indent=2)

print(f"Successfully generated {len(catalog)} topics in {output_path} ({os.path.getsize(output_path)} bytes)")
