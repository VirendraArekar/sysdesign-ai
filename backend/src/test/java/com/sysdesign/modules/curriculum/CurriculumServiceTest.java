package com.sysdesign.modules.curriculum;

import com.sysdesign.modules.curriculum.dto.BookmarkRequest;
import com.sysdesign.modules.curriculum.dto.ModuleDto;
import com.sysdesign.modules.curriculum.dto.TopicDetailDto;
import com.sysdesign.modules.curriculum.dto.UpdateProgressRequest;
import com.sysdesign.modules.curriculum.model.*;
import com.sysdesign.modules.curriculum.repository.*;
import com.sysdesign.modules.curriculum.service.CurriculumService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CurriculumServiceTest {

    @Mock
    private LearningModuleRepository moduleRepository;
    @Mock
    private TopicRepository topicRepository;
    @Mock
    private LearningContentRepository contentRepository;
    @Mock
    private LearningProgressRepository progressRepository;
    @Mock
    private BookmarkRepository bookmarkRepository;
    @Mock
    private NoteRepository noteRepository;

    private CurriculumService curriculumService;

    @BeforeEach
    void setUp() {
        curriculumService = new CurriculumService(
                moduleRepository,
                topicRepository,
                contentRepository,
                progressRepository,
                bookmarkRepository,
                noteRepository
        );
    }

    @Test
    void getAllModulesReturnsSortedList() {
        LearningModule module = new LearningModule("fundamentals", "Fundamentals", "Overview", "Layers", 1, 5);
        when(moduleRepository.findAllByOrderBySequenceOrderAsc()).thenReturn(List.of(module));

        List<ModuleDto> modules = curriculumService.getAllModules();
        assertNotNull(modules);
        assertEquals(1, modules.size());
        assertEquals("fundamentals", modules.get(0).id());
    }

    @Test
    void getTopicDetailReturnsCompleteContent() {
        LearningModule module = new LearningModule("fundamentals", "Fundamentals", "Overview", "Layers", 1, 5);
        Topic topic = new Topic("cap-theorem", module, "CAP Theorem", "Summary", "ADVANCED", 1);
        LearningContent content = new LearningContent(topic, "Beginner", "Deep Technical", "graph TD; A-->B;");

        when(topicRepository.findById("cap-theorem")).thenReturn(Optional.of(topic));
        when(contentRepository.findByTopicId("cap-theorem")).thenReturn(Optional.of(content));

        TopicDetailDto dto = curriculumService.getTopicDetail("cap-theorem", null);
        assertNotNull(dto);
        assertEquals("cap-theorem", dto.id());
        assertEquals("Beginner", dto.beginnerExplanation());
        assertEquals("graph TD; A-->B;", dto.architectureDiagramMermaid());
    }

    @Test
    void toggleBookmarkAddsWhenNotPresent() {
        UUID userId = UUID.randomUUID();
        BookmarkRequest request = new BookmarkRequest("TOPIC", "cap-theorem");

        when(bookmarkRepository.findByUserIdAndItemTypeAndItemId(userId, "TOPIC", "cap-theorem"))
                .thenReturn(Optional.empty());

        boolean bookmarked = curriculumService.toggleBookmark(userId, request);
        assertTrue(bookmarked);
        verify(bookmarkRepository, times(1)).save(any(Bookmark.class));
    }
}
