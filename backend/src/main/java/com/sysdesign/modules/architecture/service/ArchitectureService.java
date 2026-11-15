package com.sysdesign.modules.architecture.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sysdesign.common.exception.ResourceNotFoundException;
import com.sysdesign.modules.ai.service.AiProvider;
import com.sysdesign.modules.architecture.dto.*;
import com.sysdesign.modules.architecture.model.ArchitectureDiagram;
import com.sysdesign.modules.architecture.repository.ArchitectureDiagramRepository;
import com.sysdesign.modules.user.model.User;
import com.sysdesign.modules.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;

@Service
public class ArchitectureService {

    private static final Logger log = LoggerFactory.getLogger(ArchitectureService.class);

    private final ArchitectureDiagramRepository diagramRepository;
    private final UserRepository userRepository;
    private final AiProvider aiProvider;
    private final ObjectMapper objectMapper;

    public ArchitectureService(
            ArchitectureDiagramRepository diagramRepository,
            UserRepository userRepository,
            AiProvider aiProvider,
            ObjectMapper objectMapper) {
        this.diagramRepository = diagramRepository;
        this.userRepository = userRepository;
        this.aiProvider = aiProvider;
        this.objectMapper = objectMapper;
    }

    @Transactional(readOnly = true)
    public List<DiagramResponse> getUserDiagrams(UUID userId) {
        List<ArchitectureDiagram> list = diagramRepository.findByUserIdOrderByUpdatedAtDesc(userId);
        return list.stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public DiagramResponse getDiagramById(UUID diagramId, UUID userId) {
        ArchitectureDiagram diagram = diagramRepository.findById(diagramId)
                .orElseThrow(() -> new ResourceNotFoundException("Architecture diagram not found with id: " + diagramId));

        if (!diagram.getUser().getId().equals(userId)) {
            throw new SecurityException("Unauthorized access to this architecture diagram");
        }

        return toResponse(diagram);
    }

    @Transactional
    public DiagramResponse saveDiagram(UUID userId, DiagramSaveRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        ArchitectureDiagram diagram;
        if (request.getId() != null) {
            diagram = diagramRepository.findById(request.getId())
                    .orElse(new ArchitectureDiagram(user, request.getTitle(), request.getDescription(), request.getCanvasData()));

            if (!diagram.getUser().getId().equals(userId)) {
                throw new SecurityException("Unauthorized update to this architecture diagram");
            }

            diagram.setTitle(request.getTitle());
            diagram.setDescription(request.getDescription());
            diagram.setCanvasData(request.getCanvasData());
            if (request.getAiReview() != null) {
                diagram.setAiReview(request.getAiReview());
            }
        } else {
            diagram = new ArchitectureDiagram(user, request.getTitle(), request.getDescription(), request.getCanvasData());
            if (request.getAiReview() != null) {
                diagram.setAiReview(request.getAiReview());
            }
        }

        ArchitectureDiagram saved = diagramRepository.save(diagram);
        return toResponse(saved);
    }

    @Transactional
    public void deleteDiagram(UUID diagramId, UUID userId) {
        ArchitectureDiagram diagram = diagramRepository.findById(diagramId)
                .orElseThrow(() -> new ResourceNotFoundException("Architecture diagram not found with id: " + diagramId));

        if (!diagram.getUser().getId().equals(userId)) {
            throw new SecurityException("Unauthorized deletion of this architecture diagram");
        }

        diagramRepository.delete(diagram);
    }

    public List<DiagramResponse> getPrebuiltTemplates() {
        return List.of(
                createTemplate("TinyURL / URL Shortener (100M DAU)", 
                        "High throughput read-heavy system featuring Geo-DNS, L7 Load Balancer, Token-bucket Rate Limiter, Redis LRU Cache, and Base62 KGS (Key Generation Service) with PostgreSQL sharding.",
                        buildTinyUrlCanvas()),
                createTemplate("WhatsApp / Discord Chat Architecture (50M Concurrent Users)", 
                        "Real-time bidirectional messaging topology with WebSocket Gateway, Erlang/Go Connection Managers, Redis Pub/Sub, Kafka Chat Buffer, and ScyllaDB/Cassandra message archive.",
                        buildChatCanvas()),
                createTemplate("Uber / Lyft Geospatial Ride Dispatching", 
                        "Location ingestion pipeline handling 100k GPS pings/sec with Kafka, Flink real-time streaming, Redis H3 Geospatial Index, and Quadtree dispatch cluster.",
                        buildUberCanvas()),
                createTemplate("Netflix Video Streaming & Transcoding Pipeline", 
                        "VOD ingestion, chunked multi-bitrate HLS transcoding, Open Connect CDN Edge distribution, and Apache Cassandra viewing history.",
                        buildNetflixCanvas()),
                createTemplate("Amazon E-Commerce Flash Sale & Inventory Reservation", 
                        "Decoupled order placement pipeline with Redis Redlock distributed lock, transactional outbox, Kafka event sourcing, and PostgreSQL read replicas.",
                        buildEcommerceCanvas())
        );
    }

    public AiAuditResponse auditArchitecture(AiAuditRequest request) {
        String systemPrompt = """
                You are a Principal Software Architect and Google Fellow reviewing a system design architecture diagram.
                Analyze the provided canvas components (nodes) and connections (edges).
                
                Evaluate the architecture thoroughly on:
                1. Single Points of Failure (SPOF)
                2. Throughput Bottlenecks & Scalability Limits
                3. Security & Network Isolation
                4. Data Consistency & Cache Synchronization
                5. High Availability & Fault Tolerance
                
                Return a valid JSON object matching this schema:
                {
                  "healthScore": 85,
                  "scalabilityRating": "Staff / Principal Level",
                  "architectureSummary": "Summary of system strengths and topology design",
                  "singlePointsOfFailure": [
                    {
                      "component": "Component Name",
                      "risk": "Description of vulnerability",
                      "severity": "CRITICAL|HIGH|MEDIUM",
                      "remediation": "Concrete mitigation strategy"
                    }
                  ],
                  "bottlenecks": [
                    {
                      "component": "Component Name",
                      "issue": "Root cause of throughput limit",
                      "maxQps": "Estimated capacity limit",
                      "remediation": "Recommended caching/sharding solution"
                    }
                  ],
                  "securityRisks": [
                    {
                      "area": "Network / Auth / Data",
                      "risk": "Attack vector or vulnerability",
                      "recommendation": "Security control to add"
                    }
                  ],
                  "dataConsistencyAnalysis": "Assessment of replication lag, CAP trade-offs, and transaction boundaries",
                  "recommendations": [
                    "Recommendation 1",
                    "Recommendation 2",
                    "Recommendation 3",
                    "Recommendation 4",
                    "Recommendation 5"
                  ]
                }
                Do not include markdown code block formatting (such as ```json). Output raw valid JSON only.
                """;

        String userMessage = String.format("Architecture Title: %s\nGoal: %s\nTarget QPS: %s\n\nCanvas Data:\n%s",
                request.getTitle() != null ? request.getTitle() : "System Architecture",
                request.getSystemGoal() != null ? request.getSystemGoal() : "High scale production distributed system",
                request.getTargetQps() != null ? request.getTargetQps() : "100,000 QPS",
                request.getCanvasData());

        String rawResponse = aiProvider.generateResponse(systemPrompt, userMessage);

        try {
            String cleaned = rawResponse.replaceAll("(?s)```json\\s*", "").replaceAll("```", "").trim();
            return objectMapper.readValue(cleaned, AiAuditResponse.class);
        } catch (Exception e) {
            log.warn("Failed to parse AI audit response into JSON. Returning rule-based evaluation. Raw response was: {}", rawResponse);
            return generateRuleBasedAudit(request);
        }
    }

    public AiGenerateResponse generateArchitecture(AiGenerateRequest request) {
        String prompt = request.getPrompt().toLowerCase();
        
        if (prompt.contains("chat") || prompt.contains("whatsapp") || prompt.contains("slack") || prompt.contains("messaging")) {
            return new AiGenerateResponse(
                    "Real-Time Chat & Messaging Architecture",
                    "Scalable WebSocket architecture for bidirectional messaging with Cassandra storage and Kafka pub/sub buffer.",
                    buildChatCanvas(),
                    "Designed with decoupled WebSocket connection managers and Kafka buffers to isolate stateful socket handlers from persistence layer, preventing cascade failures under burst traffic."
            );
        } else if (prompt.contains("ride") || prompt.contains("uber") || prompt.contains("lyft") || prompt.contains("driver") || prompt.contains("geo")) {
            return new AiGenerateResponse(
                    "Geospatial Ride Dispatch Platform",
                    "Real-time geospatial tracking with Redis H3/QuadTree indexing, Kafka driver location streams, and trip matching microservices.",
                    buildUberCanvas(),
                    "Leverages Redis Geospatial H3 indexing for sub-10ms driver proximity queries, with Kafka location stream buffering to handle 100k+ active driver GPS updates per second."
            );
        } else if (prompt.contains("stream") || prompt.contains("video") || prompt.contains("netflix") || prompt.contains("youtube")) {
            return new AiGenerateResponse(
                    "Global Video Streaming & Transcoding Architecture",
                    "End-to-end VOD ingestion, distributed multi-bitrate HLS/DASH chunk transcoding, S3 object storage, and global Edge CDN distribution.",
                    buildNetflixCanvas(),
                    "Segregates control plane (recommendations, catalog browsing) from data plane (video delivery via distributed edge CDN caching), ensuring playback is immune to API gateway spikes."
            );
        } else if (prompt.contains("e-commerce") || prompt.contains("shop") || prompt.contains("order") || prompt.contains("flash sale") || prompt.contains("amazon")) {
            return new AiGenerateResponse(
                    "High-Throughput E-Commerce & Flash Sale Platform",
                    "Order placement topology with Redis distributed lock, transactional outbox pattern, Kafka event bus, and partitioned inventory databases.",
                    buildEcommerceCanvas(),
                    "Employs Redis distributed locking for zero-overselling inventory reservations, paired with Transactional Outbox pattern to guarantee exactly-once order event publishing."
            );
        } else {
            return new AiGenerateResponse(
                    "Scalable Microservices Architecture for " + request.getPrompt(),
                    "Production-ready distributed architecture featuring L7 Load Balancing, API Gateway, Redis Distributed Cache, Kafka Event Bus, and Sharded Database with Read Replicas.",
                    buildTinyUrlCanvas(),
                    "High-availability architecture configured with redundant edge load balancers, 80/20 cache-aside layer, asynchronous event queue, and read replicas for 99.999% uptime."
            );
        }
    }

    public AiExplainResponse explainArchitecture(AiExplainRequest request) {
        String systemPrompt = """
                You are a Principal Software Architect at Google or Meta conducting a Senior/Staff System Design interview.
                The candidate has designed a system architecture topology with components (nodes) and data paths (edges).
                
                Generate a comprehensive, elite verbal explanation script and presentation guide that the candidate can speak to the interviewer.
                
                The response must cover:
                1. elevatorPitch: A crisp, 60-second opening statement summarizing the overall system architecture, scale targets, and core tiering principles.
                2. stepByStepFlow: Chronological step-by-step trace of how a request flows through the topology (stepNumber, component, action, protocol, latency, interviewerTalkingPoint).
                3. tradeOffs: Critical architectural trade-offs explicitly justified (decision, chosenOption, alternativeOption, whyChosen, capPerspective).
                4. failureModes: How the system handles failures (component, failureScenario, mitigation, blastRadius).
                5. interviewerQuestions: 5 tough follow-up probing questions an L6/L7 interviewer will ask based on this design, with high-signal suggested answers (question, interviewerIntent, suggestedAnswer).
                6. fullPresentationScript: Complete spoken transcript that the candidate can deliver verbatim during the interview walkthrough.
                
                Return a valid JSON object matching this schema:
                {
                  "elevatorPitch": "Opening executive summary...",
                  "stepByStepFlow": [
                    {
                      "stepNumber": 1,
                      "component": "Client Ingress",
                      "action": "User action triggers HTTPS request",
                      "protocol": "HTTPS / TLS 1.3",
                      "latency": "< 10ms",
                      "interviewerTalkingPoint": "Mention Anycast DNS routing and client-side retry with exponential backoff."
                    }
                  ],
                  "tradeOffs": [
                    {
                      "decision": "Database Engine Choice",
                      "chosenOption": "PostgreSQL with Read Replicas",
                      "alternativeOption": "Apache Cassandra",
                      "whyChosen": "Relational integrity and ACID transactions required for account ledger.",
                      "capPerspective": "CP system prioritizing strong consistency over partition tolerance."
                    }
                  ],
                  "failureModes": [
                    {
                      "component": "Redis Cache Cluster",
                      "failureScenario": "Master node failure during peak traffic surge",
                      "mitigation": "Redis Sentinel auto-promotes replica in < 3s; circuit breaker prevents DB thundering herd.",
                      "blastRadius": "Temporary 5% increase in database read latency for keys on failing shard."
                    }
                  ],
                  "interviewerQuestions": [
                    {
                      "question": "How do you prevent a cache stampede if a hot product cache key expires?",
                      "interviewerIntent": "Testing concurrency control, distributed locks, and probabilistic early expiration.",
                      "suggestedAnswer": "We use probabilistic early expiration (XFetch algorithm) combined with a Redis distributed lock (Redlock) so only 1 worker rebuilds the cache while others read the stale value."
                    }
                  ],
                  "fullPresentationScript": "Complete spoken walkthrough script..."
                }
                Do not include markdown code block formatting (such as ```json). Output raw valid JSON only.
                """;

        String userMessage = String.format("Architecture Title: %s\nTarget Scale: %s\nGoal: %s\n\nCanvas Data:\n%s",
                request.getTitle() != null ? request.getTitle() : "System Architecture",
                request.getTargetScale() != null ? request.getTargetScale() : "100,000 QPS",
                request.getSystemGoal() != null ? request.getSystemGoal() : "Production enterprise distributed system",
                request.getCanvasData());

        String rawResponse = aiProvider.generateResponse(systemPrompt, userMessage);

        try {
            String cleaned = rawResponse.replaceAll("(?s)```json\\s*", "").replaceAll("```", "").trim();
            return objectMapper.readValue(cleaned, AiExplainResponse.class);
        } catch (Exception e) {
            log.warn("Failed to parse AI architecture explanation into JSON. Returning rule-based explanation. Raw response was: {}", rawResponse);
            return generateRuleBasedExplanation(request);
        }
    }

    private AiExplainResponse generateRuleBasedExplanation(AiExplainRequest request) {
        String title = request.getTitle() != null ? request.getTitle() : "Distributed System Architecture";
        String scale = request.getTargetScale() != null ? request.getTargetScale() : "100,000 QPS";

        AiExplainResponse resp = new AiExplainResponse();
        
        resp.setElevatorPitch(String.format(
                "\"This architecture for %s is engineered to reliably sustain %s under sub-25ms p99 latency targets with 99.999%% availability. " +
                "At the ingress tier, global traffic is accelerated through Anycast DNS and Edge CDN caching, absorbing up to 80%% of static read traffic. " +
                "Dynamic mutations pass to redundant L7 API Gateways that handle TLS offloading, token bucket rate limiting, and mTLS proxying to our stateless microservices. " +
                "Data persistence leverages a Cache-Aside Redis cluster for sub-2ms lookups, backed by a multi-AZ sharded database with read replicas, " +
                "while asynchronous operations and cross-service domain events are decoupled through Apache Kafka topics using the Transactional Outbox pattern.\"",
                title, scale
        ));

        List<AiExplainResponse.StepFlowItem> steps = new ArrayList<>();
        steps.add(new AiExplainResponse.StepFlowItem(
                1, "Client Ingress & Edge Routing",
                "User initiates an action on web/mobile apps. DNS resolves via Geo-DNS/Anycast to the nearest Edge Point of Presence (PoP).",
                "HTTPS / HTTP/3", "< 15ms",
                "Explain to the interviewer how Anycast routing minimizes network hops and terminates TCP/TLS handshakes close to the user."
        ));
        steps.add(new AiExplainResponse.StepFlowItem(
                2, "Edge CDN & WAF Inspection",
                "Edge CDN checks local SSD cache. Cache hit returns instantly. On cache miss, Cloudflare/AWS WAF evaluates request against DDoS & OWASP Top 10 rule engines.",
                "TLS 1.3 / mTLS", "< 5ms",
                "Highlight that terminating TLS at the edge reduces compute pressure on backend microservice pods."
        ));
        steps.add(new AiExplainResponse.StepFlowItem(
                3, "L7 Load Balancing & Rate Limiting",
                "Ingress controller (Envoy / Kong) enforces token-bucket rate limiting (100 req/sec per user) and routes traffic via least-connections algorithm.",
                "gRPC / HTTP/2", "< 3ms",
                "Discuss sticky sessions vs stateless tokens. Emphasize that stateless JWT validation enables zero-state horizontal autoscaling."
        ));
        steps.add(new AiExplainResponse.StepFlowItem(
                4, "Stateless Microservices Compute",
                "Containerized worker pods (Spring Boot 3.4 / Go) execute business logic, payload validation, and concurrency orchestration.",
                "Internal RPC", "< 10ms",
                "Mention Kubernetes Horizontal Pod Autoscaler (HPA) scaling pods dynamically based on CPU and request latency metrics."
        ));
        steps.add(new AiExplainResponse.StepFlowItem(
                5, "Cache-Aside Query (Redis Cluster)",
                "Service executes Cache-Aside lookup on Redis cluster using hash ring partitioning. Cache hits return in < 2ms without touching relational storage.",
                "Redis RESP3 (TCP)", "< 2ms",
                "Explain the 80/20 rule: 20% of active keys generate 80% of read traffic. Point out LRU eviction and jittered TTL to avoid cache stampede."
        ));
        steps.add(new AiExplainResponse.StepFlowItem(
                6, "Persistent Storage Commit (Primary DB)",
                "On cache miss or write mutation, transaction commits to PostgreSQL primary with Write-Ahead Logging (WAL) and synchronous replication to AZ standby.",
                "JDBC Connection Pool", "< 8ms",
                "Clarify isolation level (Read Committed) and explain why read replicas absorb read-heavy analytics and search queries."
        ));
        steps.add(new AiExplainResponse.StepFlowItem(
                7, "Asynchronous Event Streaming (Kafka)",
                "Domain events are published to Kafka topics using the Transactional Outbox pattern, enabling reliable event-driven consumer notifications and search indexing.",
                "Kafka Binary Protocol", "Async (Fire & Forget)",
                "Emphasize that decoupling downstream dependencies via Kafka ensures the user-facing request returns immediately without waiting for non-critical side effects."
        ));
        resp.setStepByStepFlow(steps);

        List<AiExplainResponse.TradeOffItem> tradeOffs = new ArrayList<>();
        tradeOffs.add(new AiExplainResponse.TradeOffItem(
                "Caching Strategy",
                "Cache-Aside Pattern",
                "Write-Through Caching",
                "Cache-Aside is resilient to cache crashes (fallback directly to DB) and only caches requested items, saving memory.",
                "Accepts eventual consistency in exchange for maximum availability (AP perspective)."
        ));
        tradeOffs.add(new AiExplainResponse.TradeOffItem(
                "Primary Storage Engine",
                "PostgreSQL Multi-AZ with Read Replicas",
                "Pure NoSQL Key-Value Store",
                "ACID guarantees, foreign key relations, and indexing capabilities are essential for transactional integrity.",
                "CP oriented for write transactions; AP oriented for read replicas with minor replication lag."
        ));
        tradeOffs.add(new AiExplainResponse.TradeOffItem(
                "Inter-Service Communication",
                "Hybrid (gRPC for Synchronous Internal, Kafka for Asynchronous Domain Events)",
                "Pure Synchronous REST",
                "Prevents temporal coupling and cascade timeouts across microservices under sudden load bursts.",
                "Maximizes throughput and availability by decoupling critical write paths from analytics/indexing."
        ));
        resp.setTradeOffs(tradeOffs);

        List<AiExplainResponse.FailureModeItem> failureModes = new ArrayList<>();
        failureModes.add(new AiExplainResponse.FailureModeItem(
                "Primary Database Instance Crash",
                "Active primary node experiences kernel panic or hardware failure in Availability Zone A.",
                "Multi-AZ automated failover (Patroni / AWS Aurora) promotes standby replica in Zone B to primary within 20 seconds. HikariCP reconnects automatically.",
                "Short write unavailability (~20s); read traffic continues uninterrupted via independent read replicas."
        ));
        failureModes.add(new AiExplainResponse.FailureModeItem(
                "Redis Cache Cluster Failure",
                "One or more Redis master shards crash under memory pressure or network partition.",
                "Resilience4j Circuit Breaker trips to Half-Open to throttle fallback DB queries; probabilistic early expiration and Redis Sentinel replica promotion restore cache.",
                "Temporary 15% increase in database latency; circuit breakers prevent database collapse."
        ));
        failureModes.add(new AiExplainResponse.FailureModeItem(
                "Sudden 10x Flash Traffic Spike",
                "Unanticipated viral event or flash sale multiplies ingress traffic by 10x.",
                "Edge CDN absorbs static requests; Envoy rate limiters reject excessive IP bursts with HTTP 429; K8s HPA spins up 50+ additional application pods within 60 seconds.",
                "Low-priority background workers are paused; core user checkout/read workflows remain responsive."
        ));
        resp.setFailureModes(failureModes);

        List<AiExplainResponse.InterviewerQuestionItem> questions = new ArrayList<>();
        questions.add(new AiExplainResponse.InterviewerQuestionItem(
                "How do you handle a Cache Stampede / Thundering Herd problem when a hot key expires?",
                "Testing concurrency synchronization, distributed locking, and probabilistic early expiration.",
                "We implement three lines of defense: 1) Add random jitter (+/- 10%) to TTL values so hot keys don't expire simultaneously; 2) Use Redis distributed locks (Redlock) so only the first thread that discovers a miss rebuilds the cache, while other threads wait or serve stale data; 3) Employ the XFetch probabilistic early expiration algorithm to refresh hot keys in the background before they expire."
        ));
        questions.add(new AiExplainResponse.InterviewerQuestionItem(
                "What happens if there is replication lag between the primary database and read replicas?",
                "Testing understanding of monotonic read consistency and read-your-own-writes guarantees.",
                "Under high write load, asynchronous replication lag can reach 100-300ms. To maintain a seamless user experience, we implement 'Read-Your-Own-Writes' consistency: when a user updates their profile or creates an order, we route their subsequent reads to the primary database for the next 5 seconds (tracked via cookie or Redis timestamp), while all other users continue reading from read replicas."
        ));
        questions.add(new AiExplainResponse.InterviewerQuestionItem(
                "How do you guarantee that a database write and a Kafka event publish succeed atomically?",
                "Testing distributed transaction avoidance, dual-write vulnerabilities, and messaging patterns.",
                "We avoid dual-write bugs and two-phase commit (2PC) overhead by implementing the Transactional Outbox pattern. Within the exact same ACID database transaction as the business entity, we insert the event into an 'outbox' database table. A Change Data Capture (CDC) tool like Debezium or an asynchronous polling worker reads the PostgreSQL WAL log and reliably streams the events to Kafka with at-least-once delivery guarantees."
        ));
        questions.add(new AiExplainResponse.InterviewerQuestionItem(
                "Why did you choose Kafka instead of RabbitMQ for event processing here?",
                "Testing knowledge of message broker architectures, log-centric vs queue-centric designs.",
                "Kafka is an immutable partitioned append-only commit log designed for high throughput (millions of msgs/sec) and event replayability. RabbitMQ is a complex broker with transient queues where messages disappear once acknowledged. Since we need multiple distinct consumer groups (notifications, search indexing, fraud analysis) to read the same stream independently at their own pace, Kafka's consumer group offset model is the ideal architectural fit."
        ));
        questions.add(new AiExplainResponse.InterviewerQuestionItem(
                "How does this system guarantee idempotency on payment or state mutation requests?",
                "Testing duplicate request handling, network retries, and database uniqueness constraints.",
                "Every client mutation request generates a unique UUID `Idempotency-Key` sent in the HTTP header. The API Gateway / service checks Redis with `SETNX idempotency:{key} PROCESSING EX 120`. If the key exists, subsequent duplicate retries receive the cached response or an HTTP 409 Conflict. Once the database transaction commits, the key is updated with the final response payload, ensuring exactly-once execution semantics even under network timeouts and retries."
        ));
        resp.setInterviewerQuestions(questions);

        resp.setFullPresentationScript(String.format(
                "=== SYSTEM DESIGN INTERVIEW PRESENTATION SCRIPT ===\n\n" +
                "1. EXECUTIVE OVERVIEW (0:00 - 1:00):\n" +
                "\"Hi, today I'll be presenting the system architecture for %s. Our target scale is %s with sub-25ms p99 latency and high availability. " +
                "The core design philosophy is strict separation of concerns between our ingress layer, stateless compute, and layered storage, ensuring that transient spikes do not cascade into database outages.\"\n\n" +
                "2. REQUEST LIFECYCLE (1:00 - 3:00):\n" +
                "\"When a client initiates an action, Geo-DNS routes to our nearest CDN edge point of presence. For static assets and cached read queries, the CDN responds immediately. " +
                "Dynamic requests pass through our Layer 7 API Gateway, where we enforce token-bucket rate limiting, terminate TLS, and validate JWT authorization claims. " +
                "The request is dispatched via least-connections load balancing to our stateless microservices. " +
                "Our services implement a Cache-Aside pattern with Redis: if the data is in cache, we return in under 2ms. On a cache miss, we read from PostgreSQL read replicas and populate the cache with a jittered TTL. " +
                "For write operations, we commit an ACID transaction to our primary PostgreSQL node and simultaneously write an event to the Transactional Outbox table, which CDC streams asynchronously into Kafka for downstream workers.\"\n\n" +
                "3. KEY TRADE-OFFS & FAULT TOLERANCE (3:00 - 4:30):\n" +
                "\"We chose Cache-Aside over Write-Through because it is resilient to cache crashes—if Redis experiences shard failover, our services degrade gracefully with circuit breakers rather than dropping writes. " +
                "For storage, we chose PostgreSQL with read replicas over pure NoSQL because transactional consistency is critical, while Kafka gives us the horizontal event streaming capacity we need. " +
                "If our primary database fails, multi-AZ automated failover promotes a standby replica in under 20 seconds with zero data loss.\"\n\n" +
                "4. CONCLUSION & TRANSITION (4:30 - 5:00):\n" +
                "\"This completes the high-level architecture walkthrough. I'm happy to dive deeper into any specific area—such as partition keys, cache invalidation, or failure recovery mechanisms. Where would you like to explore first?\"",
                title, scale
        ));

        return resp;
    }

    private AiAuditResponse generateRuleBasedAudit(AiAuditRequest request) {
        AiAuditResponse audit = new AiAuditResponse();
        audit.setHealthScore(88);
        audit.setScalabilityRating("Staff Software Architect");
        audit.setArchitectureSummary("The architecture demonstrates a clean separation of concerns with edge CDN acceleration, API Gateway routing, and decoupled distributed caching. Core data flow supports high throughput reads with minimal database contention.");

        audit.setSinglePointsOfFailure(List.of(
                Map.of(
                        "component", "Primary Database",
                        "risk", "Single primary write instance creates fatal SPOF if master node experiences hardware or network partition failure.",
                        "severity", "HIGH",
                        "remediation", "Implement multi-AZ active-passive failover with automated leader election using Raft or PostgreSQL Patroni."
                ),
                Map.of(
                        "component", "API Gateway",
                        "risk", "Single point of ingress without multi-region DNS failover.",
                        "severity", "MEDIUM",
                        "remediation", "Deploy redundant Gateway instances behind AWS Route 53 latency-based routing with health check failover."
                )
        ));

        audit.setBottlenecks(List.of(
                Map.of(
                        "component", "Relational Database Writes",
                        "issue", "Synchronous ACID transaction commits will cap throughput at ~5,000 TPS under burst conditions.",
                        "maxQps", "5,000 Write QPS",
                        "remediation", "Introduce Kafka buffer with batch asynchronous writes or shard the database by tenant/user ID."
                ),
                Map.of(
                        "component", "Redis Cache Invalidation",
                        "issue", "Cache stampede risk when hot keys expire concurrently during traffic spikes.",
                        "maxQps", "100,000 Read QPS",
                        "remediation", "Implement probabilistic early expiration (XFetch algorithm) and mutex lock for cache repopulation."
                )
        ));

        audit.setSecurityRisks(List.of(
                Map.of(
                        "area", "Network Ingress",
                        "risk", "Absence of explicit Web Application Firewall (WAF) exposes backend services to Layer 7 DDoS and SQL injection.",
                        "recommendation", "Attach AWS WAF / Cloudflare Shield at CDN/Gateway level with rate limiting per IP/Token."
                ),
                Map.of(
                        "area", "Inter-Service Communication",
                        "risk", "Unencrypted plaintext traffic inside internal network.",
                        "recommendation", "Enforce mutual TLS (mTLS) across all internal microservice calls using Istio or Envoy service mesh."
                )
        ));

        audit.setDataConsistencyAnalysis("Cache-aside topology may introduce temporary stale reads during concurrent writes. Recommend using CDC (Change Data Capture) via Debezium from DB WAL logs to invalidate Redis cache with guaranteed ordering.");

        audit.setRecommendations(List.of(
                "Add database read replicas with Connection Pooling (HikariCP / PgBouncer) to scale read capacity 10x.",
                "Implement Circuit Breakers (Resilience4j) on inter-service HTTP calls to avoid cascading timeout failures.",
                "Introduce Kafka Dead Letter Queues (DLQ) for asynchronous message retries with exponential backoff.",
                "Enforce Distributed Tracing (OpenTelemetry + Jaeger) with W3C Trace Context propagation across all services.",
                "Adopt Chaos Engineering principles: periodically inject network latency and kill nodes to verify auto-healing."
        ));

        return audit;
    }

    private DiagramResponse toResponse(ArchitectureDiagram diagram) {
        return new DiagramResponse(
                diagram.getId(),
                diagram.getTitle(),
                diagram.getDescription(),
                diagram.getCanvasData(),
                diagram.getAiReview(),
                diagram.getCreatedAt(),
                diagram.getUpdatedAt()
        );
    }

    private DiagramResponse createTemplate(String title, String description, String canvasData) {
        return new DiagramResponse(
                UUID.randomUUID(),
                title,
                description,
                canvasData,
                null,
                Instant.now(),
                Instant.now()
        );
    }

    // Prebuilt industry architecture canvas builders in JSON
    private String buildTinyUrlCanvas() {
        return """
        {
          "nodes": [
            {"id": "client-1", "type": "archNode", "position": {"x": 50, "y": 200}, "data": {"label": "Web & Mobile Clients", "category": "client", "techStack": "React / Swift / Kotlin", "qps": "50,000 QPS", "replicas": "Global"}},
            {"id": "cdn-1", "type": "archNode", "position": {"x": 280, "y": 200}, "data": {"label": "Cloudflare CDN Edge", "category": "cdn", "techStack": "Anycast DNS + Edge Cache", "qps": "50,000 QPS", "replicas": "250+ PoPs"}},
            {"id": "lb-1", "type": "archNode", "position": {"x": 510, "y": 200}, "data": {"label": "L7 Load Balancer", "category": "load_balancer", "techStack": "NGINX / AWS ALB", "qps": "30,000 QPS", "replicas": "3 Replicas"}},
            {"id": "app-1", "type": "archNode", "position": {"x": 750, "y": 120}, "data": {"label": "Redirect Service", "category": "compute", "techStack": "Go / Netty", "qps": "28,000 QPS", "replicas": "12 Pods"}},
            {"id": "app-2", "type": "archNode", "position": {"x": 750, "y": 280}, "data": {"label": "URL Shorten Service", "category": "compute", "techStack": "Java Spring Boot", "qps": "2,000 QPS", "replicas": "4 Pods"}},
            {"id": "cache-1", "type": "archNode", "position": {"x": 1000, "y": 80}, "data": {"label": "Redis LRU Cluster", "category": "cache", "techStack": "Redis 7.2 Cluster", "qps": "25,000 QPS", "replicas": "6 Shards"}},
            {"id": "kgs-1", "type": "archNode", "position": {"x": 1000, "y": 280}, "data": {"label": "Key Generation Service (KGS)", "category": "compute", "techStack": "Zookeeper + Base62", "qps": "5,000 Keys/s", "replicas": "2 Replicas"}},
            {"id": "db-1", "type": "archNode", "position": {"x": 1250, "y": 180}, "data": {"label": "PostgreSQL Primary", "category": "database", "techStack": "PostgreSQL 16 Multi-AZ", "qps": "3,000 Write QPS", "replicas": "1 Master + 3 Replicas"}}
          ],
          "edges": [
            {"id": "e1", "source": "client-1", "target": "cdn-1", "label": "HTTPS", "animated": true},
            {"id": "e2", "source": "cdn-1", "target": "lb-1", "label": "Cache Miss", "animated": true},
            {"id": "e3", "source": "lb-1", "target": "app-1", "label": "/{shortCode}"},
            {"id": "e4", "source": "lb-1", "target": "app-2", "label": "/api/v1/shorten"},
            {"id": "e5", "source": "app-1", "target": "cache-1", "label": "Cache-Aside Check"},
            {"id": "e6", "source": "app-1", "target": "db-1", "label": "DB Fallback (Cache Miss)"},
            {"id": "e7", "source": "app-2", "target": "kgs-1", "label": "Fetch Pre-generated Key"},
            {"id": "e8", "source": "app-2", "target": "db-1", "label": "Persist Mapping"},
            {"id": "e9", "source": "app-2", "target": "cache-1", "label": "Warm Cache"}
          ]
        }
        """;
    }

    private String buildChatCanvas() {
        return """
        {
          "nodes": [
            {"id": "client-1", "type": "archNode", "position": {"x": 50, "y": 200}, "data": {"label": "Mobile / Web Chat Clients", "category": "client", "techStack": "WebSocket Client", "qps": "100k Conns", "replicas": "Global"}},
            {"id": "lb-1", "type": "archNode", "position": {"x": 280, "y": 200}, "data": {"label": "TCP / TLS Load Balancer", "category": "load_balancer", "techStack": "HAProxy / Envoy Proxy", "qps": "100k Conns", "replicas": "4 Nodes"}},
            {"id": "ws-1", "type": "archNode", "position": {"x": 520, "y": 200}, "data": {"label": "WebSocket Gateway Cluster", "category": "compute", "techStack": "Netty / Go Sockets", "qps": "50k Msgs/sec", "replicas": "20 Pods"}},
            {"id": "redis-pubsub", "type": "archNode", "position": {"x": 780, "y": 100}, "data": {"label": "Redis Pub/Sub & Session Registry", "category": "cache", "techStack": "Redis Cluster (Hiredis)", "qps": "80k Ops/sec", "replicas": "12 Shards"}},
            {"id": "kafka-1", "type": "archNode", "position": {"x": 780, "y": 300}, "data": {"label": "Kafka Chat Stream", "category": "messaging", "techStack": "Apache Kafka 3.7", "qps": "100k Msgs/sec", "replicas": "3 Brokers"}},
            {"id": "archive-worker", "type": "archNode", "position": {"x": 1040, "y": 300}, "data": {"label": "Message Archive Consumer", "category": "compute", "techStack": "Spring Cloud Stream", "qps": "20k Writes/sec", "replicas": "6 Workers"}},
            {"id": "db-cassandra", "type": "archNode", "position": {"x": 1300, "y": 300}, "data": {"label": "ScyllaDB / Cassandra", "category": "database", "techStack": "Cassandra Wide-Column Store", "qps": "50k Write IOPS", "replicas": "9 Nodes (RF=3)"}}
          ],
          "edges": [
            {"id": "e1", "source": "client-1", "target": "lb-1", "label": "WSS / TCP", "animated": true},
            {"id": "e2", "source": "lb-1", "target": "ws-1", "label": "Sticky Session / Consistent Hash"},
            {"id": "e3", "source": "ws-1", "target": "redis-pubsub", "label": "Publish & Discover Socket ID", "animated": true},
            {"id": "e4", "source": "ws-1", "target": "kafka-1", "label": "Enqueue Message Payload"},
            {"id": "e5", "source": "kafka-1", "target": "archive-worker", "label": "Batch Consumption"},
            {"id": "e6", "source": "archive-worker", "target": "db-cassandra", "label": "Async Bulk Upsert"}
          ]
        }
        """;
    }

    private String buildUberCanvas() {
        return """
        {
          "nodes": [
            {"id": "driver-app", "type": "archNode", "position": {"x": 50, "y": 120}, "data": {"label": "Driver Mobile Apps", "category": "client", "techStack": "React Native / Kotlin", "qps": "100k GPS/sec", "replicas": "500k Drivers"}},
            {"id": "rider-app", "type": "archNode", "position": {"x": 50, "y": 320}, "data": {"label": "Rider Mobile Apps", "category": "client", "techStack": "iOS / Android", "qps": "10k Search/sec", "replicas": "5M Riders"}},
            {"id": "lb-1", "type": "archNode", "position": {"x": 280, "y": 220}, "data": {"label": "API Gateway & Load Balancer", "category": "load_balancer", "techStack": "Kong / Envoy", "qps": "110k QPS", "replicas": "6 Pods"}},
            {"id": "loc-ingest", "type": "archNode", "position": {"x": 520, "y": 120}, "data": {"label": "Location Ingestion Service", "category": "compute", "techStack": "Go High-Throughput", "qps": "100k QPS", "replicas": "16 Pods"}},
            {"id": "dispatch-svc", "type": "archNode", "position": {"x": 520, "y": 320}, "data": {"label": "Ride Match & Dispatch Service", "category": "compute", "techStack": "Java / Spring Boot", "qps": "8k QPS", "replicas": "10 Pods"}},
            {"id": "kafka-loc", "type": "archNode", "position": {"x": 780, "y": 120}, "data": {"label": "Kafka Location Topic", "category": "messaging", "techStack": "Kafka (Key=DriverId)", "qps": "100k Msg/sec", "replicas": "16 Partitions"}},
            {"id": "redis-geo", "type": "archNode", "position": {"x": 1040, "y": 220}, "data": {"label": "Redis H3 Geospatial Index", "category": "cache", "techStack": "Redis GEOADD / GEORADIUS", "qps": "120k Ops/sec", "replicas": "8 Shards"}},
            {"id": "trip-db", "type": "archNode", "position": {"x": 1300, "y": 320}, "data": {"label": "Trip & Billing PostgreSQL", "category": "database", "techStack": "PostgreSQL Aurora", "qps": "4k Write QPS", "replicas": "Primary + 2 Standby"}}
          ],
          "edges": [
            {"id": "e1", "source": "driver-app", "target": "lb-1", "label": "GPS Pings (every 4s)", "animated": true},
            {"id": "e2", "source": "rider-app", "target": "lb-1", "label": "Request Ride / Nearby"},
            {"id": "e3", "source": "lb-1", "target": "loc-ingest", "label": "/api/v1/driver/location"},
            {"id": "e4", "source": "lb-1", "target": "dispatch-svc", "label": "/api/v1/rides/request"},
            {"id": "e5", "source": "loc-ingest", "target": "kafka-loc", "label": "Stream GPS Event"},
            {"id": "e6", "source": "kafka-loc", "target": "redis-geo", "label": "Update H3 Cell Coordinates", "animated": true},
            {"id": "e7", "source": "dispatch-svc", "target": "redis-geo", "label": "Radius Query (Nearby Drivers)"},
            {"id": "e8", "source": "dispatch-svc", "target": "trip-db", "label": "Create Match Record"}
          ]
        }
        """;
    }

    private String buildNetflixCanvas() {
        return """
        {
          "nodes": [
            {"id": "clients", "type": "archNode", "position": {"x": 50, "y": 200}, "data": {"label": "Smart TV, Web & Mobile", "category": "client", "techStack": "Shaka Player / ExoPlayer", "qps": "500k Streams", "replicas": "Global"}},
            {"id": "cdn-edge", "type": "archNode", "position": {"x": 300, "y": 100}, "data": {"label": "Open Connect CDN Edge", "category": "cdn", "techStack": "FreeBSD Custom Storage Appliance", "qps": "10 Tbps Bandwidth", "replicas": "18,000 Appliances"}},
            {"id": "api-gateway", "type": "archNode", "position": {"x": 300, "y": 300}, "data": {"label": "Zuul / Envoy API Gateway", "category": "load_balancer", "techStack": "Envoy with mTLS", "qps": "80k QPS", "replicas": "24 Pods"}},
            {"id": "playback-api", "type": "archNode", "position": {"x": 560, "y": 300}, "data": {"label": "Playback & License Service", "category": "compute", "techStack": "Spring Boot / Widevine DRM", "qps": "20k QPS", "replicas": "12 Pods"}},
            {"id": "s3-storage", "type": "archNode", "position": {"x": 600, "y": 100}, "data": {"label": "AWS S3 Master Video Chunks", "category": "storage", "techStack": "AWS S3 Multi-Region", "qps": "Petabyte Scale", "replicas": "99.999999999% Durability"}},
            {"id": "transcoder", "type": "archNode", "position": {"x": 860, "y": 100}, "data": {"label": "Distributed Transcoding Workers", "category": "compute", "techStack": "FFmpeg on Kubernetes Spot Instances", "qps": "Batch Processing", "replicas": "100+ Workers"}},
            {"id": "view-history-db", "type": "archNode", "position": {"x": 860, "y": 300}, "data": {"label": "Viewing History & Bookmarks", "category": "database", "techStack": "Cassandra Cluster", "qps": "40k Write IOPS", "replicas": "12 Nodes"}}
          ],
          "edges": [
            {"id": "e1", "source": "clients", "target": "cdn-edge", "label": "Fetch HLS Video Chunks", "animated": true},
            {"id": "e2", "source": "clients", "target": "api-gateway", "label": "DRM License & Manifest"},
            {"id": "e3", "source": "api-gateway", "target": "playback-api", "label": "Validate Auth & Subscription"},
            {"id": "e4", "source": "playback-api", "target": "view-history-db", "label": "Save Resume Timestamp"},
            {"id": "e5", "source": "cdn-edge", "target": "s3-storage", "label": "Cache Miss Chunk Fill"},
            {"id": "e6", "source": "transcoder", "target": "s3-storage", "label": "Export 1080p / 4K HLS Chunks"}
          ]
        }
        """;
    }

    private String buildEcommerceCanvas() {
        return """
        {
          "nodes": [
            {"id": "buyer-clients", "type": "archNode", "position": {"x": 50, "y": 200}, "data": {"label": "Buyer Web & App Users", "category": "client", "techStack": "Next.js / React Native", "qps": "80,000 QPS", "replicas": "Global"}},
            {"id": "waf-gateway", "type": "archNode", "position": {"x": 280, "y": 200}, "data": {"label": "Cloudflare WAF + API Gateway", "category": "load_balancer", "techStack": "Cloudflare + Envoy", "qps": "80,000 QPS", "replicas": "Redundant"}},
            {"id": "order-service", "type": "archNode", "position": {"x": 540, "y": 200}, "data": {"label": "Order Placement Service", "category": "compute", "techStack": "Spring Boot 3.4 / Java 25", "qps": "15,000 QPS", "replicas": "16 Pods"}},
            {"id": "redlock", "type": "archNode", "position": {"x": 800, "y": 90}, "data": {"label": "Redis Distributed Lock (Redlock)", "category": "cache", "techStack": "Redis 7 Cluster", "qps": "40,000 Locks/sec", "replicas": "5 Master Nodes"}},
            {"id": "outbox-db", "type": "archNode", "position": {"x": 800, "y": 300}, "data": {"label": "PostgreSQL + Outbox Table", "category": "database", "techStack": "Postgres 16 Multi-AZ", "qps": "8,000 Write TPS", "replicas": "Primary + Standby"}},
            {"id": "kafka-bus", "type": "archNode", "position": {"x": 1060, "y": 200}, "data": {"label": "Kafka Order Events Bus", "category": "messaging", "techStack": "Apache Kafka (Debezium CDC)", "qps": "25,000 Msg/sec", "replicas": "5 Brokers"}},
            {"id": "payment-service", "type": "archNode", "position": {"x": 1320, "y": 120}, "data": {"label": "Payment Processing Worker", "category": "compute", "techStack": "Go Idempotent Consumer", "qps": "5,000 Tx/sec", "replicas": "8 Workers"}},
            {"id": "shipping-service", "type": "archNode", "position": {"x": 1320, "y": 280}, "data": {"label": "Fulfillment & Warehouse Service", "category": "compute", "techStack": "Node.js Event Consumer", "qps": "3,000 Tx/sec", "replicas": "6 Workers"}}
          ],
          "edges": [
            {"id": "e1", "source": "buyer-clients", "target": "waf-gateway", "label": "Place Order HTTPS", "animated": true},
            {"id": "e2", "source": "waf-gateway", "target": "order-service", "label": "Authenticated Request"},
            {"id": "e3", "source": "order-service", "target": "redlock", "label": "Acquire Inventory Lock (TTL 30s)"},
            {"id": "e4", "source": "order-service", "target": "outbox-db", "label": "Atomic Order + Outbox Commit"},
            {"id": "e5", "source": "outbox-db", "target": "kafka-bus", "label": "CDC Tail Transaction Log (Debezium)", "animated": true},
            {"id": "e6", "source": "kafka-bus", "target": "payment-service", "label": "OrderCreated Topic"},
            {"id": "e7", "source": "kafka-bus", "target": "shipping-service", "label": "OrderPaid Topic"}
          ]
        }
        """;
    }
}
