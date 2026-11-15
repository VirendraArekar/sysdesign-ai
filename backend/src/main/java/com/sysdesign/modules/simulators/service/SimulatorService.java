package com.sysdesign.modules.simulators.service;

import com.sysdesign.modules.simulators.dto.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.*;

@Service
public class SimulatorService {

    public CapacityEstimationResult calculateCapacity(CapacityEstimationRequest req) {
        long dau = req.getDailyActiveUsers();
        long totalDailyRequests = dau * req.getActionsPerUser();
        double avgQps = round(totalDailyRequests / 86400.0, 2);
        double peakQps = round(avgQps * req.getPeakTrafficMultiplier(), 2);

        double writeRatio = 1.0 / (1.0 + req.getReadWriteRatio());
        double readRatio = req.getReadWriteRatio() / (1.0 + req.getReadWriteRatio());

        double readQps = round(peakQps * readRatio, 2);
        double writeQps = round(peakQps * writeRatio, 2);

        double dailyWriteRequests = totalDailyRequests * writeRatio;
        double dailyStorageBytes = dailyWriteRequests * req.getAvgPayloadBytes() * req.getReplicationFactor();
        double dailyStorageGb = round(dailyStorageBytes / (1024.0 * 1024.0 * 1024.0), 2);

        double fiveYearStorageTb = round((dailyStorageGb * 365.0 * req.getRetentionYears()) / 1024.0, 2);

        double ingressBandwidthMbps = round((writeQps * req.getAvgPayloadBytes() * 8.0) / (1000.0 * 1000.0), 2);
        double egressBandwidthMbps = round((readQps * req.getAvgPayloadBytes() * 8.0) / (1000.0 * 1000.0), 2);

        // 80/20 Rule: 20% of daily read data in Redis RAM
        double dailyReadBytes = totalDailyRequests * readRatio * req.getAvgPayloadBytes();
        double recommendedCacheRamGb = round((dailyReadBytes * 0.20) / (1024.0 * 1024.0 * 1024.0), 2);

        CapacityEstimationResult result = new CapacityEstimationResult();
        result.setAvgQps(avgQps);
        result.setPeakQps(peakQps);
        result.setReadQps(readQps);
        result.setWriteQps(writeQps);
        result.setDailyStorageGb(dailyStorageGb);
        result.setFiveYearStorageTb(fiveYearStorageTb);
        result.setIngressBandwidthMbps(ingressBandwidthMbps);
        result.setEgressBandwidthMbps(egressBandwidthMbps);
        result.setRecommendedCacheRamGb(recommendedCacheRamGb);
        return result;
    }

    public AvailabilityResult calculateAvailability(AvailabilityRequest req) {
        double sla = req.getSlaPercentage();
        double downtimeFraction = 1.0 - (sla / 100.0);

        double yearlySeconds = 31557600.0; // 365.25 days
        double yearlyDowntimeMinutes = round((yearlySeconds * downtimeFraction) / 60.0, 2);
        double monthlyDowntimeMinutes = round(yearlyDowntimeMinutes / 12.0, 2);
        double dailyDowntimeSeconds = round(86400.0 * downtimeFraction, 2);

        String classification;
        if (sla >= 99.999) {
            classification = "Five Nines (Carrier-Grade / Mission-Critical)";
        } else if (sla >= 99.99) {
            classification = "Four Nines (Cloud Enterprise Standard)";
        } else if (sla >= 99.9) {
            classification = "Three Nines (Standard SaaS Production)";
        } else if (sla >= 99.0) {
            classification = "Two Nines (Internal Utility / Tolerant Service)";
        } else {
            classification = "Low Availability (High Risk of Business Interruption)";
        }

        return new AvailabilityResult(sla, yearlyDowntimeMinutes, monthlyDowntimeMinutes, dailyDowntimeSeconds, classification);
    }

    public ConsistentHashingResult calculateConsistentHashing(ConsistentHashingRequest req) {
        List<String> servers = req.getServerNodes() != null && !req.getServerNodes().isEmpty() 
                ? req.getServerNodes() 
                : List.of("server-node-1", "server-node-2", "server-node-3", "server-node-4");

        int vnodes = req.getVirtualNodesPerServer() > 0 ? req.getVirtualNodesPerServer() : 100;
        TreeMap<Long, String> ring = new TreeMap<>();

        for (String server : servers) {
            for (int i = 0; i < vnodes; i++) {
                long hash = hash(server + "#" + i);
                ring.put(hash, server);
            }
        }

        List<String> keys = req.getTestKeys() != null && !req.getTestKeys().isEmpty()
                ? req.getTestKeys()
                : generateDefaultTestKeys(500);

        Map<String, Integer> distribution = new HashMap<>();
        Map<String, String> keyMapping = new HashMap<>();

        for (String server : servers) {
            distribution.put(server, 0);
        }

        for (String key : keys) {
            long keyHash = hash(key);
            Map.Entry<Long, String> entry = ring.ceilingEntry(keyHash);
            if (entry == null) {
                entry = ring.firstEntry();
            }
            String assignedServer = entry.getValue();
            distribution.put(assignedServer, distribution.get(assignedServer) + 1);
            keyMapping.put(key, assignedServer);
        }

        // Calculate standard deviation across server counts
        double mean = (double) keys.size() / servers.size();
        double variance = distribution.values().stream()
                .mapToDouble(count -> Math.pow(count - mean, 2))
                .average()
                .orElse(0.0);
        double stdDev = round(Math.sqrt(variance), 2);

        ConsistentHashingResult result = new ConsistentHashingResult();
        result.setTotalNodes(servers.size());
        result.setTotalVirtualNodes(ring.size());
        result.setKeyDistribution(distribution);
        result.setKeyToNodeMapping(keyMapping);
        result.setStandardDeviation(stdDev);
        return result;
    }

    public BloomFilterResult calculateBloomFilter(BloomFilterRequest req) {
        long n = req.getExpectedItems();
        double p = req.getDesiredFalsePositiveRate();

        double ln2 = Math.log(2.0);
        double optimalBitsDouble = - (n * Math.log(p)) / (ln2 * ln2);
        long optimalBits = (long) Math.ceil(optimalBitsDouble);

        double sizeMb = round((double) optimalBits / (8.0 * 1024.0 * 1024.0), 3);
        int optimalHashFunctions = Math.max(1, (int) Math.round(((double) optimalBits / n) * ln2));
        double bitsPerItem = round((double) optimalBits / n, 2);

        double actualFpRate = Math.pow(1.0 - Math.exp(- ((double) optimalHashFunctions * n) / optimalBits), optimalHashFunctions);

        return new BloomFilterResult(optimalBits, sizeMb, optimalHashFunctions, bitsPerItem, round(actualFpRate, 6));
    }

    public LittlesLawResult calculateLittlesLaw(LittlesLawRequest req) {
        double rps = req.getArrivalRateRps();
        double latencySeconds = req.getAvgLatencyMs() / 1000.0;

        // L = lambda * W
        double concurrentRequests = round(rps * latencySeconds, 2);

        int capacityPerNode = req.getThreadPoolCapacityPerNode() > 0 ? req.getThreadPoolCapacityPerNode() : 200;
        // Target 70% max utilization for headroom against spikes
        int recommendedNodes = (int) Math.ceil(concurrentRequests / (capacityPerNode * 0.70));
        recommendedNodes = Math.max(2, recommendedNodes); // Minimum 2 nodes for High Availability

        double totalCapacity = recommendedNodes * capacityPerNode;
        double utilizationPct = round((concurrentRequests / totalCapacity) * 100.0, 1);

        String warning = null;
        if (utilizationPct > 85.0) {
            warning = "CRITICAL: Thread pool utilization exceeds 85%. Threat of request queuing, thread starvation, and cascading timeouts.";
        } else if (utilizationPct > 70.0) {
            warning = "WARNING: System running near peak safe threshold. Provision additional worker replicas or tune thread pool size.";
        }

        return new LittlesLawResult(concurrentRequests, recommendedNodes, utilizationPct, warning);
    }

    private List<String> generateDefaultTestKeys(int count) {
        List<String> keys = new ArrayList<>(count);
        for (int i = 1; i <= count; i++) {
            keys.add("user_session_id_" + UUID.randomUUID().toString().substring(0, 8));
        }
        return keys;
    }

    private long hash(String key) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] digest = md.digest(key.getBytes(StandardCharsets.UTF_8));
            long hash = 0;
            for (int i = 0; i < 4; i++) {
                hash = (hash << 8) | (digest[i] & 0xFF);
            }
            return hash & 0xFFFFFFFFL;
        } catch (NoSuchAlgorithmException e) {
            return (long) key.hashCode() & 0xFFFFFFFFL;
        }
    }

    private double round(double value, int places) {
        if (Double.isNaN(value) || Double.isInfinite(value)) return 0.0;
        return BigDecimal.valueOf(value).setScale(places, RoundingMode.HALF_UP).doubleValue();
    }
}
