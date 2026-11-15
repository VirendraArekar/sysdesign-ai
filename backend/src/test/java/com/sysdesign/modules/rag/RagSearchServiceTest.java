package com.sysdesign.modules.rag;

import com.sysdesign.modules.ai.service.AiProvider;
import com.sysdesign.modules.curriculum.model.Topic;
import com.sysdesign.modules.curriculum.repository.TopicRepository;
import com.sysdesign.modules.practice.model.HldProblem;
import com.sysdesign.modules.practice.model.LldProblem;
import com.sysdesign.modules.practice.repository.HldProblemRepository;
import com.sysdesign.modules.practice.repository.LldProblemRepository;
import com.sysdesign.modules.rag.dto.*;
import com.sysdesign.modules.rag.service.RagSearchService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RagSearchServiceTest {

    @Mock
    private TopicRepository topicRepository;

    @Mock
    private HldProblemRepository hldProblemRepository;

    @Mock
    private LldProblemRepository lldProblemRepository;

    @Mock
    private AiProvider aiProvider;

    private RagSearchService ragSearchService;

    @BeforeEach
    void setUp() {
        ragSearchService = new RagSearchService(topicRepository, hldProblemRepository, lldProblemRepository, aiProvider);
    }

    @Test
    void testSemanticSearch() {
        Topic topic = new Topic("kafka-partitioning", null, "Kafka Partitioning and Ordering", "Learn consumer groups and partition key hashing", "INTERMEDIATE", 1);
        when(topicRepository.findAll()).thenReturn(List.of(topic));

        HldProblem hld = new HldProblem(
                "distributed-cache",
                "Design Distributed In-Memory Cache",
                "Infrastructure",
                "INTERMEDIATE",
                "High scale Redis LRU cache with consistent hashing ring",
                "graph TD; A[Client]-->B[Redis];"
        );
        when(hldProblemRepository.findAll()).thenReturn(List.of(hld));
        when(lldProblemRepository.findAll()).thenReturn(List.of());

        RagQueryRequest request = new RagQueryRequest("Kafka partition key ordering", 5, "ALL");
        List<RagSearchResult> results = ragSearchService.search(request);

        assertNotNull(results);
        assertFalse(results.isEmpty());
        assertTrue(results.get(0).getTitle().contains("Kafka"));
        assertTrue(results.get(0).getSimilarityScore() > 0.0);
    }

    @Test
    void testAskArchitectureAi() {
        Topic topic = new Topic("cap-theorem", null, "CAP Theorem", "Consistency, Availability, and Partition Tolerance", "BEGINNER", 1);
        when(topicRepository.findAll()).thenReturn(List.of(topic));
        when(hldProblemRepository.findAll()).thenReturn(List.of());
        when(lldProblemRepository.findAll()).thenReturn(List.of());
        when(aiProvider.generateResponse(anyString(), anyString())).thenReturn("In distributed systems, the CAP theorem states that under a network partition, you must trade off consistency for availability.");

        RagQueryRequest request = new RagQueryRequest("Explain CAP theorem trade-offs", 3, "CURRICULUM");
        RagAnswerResponse response = ragSearchService.askArchitectureAi(request);

        assertNotNull(response);
        assertNotNull(response.getAnswer());
        assertTrue(response.getConfidenceScore() > 0.5);
        assertFalse(response.getCitedSources().isEmpty());
    }
}
