package com.sysdesign.modules.curriculum.service;

import com.sysdesign.common.exception.ResourceNotFoundException;
import com.sysdesign.modules.curriculum.dto.*;
import com.sysdesign.modules.curriculum.model.*;
import com.sysdesign.modules.curriculum.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CurriculumService {

    private final LearningModuleRepository moduleRepository;
    private final TopicRepository topicRepository;
    private final LearningContentRepository contentRepository;
    private final LearningProgressRepository progressRepository;
    private final BookmarkRepository bookmarkRepository;
    private final NoteRepository noteRepository;

    public CurriculumService(LearningModuleRepository moduleRepository,
                             TopicRepository topicRepository,
                             LearningContentRepository contentRepository,
                             LearningProgressRepository progressRepository,
                             BookmarkRepository bookmarkRepository,
                             NoteRepository noteRepository) {
        this.moduleRepository = moduleRepository;
        this.topicRepository = topicRepository;
        this.contentRepository = contentRepository;
        this.progressRepository = progressRepository;
        this.bookmarkRepository = bookmarkRepository;
        this.noteRepository = noteRepository;
    }

    @Transactional(readOnly = true)
    public List<ModuleDto> getAllModules() {
        return moduleRepository.findAllByOrderBySequenceOrderAsc().stream()
                .map(this::toModuleDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ModuleDto getModuleById(String moduleId) {
        LearningModule module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new ResourceNotFoundException("Module not found: " + moduleId));
        return toModuleDto(module);
    }

    @Transactional(readOnly = true)
    public TopicDetailDto getTopicDetail(String topicId, UUID userId) {
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new ResourceNotFoundException("Topic not found: " + topicId));

        LearningContent content = contentRepository.findByTopicId(topicId)
                .orElse(new LearningContent(topic, "", "", ""));

        String progressStatus = "NOT_STARTED";
        boolean isBookmarked = false;
        String userNote = "";

        if (userId != null) {
            Optional<LearningProgress> progress = progressRepository.findByUserIdAndTopicId(userId, topicId);
            if (progress.isPresent()) {
                progressStatus = progress.get().getStatus();
            }
            isBookmarked = bookmarkRepository.existsByUserIdAndItemTypeAndItemId(userId, "TOPIC", topicId);
            Optional<Note> note = noteRepository.findByUserIdAndItemTypeAndItemId(userId, "TOPIC", topicId);
            if (note.isPresent()) {
                userNote = note.get().getContent();
            }
        }

        List<String> subtopics = topic.getSubtopics().stream()
                .map(Subtopic::getTitle)
                .collect(Collectors.toList());

        return new TopicDetailDto(
                topic.getId(),
                topic.getModule().getId(),
                topic.getModule().getTitle(),
                topic.getTitle(),
                topic.getSummary(),
                topic.getDifficulty(),
                subtopics,
                content.getBeginnerExplanation(),
                content.getDeepTechnicalExplanation(),
                content.getArchitectureDiagramMermaid(),
                content.getAdvantages(),
                content.getDisadvantages(),
                content.getRealWorldUseCases(),
                content.getInterviewQuestions(),
                content.getPracticalExercises(),
                progressStatus,
                isBookmarked,
                userNote
        );
    }

    @Transactional
    public void updateProgress(UUID userId, UpdateProgressRequest request) {
        LearningProgress progress = progressRepository.findByUserIdAndTopicId(userId, request.topicId())
                .orElse(new LearningProgress(userId, request.topicId(), request.status()));

        progress.setStatus(request.status());
        if (request.timeSpentSeconds() != null) {
            progress.setTimeSpentSeconds(progress.getTimeSpentSeconds() + request.timeSpentSeconds());
        }
        if ("COMPLETED".equalsIgnoreCase(request.status())) {
            progress.setCompletedAt(Instant.now());
        }
        progress.setUpdatedAt(Instant.now());

        progressRepository.save(progress);
    }

    @Transactional
    public boolean toggleBookmark(UUID userId, BookmarkRequest request) {
        Optional<Bookmark> existing = bookmarkRepository.findByUserIdAndItemTypeAndItemId(
                userId, request.itemType(), request.itemId());

        if (existing.isPresent()) {
            bookmarkRepository.delete(existing.get());
            return false;
        } else {
            bookmarkRepository.save(new Bookmark(userId, request.itemType(), request.itemId()));
            return true;
        }
    }

    @Transactional
    public void saveNote(UUID userId, SaveNoteRequest request) {
        Note note = noteRepository.findByUserIdAndItemTypeAndItemId(userId, request.itemType(), request.itemId())
                .orElse(new Note(userId, request.itemType(), request.itemId(), request.content()));

        note.setContent(request.content());
        noteRepository.save(note);
    }

    private ModuleDto toModuleDto(LearningModule module) {
        List<TopicSummaryDto> topics = module.getTopics().stream()
                .map(t -> new TopicSummaryDto(
                        t.getId(),
                        module.getId(),
                        t.getTitle(),
                        t.getSummary(),
                        t.getDifficulty(),
                        t.getSequenceOrder(),
                        t.getSubtopics().stream().map(Subtopic::getTitle).collect(Collectors.toList())
                ))
                .collect(Collectors.toList());

        return new ModuleDto(
                module.getId(),
                module.getTitle(),
                module.getDescription(),
                module.getIcon(),
                module.getSequenceOrder(),
                module.getEstimatedHours(),
                topics.size(),
                topics
        );
    }
}
