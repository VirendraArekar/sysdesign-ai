package com.sysdesign.modules.simulators;

import com.sysdesign.modules.simulators.dto.*;
import com.sysdesign.modules.simulators.service.SimulatorService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class SimulatorServiceTest {

    private SimulatorService simulatorService;

    @BeforeEach
    void setUp() {
        simulatorService = new SimulatorService();
    }

    @Test
    void testCalculateCapacity() {
        CapacityEstimationRequest request = new CapacityEstimationRequest();
        request.setDailyActiveUsers(50_000_000);
        request.setActionsPerUser(20);
        request.setPeakTrafficMultiplier(2.0);
        request.setReadWriteRatio(10.0);

        CapacityEstimationResult result = simulatorService.calculateCapacity(request);

        assertNotNull(result);
        assertTrue(result.getAvgQps() > 10000);
        assertTrue(result.getPeakQps() > result.getAvgQps());
        assertTrue(result.getReadQps() > result.getWriteQps());
        assertTrue(result.getDailyStorageGb() > 0);
        assertTrue(result.getFiveYearStorageTb() > 0);
        assertTrue(result.getRecommendedCacheRamGb() > 0);
    }

    @Test
    void testCalculateAvailability() {
        AvailabilityRequest request = new AvailabilityRequest(99.99); // Four Nines
        AvailabilityResult result = simulatorService.calculateAvailability(request);

        assertNotNull(result);
        assertEquals(99.99, result.getSlaPercentage());
        // 0.01% of 31557600s = 3155.76s / 60 = ~52.6 minutes
        assertTrue(result.getYearlyDowntimeMinutes() > 50 && result.getYearlyDowntimeMinutes() < 55);
        assertTrue(result.getClassification().contains("Four Nines"));
    }

    @Test
    void testCalculateConsistentHashing() {
        ConsistentHashingRequest request = new ConsistentHashingRequest();
        request.setServerNodes(List.of("node-a", "node-b", "node-c"));
        request.setVirtualNodesPerServer(50);
        request.setTestKeys(List.of("user_1", "user_2", "user_3", "user_4", "user_5"));

        ConsistentHashingResult result = simulatorService.calculateConsistentHashing(request);

        assertNotNull(result);
        assertEquals(3, result.getTotalNodes());
        assertEquals(150, result.getTotalVirtualNodes());
        assertEquals(3, result.getKeyDistribution().size());
        assertEquals(5, result.getKeyToNodeMapping().size());
    }

    @Test
    void testCalculateBloomFilter() {
        BloomFilterRequest request = new BloomFilterRequest(10_000_000, 0.01);
        BloomFilterResult result = simulatorService.calculateBloomFilter(request);

        assertNotNull(result);
        assertTrue(result.getOptimalBits() > 0);
        assertTrue(result.getSizeInMegaBytes() > 10); // ~11.4 MB
        assertEquals(7, result.getOptimalHashFunctions());
        assertTrue(result.getActualFalsePositiveRate() <= 0.011);
    }

    @Test
    void testCalculateLittlesLaw() {
        LittlesLawRequest request = new LittlesLawRequest(10_000, 50.0, 200);
        LittlesLawResult result = simulatorService.calculateLittlesLaw(request);

        assertNotNull(result);
        // L = 10,000 * 0.05 = 500 concurrent in flight
        assertEquals(500.0, result.getConcurrentInFlightRequests());
        assertTrue(result.getRecommendedWorkerNodes() >= 4);
    }
}
