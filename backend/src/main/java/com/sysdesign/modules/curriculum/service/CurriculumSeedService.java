package com.sysdesign.modules.curriculum.service;

import com.sysdesign.modules.curriculum.model.*;
import com.sysdesign.modules.curriculum.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CurriculumSeedService implements CommandLineRunner {

    private final LearningModuleRepository moduleRepository;
    private final TopicRepository topicRepository;
    private final LearningContentRepository contentRepository;

    public CurriculumSeedService(LearningModuleRepository moduleRepository,
                                 TopicRepository topicRepository,
                                 LearningContentRepository contentRepository) {
        this.moduleRepository = moduleRepository;
        this.topicRepository = topicRepository;
        this.contentRepository = contentRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (moduleRepository.count() > 0) {
            return; // Already seeded
        }

        seedAllCurriculum();
    }

    public void seedAllCurriculum() {
        // Module 1: System Design Fundamentals
        LearningModule m1 = saveModule("fundamentals", "System Design Fundamentals",
                "HLD vs LLD, CAP & PACELC theorems, Scalability, Fault Tolerance and Architectural Trade-offs.", "Layers", 1, 6);
        saveTopicWithContent(m1, "cap-pacelc-theorem", "CAP & PACELC Theorem",
                "Understanding the fundamental trade-offs between consistency, availability, and partition tolerance in distributed storage.",
                "ADVANCED", 1,
                List.of("Consistency Models", "Partition Tolerance", "PACELC Latency Trade-offs", "Real-world Store Mapping"),
                "Think of CAP theorem like a shared Google Doc during a Wi-Fi disconnect. If you and your peer lose connection to each other, you either freeze editing (Consistency) or keep editing and risk conflicts (Availability).",
                "The CAP theorem states that any distributed data store can only simultaneously provide at most two of three guarantees: Consistency (every read receives the most recent write or an error), Availability (every request receives a non-error response without guarantee of recent write), and Partition Tolerance (the system continues to operate despite network partitions). Because network partitions are inevitable in physical networks, distributed systems must trade off Consistency vs Availability during a partition. The PACELC theorem extends this: If there is a Partition (P), trade off Availability (A) and Consistency (C); Else (E), trade off Latency (L) and Consistency (C).",
                "graph TD\n  Client([Client]) --> LB[Load Balancer]\n  LB --> NodeA[(Node A - Leader)]\n  NodeA -. Network Partition .- NodeB[(Node B - Follower)]\n  LB --> NodeB\n  classDef partition stroke:#EF4444,stroke-width:3px;",
                "[\"Provides mathematical clarity on system limits\", \"Guides database selection based on business requirements\", \"PACELC highlights normal-operation latency trade-offs\"]",
                "[\"Often oversimplified into binary CP or AP buckets in practice\", \"Does not model network latency under non-partitioned conditions (solved by PACELC)\"]",
                "[\"Spanner chooses CP with TrueTime atomic clocks to maximize availability\", \"DynamoDB and Cassandra choose AP with tunable eventual consistency\"]",
                "[\"Can a distributed database guarantee both Consistency and Availability when network partitions occur?\", \"How does PACELC explain Cassandra's read latency with QUORUM vs ONE?\", \"Under what circumstances would an e-commerce checkout system prefer AP over CP?\"]",
                "[\"Design an inventory reservation service that guarantees consistency across two data centers during network partitions.\", \"Calculate the probability of stale reads when R + W <= N.\"]");

        saveTopicWithContent(m1, "scalability-and-tradeoffs", "Scalability & Architecture Trade-offs",
                "Horizontal vs vertical scaling, stateless vs stateful architectures, identifying single points of failure.",
                "BEGINNER", 2,
                List.of("Scale Up vs Scale Out", "Stateless Architecture", "Single Points of Failure", "Bottlenecks"),
                "Vertical scaling is upgrading your laptop to a supercomputer. Horizontal scaling is adding ten laptops working together in parallel.",
                "Scalability is the property of a system to handle a growing amount of work by adding resources to the system. Horizontal scaling (scale out) adds more machines into the pool of resources, whereas vertical scaling (scale up) adds more power (CPU, RAM, NVMe) to an existing server. Production architectures aim for stateless application tiers where any node can service any HTTP/REST/gRPC request, delegating state to dedicated, horizontally partitioned distributed data layers.",
                "flowchart LR\n  Clients --> ALB[Application Load Balancer]\n  ALB --> App1[Stateless App Node 1]\n  ALB --> App2[Stateless App Node 2]\n  ALB --> App3[Stateless App Node 3]\n  App1 --> RedisCache[(Distributed Redis)]\n  App2 --> RedisCache\n  App3 --> RedisCache",
                "[\"Horizontal scaling offers virtually limitless theoretical scale\", \"Stateless tiers allow instantaneous auto-scaling and zero-downtime rolling updates\"]",
                "[\"Distributed complexity increases: data serialization, network hops, distributed locking, split-brain\"]",
                "[\"Netflix microservices fleet scaling dynamically based on CPU and request queues\", \"Uber ride matching dispatch service\"]",
                "[\"How do you convert a stateful session-based monolith into a horizontally scalable stateless system?\", \"What are the main bottlenecks when scaling PostgreSQL horizontally for writes?\"]",
                "[\"Identify all single points of failure in a traditional 3-tier monolithic web architecture and redesign it for high availability.\"]");

        // Module 2: Networking
        LearningModule m2 = saveModule("networking", "Networking & Protocols",
                "OSI model, TCP vs UDP, HTTP/2 & HTTP/3, TLS handshakes, WebSockets, gRPC, and API Gateways.", "Network", 2, 5);
        saveTopicWithContent(m2, "http-grpc-websockets", "HTTP/2, HTTP/3, gRPC & WebSockets",
                "Comparing modern transport protocols, multiplexing, binary protocols, and real-time bidirectional communication.",
                "SENIOR", 1,
                List.of("HTTP/2 Multiplexing", "HTTP/3 QUIC (UDP)", "gRPC Protocol Buffers", "WebSockets vs SSE"),
                "HTTP/1.1 is like single-lane traffic. HTTP/2 is a multi-lane highway. HTTP/3 is a high-speed maglev train that doesn't get blocked if one car stalls.",
                "Modern distributed systems utilize protocols optimized for throughput and latency. HTTP/2 introduced binary framing and stream multiplexing over a single TCP connection, eliminating head-of-line blocking at the application layer. HTTP/3 moves from TCP to QUIC (built over UDP), eliminating head-of-line blocking at the transport layer and enabling 0-RTT handshakes. gRPC leverages HTTP/2 multiplexing combined with Protobuf binary serialization, offering up to 7x-10x throughput advantages over JSON REST for inter-service communication.",
                "flowchart TD\n  Client[Mobile / Web Client] -->|HTTPS / HTTP/3| Envoy[Envoy API Gateway]\n  Envoy -->|gRPC / Protobuf| OrderService[Order Microservice]\n  Envoy -->|gRPC / Protobuf| PaymentService[Payment Microservice]\n  Envoy -->|WebSocket| NotificationService[Real-Time Push Service]",
                "[\"gRPC reduces payload serialization size and CPU overhead by 60%+\", \"QUIC eliminates connection migration penalties when switching networks (e.g. WiFi to 5G)\"]",
                "[\"Protobuf payloads are not human-readable in raw network captures\", \"Browsers require gRPC-web proxy translation\"]",
                "[\"Google and Netflix internal service-to-service RPC using gRPC\", \"Figma real-time multiplayer canvas using WebSockets\"]",
                "[\"Why does HTTP/2 still suffer from TCP head-of-line blocking?\", \"When should you choose WebSockets over Server-Sent Events (SSE)?\", \"Explain how gRPC handles client-side load balancing.\"]",
                "[\"Implement a bidirectional streaming gRPC service definition in .proto for live telemetry data.\"]");

        // Module 3: Database Architecture
        LearningModule m3 = saveModule("database", "Database Architecture & Storage",
                "Relational vs NoSQL, B-Trees vs LSM-Trees, Sharding, Read Replicas, 2PC, Saga and CQRS.", "Database", 3, 7);
        saveTopicWithContent(m3, "db-sharding-replication", "Database Sharding, Partitioning & Replication",
                "Horizontal partitioning algorithms, range vs hash sharding, rebalancing, replica lag, and read/write splits.",
                "STAFF", 1,
                List.of("Range-based vs Hash-based Sharding", "Shard Key Selection", "Read Replicas & Replication Lag", "Cross-Shard Queries"),
                "Sharding is like splitting a massive encyclopedia across 26 shelves alphabetically so 26 people can read and write simultaneously without bumping into each other.",
                "When a relational database outgrows single-node vertical limits, horizontal sharding distributes rows across multiple autonomous database instances. Sharding strategies include Hash Sharding (using hash(shard_key) % num_shards to evenly distribute records) and Range Sharding (segmenting by date or alphanumeric ranges). Shard key selection is critical: a poor shard key creates hot spots and forces cross-shard distributed joins that degrade latency exponentially.",
                "flowchart TD\n  App[Application Layer] --> Router[Database Proxy / Shard Router]\n  Router -->|Hash mod 3 = 0| Shard0[(Shard 0 - US Users)]\n  Router -->|Hash mod 3 = 1| Shard1[(Shard 1 - EU Users)]\n  Router -->|Hash mod 3 = 2| Shard2[(Shard 2 - APAC Users)]\n  Shard0 --> Replica0[(Read Replica 0)]",
                "[\"Linear write throughput and storage capacity growth\", \"Isolates blast radius of database failures to specific shards\"]",
                "[\"Cross-shard joins and distributed transactions become slow and complex\", \"Resharding and cluster rebalancing require complex online data migration\"]",
                "[\"Instagram sharding PostgreSQL databases using user_id in ID generation\", \"Slack sharding MySQL clusters via Vitess\"]",
                "[\"How do you handle secondary index queries across sharded databases?\", \"What happens during resharding when doubling the number of shards?\", \"How do you prevent replication lag from serving stale data to a user who just updated their profile?\"]",
                "[\"Design a custom 64-bit ID generator (Snowflake pattern) that encodes shard_id, timestamp, and sequence.\"]");

        // Module 4: Caching
        LearningModule m4 = saveModule("caching", "Distributed Caching & Invalidation",
                "Cache-aside, Write-through, Write-back, Redis clustering, Hot keys, Cache stampede and Cache avalanche.", "Server", 4, 5);
        saveTopicWithContent(m4, "caching-strategies-stampede", "Caching Patterns, Eviction & Stampede Prevention",
                "Deep dive into Cache-Aside vs Write-Through, LRU/LFU eviction, probabilistic early expiration, and distributed locking for hot keys.",
                "SENIOR", 1,
                List.of("Cache-Aside Pattern", "Cache Stampede (Thundering Herd)", "Cache Avalanche & Random Jitter", "Cache Penetration (Bloom Filters)"),
                "A cache is your desk drawer where you keep frequently used files so you don't have to walk to the warehouse archive (the database) every time.",
                "In high-scale systems, caching shields databases from millions of read QPS. The Cache-Aside pattern queries cache first; on a miss, reads from DB and writes back to cache. In Cache Stampede (thundering herd), a hot cache key expires, causing thousands of concurrent requests to hit the database simultaneously. Mitigation techniques include: Mutex locking (only one thread computes and populates cache while others wait), Probabilistic Early Expiration (XFetch algorithm), and Pre-warming.",
                "sequenceDiagram\n  autonumber\n  Client->>Cache: GET key\n  alt Cache Hit\n    Cache-->>Client: Return cached value\n  else Cache Miss\n    Cache-->>Client: null\n    Client->>Lock: Acquire distributed lock (key)\n    Client->>DB: Query Database\n    DB-->>Client: Return record\n    Client->>Cache: SET key (TTL + jitter)\n    Client->>Lock: Release lock\n    Client-->>Client: Process response\n  end",
                "[\"Sub-millisecond read latency (Redis in-memory)\", \"Reduces database load by 80-95% when cache hit ratio exceeds 0.9\"]",
                "[\"Cache inconsistency and stale reads during write operations\", \"Memory costs and complex invalidation invalidation bugs\"]",
                "[\"Twitter/X caching user timelines in Redis clusters\", \"Amazon caching product catalog details with distributed memcached\"]",
                "[\"Explain the XFetch algorithm for probabilistic cache early expiration.\", \"How does a Bloom Filter prevent cache penetration for non-existent records?\", \"Why should you always add random jitter to cache TTLs?\"]",
                "[\"Write a thread-safe Cache-Aside wrapper in Java using Redis SETNX for distributed locking.\"]");

        // Module 5: Load Balancing & Scaling
        LearningModule m5 = saveModule("load-balancing", "Load Balancing & Global Scaling",
                "L4 vs L7 load balancing, Consistent Hashing algorithms, Global Server Load Balancing (GSLB) and Anycast.", "Cpu", 5, 5);
        saveTopicWithContent(m5, "consistent-hashing-l4-l7", "Consistent Hashing & Layer 4 vs Layer 7 Balancing",
                "Virtual nodes, hash ring distribution, minimal key redistribution during cluster resizing, and reverse proxies.",
                "STAFF", 1,
                List.of("Hash Ring Topology", "Virtual Nodes & Skew Reduction", "Layer 4 (TCP/UDP) vs Layer 7 (HTTP/gRPC)", "Sticky Sessions vs Stateless Routing"),
                "Consistent hashing is like placing servers around a clock face. If one server leaves, only its immediate neighbor takes on its load, rather than rearranging everyone in the room.",
                "Traditional hash routing (hash(key) % N) causes almost 100% of keys to remap when N changes. Consistent hashing maps both servers and data keys onto a circular 2^32-1 keyspace ring. When a node is added or removed, only K/N keys need to be reassigned. To prevent non-uniform distribution and hot spots, each physical node is assigned multiple (e.g. 150-250) Virtual Nodes across the ring.",
                "flowchart TD\n  ClientRequest --> Ring[Consistent Hash Ring 0 to 2^32-1]\n  Ring -->|Key: user_49201| NodeB_VNode1[Server B VNode 1]\n  Ring -->|Key: user_81023| NodeA_VNode2[Server A VNode 2]\n  Ring -->|Key: user_12948| NodeC_VNode1[Server C VNode 1]",
                "[\"Minimizes cache misses and data movement when scaling server clusters up or down\", \"Virtual nodes provide smooth load distribution without hotspots\"]",
                "[\"Ring lookups require binary search O(log V) where V = nodes * virtual_nodes\", \"Cascading failure risk if adjacent node cannot handle transferred load\"]",
                "[\"Discord routing gateway connections using consistent hashing\", \"Amazon DynamoDB internal storage node placement\"]",
                "[\"How do virtual nodes prevent load skew in consistent hashing?\", \"Compare HAProxy (L4) with Nginx/Envoy (L7) in terms of throughput and SSL termination.\", \"How does Anycast DNS route users to the geographically closest data center?\"]",
                "[\"Implement a consistent hash ring class in Java with MD5/MurmurHash and TreeMap virtual node routing.\"]");

        // Module 6: Distributed Systems
        LearningModule m6 = saveModule("distributed-systems", "Distributed Systems & Consensus",
                "Consensus protocols, Raft, Paxos, Gossip protocol, Distributed Locks, Quorums, Vector Clocks and Idempotency.", "GitBranch", 6, 8);
        saveTopicWithContent(m6, "consensus-raft-distributed-locks", "Raft Consensus & Distributed Locking",
                "Leader election, log replication, heartbeats, split-brain prevention, and distributed locks using Redis Redlock and Zookeeper.",
                "PRINCIPAL", 1,
                List.of("Raft Leader Election", "Log Replication & Safety Invariants", "Distributed Lock Semantics (Fencing Tokens)", "Redlock Algorithm Analysis"),
                "Raft is like an elected parliament where a majority vote is required to pass any law, ensuring no rogue member can dictate rules alone.",
                "In distributed systems, consensus requires multiple nodes to agree on state transitions despite node crashes and network delays. Raft achieves this by decomposing consensus into Leader Election, Log Replication, and Safety. A leader is elected via majority votes; it accepts client proposals, appends them to its log, replicates to followers, and commits only once quorum (N/2 + 1) acknowledges. For distributed locking, naive Redis SET key token NX EX is insufficient across multiple Redis nodes; Redlock uses majority consensus, and Martin Kleppmann showed fencing tokens (monotonically increasing version numbers) are required to guard shared resources against GC pauses.",
                "sequenceDiagram\n  autonumber\n  Leader->>Follower1: AppendEntries(Term 3, LogIndex 42)\n  Leader->>Follower2: AppendEntries(Term 3, LogIndex 42)\n  Follower1-->>Leader: Success\n  Follower2-->>Leader: Success (Quorum Reached)\n  Leader->>Leader: Commit LogIndex 42\n  Leader->>Client: Acknowledge Success\n  Leader->>Follower1: AppendEntries(CommitIndex 42)",
                "[\"Provides guaranteed linearizability and deterministic state transitions\", \"Self-healing leader election with zero human intervention\"]",
                "[\"Write throughput is bounded by leader bandwidth and quorum network RTT\", \"Requires strict odd number of nodes (3, 5, 7) to maintain majority\"]",
                "[\"etcd in Kubernetes managing cluster state and service endpoints\", \"Kafka KRaft metadata quorum replacing Zookeeper\"]",
                "[\"What happens in Raft when network partition splits 5 nodes into [2] and [3]?\", \"Why are fencing tokens required when implementing distributed locks?\", \"Why did Kafka replace Zookeeper with its own KRaft consensus engine?\"]",
                "[\"Design an idempotent payment processing API using unique transaction idempotency keys, database unique constraints, and state machines.\"]");

        // Module 7: Messaging & Event-Driven Architecture
        LearningModule m7 = saveModule("messaging", "Messaging & Event-Driven Architecture",
                "Apache Kafka, RabbitMQ, Consumer Groups, Partitions, Delivery Guarantees, Dead Letter Queues, and Transactional Outbox.", "Radio", 7, 6);
        saveTopicWithContent(m7, "kafka-architecture-outbox", "Kafka Internals & Transactional Outbox Pattern",
                "Log segments, partition offsets, consumer rebalancing, exactly-once semantics (EOS), and Dual-Write problem resolution.",
                "STAFF", 1,
                List.of("Kafka Partitioning & Offset Management", "Exactly-Once Semantics (EOS)", "Transactional Outbox Pattern", "Dead Letter Queues (DLQ) & Poison Pills"),
                "Kafka is an immutable, append-only flight recorder that multiple control towers can read at their own speed without deleting entries.",
                "Apache Kafka is a distributed event store and stream-processing platform built on an append-only commit log on disk with zero-copy OS transfers (sendfile). Topics are split into Partitions for parallel consumption. The Dual-Write Problem occurs when an application updates a database and publishes an event to Kafka; if either fails, the system is inconsistent. The Transactional Outbox Pattern solves this: the business entity and an outbox event are saved in the same atomic relational database transaction, then an asynchronous worker (or Debezium CDC) reads the outbox table and reliably publishes to Kafka.",
                "flowchart TD\n  App[Order Service] -->|1. Begin DB Transaction| DB[(PostgreSQL)]\n  DB -->|2. Insert Order| OrderTable[orders table]\n  DB -->|3. Insert Event| OutboxTable[outbox_events table]\n  App -->|4. Commit Transaction| DB\n  CDC[Debezium CDC / Outbox Poller] -->|5. Tail WAL Logs| OutboxTable\n  CDC -->|6. Publish Event| KafkaTopic[Kafka: order-events Topic]\n  KafkaTopic --> Consumer[Inventory Service Consumer]",
                "[\"100% eliminates split-brain and dual-write inconsistencies\", \"Kafka scales to millions of events/sec with linear partition scaling\"]",
                "[\"Consumers must be designed to be strictly idempotent to handle at-least-once edge cases\", \"Outbox table polling introduces slight event delivery latency\"]",
                "[\"Uber ride lifecycle events published across dozens of real-time streaming pipelines\", \"Shopify order processing and checkout fulfillment\"]",
                "[\"How does Kafka achieve sub-millisecond latency despite writing to physical disk?\", \"Explain consumer group rebalancing and the difference between Eager and Cooperative rebalance protocols.\", \"What is the role of the Transactional Outbox pattern in microservice event publishing?\"]",
                "[\"Implement a Transactional Outbox processor in Spring Boot using Spring Data JPA and KafkaTemplate.\"]");

        // Module 8: Microservices
        LearningModule m8 = saveModule("microservices", "Microservices Architecture",
                "Service discovery, API Gateway, Database per Service, Saga pattern, CQRS, Service Mesh, and Distributed Tracing.", "Boxes", 8, 6);
        saveTopicWithContent(m8, "saga-cqrs-microservices", "Saga Pattern, CQRS & Distributed Tracing",
                "Orchestration vs Choreography Sagas, Compensating Transactions, CQRS read/write separation, and OpenTelemetry context propagation.",
                "STAFF", 1,
                List.of("Choreography vs Orchestration Saga", "Compensating Transactions", "CQRS (Command Query Responsibility Segregation)", "W3C Trace Context & B3 Headers"),
                "A Saga is like booking a vacation: you book a flight, hotel, and rental car. If the car booking fails, you don't stay stranded—you run compensating actions to cancel the hotel and refund the flight.",
                "In microservices, two-phase commit (2PC) is rarely used because blocking locks destroy availability and latency across distributed services. The Saga pattern manages distributed transactions as a sequence of local transactions. If a step fails, compensating transactions execute in reverse order to roll back earlier changes. Sagas can be Choreographed (event-driven via message broker) or Orchestrated (a centralized state coordinator controls the flow). CQRS separates read and write models: commands update the relational store, which emits events to update an optimized Elasticsearch or read-view store.",
                "sequenceDiagram\n  autonumber\n  Orchestrator->>OrderSvc: Create Pending Order\n  OrderSvc-->>Orchestrator: Order Created\n  Orchestrator->>PaymentSvc: Charge Payment\n  PaymentSvc-->>Orchestrator: Payment Failed!\n  Note over Orchestrator: Trigger Compensating Transaction\n  Orchestrator->>OrderSvc: Cancel Order\n  OrderSvc-->>Orchestrator: Order Cancelled\n  Orchestrator->>User: Notify Order Failure",
                "[\"Preserves microservice autonomy and high availability without 2PC blocking locks\", \"CQRS allows read models to be scaled and indexed independently of write models\"]",
                "[\"Eventually consistent data model means reads may briefly show intermediate states\", \"Compensating transactions must be idempotent and cannot always be undone (e.g. sent SMS)\"]",
                "[\"Amazon multi-step checkout fulfillment and payment capture\", \"Airbnb booking and refund workflows\"]",
                "[\"Compare Choreography vs Orchestration Sagas in terms of coupling and observability.\", \"How does CQRS handle eventual consistency during high-traffic writes?\", \"Explain how OpenTelemetry propagates W3C traceparent headers across HTTP and gRPC boundaries.\"]",
                "[\"Design an Orchestrator Saga state machine in Java for an e-commerce order checkout pipeline.\"]");

        // Module 9: Security
        LearningModule m9 = saveModule("security", "Enterprise Security & Zero Trust",
                "OAuth 2.0, OpenID Connect, JWT architecture, RBAC vs ABAC, SQLi, XSS, CSRF, DDoS, WAF, and Encryption.", "ShieldCheck", 9, 5);
        saveTopicWithContent(m9, "oauth2-jwt-zero-trust", "OAuth 2.0, JWT Lifecycles & Zero Trust Architecture",
                "Authorization Code flow with PKCE, JWT token rotation, revocation blacklists, and mutual TLS (mTLS) service security.",
                "SENIOR", 1,
                List.of("Authorization Code Grant with PKCE", "JWT Claims & Tamper Detection", "Stateless Token Revocation via Redis", "Zero Trust & mTLS"),
                "OAuth 2.0 is like a hotel keycard: you don't get the master key to the building, but a temporary badge that unlocks only your specific room for your stay.",
                "Modern architecture operates on Zero Trust: never trust, always verify. Every request—internal or external—is authenticated and encrypted with mutual TLS (mTLS). User authentication is standardized via OpenID Connect and delegated authorization via OAuth 2.0 (Authorization Code + PKCE for single page applications and mobile). JWT tokens are digitally signed (RS256 or HMAC-SHA256). Because JWTs are stateless, token revocation requires a short TTL (e.g. 15 minutes) coupled with a Redis Bloom filter or blacklist for immediate invalidation upon logout.",
                "flowchart LR\n  SPA[Single Page App] -->|1. Auth Code + PKCE| IdP[Identity Provider (Auth0/Keycloak)]\n  IdP -->|2. Issue JWT Access & Refresh Token| SPA\n  SPA -->|3. Bearer JWT| Gateway[API Gateway]\n  Gateway -->|4. Verify Signature & Claims| Gateway\n  Gateway -->|5. mTLS + User Headers| Microservice[Internal Microservice]",
                "[\"Stateless JWT validation eliminates database lookups on every API request\", \"PKCE protects against authorization code interception attacks on public clients\"]",
                "[\"Compromised JWTs remain valid until expiration unless an active revocation check is maintained\", \"JWT payloads are only Base64 encoded, never put sensitive secrets in claims\"]",
                "[\"Google BeyondCorp Zero Trust enterprise infrastructure\", \"Stripe API authentication with restricted API keys and HMAC webhooks\"]",
                "[\"Why should modern web apps use OAuth 2.0 Authorization Code with PKCE instead of the Implicit Flow?\", \"How do you handle JWT revocation in a distributed environment without turning it into a stateful system?\", \"What is the difference between Role-Based Access Control (RBAC) and Attribute-Based Access Control (ABAC)?\"]",
                "[\"Implement a JWT verification middleware with RSA public key caching and Redis token blacklist checking.\"]");

        // Module 10: Cloud & Infrastructure
        LearningModule m10 = saveModule("cloud-infra", "Cloud Infrastructure & Resilience",
                "AWS architecture, VPC, Kubernetes pod scheduling, Multi-region active-active, Disaster Recovery, RTO and RPO.", "Cloud", 10, 6);
        saveTopicWithContent(m10, "k8s-multi-region-dr", "Kubernetes Architecture & Multi-Region Disaster Recovery",
                "Control plane vs worker nodes, Ingress, Pod autoscaling (HPA), RTO vs RPO, and Pilot Light vs Multi-Region Active-Active.",
                "STAFF", 1,
                List.of("Kubernetes Control Plane (etcd, API server)", "HPA (Horizontal Pod Autoscaler)", "Recovery Time Objective (RTO) & RPO", "Active-Active Multi-Region Routing"),
                "Multi-region active-active is having two identical restaurants running simultaneously in New York and London; if an earthquake hits one, the other immediately absorbs all customers.",
                "Cloud infrastructure relies on automated orchestration and geographic redundancy. Kubernetes orchestrates containers using pods, deployments, and services, monitored by control plane components (kube-apiserver, etcd, kube-scheduler, kube-controller-manager). Disaster recovery is measured by RPO (Recovery Point Objective: max acceptable data loss in time) and RTO (Recovery Time Objective: max downtime before service restoration). Strategies range from Backup & Restore (hours RTO/RPO), Pilot Light (minutes), Warm Standby, to Active-Active Multi-Region (zero RTO, sub-second RPO).",
                "flowchart TD\n  Users[Global Traffic] --> Route53[AWS Route 53 Latency-Based Routing]\n  Route53 -->|US Users| US_ALB[US East ALB]\n  Route53 -->|EU Users| EU_ALB[EU West ALB]\n  US_ALB --> US_EKS[US East EKS Cluster]\n  EU_ALB --> EU_EKS[EU West EKS Cluster]\n  US_EKS --> GlobalDB[(Aurora Global Database - Multi-Region)]\n  EU_EKS --> GlobalDB",
                "[\"Active-Active achieves sub-second failover and local latency for global users\", \"Kubernetes declarative YAML models ensure reproducible infrastructure state\"]",
                "[\"Multi-region database write replication suffers from speed-of-light latency across continents\", \"High cloud networking egress costs\"]",
                "[\"Netflix running AWS Multi-Region active-active failover within 8 minutes\", \"Uber active-active data center dispatch service\"]",
                "[\"How do you resolve write conflicts in an active-active multi-region database setup?\", \"Explain how the Kubernetes Horizontal Pod Autoscaler calculates replica counts based on target CPU utilization.\", \"What is the difference between RTO and RPO in disaster recovery planning?\"]",
                "[\"Calculate the required database replication throughput for an active-active setup with 50,000 write QPS.\"]");

        // Module 11: Observability
        LearningModule m11 = saveModule("observability", "Observability, Telemetry & SRE",
                "Metrics, Logging, Tracing, Prometheus, Grafana, OpenTelemetry, SLIs, SLOs, SLAs, Error Budgets, and Chaos Engineering.", "Activity", 11, 5);
        saveTopicWithContent(m11, "sli-slo-opentelemetry", "SLIs, SLOs, Error Budgets & OpenTelemetry",
                "Defining actionable service levels, burning error budgets, distributed tracing with OpenTelemetry, and Chaos Engineering.",
                "SENIOR", 1,
                List.of("SLI vs SLO vs SLA", "Error Budget Burn Rate", "The Three Pillars: Metrics, Logs, Traces", "Chaos Monkey & Fault Injection"),
                "An SLI is your speedometer (actual speed), an SLO is your target cruise control (65 mph), and the error budget is how many minutes you can safely speed or brake without getting a ticket.",
                "Observability determines the internal state of a complex system based on its external outputs. The Three Pillars are Metrics (aggregatable numerical data over time), Logs (timestamped discrete event records), and Traces (end-to-end request lifecycle across distributed hops). Google SRE principles define SLI (Service Level Indicator, e.g. % of requests faster than 200ms), SLO (Service Level Objective, target goal like 99.9% over 30 days), and SLA (Service Level Agreement with legal/financial penalties). The Error Budget (100% - SLO) governs the release velocity: if burned, feature deploys freeze until reliability is restored.",
                "flowchart LR\n  App[Microservices] -->|OTLP Protocol| OTelCollector[OpenTelemetry Collector]\n  OTelCollector -->|Metrics| Prometheus[(Prometheus TSDB)]\n  OTelCollector -->|Traces| Jaeger[Jaeger / Tempo]\n  OTelCollector -->|Logs| Loki[(Grafana Loki)]\n  Prometheus --> GrafanaDashboard[Grafana Dashboards & Alerts]\n  Jaeger --> GrafanaDashboard\n  Loki --> GrafanaDashboard",
                "[\"Provides actionable alerting on symptoms affecting users rather than noisy server telemetry\", \"Distributed tracing pinpoints exact microservice latency bottlenecks in complex call trees\"]",
                "[\"High storage costs for uncompressed telemetry at high volume (requires trace sampling)\", \"Instrumentation overhead in hot loops\"]",
                "[\"Uber Jaeger tracing billions of spans per day across thousands of microservices\", \"Netflix Chaos Monkey testing resilience in production\"]",
                "[\"How do you calculate the burn rate of an error budget for a 99.9% availability SLO?\", \"What is head-based vs tail-based trace sampling in OpenTelemetry?\", \"Explain the difference between RED method (Rate, Errors, Duration) and USE method (Utilization, Saturation, Errors).\"]",
                "[\"Define Prometheus alerting rules for an API whose error budget burn rate exceeds 14.4x over 1 hour.\"]");

        // Module 12: Design Patterns
        LearningModule m12 = saveModule("design-patterns", "System Architecture & Design Patterns",
                "GoF patterns, Distributed patterns: Circuit Breaker, Bulkhead, Outbox, Retry with Exponential Backoff, Sidecar, and BFF.", "Shapes", 12, 6);
        saveTopicWithContent(m12, "resilience-circuit-breaker-bff", "Circuit Breaker, Bulkhead & Backend for Frontend (BFF)",
                "Failsafe patterns, state transitions (Closed, Open, Half-Open), isolation bulkheads, and client-specific API aggregation.",
                "STAFF", 1,
                List.of("Circuit Breaker State Machine", "Bulkhead Isolation (Thread Pools vs Semaphores)", "Exponential Backoff & Full Jitter", "Backend for Frontend (BFF) Pattern"),
                "A circuit breaker in software works exactly like the electrical fuse in your house: if a downstream appliance catches fire, it trips immediately so your whole house doesn't burn down.",
                "Distributed systems are inherently prone to partial failures. The Circuit Breaker pattern prevents cascading failures when a downstream dependency is slow or unresponsive. In the CLOSED state, requests flow normally; when failure threshold (e.g., 50% errors) is breached, it trips to OPEN, instantly returning fallbacks without contacting the failing service. After a sleep window, it enters HALF-OPEN, allowing canary requests through to verify recovery. The Bulkhead pattern isolates resources (such as thread pools or memory) so exhaustion in one integration cannot starve critical system operations. The BFF (Backend for Frontend) pattern provides dedicated API gateways tailored for web, mobile, and IoT clients.",
                "stateDiagram-v2\n  [*] --> Closed\n  Closed --> Open: Failure Rate > Threshold (50%)\n  Open --> HalfOpen: Sleep Window Elapsed (e.g. 30s)\n  HalfOpen --> Closed: Canary Requests Succeeded\n  HalfOpen --> Open: Canary Request Failed",
                "[\"Prevents thread pool exhaustion and cascading outages across entire microservice graphs\", \"BFF reduces mobile payload size and eliminates multiple round trips over cellular networks\"]",
                "[\"Fallbacks must be carefully designed to prevent incorrect business operations\", \"Adds configuration complexity (thresholds, timeouts, sliding window sizes)\"]",
                "[\"Netflix Resilience4j & Hystrix managing thousands of downstream microservice calls\", \"SoundCloud using BFF pattern for mobile vs desktop clients\"]",
                "[\"What is the mathematical formula for exponential backoff with full jitter?\", \"How does the Bulkhead pattern differ from Rate Limiting?\", \"Under what circumstances should a Circuit Breaker return a degraded cached response vs an error?\"]",
                "[\"Implement a lightweight Circuit Breaker state machine in Java using atomic counters and time windows.\"]");

        // Module 13: Capacity Estimation
        LearningModule m13 = saveModule("capacity-estimation", "Capacity Estimation & Back-of-the-Envelope",
                "QPS, RPS, TPS, DAU/MAU, Peak traffic multipliers, Storage calculations, Bandwidth, Latency budgets and Little's Law.", "Calculator", 13, 5);
        saveTopicWithContent(m13, "qps-storage-bandwidth-estimation", "QPS, Bandwidth & Storage Capacity Estimation",
                "Mastering powers of two, read/write ratios, Little's Law, memory sizing via the 80/20 rule, and 5-year hardware projections.",
                "SENIOR", 1,
                List.of("QPS & Peak Multipliers", "Read/Write Ratio Impact", "Storage Calculation for 5-Year Horizon", "Bandwidth Sizing (Ingress vs Egress)", "Little's Law: L = λ * W"),
                "Back-of-the-envelope estimation is the superpower of calculating whether your system needs 2 servers or 2,000 servers on a napkin in 3 minutes.",
                "In architecture interviews, capacity estimation grounds theoretical designs in physical reality. Key metrics include: Daily Active Users (DAU), Average QPS = DAU * actions_per_user / 86,400 seconds; Peak QPS = Average QPS * Peak Multiplier (typically 2x to 5x). Storage estimations calculate payload size * writes_per_day * 365 days * 5 years, adding 20-30% overhead for indexing and replication factor (e.g. 3x). Little's Law (L = λ * W) calculates the concurrent requests (L) in the system based on arrival rate (λ) and average latency (W).",
                "flowchart LR\n  DAU[50 Million DAU] -->|20 Actions/Day| TotalActions[1 Billion Actions/Day]\n  TotalActions -->|Divide by 86,400s| AvgQPS[~11,600 Avg QPS]\n  AvgQPS -->|Peak Multiplier 3x| PeakQPS[~35,000 Peak QPS]\n  PeakQPS -->|10:1 Read/Write Ratio| ReadWriteSplit[Reads: 31,800 QPS\nWrites: 3,200 QPS]",
                "[\"Validates whether single database or sharding is required before writing any code\", \"Prevents multi-million dollar cloud infrastructure over-provisioning\"]",
                "[\"Estimates are approximations; actual production traffic exhibits unpredictable spikes and black swan events\"]",
                "[\"Twitter/X sizing Redis clusters for 500 million tweets per day\", \"YouTube sizing Google Cloud storage and CDN egress for video ingestion\"]",
                "[\"Estimate the daily storage and peak egress bandwidth for a photo sharing app with 100M DAU where each user uploads 2 photos of 2MB each.\", \"Using Little's Law, how many concurrent threads are required to handle 10,000 QPS if average service latency is 50ms?\", \"Why is the 80/20 rule used for cache memory sizing?\"]",
                "[\"Calculate the total 5-year storage, RAM cache requirement, and network egress bandwidth for an enterprise URL Shortener with 100M new URLs per month.\"]");
    }

    private LearningModule saveModule(String id, String title, String description, String icon, int order, int hours) {
        LearningModule module = new LearningModule(id, title, description, icon, order, hours);
        return moduleRepository.save(module);
    }

    private void saveTopicWithContent(LearningModule module, String id, String title, String summary,
                                      String difficulty, int order, List<String> subtopicTitles,
                                      String beginnerExp, String deepExp, String mermaid,
                                      String advantages, String disadvantages, String useCases,
                                      String interviewQuestions, String practicalExercises) {
        Topic topic = new Topic(id, module, title, summary, difficulty, order);
        Topic savedTopic = topicRepository.save(topic);

        int subOrder = 1;
        for (String sub : subtopicTitles) {
            Subtopic subtopic = new Subtopic(id + "-" + subOrder, savedTopic, sub, subOrder++);
            savedTopic.getSubtopics().add(subtopic);
        }

        LearningContent content = new LearningContent(savedTopic, beginnerExp, deepExp, mermaid);
        content.setAdvantages(advantages);
        content.setDisadvantages(disadvantages);
        content.setRealWorldUseCases(useCases);
        content.setInterviewQuestions(interviewQuestions);
        content.setPracticalExercises(practicalExercises);

        contentRepository.save(content);
        savedTopic.setContent(content);
    }
}
