package com.sysdesign.modules.practice.dto;

import java.util.List;

public record TopicHubDetailDto(
    String id,
    String title,
    String type, // "HLD", "LLD", or "HLD & LLD"
    String category,
    String difficulty,
    String description,
    List<String> hldPoints,
    String systemDesignDiagram,
    String hldExplanation,
    List<String> lldPoints,
    String umlClassDiagram,
    String umlSequenceDiagram,
    String lldExplanation,
    CodeOptionsDto codeOptions,
    List<WorkingStepDto> workingSteps,
    List<RelatedAnswerDto> relatedAnswers,
    List<String> deepDiveTopics,
    List<String> tradeOffs
) {
    // Backward-compatible constructor for existing 14-parameter callers
    public TopicHubDetailDto(
        String id,
        String title,
        String type,
        String category,
        String difficulty,
        String description,
        String systemDesignDiagram,
        String umlClassDiagram,
        String umlSequenceDiagram,
        CodeOptionsDto codeOptions,
        List<WorkingStepDto> workingSteps,
        List<RelatedAnswerDto> relatedAnswers,
        List<String> deepDiveTopics,
        List<String> tradeOffs
    ) {
        this(
            id,
            title,
            type,
            category,
            difficulty,
            description,
            List.of(
                "High Throughput & Low Latency SLA: Modeled for peak QPS with sub-50ms p99 latency guarantees.",
                "Stateless Application Fleet: Auto-scaled microservices behind an L7 Application Load Balancer with round-robin and health checks.",
                "Distributed Multi-Tier Caching: In-memory Redis Cluster caching hot read paths using cache-aside / write-through with LRU eviction.",
                "Database Partitioning & Storage: Relational/NoSQL database sharding by entity hash, with primary-replica asynchronous replication.",
                "Fault Tolerance & Disaster Recovery: Multi-AZ active-active deployment, circuit breaker fast-fail fallback, and dead-letter queues."
            ),
            systemDesignDiagram,
            "Client requests arrive through global DNS and edge CDN caching. Traffic routes through L7 Load Balancers to stateless application services. Services query distributed Redis caches before hitting sharded database replicas, ensuring horizontal scalability and fault isolation under high concurrency.",
            List.of(
                "SOLID Principles Adherence: Strict Single Responsibility (SRP) and Open/Closed (OCP) architecture across models and services.",
                "Design Patterns in Action: Strategy Pattern for swappable business algorithms, Factory Method for instantiation, and Observer/State for event management.",
                "Thread-Safety & Concurrency: Built with atomic references, ReentrantLock, and ConcurrentHashMap for high-contention synchronization.",
                "Extensible Domain Model: Decoupled interfaces allowing pluggable extensions without modifying existing production classes."
            ),
            umlClassDiagram,
            umlSequenceDiagram,
            "The low-level object-oriented design decomposes domain entities into modular, cohesive classes. Each entity encapsulates its own internal state, validating business constraints and utilizing thread-safe operations to prevent race conditions during concurrent execution.",
            codeOptions,
            workingSteps,
            relatedAnswers,
            deepDiveTopics,
            tradeOffs
        );
    }
}
