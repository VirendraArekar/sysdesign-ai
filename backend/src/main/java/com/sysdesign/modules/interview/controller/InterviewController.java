package com.sysdesign.modules.interview.controller;

import com.sysdesign.common.ApiResponse;
import com.sysdesign.common.security.UserPrincipal;
import com.sysdesign.modules.interview.dto.*;
import com.sysdesign.modules.interview.service.InterviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/interviews")
@Tag(name = "AI Interview Simulator", description = "Mock interview session creation, execution and evaluation")
public class InterviewController {

    private final InterviewService interviewService;

    public InterviewController(InterviewService interviewService) {
        this.interviewService = interviewService;
    }

    @PostMapping("/start")
    @Operation(summary = "Start a new AI mock interview session")
    public ApiResponse<InterviewSessionDto> startSession(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody StartInterviewRequest request) {
        InterviewSessionDto session = interviewService.startSession(principal.getId(), request);
        return ApiResponse.ok("Interview started", session);
    }

    @PostMapping("/{sessionId}/reply")
    @Operation(summary = "Submit candidate answer and get contextual AI follow-up")
    public ApiResponse<InterviewSessionDto> submitReply(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID sessionId,
            @Valid @RequestBody CandidateReplyRequest request) {
        InterviewSessionDto session = interviewService.submitCandidateReply(principal.getId(), sessionId, request);
        return ApiResponse.ok("Reply processed", session);
    }

    @PostMapping("/{sessionId}/pause")
    @Operation(summary = "Pause active interview timer")
    public ApiResponse<Void> pauseSession(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID sessionId) {
        interviewService.pauseSession(principal.getId(), sessionId);
        return ApiResponse.ok("Interview paused", null);
    }

    @PostMapping("/{sessionId}/resume")
    @Operation(summary = "Resume paused interview")
    public ApiResponse<Void> resumeSession(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID sessionId) {
        interviewService.resumeSession(principal.getId(), sessionId);
        return ApiResponse.ok("Interview resumed", null);
    }

    @PostMapping("/{sessionId}/finish")
    @Operation(summary = "Finish interview and generate 15-category evaluation report")
    public ApiResponse<InterviewSessionDto> finishSession(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID sessionId) {
        InterviewSessionDto session = interviewService.finishSession(principal.getId(), sessionId);
        return ApiResponse.ok("Interview evaluation completed", session);
    }

    @GetMapping("/{sessionId}")
    @Operation(summary = "Get interview session transcript and current status")
    public ApiResponse<InterviewSessionDto> getSession(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID sessionId) {
        InterviewSessionDto session = interviewService.getSessionById(principal.getId(), sessionId);
        return ApiResponse.ok(session);
    }

    @GetMapping("/history")
    @Operation(summary = "List user past interview sessions")
    public ApiResponse<List<InterviewSessionDto>> getUserHistory(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(interviewService.getUserSessions(principal.getId()));
    }
}
