package com.sysdesign.modules.simulators.controller;

import com.sysdesign.common.ApiResponse;
import com.sysdesign.modules.simulators.dto.*;
import com.sysdesign.modules.simulators.service.SimulatorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/simulators")
@Tag(name = "Distributed Simulators & Calculators", description = "Endpoints for system design capacity estimation, consistent hashing, Little's Law, Bloom Filters and SLAs")
public class SimulatorController {

    private final SimulatorService simulatorService;

    public SimulatorController(SimulatorService simulatorService) {
        this.simulatorService = simulatorService;
    }

    @PostMapping("/capacity")
    @Operation(summary = "Calculate system capacity: QPS, Daily Storage, 5-Year Storage, Bandwidth and Redis RAM")
    public ApiResponse<CapacityEstimationResult> calculateCapacity(@Valid @RequestBody CapacityEstimationRequest request) {
        CapacityEstimationResult result = simulatorService.calculateCapacity(request);
        return ApiResponse.ok("Capacity estimation computed", result);
    }

    @PostMapping("/availability")
    @Operation(summary = "Calculate High Availability SLA downtime budgets (seconds/minutes per day/month/year)")
    public ApiResponse<AvailabilityResult> calculateAvailability(@Valid @RequestBody AvailabilityRequest request) {
        AvailabilityResult result = simulatorService.calculateAvailability(request);
        return ApiResponse.ok("Availability SLA computed", result);
    }

    @PostMapping("/consistent-hashing")
    @Operation(summary = "Simulate Consistent Hashing ring, virtual nodes and key distribution")
    public ApiResponse<ConsistentHashingResult> calculateConsistentHashing(@RequestBody ConsistentHashingRequest request) {
        ConsistentHashingResult result = simulatorService.calculateConsistentHashing(request);
        return ApiResponse.ok("Consistent hashing ring evaluated", result);
    }

    @PostMapping("/bloom-filter")
    @Operation(summary = "Compute optimal bit array size and hash functions count for Bloom Filters")
    public ApiResponse<BloomFilterResult> calculateBloomFilter(@Valid @RequestBody BloomFilterRequest request) {
        BloomFilterResult result = simulatorService.calculateBloomFilter(request);
        return ApiResponse.ok("Bloom filter parameters computed", result);
    }

    @PostMapping("/littles-law")
    @Operation(summary = "Compute Little's Law concurrency and worker thread pool sizing")
    public ApiResponse<LittlesLawResult> calculateLittlesLaw(@Valid @RequestBody LittlesLawRequest request) {
        LittlesLawResult result = simulatorService.calculateLittlesLaw(request);
        return ApiResponse.ok("Little's Law concurrency computed", result);
    }
}
