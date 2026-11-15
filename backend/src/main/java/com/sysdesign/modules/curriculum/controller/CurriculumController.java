package com.sysdesign.modules.curriculum.controller;

import com.sysdesign.common.ApiResponse;
import com.sysdesign.common.security.UserPrincipal;
import com.sysdesign.modules.curriculum.dto.*;
import com.sysdesign.modules.curriculum.service.CurriculumService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/curriculum")
@Tag(name = "Curriculum", description = "Learning modules, topics, progress and user notes")
public class CurriculumController {

    private final CurriculumService curriculumService;

    public CurriculumController(CurriculumService curriculumService) {
        this.curriculumService = curriculumService;
    }

    @GetMapping("/modules")
    @Operation(summary = "Get all 13 system design curriculum modules")
    public ApiResponse<List<ModuleDto>> getAllModules() {
        return ApiResponse.ok(curriculumService.getAllModules());
    }

    @GetMapping("/modules/{moduleId}")
    @Operation(summary = "Get single module with its topics and subtopics")
    public ApiResponse<ModuleDto> getModuleById(@PathVariable String moduleId) {
        return ApiResponse.ok(curriculumService.getModuleById(moduleId));
    }

    @GetMapping("/topics/{topicId}")
    @Operation(summary = "Get deep learning content and diagrams for a topic")
    public ApiResponse<TopicDetailDto> getTopicDetail(
            @PathVariable String topicId,
            @AuthenticationPrincipal UserPrincipal principal) {
        UUID userId = principal != null ? principal.getId() : null;
        return ApiResponse.ok(curriculumService.getTopicDetail(topicId, userId));
    }

    @PostMapping("/progress")
    @Operation(summary = "Update learning progress for a topic")
    public ApiResponse<Void> updateProgress(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody UpdateProgressRequest request) {
        curriculumService.updateProgress(principal.getId(), request);
        return ApiResponse.ok("Progress recorded successfully", null);
    }

    @PostMapping("/bookmarks")
    @Operation(summary = "Toggle bookmark for a topic or problem")
    public ApiResponse<Boolean> toggleBookmark(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody BookmarkRequest request) {
        boolean bookmarked = curriculumService.toggleBookmark(principal.getId(), request);
        return ApiResponse.ok(bookmarked ? "Bookmarked" : "Bookmark removed", bookmarked);
    }

    @PostMapping("/notes")
    @Operation(summary = "Save user study note for a topic")
    public ApiResponse<Void> saveNote(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody SaveNoteRequest request) {
        curriculumService.saveNote(principal.getId(), request);
        return ApiResponse.ok("Note saved successfully", null);
    }
}
