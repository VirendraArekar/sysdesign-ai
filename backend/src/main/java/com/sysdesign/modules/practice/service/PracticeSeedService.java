package com.sysdesign.modules.practice.service;

import com.sysdesign.modules.practice.model.HldProblem;
import com.sysdesign.modules.practice.model.LldProblem;
import com.sysdesign.modules.practice.model.QuestionBankItem;
import com.sysdesign.modules.practice.repository.HldProblemRepository;
import com.sysdesign.modules.practice.repository.LldProblemRepository;
import com.sysdesign.modules.practice.repository.QuestionBankRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Profile("!test")
public class PracticeSeedService implements CommandLineRunner {

    private final HldProblemRepository hldRepository;
    private final LldProblemRepository lldRepository;
    private final QuestionBankRepository questionBankRepository;

    public PracticeSeedService(HldProblemRepository hldRepository,
                               LldProblemRepository lldRepository,
                               QuestionBankRepository questionBankRepository) {
        this.hldRepository = hldRepository;
        this.lldRepository = lldRepository;
        this.questionBankRepository = questionBankRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (hldRepository.count() > 0) {
            return; // Already seeded
        }
        seedHldProblems();
        seedLldProblems();
        seedQuestionBank();
    }

    private void seedHldProblems() {
        // 1. URL Shortener (TinyURL)
        HldProblem urlShortener = new HldProblem(
                "url-shortener",
                "Design a Scalable URL Shortener (TinyURL)",
                "Infrastructure",
                "BEGINNER",
                "Design a highly available, globally distributed URL shortening service capable of handling 500M new URLs per month and 100:1 read-to-write ratio.",
                "flowchart TD\n  Client([Client Web/Mobile]) --> DNS[Route 53 GeoDNS]\n  DNS --> CDN[CloudFront Edge CDN]\n  CDN --> ALB[Application Load Balancer]\n  ALB --> AppFleet[Stateless Web API Fleet]\n  AppFleet --> Redis[(Redis Cache - LRU 20% Hot URLs)]\n  AppFleet --> KGS[Key Generation Service / Zookeeper Range Allocator]\n  AppFleet --> Postgres[(PostgreSQL Sharded by Hash of ShortKey)]\n  Postgres --> Replica[(Read Replicas)]"
        );
        urlShortener.setFunctionalRequirements("[\"Given a long URL, generate a shorter and unique 7-character alias.\", \"When users access a short link, redirect them with 301/302 HTTP status to the original long URL.\", \"Users can optionally specify a custom alias.\", \"Links expire after a default TTL (e.g., 2 years) or custom expiration date.\"]");
        urlShortener.setNonFunctionalRequirements("[\"Ultra-low latency redirect (< 20ms read latency at p99).\", \"High availability of 99.99% for redirection (reads must never fail).\", \"Shortened links should not be guessable or predictable.\", \"System must handle read spikes without degrading database performance.\"]");
        urlShortener.setCapacityEstimation("{\"newUrlsPerMonth\": \"500 Million\", \"writeQPS\": \"~200 writes/sec\", \"readQPS\": \"~20,000 reads/sec (100:1 read/write ratio)\", \"storage5Years\": \"500M * 12 * 5 * 500 bytes = 15 Terabytes\", \"cacheMemory8020\": \"20,000 * 86,400 * 0.2 * 500 bytes = ~170 GB RAM\"}");
        urlShortener.setApiDesign("[\"POST /api/v1/urls: { longUrl: string, customAlias?: string, expireAt?: string } -> { shortUrl: string, shortKey: string }\", \"GET /{shortKey}: 302 Found redirect with Location header\", \"DELETE /api/v1/urls/{shortKey}: Admin or owner link revocation\"]");
        urlShortener.setDatabaseSchema("{\"table\": \"url_mappings\", \"columns\": {\"short_key\": \"VARCHAR(7) PRIMARY KEY\", \"long_url\": \"VARCHAR(2048) NOT NULL\", \"user_id\": \"UUID\", \"created_at\": \"TIMESTAMPTZ\", \"expires_at\": \"TIMESTAMPTZ\"}, \"indexes\": [\"CREATE INDEX idx_user_urls ON url_mappings(user_id)\", \"CREATE INDEX idx_expires ON url_mappings(expires_at)\"]}");
        urlShortener.setDeepDiveTopics("[\"Base62 Encoding vs MD5/SHA256 truncation with collision resolution.\", \"Pre-generating keys with a standalone Key Generation Service (KGS) and Zookeeper range tokens to eliminate database lock contention.\", \"301 Permanent Redirect (cached by browser, lowers server analytics) vs 302 Temporary Redirect (hits server every time, allows accurate click tracking).\"]");
        urlShortener.setTradeOffs("[\"Choosing 302 over 301 increases server load by 10x but enables real-time click analytics.\", \"Pre-generating keys in KGS risks unassigned key loss if a worker crashes, which is acceptable since Base62 with 7 chars provides 62^7 = 3.5 Trillion keys.\"]");
        hldRepository.save(urlShortener);

        // 2. WhatsApp / Messenger
        HldProblem whatsapp = new HldProblem(
                "whatsapp-chat",
                "Design a Real-Time Messaging System (WhatsApp)",
                "Social Media",
                "STAFF",
                "Design a globally scalable end-to-end encrypted messaging service serving 2 Billion users with one-on-one chat, group messaging, online presence, and delivery receipts.",
                "flowchart TD\n  UserA([User A]) -->|WebSocket / TLS| GatewayA[WebSocket Connection Gateway 1]\n  UserB([User B]) -->|WebSocket / TLS| GatewayB[WebSocket Connection Gateway 2]\n  GatewayA --> SessionRegistry[(Redis Cluster - User to Gateway Mapping)]\n  GatewayA --> MessageRouter[Message Router / Dispatcher]\n  MessageRouter --> Kafka[Kafka: chat-events Topic]\n  MessageRouter --> Cassandra[(Cassandra / ScyllaDB Message Store)]\n  MessageRouter --> PushSvc[APNs / FCM Push Notification Service]"
        );
        whatsapp.setFunctionalRequirements("[\"1-on-1 real-time messaging with low latency.\", \"Sent, Delivered, and Read receipts (ticks).\", \"Last seen and real-time online presence status.\", \"Group chat support with up to 1,024 members.\", \"Offline message storage and replay upon reconnect.\"]");
        whatsapp.setNonFunctionalRequirements("[\"End-to-End Encryption (Signal Protocol Double Ratchet).\", \"Sub-100ms message delivery worldwide.\", \"Guaranteed message ordering per conversation.\", \"Scalable to 100 Billion messages per day.\"]");
        whatsapp.setCapacityEstimation("{\"dailyActiveUsers\": \"1 Billion DAU\", \"messagesPerDay\": \"100 Billion messages/day\", \"avgQPS\": \"1.15 Million msgs/sec\", \"peakQPS\": \"3 Million msgs/sec\", \"dailyStorage\": \"100B * 200 bytes = 20 TB / day\"}");
        whatsapp.setApiDesign("[\"WS /ws/chat: Bidirectional binary WebSocket frames for message send/ack/presence\", \"POST /api/v1/conversations/groups: Create group, add members\", \"GET /api/v1/messages/offline: Fetch queued offline messages\"]");
        whatsapp.setDatabaseSchema("{\"messages\": {\"partition_key\": \"conversation_id\", \"clustering_key\": \"message_id DESC\", \"sender_id\": \"UUID\", \"encrypted_payload\": \"BLOB\", \"status\": \"TINYINT\", \"created_at\": \"TIMEUUID\"}}");
        whatsapp.setDeepDiveTopics("[\"Maintaining 50M concurrent WebSocket connections via Epoll on lightweight Go/Netty gateways.\", \"Online presence tracking with heartbeat pings and Redis sorted sets / bitmaps.\", \"Handling fan-out in group chats (Fan-out on Write vs Fan-out on Read for groups).\"]");
        whatsapp.setTradeOffs("[\"Storing messages on device vs cloud: WhatsApp stores ephemeral messages on server until delivered, saving petabytes of cloud storage at the cost of cross-device sync complexity.\"]");
        hldRepository.save(whatsapp);

        // 3. Netflix / YouTube Video Streaming
        HldProblem netflix = new HldProblem(
                "netflix-streaming",
                "Design a Global Video Streaming Platform (Netflix / YouTube)",
                "Streaming",
                "STAFF",
                "Design a global video ingestion, adaptive bitrate encoding (HLS/DASH), and multi-CDN streaming architecture serving 250M subscribers.",
                "flowchart LR\n  Creator([Content Ingestion]) --> S3Ingest[(Raw S3 Bucket)]\n  S3Ingest --> TranscoderFleet[Distributed Transcoding Fleet (FFmpeg on GPU)]\n  TranscoderFleet --> ChunkStorage[(HLS Chunks: 1080p, 4K, 720p, 480p)]\n  ChunkStorage --> MultiCDN[Open Connect Appliance / Fastly / CloudFront]\n  Viewer([Viewer Client]) --> CDNRouter[Dynamic CDN Steering Router]\n  CDNRouter --> MultiCDN"
        );
        netflix.setFunctionalRequirements("[\"Upload and transcode high-resolution raw video into multi-bitrate HLS/DASH chunks.\", \"Adaptive Bitrate Streaming (ABR) that adjusts resolution based on client network bandwidth.\", \"User video search, recommendation feed, and playback progress resume.\"]");
        netflix.setNonFunctionalRequirements("[\"Zero buffering playback at p95.\", \"High availability and regional fault tolerance.\", \"Low storage duplication via deduplication and CDN edge caching.\"]");
        netflix.setCapacityEstimation("{\"subscribers\": \"250 Million\", \"concurrentStreamers\": \"15 Million peak\", \"bandwidth\": \"15M * 5 Mbps = 75 Terabits / second aggregate egress\"}");
        hldRepository.save(netflix);

        // 4. Uber / Ride-Sharing Dispatch
        HldProblem uber = new HldProblem(
                "uber-ride-sharing",
                "Design a Real-Time Ride Sharing Service (Uber / Lyft)",
                "Transportation",
                "PRINCIPAL",
                "Design a distributed geospatial dispatch and matching engine connecting millions of riders and drivers with real-time location updates.",
                "flowchart TD\n  Driver([Driver App]) -->|Location every 4s| GeoIngest[Geospatial Ingestion Gateway]\n  GeoIngest --> Kafka[Kafka Location Stream]\n  Kafka --> H3SpatialIndex[(H3 / Google S2 Geospatial Index in Memory)]\n  Rider([Rider App]) --> DispatchService[Dispatch & Matching Engine]\n  DispatchService --> H3SpatialIndex\n  DispatchService --> ETAService[Routing & Mapbox/OSRM ETA Engine]\n  DispatchService --> TripDatabase[(PostgreSQL Trip Store)]"
        );
        uber.setFunctionalRequirements("[\"Drivers broadcast location every 4 seconds.\", \"Riders request ride; find top N nearest available drivers.\", \"ETA calculation and dynamic surge pricing.\", \"Trip lifecycle tracking: requested, matched, pickup, dropoff.\"]");
        uber.setNonFunctionalRequirements("[\"Location update latency < 500ms.\", \"High consistency during driver acceptance (prevent double booking of a single driver).\", \"High availability for ride dispatch.\"]");
        uber.setCapacityEstimation("{\"activeDrivers\": \"1 Million\", \"locationUpdates\": \"1M / 4s = 250,000 updates/sec\", \"storage\": \"Driver location held in volatile memory H3 geospatial ring with TTL\"}");
        hldRepository.save(uber);

        // 5. Distributed Cache (Redis / Memcached clone)
        HldProblem distCache = new HldProblem(
                "distributed-cache",
                "Design a Distributed In-Memory Cache (Redis Clone)",
                "Infrastructure",
                "STAFF",
                "Design an ultra-low latency distributed in-memory key-value store with consistent hashing, LRU eviction, replication, and master-slave failover.",
                "flowchart TD\n  Client([Client App]) --> HashRing[Consistent Hash Ring / Proxy]\n  HashRing --> ShardMaster1[Node 1 Master]\n  ShardMaster1 --> ShardReplica1[Node 1 Replica]\n  HashRing --> ShardMaster2[Node 2 Master]\n  ShardMaster2 --> ShardReplica2[Node 2 Replica]\n  RaftConsensus[Raft Metadata & Health Coordinator] -. Heartbeats .- ShardMaster1\n  RaftConsensus -. Heartbeats .- ShardMaster2"
        );
        distCache.setFunctionalRequirements("[\"GET(key) -> value in < 1ms.\", \"SET(key, value, ttl) with automatic background expiration.\", \"LRU and LFU cache eviction when memory limit is reached.\", \"Data replication to replica nodes with automatic failover.\"]");
        distCache.setNonFunctionalRequirements("[\"Sub-millisecond read/write latency.\", \"Linear horizontal scalability via consistent hashing.\", \"High availability with zero data loss on clean failover.\"]");
        hldRepository.save(distCache);
    }

    private void seedLldProblems() {
        // 1. Parking Lot
        LldProblem parkingLot = new LldProblem(
                "parking-lot",
                "Design a Low-Level Parking Lot System",
                "INTERMEDIATE",
                "Design a multi-floor parking lot system supporting multiple vehicle types (Motorcycle, Car, Truck), automated ticket issuance, spot allocation strategies (Nearest-First, Random), and flexible payment fee calculation (Hourly, Flat, Dynamic).",
                "classDiagram\n  class VehicleType {\n    <<enumeration>>\n    MOTORCYCLE\n    COMPACT\n    LARGE\n  }\n  class ParkingSpot {\n    -id: String\n    -floor: int\n    -spotType: VehicleType\n    -isFree: boolean\n    +assignVehicle(Vehicle v)\n    +vacate()\n  }\n  class ParkingLot {\n    -floors: List~ParkingFloor~\n    -allocationStrategy: SpotAllocationStrategy\n    +parkVehicle(Vehicle v): Ticket\n    +vacateVehicle(Ticket t): Bill\n  }\n  class SpotAllocationStrategy {\n    <<interface>>\n    +findSpot(List~ParkingFloor~ floors, VehicleType type): ParkingSpot\n  }\n  ParkingLot --> SpotAllocationStrategy\n  ParkingLot --> ParkingSpot",
                "// Production-Ready Java Implementation\npackage com.sysdesign.lld.parkinglot;\n\nimport java.time.Duration;\nimport java.time.Instant;\nimport java.util.*;\nimport java.util.concurrent.ConcurrentHashMap;\n\nenum VehicleType { MOTORCYCLE, COMPACT, LARGE }\n\nrecord Vehicle(String licensePlate, VehicleType type) {}\n\nclass ParkingSpot {\n    private final String id;\n    private final int floor;\n    private final VehicleType type;\n    private volatile boolean occupied;\n    private Vehicle currentVehicle;\n\n    public ParkingSpot(String id, int floor, VehicleType type) {\n        this.id = id;\n        this.floor = floor;\n        this.type = type;\n        this.occupied = false;\n    }\n\n    public synchronized boolean assign(Vehicle vehicle) {\n        if (occupied || vehicle.type() != this.type) return false;\n        this.currentVehicle = vehicle;\n        this.occupied = true;\n        return true;\n    }\n\n    public synchronized void vacate() {\n        this.currentVehicle = null;\n        this.occupied = false;\n    }\n\n    public boolean isFree() { return !occupied; }\n    public String getId() { return id; }\n    public VehicleType getType() { return type; }\n}\n\nrecord ParkingTicket(String ticketId, Vehicle vehicle, ParkingSpot spot, Instant entryTime) {}\n\ninterface FeeCalculationStrategy {\n    double calculateFee(Duration duration, VehicleType type);\n}\n\nclass HourlyFeeStrategy implements FeeCalculationStrategy {\n    public double calculateFee(Duration duration, VehicleType type) {\n        long hours = Math.max(1, duration.toHours());\n        double rate = switch (type) {\n            case MOTORCYCLE -> 10.0;\n            case COMPACT -> 20.0;\n            case LARGE -> 40.0;\n        };\n        return hours * rate;\n    }\n}\n\nclass ParkingLot {\n    private final List<ParkingSpot> spots = new ArrayList<>();\n    private final Map<String, ParkingTicket> activeTickets = new ConcurrentHashMap<>();\n    private final FeeCalculationStrategy feeStrategy;\n\n    public ParkingLot(FeeCalculationStrategy feeStrategy) {\n        this.feeStrategy = feeStrategy;\n    }\n\n    public void addSpot(ParkingSpot spot) { spots.add(spot); }\n\n    public synchronized Optional<ParkingTicket> park(Vehicle vehicle) {\n        for (ParkingSpot spot : spots) {\n            if (spot.isFree() && spot.getType() == vehicle.type()) {\n                if (spot.assign(vehicle)) {\n                    String ticketId = UUID.randomUUID().toString();\n                    ParkingTicket ticket = new ParkingTicket(ticketId, vehicle, spot, Instant.now());\n                    activeTickets.put(ticketId, ticket);\n                    return Optional.of(ticket);\n                }\n            }\n        }\n        return Optional.empty(); // Lot full\n    }\n\n    public synchronized double unpark(String ticketId) {\n        ParkingTicket ticket = activeTickets.remove(ticketId);\n        if (ticket == null) throw new IllegalArgumentException(\"Invalid ticket\");\n        ticket.spot().vacate();\n        Duration duration = Duration.between(ticket.entryTime(), Instant.now());\n        return feeStrategy.calculateFee(duration, ticket.vehicle().type());\n    }\n}",
                "@Test\nvoid testParkingLotAllocationAndUnparking() {\n    FeeCalculationStrategy strategy = new HourlyFeeStrategy();\n    ParkingLot lot = new ParkingLot(strategy);\n    lot.addSpot(new ParkingSpot(\"F1-S1\", 1, VehicleType.COMPACT));\n\n    Vehicle car = new Vehicle(\"MH12-AB-1234\", VehicleType.COMPACT);\n    Optional<ParkingTicket> ticketOpt = lot.park(car);\n    assertTrue(ticketOpt.isPresent());\n\n    double fee = lot.unpark(ticketOpt.get().ticketId());\n    assertTrue(fee >= 20.0);\n}",
                "Extensibility: Easily add electric vehicle charging spots by extending ParkingSpot. Add dynamic peak pricing by injecting a SurgeFeeStrategy. Add multi-entry and multi-exit barrier gates using thread-safe concurrent queues."
        );
        parkingLot.setSolidPrinciplesApplied("[\"Single Responsibility: Separate classes for ParkingSpot, Ticket, FeeCalculationStrategy, and ParkingLot.\", \"Open/Closed Principle: FeeCalculationStrategy allows adding Flat, Daily, or Surge fees without touching ParkingLot logic.\", \"Dependency Inversion: ParkingLot depends on FeeCalculationStrategy abstraction rather than hardcoded math.\"]");
        parkingLot.setDesignPatternsUsed("[\"Strategy Pattern: FeeCalculationStrategy for swappable payment algorithms.\", \"Factory Pattern: ParkingSpotFactory to instantiate typed spots.\", \"Singleton Pattern: ParkingLot instance in enterprise deployments.\"]");
        lldRepository.save(parkingLot);

        // 2. Elevator System
        LldProblem elevator = new LldProblem(
                "elevator-system",
                "Design a Multi-Car Elevator Control System",
                "STAFF",
                "Design an intelligent elevator dispatch system for a 50-story commercial building with multiple elevator cars, handling internal button presses, hall call button presses, and the LOOK/SCAN elevator scheduling algorithm.",
                "classDiagram\n  class Direction {\n    <<enumeration>>\n    UP\n    DOWN\n    IDLE\n  }\n  class ElevatorCar {\n    -id: int\n    -currentFloor: int\n    -direction: Direction\n    -destinations: TreeSet~Integer~\n    +addStop(int floor)\n    +step(): void\n  }\n  class ElevatorController {\n    -elevators: List~ElevatorCar~\n    -dispatchStrategy: DispatchStrategy\n    +requestElevator(int floor, Direction dir)\n  }\n  ElevatorController --> ElevatorCar",
                "// Elevator System Implementation with LOOK scheduling algorithm\npackage com.sysdesign.lld.elevator;\n\nimport java.util.*;\n\nenum Direction { UP, DOWN, IDLE }\n\nclass ElevatorCar {\n    private final int id;\n    private int currentFloor = 1;\n    private Direction direction = Direction.IDLE;\n    private final TreeSet<Integer> upRequests = new TreeSet<>();\n    private final TreeSet<Integer> downRequests = new TreeSet<>(Collections.reverseOrder());\n\n    public ElevatorCar(int id) { this.id = id; }\n\n    public synchronized void addDestination(int floor) {\n        if (floor > currentFloor) upRequests.add(floor);\n        else if (floor < currentFloor) downRequests.add(floor);\n        if (direction == Direction.IDLE) {\n            direction = floor >= currentFloor ? Direction.UP : Direction.DOWN;\n        }\n    }\n\n    public synchronized void step() {\n        if (direction == Direction.UP) {\n            if (!upRequests.isEmpty()) {\n                currentFloor = upRequests.pollFirst();\n            } else if (!downRequests.isEmpty()) {\n                direction = Direction.DOWN;\n                currentFloor = downRequests.pollFirst();\n            } else {\n                direction = Direction.IDLE;\n            }\n        } else if (direction == Direction.DOWN) {\n            if (!downRequests.isEmpty()) {\n                currentFloor = downRequests.pollFirst();\n            } else if (!upRequests.isEmpty()) {\n                direction = Direction.UP;\n                currentFloor = upRequests.pollFirst();\n            } else {\n                direction = Direction.IDLE;\n            }\n        }\n    }\n\n    public int getCurrentFloor() { return currentFloor; }\n    public Direction getDirection() { return direction; }\n    public int getId() { return id; }\n}",
                "@Test\nvoid testElevatorLookScheduling() {\n    ElevatorCar car = new ElevatorCar(1);\n    car.addDestination(5);\n    car.addDestination(3);\n    car.addDestination(10);\n\n    car.step();\n    assertEquals(3, car.getCurrentFloor());\n    car.step();\n    assertEquals(5, car.getCurrentFloor());\n    car.step();\n    assertEquals(10, car.getCurrentFloor());\n}",
                "Extensibility: Supports adding VIP priority elevator dispatch, energy saving standby modes, and weight sensor overloading safeguards."
        );
        elevator.setSolidPrinciplesApplied("[\"Single Responsibility: ElevatorCar handles movement; ElevatorController handles dispatch.\", \"Open/Closed: Dispatch algorithms (LOOK, SCAN, Shortest Seek Time) are pluggable.\"]");
        elevator.setDesignPatternsUsed("[\"State Pattern: Elevator state transitions between UP, DOWN, and IDLE.\", \"Observer Pattern: Door opening and floor arrival event broadcasting.\"]");
        lldRepository.save(elevator);

        // 3. Rate Limiter
        LldProblem rateLimiter = new LldProblem(
                "rate-limiter",
                "Design a Low-Level Rate Limiter (Token Bucket & Leaky Bucket)",
                "SENIOR",
                "Design a thread-safe, low-latency API rate limiter supporting Token Bucket and Sliding Window Log algorithms with custom refill rates and burst capacities.",
                "classDiagram\n  class RateLimiter {\n    <<interface>>\n    +allowRequest(String clientId): boolean\n  }\n  class TokenBucketRateLimiter {\n    -capacity: long\n    -refillRatePerSec: double\n    -clientBuckets: Map~String, Bucket~\n    +allowRequest(String clientId): boolean\n  }\n  RateLimiter <|.. TokenBucketRateLimiter",
                "// Thread-Safe Token Bucket Rate Limiter\npackage com.sysdesign.lld.ratelimiter;\n\nimport java.util.concurrent.ConcurrentHashMap;\n\npublic class TokenBucketRateLimiter {\n    private final long capacity;\n    private final double refillTokensPerNano;\n    private final ConcurrentHashMap<String, Bucket> buckets = new ConcurrentHashMap<>();\n\n    public TokenBucketRateLimiter(long capacity, double refillTokensPerSecond) {\n        this.capacity = capacity;\n        this.refillTokensPerNano = refillTokensPerSecond / 1_000_000_000.0;\n    }\n\n    public boolean allowRequest(String clientId) {\n        return buckets.computeIfAbsent(clientId, k -> new Bucket(capacity, refillTokensPerNano))\n                      .tryConsume(1);\n    }\n\n    private static class Bucket {\n        private final long capacity;\n        private final double refillRate;\n        private double tokens;\n        private long lastRefillNanos;\n\n        Bucket(long capacity, double refillRate) {\n            this.capacity = capacity;\n            this.refillRate = refillRate;\n            this.tokens = capacity;\n            this.lastRefillNanos = System.nanoTime();\n        }\n\n        synchronized boolean tryConsume(int requiredTokens) {\n            long now = System.nanoTime();\n            long elapsed = now - lastRefillNanos;\n            tokens = Math.min(capacity, tokens + (elapsed * refillRate));\n            lastRefillNanos = now;\n\n            if (tokens >= requiredTokens) {\n                tokens -= requiredTokens;\n                return true;\n            }\n            return false;\n        }\n    }\n}",
                "@Test\nvoid testRateLimiterBurstAndRejection() {\n    TokenBucketRateLimiter limiter = new TokenBucketRateLimiter(2, 1.0);\n    assertTrue(limiter.allowRequest(\"user1\"));\n    assertTrue(limiter.allowRequest(\"user1\"));\n    assertFalse(limiter.allowRequest(\"user1\")); // Burst exceeded\n}",
                "Extensibility: Can be distributed by backing tokens with Redis Lua scripts for multi-node API gateways."
        );
        rateLimiter.setSolidPrinciplesApplied("[\"Interface Segregation: Simple boolean allowRequest interface.\", \"Single Responsibility: Bucket manages token refill calculus; Limiter manages tenant routing.\"]");
        rateLimiter.setDesignPatternsUsed("[\"Strategy Pattern: Swappable Token Bucket vs Sliding Window Counter algorithms.\"]");
        lldRepository.save(rateLimiter);
    }

    private void seedQuestionBank() {
        QuestionBankItem q1 = new QuestionBankItem(
                "How does Kafka guarantee message ordering across consumer failures?",
                "Distributed Systems",
                "STAFF",
                new String[]{"Google", "Uber", "Amazon", "Netflix"},
                true,
                "In Apache Kafka, message ordering is strictly guaranteed only within a single partition. How does Kafka maintain this guarantee during consumer crashes, and how do you achieve global ordering when required?",
                "Kafka guarantees total ordering within a partition by assigning sequential offsets to each record written to the partition log. When a consumer fails, the consumer group triggers a rebalance. To avoid out-of-order processing, consumers commit offsets only after successfully processing batches (or using cooperative sticky rebalance protocols). For keys requiring strict ordering, producers specify a partition key: all events with the same key (e.g. order_id) hash to the exact same partition. Global ordering across multiple partitions is fundamentally incompatible with horizontal scale, but can be simulated using single-partition topics or application-level sequence resequencers.",
                "[\"Partition-level ordering guarantee\", \"Consistent hashing of message keys\", \"Consumer offset commit semantics\", \"Cooperative sticky rebalance\"]"
        );
        questionBankRepository.save(q1);

        QuestionBankItem q2 = new QuestionBankItem(
                "Explain the two-phase commit (2PC) protocol and why modern microservices avoid it.",
                "Databases",
                "SENIOR",
                new String[]{"Amazon", "Microsoft", "Meta"},
                true,
                "Walk through the prepare and commit phases of Two-Phase Commit. What is the fundamental flaw of 2PC in distributed architectures?",
                "2PC coordinates atomic distributed transactions across multiple resource managers. In Phase 1 (Prepare), the coordinator asks all participants if they can commit; participants acquire local row locks and write prepare logs to WAL before replying 'Yes'. In Phase 2 (Commit), if all voted Yes, coordinator commands 'Commit'. The fatal flaw of 2PC is that it is a BLOCKING protocol: if the coordinator crashes during Phase 2, participants hold database locks indefinitely, starving all subsequent requests and destroying system availability. Therefore, cloud-native microservices replace 2PC with asynchronous Saga patterns with compensating transactions.",
                "[\"Prepare phase vs Commit phase\", \"Coordinator single point of failure and blocking locks\", \"Saga pattern alternative with eventual consistency\"]"
        );
        questionBankRepository.save(q2);
    }
}
