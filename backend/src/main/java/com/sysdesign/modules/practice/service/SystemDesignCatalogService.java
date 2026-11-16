package com.sysdesign.modules.practice.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sysdesign.modules.practice.dto.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class SystemDesignCatalogService {

    private static final Logger log = LoggerFactory.getLogger(SystemDesignCatalogService.class);
    private final Map<String, TopicHubDetailDto> topicsMap = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper;

    public SystemDesignCatalogService() {
        this(new ObjectMapper());
    }

    public SystemDesignCatalogService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper != null ? objectMapper : new ObjectMapper();
        initHardcodedTopics();
        loadCatalogFromJson();
    }

    private void loadCatalogFromJson() {
        try (InputStream is = getClass().getResourceAsStream("/data/topics-catalog.json")) {
            if (is != null) {
                List<TopicHubDetailDto> list = objectMapper.readValue(is, new TypeReference<List<TopicHubDetailDto>>() {});
                for (TopicHubDetailDto topic : list) {
                    topicsMap.put(topic.id(), topic);
                }
                log.info("Loaded {} topics from /data/topics-catalog.json into topicsMap", list.size());
            } else {
                log.warn("topics-catalog.json not found in classpath /data/");
            }
        } catch (Exception e) {
            log.error("Failed to load /data/topics-catalog.json", e);
        }
    }

    public List<TopicHubSummaryDto> getAllSummaries(String typeFilter, String categoryFilter, String search) {
        return topicsMap.values().stream()
                .filter(t -> typeFilter == null || typeFilter.equalsIgnoreCase("ALL") || t.type().equalsIgnoreCase(typeFilter))
                .filter(t -> categoryFilter == null || categoryFilter.equalsIgnoreCase("ALL") || t.category().equalsIgnoreCase(categoryFilter))
                .filter(t -> {
                    if (search == null || search.isBlank()) return true;
                    String query = search.toLowerCase();
                    return t.title().toLowerCase().contains(query) ||
                            t.description().toLowerCase().contains(query) ||
                            t.category().toLowerCase().contains(query);
                })
                .sorted(Comparator.comparing(TopicHubDetailDto::title))
                .map(t -> new TopicHubSummaryDto(
                        t.id(),
                        t.title(),
                        t.type(),
                        t.category(),
                        t.difficulty(),
                        t.description(),
                        t.deepDiveTopics()
                ))
                .collect(Collectors.toList());
    }

    public Optional<TopicHubDetailDto> getTopicDetail(String id) {
        return Optional.ofNullable(topicsMap.get(id));
    }

    private void initHardcodedTopics() {
        // ==========================================
        // 1. HLD: URL Shortener (TinyURL)
        // ==========================================
        topicsMap.put("url-shortener", new TopicHubDetailDto(
                "url-shortener",
                "Design a Scalable URL Shortener (TinyURL)",
                "HLD",
                "Infrastructure",
                "BEGINNER",
                "High-availability URL shortening service capable of handling 500M new links per month with a 100:1 read-to-write ratio and < 20ms p99 redirect latency.",
                """
                flowchart TD
                  Client([Client Browser / Mobile]) -->|GET /xyz123| DNS[Route 53 GeoDNS]
                  DNS --> CDN[CloudFront Edge CDN]
                  CDN -->|Cache Miss| ALB[Application Load Balancer]
                  ALB --> WebFleet[Stateless Web API Fleet]
                  WebFleet -->|1. Check Cache| Redis[(Redis Cluster - Hot 20% URLs)]
                  WebFleet -->|2. Generate Key| KGS[Key Generation Service / Zookeeper Range]
                  WebFleet -->|3. Persist / Fallback| Postgres[(PostgreSQL Sharded by Hash)]
                  Postgres --> ReadReplica[(Read Replicas)]
                """,
                """
                classDiagram
                  class ShortUrl {
                    -shortKey: String
                    -longUrl: String
                    -userId: String
                    -createdAt: Instant
                    -expiresAt: Instant
                    +isExpired(): boolean
                  }
                  class UrlRepository {
                    <<interface>>
                    +findByKey(String key): Optional~ShortUrl~
                    +save(ShortUrl url): ShortUrl
                  }
                  class KeyGenerationService {
                    +generateNextKey(): String
                  }
                  class UrlShortenerService {
                    -repo: UrlRepository
                    -cache: CacheClient
                    -kgs: KeyGenerationService
                    +shortenUrl(String longUrl): String
                    +resolveUrl(String shortKey): String
                  }
                  UrlShortenerService --> UrlRepository
                  UrlShortenerService --> KeyGenerationService
                """,
                """
                sequenceDiagram
                  autonumber
                  Client->>CDN: GET /aB3d9e
                  alt Edge Cache Hit
                    CDN-->>Client: 302 Found (Location: target URL)
                  else Edge Cache Miss
                    CDN->>Gateway: Forward Request
                    Gateway->>Redis: GET aB3d9e
                    alt Cache Hit
                      Redis-->>Gateway: https://destination.com
                      Gateway-->>CDN: 302 Found
                      CDN-->>Client: 302 Found
                    else Cache Miss
                      Gateway->>Postgres: SELECT long_url FROM url_mappings WHERE short_key = 'aB3d9e'
                      Postgres-->>Gateway: Long URL result
                      Gateway->>Redis: SETEX aB3d9e 86400 (URL + Jitter)
                      Gateway-->>CDN: 302 Found
                      CDN-->>Client: 302 Found
                    end
                  end
                """,
                new CodeOptionsDto(
                        """
                        // Java 25 Production URL Shortener Service
                        package com.sysdesign.hld.urlshortener;

                        import java.time.Instant;
                        import java.util.Optional;
                        import java.util.concurrent.ConcurrentHashMap;

                        public class UrlShortenerService {
                            private static final String BASE62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
                            private final ConcurrentHashMap<String, String> cache = new ConcurrentHashMap<>();
                            private final ConcurrentHashMap<String, String> database = new ConcurrentHashMap<>();
                            private long counter = 100000000000L;

                            public synchronized String shortenUrl(String longUrl) {
                                String shortKey = encodeBase62(counter++);
                                database.put(shortKey, longUrl);
                                cache.put(shortKey, longUrl);
                                return "https://short.ly/" + shortKey;
                            }

                            public Optional<String> resolve(String shortKey) {
                                if (cache.containsKey(shortKey)) {
                                    return Optional.of(cache.get(shortKey));
                                }
                                String url = database.get(shortKey);
                                if (url != null) {
                                    cache.put(shortKey, url);
                                    return Optional.of(url);
                                }
                                return Optional.empty();
                            }

                            private String encodeBase62(long num) {
                                StringBuilder sb = new StringBuilder();
                                while (num > 0) {
                                    sb.append(BASE62.charAt((int) (num % 62)));
                                    num /= 62;
                                }
                                return sb.reverse().toString();
                            }
                        }
                        """,
                        """
                        # Python 3.12 URL Shortener Implementation
                        import time
                        from typing import Optional

                        BASE62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

                        class UrlShortenerService:
                            def __init__(self):
                                self.cache: dict[str, str] = {}
                                self.db: dict[str, str] = {}
                                self.counter: int = 100_000_000_000

                            def shorten(self, long_url: str) -> str:
                                self.counter += 1
                                short_key = self._encode_base62(self.counter)
                                self.db[short_key] = long_url
                                self.cache[short_key] = long_url
                                return f"https://short.ly/{short_key}"

                            def resolve(self, short_key: str) -> Optional[str]:
                                if short_key in self.cache:
                                    return self.cache[short_key]
                                long_url = self.db.get(short_key)
                                if long_url:
                                    self.cache[short_key] = long_url
                                    return long_url
                                return None

                            def _encode_base62(self, num: int) -> str:
                                digits = []
                                while num > 0:
                                    digits.append(BASE62[num % 62])
                                    num //= 62
                                return "".join(reversed(digits))
                        """,
                        """
                        // C++ 20 URL Shortener Implementation
                        #include <iostream>
                        #include <string>
                        #include <unordered_map>
                        #include <optional>
                        #include <algorithm>
                        #include <mutex>

                        class UrlShortenerService {
                        private:
                            const std::string BASE62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
                            std::unordered_map<std::string, std::string> cache;
                            std::unordered_map<std::string, std::string> database;
                            uint64_t counter = 100000000000ULL;
                            std::mutex mtx;

                            std::string encodeBase62(uint64_t num) {
                                std::string result;
                                while (num > 0) {
                                    result += BASE62[num % 62];
                                    num /= 62;
                                }
                                std::reverse(result.begin(), result.end());
                                return result;
                            }

                        public:
                            std::string shorten(const std::string& longUrl) {
                                std::lock_guard<std::mutex> lock(mtx);
                                std::string shortKey = encodeBase62(++counter);
                                database[shortKey] = longUrl;
                                cache[shortKey] = longUrl;
                                return "https://short.ly/" + shortKey;
                            }

                            std::optional<std::string> resolve(const std::string& shortKey) {
                                std::lock_guard<std::mutex> lock(mtx);
                                auto it = cache.find(shortKey);
                                if (it != cache.end()) return it->second;
                                auto dbIt = database.find(shortKey);
                                if (dbIt != database.end()) {
                                    cache[shortKey] = dbIt->second;
                                    return dbIt->second;
                                }
                                return std::nullopt;
                            }
                        };
                        """,
                        """
                        // Go URL Shortener Implementation
                        package main

                        import (
                            "errors"
                            "strings"
                            "sync"
                            "sync/atomic"
                        )

                        const base62Chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

                        type UrlShortener struct {
                            counter uint64
                            cache   sync.Map
                            db      sync.Map
                        }

                        func NewUrlShortener() *UrlShortener {
                            return &UrlShortener{counter: 100000000000}
                        }

                        func (s *UrlShortener) Shorten(longUrl string) string {
                            id := atomic.AddUint64(&s.counter, 1)
                            shortKey := s.encodeBase62(id)
                            s.db.Store(shortKey, longUrl)
                            s.cache.Store(shortKey, longUrl)
                            return "https://short.ly/" + shortKey
                        }

                        func (s *UrlShortener) Resolve(shortKey string) (string, error) {
                            if val, ok := s.cache.Load(shortKey); ok {
                                return val.(string), nil
                            }
                            if val, ok := s.db.Load(shortKey); ok {
                                s.cache.Store(shortKey, val)
                                return val.(string), nil
                            }
                            return "", errors.New("url not found")
                        }

                        func (s *UrlShortener) encodeBase62(num uint64) string {
                            var sb strings.Builder
                            for num > 0 {
                                sb.WriteByte(base62Chars[num%62])
                                num /= 62
                            }
                            runes := []rune(sb.String())
                            for i, j := 0, len(runes)-1; i < j; i, j = i+1, j-1 {
                                runes[i], runes[j] = runes[j], runes[i]
                            }
                            return string(runes)
                        }
                        """
                ),
                List.of(
                        new WorkingStepDto(1, "GeoDNS & Anycast", "Client initiates GET request for short link. Anycast DNS routes traffic to geographically closest CDN PoP.", "DNS / Anycast", "< 15ms", "Explain how Anycast terminates TLS handshakes close to user, avoiding cross-ocean RTT."),
                        new WorkingStepDto(2, "Edge CDN Cache", "CloudFront edge inspects in-memory cache. On hit, issues HTTP 302 redirect instantly without touching origin.", "TLS 1.3 / HTTP/3", "< 5ms", "Clarify why 302 Found is preferred over 301 Moved Permanently when real-time analytics are required."),
                        new WorkingStepDto(3, "L7 Gateway & Rate Limiting", "On cache miss, request hits Envoy API Gateway which checks Token Bucket rate limits (100 req/sec per IP).", "gRPC / HTTP/2", "< 2ms", "Stateless token-bucket limits prevent scrape crawlers from exhausting database connections."),
                        new WorkingStepDto(4, "Redis LRU Cache Lookup", "Application worker queries Redis cluster using short_key as hash key. 80/20 rule guarantees > 80% hit ratio.", "Redis RESP3", "< 2ms", "Explain memory sizing: 20% hot keys with 170 GB RAM covers 500M URLs comfortably."),
                        new WorkingStepDto(5, "PostgreSQL Sharded Read", "On Redis miss, worker queries sharded PostgreSQL DB using hash(short_key) % num_shards.", "JDBC Pool", "< 8ms", "Discuss shard key selection: using short_key ensures uniform read distribution across all database instances.")
                ),
                List.of(
                        new RelatedAnswerDto(
                                "Why use Base62 encoding instead of Base64 or MD5 hashing?",
                                "Testing encoding trade-offs, URL safety, and hash collision vulnerabilities.",
                                "Base62 uses [0-9, a-z, A-Z] which avoids special URL characters like '+' and '/' used in Base64 that require URL percent-encoding. Hashing algorithms like MD5 or SHA-256 produce 128/256-bit digests that require truncation to 7 characters, introducing the Birthday Paradox collision risk. Base62 sequential key generation guarantees zero collisions and yields 62^7 = 3.52 Trillion unique URLs.",
                                List.of("Base62 is alphanumeric and URL-safe", "Avoids collision handling loops required by truncated MD5", "62^7 provides 3.52 Trillion unique links"),
                                "Pre-generating keys in KGS introduces potential unallocated key gaps during node crashes, but keyspace (3.5T) is virtually inexhaustible.",
                                "Handling custom user aliases: Requires immediate unique index check in DB and reservation before client commit."
                        ),
                        new RelatedAnswerDto(
                                "What is the difference between HTTP 301 and HTTP 302 redirects for TinyURL?",
                                "Testing HTTP protocol mechanics, browser caching, and analytics trade-offs.",
                                "HTTP 301 is 'Moved Permanently'. Browsers cache this redirect locally, meaning future clicks go directly to the destination without contacting TinyURL servers. This saves origin server bandwidth but prevents click analytics tracking. HTTP 302 is 'Found' (Temporary Redirect), forcing the browser to request TinyURL on every single visit, enabling accurate click counting, referrer logging, and geolocation tracking.",
                                List.of("301 is permanently cached by browser", "302 forces origin hit for analytics and click counters", "Enterprise shorteners typically choose 302"),
                                "302 increases origin server load by 5x-10x, requiring robust Redis and CDN edge caching.",
                                "Cache stampede if a hot promotion link expires simultaneously across edge nodes."
                        )
                ),
                List.of("Key Generation Service (KGS) with Zookeeper Range Allocation", "Hash Sharding across PostgreSQL instances", "Probabilistic Early Expiration (XFetch) for Hot Links"),
                List.of("301 (low server cost, zero analytics) vs 302 (high analytics, higher traffic load)", "KGS pre-allocation (speed) vs sequence auto-increment (lock contention)")
        ));

        // ==========================================
        // 2. HLD: WhatsApp Real-Time Chat
        // ==========================================
        topicsMap.put("whatsapp-chat", new TopicHubDetailDto(
                "whatsapp-chat",
                "Design a Real-Time Messaging System (WhatsApp / Messenger)",
                "HLD",
                "Social Media",
                "STAFF",
                "Globally distributed messaging platform serving 2B users with sub-100ms 1-on-1 chat, group fan-out, online presence, and offline delivery queues.",
                """
                flowchart TD
                  UserA([User A Mobile]) -->|WebSocket / TLS| GatewayA[WebSocket Gateway Pod 1]
                  UserB([User B Mobile]) -->|WebSocket / TLS| GatewayB[WebSocket Gateway Pod 2]
                  GatewayA --> SessionMap[(Redis Cluster - User to Gateway Mapping)]
                  GatewayA --> MessageRouter[Message Dispatch Router]
                  MessageRouter --> Kafka[Kafka: chat-messages Topic]
                  MessageRouter --> Cassandra[(Cassandra / ScyllaDB Message Store)]
                  MessageRouter --> PushSvc[APNs / FCM Push Notification Service]
                """,
                """
                classDiagram
                  class Message {
                    -messageId: UUID
                    -conversationId: UUID
                    -senderId: UUID
                    -recipientId: UUID
                    -payload: byte[]
                    -status: MessageStatus
                    -timestamp: Instant
                  }
                  class MessageStatus {
                    <<enumeration>>
                    SENT
                    DELIVERED
                    READ
                  }
                  class ConnectionManager {
                    -activeSockets: Map~UUID, WebSocket~
                    +routeMessage(UUID recipientId, Message msg)
                    +registerUser(UUID userId, WebSocket socket)
                  }
                  class GroupManager {
                    +fanOutMessage(UUID groupId, Message msg)
                  }
                  ConnectionManager --> Message
                """,
                """
                sequenceDiagram
                  autonumber
                  UserA->>GatewayA: Send Message (recipient: UserB)
                  GatewayA->>Cassandra: Persist Message (Status: SENT)
                  GatewayA-->>UserA: ACK (Single Tick ✓)
                  GatewayA->>Redis: Lookup UserB Gateway Pod
                  alt UserB is Online (GatewayB)
                    Redis-->>GatewayA: Gateway Pod B IP
                    GatewayA->>GatewayB: Push Message via internal RPC
                    GatewayB->>UserB: Deliver WebSocket Frame
                    UserB-->>GatewayB: ACK Delivered
                    GatewayB->>GatewayA: Notify Delivered
                    GatewayA->>UserA: Update Double Tick (✓✓)
                  else UserB is Offline
                    Redis-->>GatewayA: User Offline
                    GatewayA->>PushSvc: Send Push Notification (APNs/FCM)
                  end
                """,
                new CodeOptionsDto(
                        """
                        // Java WebSocket Session Router
                        package com.sysdesign.hld.chat;

                        import java.util.UUID;
                        import java.util.concurrent.ConcurrentHashMap;

                        public class ChatRouterService {
                            private final ConcurrentHashMap<UUID, String> userGatewayRegistry = new ConcurrentHashMap<>();

                            public void registerConnection(UUID userId, String gatewayId) {
                                userGatewayRegistry.put(userId, gatewayId);
                            }

                            public String routeMessage(UUID recipientId) {
                                return userGatewayRegistry.getOrDefault(recipientId, "OFFLINE");
                            }
                        }
                        """,
                        """
                        # Python Real-Time Message Router
                        from typing import Dict, Optional
                        import uuid

                        class ChatRouterService:
                            def __init__(self):
                                self.sessions: Dict[uuid.UUID, str] = {}

                            def register(self, user_id: uuid.UUID, gateway_id: str):
                                self.sessions[user_id] = gateway_id

                            def get_route(self, recipient_id: uuid.UUID) -> Optional[str]:
                                return self.sessions.get(recipient_id)
                        """,
                        """
                        // C++ 20 High-Throughput Connection Registry
                        #include <unordered_map>
                        #include <string>
                        #include <mutex>

                        class ChatRouterService {
                        private:
                            std::unordered_map<std::string, std::string> sessionMap;
                            std::mutex mtx;
                        public:
                            void registerUser(const std::string& userId, const std::string& gatewayIp) {
                                std::lock_guard<std::mutex> lock(mtx);
                                sessionMap[userId] = gatewayIp;
                            }
                            std::string getGateway(const std::string& userId) {
                                std::lock_guard<std::mutex> lock(mtx);
                                auto it = sessionMap.find(userId);
                                return (it != sessionMap.end()) ? it->second : "OFFLINE";
                            }
                        };
                        """,
                        """
                        // Go Concurrent Message Dispatcher
                        package main

                        import "sync"

                        type ChatRouter struct {
                            sessions sync.Map
                        }

                        func (r *ChatRouter) Register(userId, gatewayIp string) {
                            r.sessions.Store(userId, gatewayIp)
                        }

                        func (r *ChatRouter) Route(userId string) (string, bool) {
                            val, ok := r.sessions.Load(userId)
                            if !ok {
                                return "", false
                            }
                            return val.(string), true
                        }
                        """
                ),
                List.of(
                        new WorkingStepDto(1, "WebSocket Handshake", "User connects and upgrades HTTP to TLS WebSocket connection. Connection terminates on edge Netty/Go gateway.", "WSS / TLS 1.3", "< 50ms", "Gateways use Linux Epoll to handle up to 2 million idle connections per server node."),
                        new WorkingStepDto(2, "Session Registration", "Gateway registers userId -> gateway_pod_ip mapping inside Redis Cluster with 60s TTL refreshed by heartbeat.", "Redis RESP", "< 2ms", "Distributed session table allows any gateway to locate any user in O(1) time."),
                        new WorkingStepDto(3, "Message Serialization", "Sender transmits encrypted message payload with client timestamp and idempotency sequence number.", "Protobuf", "< 1ms", "Protobuf cuts message payload size by 65% compared to JSON."),
                        new WorkingStepDto(4, "Message Ingestion & DB", "Message is written to Cassandra with partition_key = conversation_id and clustering_key = message_id DESC.", "CQL / LSM-Tree", "< 5ms", "Cassandra LSM-Tree architecture delivers 100,000+ sequential write IOPS per node."),
                        new WorkingStepDto(5, "Delivery Dispatch", "Router checks recipient presence. If online, routes via internal gRPC to recipient gateway; if offline, pushes to APNs/FCM.", "gRPC / Push", "< 30ms", "Double-tick delivery receipt is transmitted back along the sender's active WebSocket connection.")
                ),
                List.of(
                        new RelatedAnswerDto(
                                "How do you maintain 50 Million active WebSocket connections concurrently?",
                                "Testing OS kernel tuning, memory footprints, and gateway architectural limits.",
                                "A naive thread-per-connection model crashes due to thread stack memory. We use non-blocking event-loop architectures (Linux epoll with Netty in Java, or Go goroutines). Each idle socket consumes only ~2-3 KB of kernel memory. Kernel parameters must be tuned: increase `fs.file-max` (file descriptors), set `tcp_tw_reuse`, and decrease TCP buffer allocations. Load balancers at Layer 4 (AWS NLB) steer TCP traffic across gateway fleets.",
                                List.of("Linux epoll event-driven I/O", "Tuning OS file descriptors and TCP socket buffers", "L4 Load Balancing with connection affinity"),
                                "Heartbeat ping frequency: Frequent pings detect dropped connections quickly but burn mobile battery and server CPU.",
                                "Mass reconnection storms during cellular network blips mitigated by exponential backoff with jitter."
                        ),
                        new RelatedAnswerDto(
                                "How does WhatsApp ensure message ordering across distributed connections?",
                                "Testing distributed clocks, vector clocks, and partition ordering semantics.",
                                "Relying on client wall-clock timestamps causes out-of-order messages due to clock drift. WhatsApp assigns a monotonic sequence number or TimeUUID per conversation generated on the server gateway. In Cassandra, messages are partitioned by conversation_id and clustered by message_id DESC, guaranteeing total physical ordering within any given chat.",
                                List.of("Server-generated monotonic TimeUUID", "Cassandra partition_key + clustering_key ordering", "Client reconciliation via sequence numbers"),
                                "Cassandra eventual consistency during cross-DC replication handled by local quorum (LOCAL_QUORUM).",
                                "Offline message reconciliation when a device reconnects after weeks."
                        )
                ),
                List.of("End-to-End Encryption (Signal Protocol Double Ratchet)", "Fan-out on Write vs Fan-out on Read for Group Chats", "Heartbeat Ping Frequency vs Mobile Battery Optimization"),
                List.of("Server ephemeral storage (privacy + cost) vs Cloud chat history backup", "L4 TCP load balancing vs L7 WebSocket termination")
        ));

        // ==========================================
        // 3. LLD: Low-Level Parking Lot System
        // ==========================================
        topicsMap.put("parking-lot", new TopicHubDetailDto(
                "parking-lot",
                "Design a Low-Level Parking Lot System",
                "LLD",
                "Object-Oriented Design",
                "INTERMEDIATE",
                "Complete OOP design of a multi-floor parking lot with vehicle types, nearest-first spot allocation, swappable fee calculation strategies, and thread-safe concurrency.",
                """
                flowchart TD
                  Vehicle([Vehicle Ingress]) --> Gate[Entry Barrier Gate]
                  Gate --> Allocator[Spot Allocation Engine]
                  Allocator --> FloorMap[Floors 1..N Spot Index]
                  Allocator --> TicketGen[Ticket Generator]
                  TicketGen --> Ticket([Issued Ticket])
                  Ticket --> ExitGate[Exit Payment Gate]
                  ExitGate --> FeeCalc[Fee Strategy: Hourly / Daily / Surge]
                  FeeCalc --> PaymentReceipt([Paid Bill])
                """,
                """
                classDiagram
                  class VehicleType {
                    <<enumeration>>
                    MOTORCYCLE
                    COMPACT
                    LARGE
                  }
                  class Vehicle {
                    -licensePlate: String
                    -type: VehicleType
                  }
                  class ParkingSpot {
                    -id: String
                    -floor: int
                    -type: VehicleType
                    -isOccupied: boolean
                    +assign(Vehicle v): boolean
                    +vacate(): void
                  }
                  class FeeCalculationStrategy {
                    <<interface>>
                    +calculateFee(Duration duration, VehicleType type): double
                  }
                  class HourlyFeeStrategy {
                    +calculateFee(Duration duration, VehicleType type): double
                  }
                  class ParkingLot {
                    -spots: List~ParkingSpot~
                    -feeStrategy: FeeCalculationStrategy
                    +park(Vehicle v): ParkingTicket
                    +unpark(String ticketId): double
                  }
                  FeeCalculationStrategy <|.. HourlyFeeStrategy
                  ParkingLot --> FeeCalculationStrategy
                  ParkingLot --> ParkingSpot
                """,
                """
                sequenceDiagram
                  autonumber
                  Driver->>EntryGate: Request Parking (Vehicle: Compact)
                  EntryGate->>ParkingLot: park(car)
                  ParkingLot->>SpotAllocator: findNearestFreeSpot(COMPACT)
                  SpotAllocator-->>ParkingLot: Spot F1-S4
                  ParkingLot->>ParkingSpot: assign(car)
                  ParkingLot->>TicketGen: createTicket(car, spot, now())
                  TicketGen-->>Driver: Ticket #TK-8942
                  Note over Driver: Vehicle stays parked...
                  Driver->>ExitGate: Present Ticket #TK-8942
                  ExitGate->>ParkingLot: unpark(TK-8942)
                  ParkingLot->>ParkingSpot: vacate()
                  ParkingLot->>FeeStrategy: calculateFee(entryTime, exitTime, COMPACT)
                  FeeStrategy-->>ExitGate: Amount Due ($25.00)
                  ExitGate-->>Driver: Receipt & Open Barrier
                """,
                new CodeOptionsDto(
                        """
                        // Java 25 Thread-Safe Parking Lot Implementation
                        package com.sysdesign.lld.parkinglot;

                        import java.time.Duration;
                        import java.time.Instant;
                        import java.util.*;
                        import java.util.concurrent.ConcurrentHashMap;

                        enum VehicleType { MOTORCYCLE, COMPACT, LARGE }
                        record Vehicle(String licensePlate, VehicleType type) {}

                        class ParkingSpot {
                            private final String id;
                            private final int floor;
                            private final VehicleType type;
                            private volatile boolean occupied;

                            public ParkingSpot(String id, int floor, VehicleType type) {
                                this.id = id;
                                this.floor = floor;
                                this.type = type;
                            }
                            public synchronized boolean assign(Vehicle vehicle) {
                                if (occupied || vehicle.type() != this.type) return false;
                                this.occupied = true;
                                return true;
                            }
                            public synchronized void vacate() { this.occupied = false; }
                            public boolean isFree() { return !occupied; }
                            public VehicleType getType() { return type; }
                        }

                        record ParkingTicket(String ticketId, Vehicle vehicle, ParkingSpot spot, Instant entryTime) {}

                        interface FeeStrategy {
                            double calculate(Duration duration, VehicleType type);
                        }

                        class HourlyFeeStrategy implements FeeStrategy {
                            public double calculate(Duration duration, VehicleType type) {
                                long hours = Math.max(1, duration.toHours());
                                double rate = switch (type) {
                                    case MOTORCYCLE -> 10.0;
                                    case COMPACT -> 20.0;
                                    case LARGE -> 40.0;
                                };
                                return hours * rate;
                            }
                        }

                        public class ParkingLot {
                            private final List<ParkingSpot> spots = new ArrayList<>();
                            private final Map<String, ParkingTicket> activeTickets = new ConcurrentHashMap<>();
                            private final FeeStrategy feeStrategy;

                            public ParkingLot(FeeStrategy feeStrategy) { this.feeStrategy = feeStrategy; }
                            public void addSpot(ParkingSpot s) { spots.add(s); }

                            public synchronized Optional<ParkingTicket> park(Vehicle vehicle) {
                                for (ParkingSpot s : spots) {
                                    if (s.isFree() && s.getType() == vehicle.type() && s.assign(vehicle)) {
                                        String tid = UUID.randomUUID().toString();
                                        ParkingTicket t = new ParkingTicket(tid, vehicle, s, Instant.now());
                                        activeTickets.put(tid, t);
                                        return Optional.of(t);
                                    }
                                }
                                return Optional.empty();
                            }

                            public synchronized double unpark(String ticketId) {
                                ParkingTicket t = activeTickets.remove(ticketId);
                                if (t == null) throw new IllegalArgumentException("Invalid ticket");
                                t.spot().vacate();
                                return feeStrategy.calculate(Duration.between(t.entryTime(), Instant.now()), t.vehicle().type());
                            }
                        }
                        """,
                        """
                        # Python 3.12 Object-Oriented Parking Lot
                        from enum import Enum
                        from dataclasses import dataclass
                        from datetime import datetime
                        import uuid
                        from typing import Optional, Dict, List

                        class VehicleType(Enum):
                            MOTORCYCLE = 1
                            COMPACT = 2
                            LARGE = 3

                        @dataclass(frozen=True)
                        class Vehicle:
                            plate: str
                            vtype: VehicleType

                        class ParkingSpot:
                            def __init__(self, spot_id: str, floor: int, vtype: VehicleType):
                                self.spot_id = spot_id
                                self.floor = floor
                                self.vtype = vtype
                                self.occupied = False

                            def assign(self, vehicle: Vehicle) -> bool:
                                if self.occupied or vehicle.vtype != self.vtype:
                                    return False
                                self.occupied = True
                                return True

                            def vacate(self):
                                self.occupied = False

                        @dataclass
                        class Ticket:
                            ticket_id: str
                            vehicle: Vehicle
                            spot: ParkingSpot
                            entry_time: datetime

                        class ParkingLot:
                            def __init__(self):
                                self.spots: List[ParkingSpot] = []
                                self.tickets: Dict[str, Ticket] = {}

                            def add_spot(self, spot: ParkingSpot):
                                self.spots.append(spot)

                            def park(self, vehicle: Vehicle) -> Optional[Ticket]:
                                for spot in self.spots:
                                    if not spot.occupied and spot.vtype == vehicle.vtype:
                                        if spot.assign(vehicle):
                                            tid = str(uuid.uuid4())
                                            t = Ticket(tid, vehicle, spot, datetime.now())
                                            self.tickets[tid] = t
                                            return t
                                return None

                            def unpark(self, ticket_id: str) -> float:
                                ticket = self.tickets.pop(ticket_id, None)
                                if not ticket:
                                    raise ValueError("Invalid ticket")
                                ticket.spot.vacate()
                                hours = max(1.0, (datetime.now() - ticket.entry_time).total_seconds() / 3600.0)
                                return hours * 20.0
                        """,
                        """
                        // C++ 20 Parking Lot Implementation
                        #include <iostream>
                        #include <string>
                        #include <vector>
                        #include <unordered_map>
                        #include <memory>
                        #include <mutex>
                        #include <chrono>

                        enum class VehicleType { MOTORCYCLE, COMPACT, LARGE };

                        struct Vehicle {
                            std::string plate;
                            VehicleType type;
                        };

                        class ParkingSpot {
                        public:
                            std::string id;
                            int floor;
                            VehicleType type;
                            bool occupied = false;

                            ParkingSpot(std::string id, int floor, VehicleType type)
                                : id(id), floor(floor), type(type) {}

                            bool assign(const Vehicle& v) {
                                if (occupied || v.type != type) return false;
                                occupied = true;
                                return true;
                            }
                            void vacate() { occupied = false; }
                        };

                        class ParkingLot {
                        private:
                            std::vector<std::shared_ptr<ParkingSpot>> spots;
                            std::unordered_map<std::string, std::shared_ptr<ParkingSpot>> activeTickets;
                            std::mutex mtx;
                        public:
                            void addSpot(std::shared_ptr<ParkingSpot> s) { spots.push_back(s); }

                            std::string park(const Vehicle& v) {
                                std::lock_guard<std::mutex> lock(mtx);
                                for (auto& s : spots) {
                                    if (!s->occupied && s->type == v.type && s->assign(v)) {
                                        std::string tid = "TK-" + s->id;
                                        activeTickets[tid] = s;
                                        return tid;
                                    }
                                }
                                return "";
                            }

                            bool unpark(const std::string& tid) {
                                std::lock_guard<std::mutex> lock(mtx);
                                auto it = activeTickets.find(tid);
                                if (it == activeTickets.end()) return false;
                                it->second->vacate();
                                activeTickets.erase(it);
                                return true;
                            }
                        };
                        """,
                        """
                        // Go Parking Lot Implementation
                        package main

                        import (
                            "errors"
                            "sync"
                            "time"
                        )

                        type VehicleType int
                        const (
                            Motorcycle VehicleType = iota
                            Compact
                            Large
                        )

                        type ParkingSpot struct {
                            ID       string
                            Floor    int
                            Type     VehicleType
                            Occupied bool
                        }

                        type ParkingLot struct {
                            spots   []*ParkingSpot
                            tickets map[string]*ParkingSpot
                            mu      sync.Mutex
                        }

                        func NewParkingLot() *ParkingLot {
                            return &ParkingLot{tickets: make(map[string]*ParkingSpot)}
                        }

                        func (l *ParkingLot) Park(plate string, vType VehicleType) (string, error) {
                            l.mu.Lock()
                            defer l.mu.Unlock()
                            for _, s := range l.spots {
                                if !s.Occupied && s.Type == vType {
                                    s.Occupied = true
                                    tid := "TICKET-" + s.ID
                                    l.tickets[tid] = s
                                    return tid, nil
                                }
                            }
                            return "", errors.New("lot full")
                        }

                        func (l *ParkingLot) Unpark(tid string) error {
                            l.mu.Lock()
                            defer l.mu.Unlock()
                            spot, ok := l.tickets[tid]
                            if !ok {
                                return errors.New("invalid ticket")
                            }
                            spot.Occupied = false
                            delete(l.tickets, tid)
                            return nil
                        }
                        """
                ),
                List.of(
                        new WorkingStepDto(1, "Vehicle Sensor Detection", "Vehicle triggers entrance induction loop sensor. Automatic number plate recognition (ANPR) cameras read plate.", "Hardware / Edge", "< 10ms", "Vehicle type is inferred from height barriers and optical sensors."),
                        new WorkingStepDto(2, "Spot Allocation Search", "Allocation engine searches in-memory multi-floor index for the closest vacant spot matching the vehicle type.", "In-Memory Tree", "< 1ms", "Nearest-first search uses floor-by-floor priority queues to avoid traffic bottlenecks."),
                        new WorkingStepDto(3, "Atomic Spot Locking", "Spot status is atomically flipped to OCCUPIED using synchronized methods or compare-and-swap (CAS).", "Concurrency Mutex", "< 1ms", "Thread-safe locking prevents two entry gates from assigning the same spot simultaneously."),
                        new WorkingStepDto(4, "Ticket Generation", "Unique UUID ticket is issued encoding vehicle plate, assigned spot number, and cryptographic entry timestamp.", "Encrypted Barcode", "< 5ms", "Barcode contains HMAC signature to prevent forged ticket exit tampering."),
                        new WorkingStepDto(5, "Exit & Fee Settlement", "At exit gate, ticket timestamp is read, duration calculated, and injected FeeStrategy computes total price.", "Strategy Pattern", "< 2ms", "Open/Closed Principle allows swapping hourly, daily, VIP, or surge pricing without changing gate logic.")
                ),
                List.of(
                        new RelatedAnswerDto(
                                "How do you make the parking spot allocation thread-safe with multiple entry gates?",
                                "Testing concurrency control, race conditions, and synchronized collections in low-level design.",
                                "If multiple cars enter simultaneously across 4 different gates, they could compete for the exact same vacant spot. We solve this by placing spots inside concurrent data structures (such as `ConcurrentSkipListSet` or thread-safe priority queues segregated by VehicleType) and using atomic CAS operations on the spot's `occupied` flag. When a gate selects a spot, it calls `spot.assign(vehicle)` which atomically checks and sets the state.",
                                List.of("Concurrent collections for free spots", "Atomic Compare-And-Swap (CAS) on spot state", "Segregating queues by VehicleType eliminates cross-type contention"),
                                "Lock granularity: Avoid synchronizing the entire ParkingLot object; lock only individual floors or individual spots.",
                                "Handling abandoned vehicles: Expired tickets automatically alert parking attendants after 72 hours."
                        ),
                        new RelatedAnswerDto(
                                "How do SOLID principles apply to the Parking Lot design?",
                                "Testing architectural design patterns and object-oriented cleanliness.",
                                "1. Single Responsibility: Spot manages occupancy; Ticket records time; FeeStrategy calculates cost; ParkingLot orchestrates operations. 2. Open/Closed: FeeStrategy is an interface, allowing FlatRate, HourlyRate, and DynamicSurgeRate without modifying ParkingLot code. 3. Liskov Substitution: Any Vehicle subclass can be passed to ParkingLot without breaking behavior. 4. Dependency Inversion: ParkingLot depends on FeeStrategy abstraction, not concrete implementations.",
                                List.of("Strategy pattern for fee calculus", "Decoupling payment processing from spot allocation", "Liskov-compliant vehicle hierarchy"),
                                "Factory Pattern can instantiate spots based on floor blueprints.",
                                "Observer Pattern notifies display boards of real-time spot counts."
                        )
                ),
                List.of("Strategy Pattern for Dynamic Pricing", "Thread-safe Concurrency with Atomic CAS", "Multi-Floor Nearest-First Allocation Algorithms"),
                List.of("Fine-grained spot locking vs Coarse-grained lot lock", "In-memory priority queue vs Database query on allocation")
        ));

        // ==========================================
        // 4. LLD: Multi-Car Elevator Control System
        // ==========================================
        topicsMap.put("elevator-system", new TopicHubDetailDto(
                "elevator-system",
                "Design a Multi-Car Elevator Control System",
                "LLD",
                "Algorithms & State Machines",
                "STAFF",
                "Complete scheduling and control engine for multiple elevator cars serving a 50-story skyscraper using the LOOK/SCAN scheduling algorithm.",
                """
                flowchart TD
                  HallButton([Hall Button: Floor 14 UP]) --> Dispatcher[Elevator Dispatch Coordinator]
                  Dispatcher --> CostCalc[Proximity & Direction Cost Function]
                  CostCalc --> CarSelector[Select Elevator Car #3]
                  CarSelector --> CarController[Elevator Car #3 Controller]
                  CarController --> RequestQueue[TreeSet: UP & DOWN Stops]
                  RequestQueue --> MotorController[LOOK Scheduling Stepper]
                """,
                """
                classDiagram
                  class Direction {
                    <<enumeration>>
                    UP
                    DOWN
                    IDLE
                  }
                  class ElevatorCar {
                    -id: int
                    -currentFloor: int
                    -direction: Direction
                    -upRequests: TreeSet~int~
                    -downRequests: TreeSet~int~
                    +addStop(int floor)
                    +step()
                  }
                  class DispatchStrategy {
                    <<interface>>
                    +selectCar(List~ElevatorCar~ cars, int floor, Direction dir): ElevatorCar
                  }
                  class ElevatorSystem {
                    -cars: List~ElevatorCar~
                    -strategy: DispatchStrategy
                    +requestElevator(int floor, Direction dir)
                  }
                  ElevatorSystem --> DispatchStrategy
                  ElevatorSystem --> ElevatorCar
                """,
                """
                sequenceDiagram
                  autonumber
                  Passenger->>HallPanel: Press Floor 8 UP
                  HallPanel->>Dispatcher: dispatch(floor: 8, direction: UP)
                  Dispatcher->>ElevatorCar1: Calculate Cost (Floor 12 DOWN) -> Cost: 20
                  Dispatcher->>ElevatorCar2: Calculate Cost (Floor 4 UP) -> Cost: 4
                  Note over Dispatcher: Car 2 has minimum cost
                  Dispatcher->>ElevatorCar2: addStop(floor: 8)
                  ElevatorCar2->>ElevatorCar2: step() -> Floor 5, 6, 7, 8
                  ElevatorCar2->>Doors: Open Doors at Floor 8
                  Doors-->>Passenger: Chime & Welcome Aboard
                """,
                new CodeOptionsDto(
                        """
                        // Java LOOK Scheduling Elevator Car
                        package com.sysdesign.lld.elevator;

                        import java.util.*;

                        enum Direction { UP, DOWN, IDLE }

                        public class ElevatorCar {
                            private final int id;
                            private int currentFloor = 1;
                            private Direction direction = Direction.IDLE;
                            private final TreeSet<Integer> upStops = new TreeSet<>();
                            private final TreeSet<Integer> downStops = new TreeSet<>(Collections.reverseOrder());

                            public ElevatorCar(int id) { this.id = id; }

                            public synchronized void addStop(int floor) {
                                if (floor > currentFloor) upStops.add(floor);
                                else if (floor < currentFloor) downStops.add(floor);
                                if (direction == Direction.IDLE) {
                                    direction = floor >= currentFloor ? Direction.UP : Direction.DOWN;
                                }
                            }

                            public synchronized void step() {
                                if (direction == Direction.UP) {
                                    if (!upStops.isEmpty()) currentFloor = upStops.pollFirst();
                                    else if (!downStops.isEmpty()) { direction = Direction.DOWN; currentFloor = downStops.pollFirst(); }
                                    else direction = Direction.IDLE;
                                } else if (direction == Direction.DOWN) {
                                    if (!downStops.isEmpty()) currentFloor = downStops.pollFirst();
                                    else if (!upStops.isEmpty()) { direction = Direction.UP; currentFloor = upStops.pollFirst(); }
                                    else direction = Direction.IDLE;
                                }
                            }
                            public int getCurrentFloor() { return currentFloor; }
                            public Direction getDirection() { return direction; }
                        }
                        """,
                        """
                        # Python LOOK Scheduling Elevator
                        from enum import Enum
                        from sortedcontainers import SortedSet

                        class Direction(Enum):
                            UP = 1
                            DOWN = 2
                            IDLE = 3

                        class ElevatorCar:
                            def __init__(self, car_id: int):
                                self.car_id = car_id
                                self.current_floor = 1
                                self.direction = Direction.IDLE
                                self.up_stops = SortedSet()
                                self.down_stops = SortedSet()

                            def add_stop(self, floor: int):
                                if floor > self.current_floor:
                                    self.up_stops.add(floor)
                                elif floor < self.current_floor:
                                    self.down_stops.add(floor)
                                if self.direction == Direction.IDLE:
                                    self.direction = Direction.UP if floor >= self.current_floor else Direction.DOWN

                            def step(self):
                                if self.direction == Direction.UP:
                                    if self.up_stops:
                                        self.current_floor = self.up_stops.pop(0)
                                    elif self.down_stops:
                                        self.direction = Direction.DOWN
                                        self.current_floor = self.down_stops.pop(-1)
                                    else:
                                        self.direction = Direction.IDLE
                                elif self.direction == Direction.DOWN:
                                    if self.down_stops:
                                        self.current_floor = self.down_stops.pop(-1)
                                    elif self.up_stops:
                                        self.direction = Direction.UP
                                        self.current_floor = self.up_stops.pop(0)
                                    else:
                                        self.direction = Direction.IDLE
                        """,
                        """
                        // C++ 20 Elevator System
                        #include <set>
                        #include <iostream>
                        #include <mutex>

                        enum class Direction { UP, DOWN, IDLE };

                        class ElevatorCar {
                        private:
                            int id;
                            int currentFloor = 1;
                            Direction direction = Direction.IDLE;
                            std::set<int> upStops;
                            std::set<int, std::greater<int>> downStops;
                            std::mutex mtx;
                        public:
                            ElevatorCar(int id) : id(id) {}

                            void addStop(int floor) {
                                std::lock_guard<std::mutex> lock(mtx);
                                if (floor > currentFloor) upStops.insert(floor);
                                else if (floor < currentFloor) downStops.insert(floor);
                                if (direction == Direction.IDLE) {
                                    direction = (floor >= currentFloor) ? Direction.UP : Direction.DOWN;
                                }
                            }
                        };
                        """,
                        """
                        // Go Elevator Controller
                        package main

                        import "sync"

                        type Direction int
                        const (
                            Idle Direction = iota
                            Up
                            Down
                        )

                        type ElevatorCar struct {
                            ID           int
                            CurrentFloor int
                            Direction    Direction
                            mu           sync.Mutex
                        }

                        func (e *ElevatorCar) AddStop(floor int) {
                            e.mu.Lock()
                            defer e.mu.Unlock()
                            if e.Direction == Idle {
                                if floor >= e.CurrentFloor {
                                    e.Direction = Up
                                } else {
                                    e.Direction = Down
                                }
                            }
                        }
                        """
                ),
                List.of(
                        new WorkingStepDto(1, "Hall Call Registration", "Passenger presses floor button. Hall sensor registers desired travel direction (UP or DOWN).", "Hardware I/O", "< 5ms", "Buttons do not control motors directly; they publish events to the central scheduler."),
                        new WorkingStepDto(2, "Heuristic Cost Scoring", "Scheduler computes proximity cost for all cars: Cars moving towards the passenger with matching direction have lowest cost.", "Cost Function", "< 1ms", "Cost Formula: Distance + (IsOppositeDirection ? 20 : 0) + (IsBehindCar ? 40 : 0)."),
                        new WorkingStepDto(3, "Destination Tree Insertion", "Target floor is inserted into the assigned elevator's sorted TreeSet (upStops or downStops).", "TreeSet Insert", "< 1ms", "Using a self-balancing binary search tree guarantees O(log N) insertion and sorted traversal."),
                        new WorkingStepDto(4, "LOOK Algorithm Execution", "Car continues in current direction servicing all requested stops until no further requests exist ahead, then reverses.", "LOOK Scheduling", "< 1ms", "LOOK prevents elevator starvation and optimizes motor energy consumption."),
                        new WorkingStepDto(5, "Door Interlock Safety", "At target floor, optical light curtains verify threshold is clear before mechanical interlocks cycle.", "Safety Protocol", "< 2s", "Door cycles are governed by emergency state machines that override normal dispatch commands.")
                ),
                List.of(
                        new RelatedAnswerDto(
                                "Why is the LOOK algorithm preferred over FCFS or SCAN for elevators?",
                                "Testing scheduling algorithms, disk head scheduling comparisons, and starvation prevention.",
                                "First-Come First-Served (FCFS) causes wild oscillations between top and bottom floors, maximizing passenger wait time and motor wear. SCAN travels all the way to the top and bottom physical floors regardless of whether requests exist there. LOOK travels in one direction only as far as the furthest requested stop, then immediately reverses if no higher requests exist. This minimizes energy consumption and average wait time.",
                                List.of("LOOK stops at furthest request rather than physical boundary", "FCFS causes erratic floor hopping and long queues", "LOOK provides optimal average wait time under heavy traffic"),
                                "During morning rush hour, zoning algorithms (assigning cars to floors 1-20, 21-40) outperform pure LOOK.",
                                "Overcrowding weight sensors bypass hall calls when car is at 90% capacity."
                        )
                ),
                List.of("LOOK vs SCAN Scheduling Algorithm Analysis", "Multi-Car Dispatch Cost Function Optimization", "State Pattern for Door Interlock and Emergency States"),
                List.of("Centralized dispatch coordinator vs Distributed peer-to-peer car gossip", "LOOK algorithm (throughput) vs Destination Dispatch (passenger comfort)")
        ));

        // ==========================================
        // 5. LLD: Token Bucket Rate Limiter
        // ==========================================
        topicsMap.put("rate-limiter", new TopicHubDetailDto(
                "rate-limiter",
                "Design a Low-Level Rate Limiter (Token Bucket)",
                "LLD",
                "Concurrency & Algorithms",
                "SENIOR",
                "Thread-safe in-memory API rate limiter supporting Token Bucket and Sliding Window algorithms with sub-microsecond latency and burst capacity.",
                """
                flowchart TD
                  Request([Incoming API Request]) --> RateLimiter[Token Bucket Rate Limiter]
                  RateLimiter --> ComputeTokens[Calculate Refill Tokens: elapsed * rate]
                  ComputeTokens --> CheckTokens{Tokens >= 1 ?}
                  CheckTokens -->|Yes: Deduct 1 Token| Pass([Allow Request - 200 OK])
                  CheckTokens -->|No: Rate Exceeded| Reject([Reject Request - 429 Too Many Requests])
                """,
                """
                classDiagram
                  class RateLimiter {
                    <<interface>>
                    +allowRequest(String clientId): boolean
                  }
                  class TokenBucketRateLimiter {
                    -capacity: long
                    -refillTokensPerNano: double
                    -buckets: ConcurrentHashMap~String, Bucket~
                    +allowRequest(String clientId): boolean
                  }
                  class Bucket {
                    -capacity: long
                    -refillRate: double
                    -tokens: double
                    -lastRefillNanos: long
                    +tryConsume(int tokens): boolean
                  }
                  RateLimiter <|.. TokenBucketRateLimiter
                  TokenBucketRateLimiter --> Bucket
                """,
                """
                sequenceDiagram
                  autonumber
                  Client->>RateLimiter: HTTP GET /api/v1/orders
                  RateLimiter->>Bucket: tryConsume(1)
                  Bucket->>Bucket: Refill: tokens = min(cap, tokens + elapsed * rate)
                  alt Tokens Available
                    Bucket-->>RateLimiter: true (Deduct 1)
                    RateLimiter-->>Client: 200 OK (Processed)
                  else Exhausted
                    Bucket-->>RateLimiter: false
                    RateLimiter-->>Client: 429 Too Many Requests (Retry-After: 2s)
                  end
                """,
                new CodeOptionsDto(
                        """
                        // Java 25 High-Performance Token Bucket
                        package com.sysdesign.lld.ratelimiter;

                        import java.util.concurrent.ConcurrentHashMap;

                        public class TokenBucketRateLimiter {
                            private final long capacity;
                            private final double refillTokensPerNano;
                            private final ConcurrentHashMap<String, Bucket> buckets = new ConcurrentHashMap<>();

                            public TokenBucketRateLimiter(long capacity, double refillTokensPerSecond) {
                                this.capacity = capacity;
                                this.refillTokensPerNano = refillTokensPerSecond / 1_000_000_000.0;
                            }

                            public boolean allowRequest(String clientId) {
                                return buckets.computeIfAbsent(clientId, k -> new Bucket(capacity, refillTokensPerNano))
                                              .tryConsume(1);
                            }

                            private static class Bucket {
                                private final long capacity;
                                private final double refillRate;
                                private double tokens;
                                private long lastRefillNanos;

                                Bucket(long capacity, double refillRate) {
                                    this.capacity = capacity;
                                    this.refillRate = refillRate;
                                    this.tokens = capacity;
                                    this.lastRefillNanos = System.nanoTime();
                                }

                                synchronized boolean tryConsume(int count) {
                                    long now = System.nanoTime();
                                    long elapsed = now - lastRefillNanos;
                                    tokens = Math.min(capacity, tokens + (elapsed * refillRate));
                                    lastRefillNanos = now;

                                    if (tokens >= count) {
                                        tokens -= count;
                                        return true;
                                    }
                                    return false;
                                }
                            }
                        }
                        """,
                        """
                        # Python 3.12 Token Bucket Rate Limiter
                        import time
                        from typing import Dict

                        class TokenBucket:
                            def __init__(self, capacity: int, refill_rate: float):
                                self.capacity = capacity
                                self.refill_rate = refill_rate
                                self.tokens = float(capacity)
                                self.last_time = time.monotonic()

                            def try_consume(self, count: int = 1) -> bool:
                                now = time.monotonic()
                                elapsed = now - self.last_time
                                self.tokens = min(self.capacity, self.tokens + elapsed * self.refill_rate)
                                self.last_time = now

                                if self.tokens >= count:
                                    self.tokens -= count
                                    return True
                                return False
                        """,
                        """
                        // C++ 20 Lock-Free Token Bucket
                        #include <chrono>
                        #include <algorithm>
                        #include <mutex>

                        class TokenBucket {
                        private:
                            const double capacity;
                            const double refillRate;
                            double tokens;
                            std::chrono::steady_clock::time_point lastRefill;
                            std::mutex mtx;
                        public:
                            TokenBucket(double cap, double rate)
                                : capacity(cap), refillRate(rate), tokens(cap), lastRefill(std::chrono::steady_clock::now()) {}

                            bool tryConsume(double count = 1.0) {
                                std::lock_guard<std::mutex> lock(mtx);
                                auto now = std::chrono::steady_clock::now();
                                double elapsed = std::chrono::duration<double>(now - lastRefill).count();
                                tokens = std::min(capacity, tokens + elapsed * refillRate);
                                lastRefill = now;

                                if (tokens >= count) {
                                    tokens -= count;
                                    return true;
                                }
                                return false;
                            }
                        };
                        """,
                        """
                        // Go Token Bucket Rate Limiter
                        package main

                        import (
                            "math"
                            "sync"
                            "time"
                        )

                        type Bucket struct {
                            capacity   float64
                            refillRate float64
                            tokens     float64
                            lastRefill time.Time
                            mu         sync.Mutex
                        }

                        func (b *Bucket) TryConsume(count float64) bool {
                            b.mu.Lock()
                            defer b.mu.Unlock()
                            now := time.Now()
                            elapsed := now.Sub(b.lastRefill).Seconds()
                            b.tokens = math.Min(b.capacity, b.tokens+elapsed*b.refillRate)
                            b.lastRefill = now

                            if b.tokens >= count {
                                b.tokens -= count
                                return true
                            }
                            return false
                        }
                        """
                ),
                List.of(
                        new WorkingStepDto(1, "Request Ingress", "Client request reaches API Gateway middleware. Client identifier (API Key or IP) is extracted.", "HTTP Headers", "< 0.5ms", "Tenant identification must be fast; avoid database lookups on every request."),
                        new WorkingStepDto(2, "Bucket Retrieval", "Gateway fetches client bucket from ConcurrentHashMap using atomic `computeIfAbsent`.", "In-Memory Map", "< 0.1ms", "Memory overhead is minimal (~64 bytes per active client bucket)."),
                        new WorkingStepDto(3, "Lazy Token Calculation", "Bucket calculates token replenishment lazily based on delta time: elapsed = now - lastRefill.", "CPU Arithmetic", "< 0.05ms", "Lazy refill avoids background timer threads constantly waking up to increment counters."),
                        new WorkingStepDto(4, "Atomic Token Consumption", "If tokens >= 1, decrement and return true; otherwise reject with HTTP 429.", "Thread Lock", "< 0.05ms", "Microsecond execution guarantees zero throughput degradation on high-load APIs."),
                        new WorkingStepDto(5, "Response Header Injection", "Add standard rate limit headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `Retry-After`.", "HTTP 429 / 200", "< 0.1ms", "Informing clients of retry windows prevents retry storms and stampedes.")
                ),
                List.of(
                        new RelatedAnswerDto(
                                "Compare Token Bucket vs Leaky Bucket vs Sliding Window Log.",
                                "Testing algorithm knowledge, burst tolerance, and memory consumption.",
                                "Token Bucket allows bursts of traffic up to the bucket capacity while maintaining an average rate. Leaky Bucket smooths out bursts, processing requests at a strictly constant rate (acting as a queue). Sliding Window Log provides 100% precision by storing all request timestamps in a Redis sorted set, but consumes substantial memory (O(N) with request count). Token Bucket is the FAANG standard for API Gateways due to O(1) memory and burst tolerance.",
                                List.of("Token bucket handles bursts cleanly", "Leaky bucket enforces smooth constant egress rate", "Sliding window log is accurate but memory-intensive"),
                                "Redis Lua scripts allow Token Bucket to run distributed across multiple gateway instances atomically.",
                                "Client starvation under DDoS mitigated by dropping unauthenticated traffic at Cloudflare WAF before reaching rate limiter."
                        )
                ),
                List.of("Token Bucket vs Sliding Window Counter", "Distributed Rate Limiting via Redis Lua Scripts", "Lazy Calculation vs Background Daemon Refills"),
                List.of("Token Bucket (burst tolerant) vs Leaky Bucket (smooth pacing)", "Local in-memory limiter (ultra fast) vs Redis cluster (globally consistent)")
        ));
    }
}
