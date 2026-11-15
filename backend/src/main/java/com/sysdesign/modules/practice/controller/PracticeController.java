package com.sysdesign.modules.practice.controller;

import com.sysdesign.common.ApiResponse;
import com.sysdesign.modules.practice.dto.*;
import com.sysdesign.modules.practice.service.PracticeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/practice")
@Tag(name = "Practice Hub", description = "High-Level Design (HLD), Low-Level Design (LLD), and Question Bank")
public class PracticeController {

    private final PracticeService practiceService;

    public PracticeController(PracticeService practiceService) {
        this.practiceService = practiceService;
    }

    @GetMapping("/hld")
    @Operation(summary = "Get all HLD design problems")
    public ApiResponse<List<HldSummaryDto>> getAllHldProblems() {
        return ApiResponse.ok(practiceService.getAllHldProblems());
    }

    @GetMapping("/hld/{id}")
    @Operation(summary = "Get full architectural blueprint for an HLD problem")
    public ApiResponse<HldDetailDto> getHldProblemById(@PathVariable String id) {
        return ApiResponse.ok(practiceService.getHldProblemById(id));
    }

    @GetMapping("/lld")
    @Operation(summary = "Get all LLD design problems")
    public ApiResponse<List<LldSummaryDto>> getAllLldProblems() {
        return ApiResponse.ok(practiceService.getAllLldProblems());
    }

    @GetMapping("/lld/{id}")
    @Operation(summary = "Get complete OOP/SOLID design and Java implementation for an LLD problem")
    public ApiResponse<LldDetailDto> getLldProblemById(@PathVariable String id) {
        return ApiResponse.ok(practiceService.getLldProblemById(id));
    }

    @GetMapping("/questions")
    @Operation(summary = "Query searchable question bank with company and category filters")
    public ApiResponse<List<QuestionBankDto>> getQuestions(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String company) {
        return ApiResponse.ok(practiceService.getQuestions(category, company));
    }
}
