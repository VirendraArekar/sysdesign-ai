package com.sysdesign.modules.practice;

import com.sysdesign.modules.practice.dto.HldDetailDto;
import com.sysdesign.modules.practice.dto.HldSummaryDto;
import com.sysdesign.modules.practice.dto.LldDetailDto;
import com.sysdesign.modules.practice.model.HldProblem;
import com.sysdesign.modules.practice.model.LldProblem;
import com.sysdesign.modules.practice.repository.HldProblemRepository;
import com.sysdesign.modules.practice.repository.LldProblemRepository;
import com.sysdesign.modules.practice.repository.QuestionBankRepository;
import com.sysdesign.modules.practice.service.PracticeService;
import com.sysdesign.modules.practice.service.SystemDesignCatalogService;
import com.sysdesign.modules.practice.dto.TopicHubSummaryDto;
import com.sysdesign.modules.practice.dto.TopicHubDetailDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PracticeServiceTest {

    @Mock
    private HldProblemRepository hldRepository;
    @Mock
    private LldProblemRepository lldRepository;
    @Mock
    private QuestionBankRepository questionBankRepository;

    private SystemDesignCatalogService catalogService;
    private PracticeService practiceService;

    @BeforeEach
    void setUp() {
        catalogService = new SystemDesignCatalogService();
        practiceService = new PracticeService(hldRepository, lldRepository, questionBankRepository, catalogService);
    }

    @Test
    void getAllHldProblemsReturnsSummaryList() {
        HldProblem p = new HldProblem("url-shortener", "TinyURL", "Infra", "BEGINNER", "Description", "graph TD;");
        when(hldRepository.findAll()).thenReturn(List.of(p));

        List<HldSummaryDto> list = practiceService.getAllHldProblems();
        assertEquals(1, list.size());
        assertEquals("url-shortener", list.get(0).id());
        assertEquals("TinyURL", list.get(0).title());
    }

    @Test
    void getHldProblemByIdReturnsFullDetail() {
        HldProblem p = new HldProblem("whatsapp", "WhatsApp", "Social", "STAFF", "Desc", "graph TD;");
        p.setFunctionalRequirements("[\"1-on-1 chat\"]");
        when(hldRepository.findById("whatsapp")).thenReturn(Optional.of(p));

        HldDetailDto detail = practiceService.getHldProblemById("whatsapp");
        assertNotNull(detail);
        assertEquals("whatsapp", detail.id());
        assertEquals("[\"1-on-1 chat\"]", detail.functionalRequirements());
    }

    @Test
    void getLldProblemByIdReturnsFullDetail() {
        LldProblem p = new LldProblem("parking-lot", "Parking Lot", "INTERMEDIATE", "Statement", "classDiagram", "class Code{}", "@Test", "Notes");
        when(lldRepository.findById("parking-lot")).thenReturn(Optional.of(p));

        LldDetailDto detail = practiceService.getLldProblemById("parking-lot");
        assertNotNull(detail);
        assertEquals("parking-lot", detail.id());
        assertEquals("class Code{}", detail.javaSolutionCode());
    }

    @Test
    void getTopicsHubFiltersHldAndLldCorrectly() {
        List<TopicHubSummaryDto> all = practiceService.getTopicsHub("ALL", "ALL", null);
        assertFalse(all.isEmpty());

        List<TopicHubSummaryDto> hldOnly = practiceService.getTopicsHub("HLD", "ALL", null);
        assertFalse(hldOnly.isEmpty());
        assertTrue(hldOnly.stream().allMatch(t -> "HLD".equalsIgnoreCase(t.type())));

        List<TopicHubSummaryDto> lldOnly = practiceService.getTopicsHub("LLD", "ALL", null);
        assertFalse(lldOnly.isEmpty());
        assertTrue(lldOnly.stream().allMatch(t -> "LLD".equalsIgnoreCase(t.type())));
    }

    @Test
    void getTopicHubDetailReturnsFullMultiLanguageAndUml() {
        TopicHubDetailDto urlShortener = practiceService.getTopicHubDetail("url-shortener");
        assertNotNull(urlShortener);
        assertEquals("url-shortener", urlShortener.id());
        assertNotNull(urlShortener.systemDesignDiagram());
        assertNotNull(urlShortener.umlClassDiagram());
        assertNotNull(urlShortener.umlSequenceDiagram());
        assertNotNull(urlShortener.codeOptions().java());
        assertNotNull(urlShortener.codeOptions().python());
        assertNotNull(urlShortener.codeOptions().cpp());
        assertNotNull(urlShortener.codeOptions().go());
        assertFalse(urlShortener.workingSteps().isEmpty());
        assertFalse(urlShortener.relatedAnswers().isEmpty());
    }

    @Test
    void getTopicsHubReturnsAtLeast100Topics() {
        List<TopicHubSummaryDto> all = practiceService.getTopicsHub("ALL", "ALL", null);
        assertTrue(all.size() >= 100, "Expected at least 100 topics, but found: " + all.size());
    }
}
