package com.sysdesign.modules.rag.controller;

import com.sysdesign.common.ApiResponse;
import com.sysdesign.modules.rag.dto.*;
import com.sysdesign.modules.rag.service.RagSearchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/rag")
@Tag(name = "RAG & Semantic Vector Search", description = "Semantic retrieval across 13 curriculum modules, HLD blueprints and LLD systems")
public class RagSearchController {

    private final RagSearchService ragSearchService;

    public RagSearchController(RagSearchService ragSearchService) {
        this.ragSearchService = ragSearchService;
    }

    @PostMapping("/search")
    @Operation(summary = "Semantic vector search across system design knowledge base")
    public ApiResponse<List<RagSearchResult>> search(@Valid @RequestBody RagQueryRequest request) {
        List<RagSearchResult> results = ragSearchService.search(request);
        return ApiResponse.ok("Search results retrieved", results);
    }

    @PostMapping("/ask")
    @Operation(summary = "Ask AI Architect: Grounded RAG answering with cited sources")
    public ApiResponse<RagAnswerResponse> askArchitectureAi(@Valid @RequestBody RagQueryRequest request) {
        RagAnswerResponse response = ragSearchService.askArchitectureAi(request);
        return ApiResponse.ok("Grounded answer generated", response);
    }
}
