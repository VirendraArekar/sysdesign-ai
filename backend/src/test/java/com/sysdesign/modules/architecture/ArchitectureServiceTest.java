package com.sysdesign.modules.architecture;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sysdesign.modules.ai.service.AiProvider;
import com.sysdesign.modules.architecture.dto.*;
import com.sysdesign.modules.architecture.model.ArchitectureDiagram;
import com.sysdesign.modules.architecture.repository.ArchitectureDiagramRepository;
import com.sysdesign.modules.architecture.service.ArchitectureService;
import com.sysdesign.modules.user.model.User;
import com.sysdesign.modules.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ArchitectureServiceTest {

    @Mock
    private ArchitectureDiagramRepository diagramRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private AiProvider aiProvider;

    private ObjectMapper objectMapper;
    private ArchitectureService architectureService;

    private User testUser;
    private UUID userId;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        architectureService = new ArchitectureService(diagramRepository, userRepository, aiProvider, objectMapper);

        userId = UUID.randomUUID();
        testUser = new User();
        testUser.setId(userId);
        testUser.setEmail("architect@example.com");
        testUser.setFullName("Staff Architect");
    }

    @Test
    void testGetPrebuiltTemplates() {
        List<DiagramResponse> templates = architectureService.getPrebuiltTemplates();
        assertNotNull(templates);
        assertEquals(5, templates.size());
        assertTrue(templates.stream().anyMatch(t -> t.getTitle().contains("TinyURL")));
        assertTrue(templates.stream().anyMatch(t -> t.getTitle().contains("WhatsApp")));
        assertTrue(templates.stream().anyMatch(t -> t.getTitle().contains("Uber")));
    }

    @Test
    void testSaveNewDiagram() {
        DiagramSaveRequest request = new DiagramSaveRequest(null, "E-Commerce Pipeline", "High scale checkout", "{\"nodes\":[]}", null);
        
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(diagramRepository.save(any(ArchitectureDiagram.class))).thenAnswer(invocation -> {
            ArchitectureDiagram diagram = invocation.getArgument(0);
            diagram.setId(UUID.randomUUID());
            return diagram;
        });

        DiagramResponse response = architectureService.saveDiagram(userId, request);

        assertNotNull(response);
        assertEquals("E-Commerce Pipeline", response.getTitle());
        verify(diagramRepository, times(1)).save(any(ArchitectureDiagram.class));
    }

    @Test
    void testAuditArchitectureFallback() {
        AiAuditRequest request = new AiAuditRequest("Streaming Service", "Low latency video playback", "100k QPS", "{\"nodes\":[]}");
        when(aiProvider.generateResponse(anyString(), anyString())).thenReturn("Invalid non-json response");

        AiAuditResponse audit = architectureService.auditArchitecture(request);

        assertNotNull(audit);
        assertTrue(audit.getHealthScore() > 0);
        assertFalse(audit.getSinglePointsOfFailure().isEmpty());
        assertFalse(audit.getBottlenecks().isEmpty());
        assertFalse(audit.getRecommendations().isEmpty());
    }

    @Test
    void testGenerateArchitectureChat() {
        AiGenerateRequest request = new AiGenerateRequest("Build a WhatsApp chat messenger with real time updates", "50M DAU", "EVENT_DRIVEN");

        AiGenerateResponse response = architectureService.generateArchitecture(request);

        assertNotNull(response);
        assertTrue(response.getTitle().contains("Chat"));
        assertTrue(response.getCanvasData().contains("WebSocket"));
        assertTrue(response.getCanvasData().contains("Cassandra"));
    }

    @Test
    void testGetComponentsCatalog() {
        List<ComponentDefinitionDto> catalog = architectureService.getComponentsCatalog();
        assertNotNull(catalog);
        assertEquals(9, catalog.size());
        assertTrue(catalog.stream().anyMatch(c -> c.getCategory().equals("database")));
        assertTrue(catalog.stream().anyMatch(c -> c.getCategory().equals("cache")));
        assertTrue(catalog.stream().anyMatch(c -> c.getCategory().equals("messaging")));
    }

    @Test
    void testValidateNode() {
        NodeValidationRequest req = new NodeValidationRequest("database", "Primary Database", "PostgreSQL 16", "5k QPS", "1 Master + 2 Replicas");
        NodeValidationResponse res = architectureService.validateNode(req);
        assertNotNull(res);
        assertTrue(res.isValid());
        assertEquals("database", res.getCategory());
        assertNotNull(res.getResilienceTip());
        assertTrue(res.getResilienceTip().contains("Replicas"));
    }
}
