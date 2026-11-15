package com.sysdesign.modules.architecture.controller;

import com.sysdesign.common.ApiResponse;
import com.sysdesign.common.security.UserPrincipal;
import com.sysdesign.modules.architecture.dto.*;
import com.sysdesign.modules.architecture.service.ArchitectureService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/architecture")
@Tag(name = "Architecture Designer", description = "System architecture diagram design, templates, AI audit and auto-layout")
public class ArchitectureController {

    private final ArchitectureService architectureService;

    public ArchitectureController(ArchitectureService architectureService) {
        this.architectureService = architectureService;
    }

    @GetMapping
    @Operation(summary = "Get all architecture diagrams created by authenticated user")
    public ApiResponse<List<DiagramResponse>> getUserDiagrams(@AuthenticationPrincipal UserPrincipal principal) {
        List<DiagramResponse> diagrams = architectureService.getUserDiagrams(principal.getId());
        return ApiResponse.ok("Diagrams retrieved successfully", diagrams);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a specific architecture diagram by ID")
    public ApiResponse<DiagramResponse> getDiagramById(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id) {
        DiagramResponse diagram = architectureService.getDiagramById(id, principal.getId());
        return ApiResponse.ok("Diagram retrieved successfully", diagram);
    }

    @PostMapping
    @Operation(summary = "Save or update an architecture diagram")
    public ApiResponse<DiagramResponse> saveDiagram(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody DiagramSaveRequest request) {
        DiagramResponse diagram = architectureService.saveDiagram(principal.getId(), request);
        return ApiResponse.ok("Diagram saved successfully", diagram);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an architecture diagram")
    public ApiResponse<Void> deleteDiagram(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id) {
        architectureService.deleteDiagram(id, principal.getId());
        return ApiResponse.ok("Diagram deleted successfully", null);
    }

    @GetMapping("/templates")
    @Operation(summary = "Get prebuilt production architecture blueprints")
    public ApiResponse<List<DiagramResponse>> getTemplates() {
        List<DiagramResponse> templates = architectureService.getPrebuiltTemplates();
        return ApiResponse.ok("Templates retrieved successfully", templates);
    }

    @PostMapping("/audit")
    @Operation(summary = "Run AI architectural audit on canvas nodes & edges")
    public ApiResponse<AiAuditResponse> auditArchitecture(@Valid @RequestBody AiAuditRequest request) {
        AiAuditResponse audit = architectureService.auditArchitecture(request);
        return ApiResponse.ok("Architecture audit completed", audit);
    }

    @PostMapping("/generate")
    @Operation(summary = "Generate architecture topology from natural language prompt")
    public ApiResponse<AiGenerateResponse> generateArchitecture(@Valid @RequestBody AiGenerateRequest request) {
        AiGenerateResponse generated = architectureService.generateArchitecture(request);
        return ApiResponse.ok("Architecture generated successfully", generated);
    }
}
