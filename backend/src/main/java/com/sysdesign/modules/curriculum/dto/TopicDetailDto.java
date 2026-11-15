package com.sysdesign.modules.curriculum.dto;

import java.util.List;

public record TopicDetailDto(
    String id,
    String moduleId,
    String moduleTitle,
    String title,
    String summary,
    String difficulty,
    List<String> subtopics,
    String beginnerExplanation,
    String deepTechnicalExplanation,
    String architectureDiagramMermaid,
    String advantages,
    String disadvantages,
    String realWorldUseCases,
    String interviewQuestions,
    String practicalExercises,
    String userProgressStatus,
    boolean isBookmarked,
    String userNote
) {}
