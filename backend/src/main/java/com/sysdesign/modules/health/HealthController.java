package com.sysdesign.modules.health;

import com.sysdesign.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/health")
@Tag(name = "Health", description = "System health check endpoints")
public class HealthController {

    @GetMapping
    @Operation(summary = "System status check")
    public ApiResponse<Map<String, Object>> checkHealth() {
        return ApiResponse.ok("System Design AI Service is healthy and operational", Map.of(
                "status", "UP",
                "service", "sysdesign-ai-backend",
                "version", "1.0.0",
                "timestamp", Instant.now().toString()
        ));
    }
}
