package com.sysdesign.modules.simulators.dto;

import java.util.Map;

public class ConsistentHashingResult {

    private int totalNodes;
    private int totalVirtualNodes;
    private Map<String, Integer> keyDistribution; // Server -> count of assigned keys
    private Map<String, String> keyToNodeMapping; // Key -> Server
    private double standardDeviation;

    public ConsistentHashingResult() {}

    public int getTotalNodes() {
        return totalNodes;
    }

    public void setTotalNodes(int totalNodes) {
        this.totalNodes = totalNodes;
    }

    public int getTotalVirtualNodes() {
        return totalVirtualNodes;
    }

    public void setTotalVirtualNodes(int totalVirtualNodes) {
        this.totalVirtualNodes = totalVirtualNodes;
    }

    public Map<String, Integer> getKeyDistribution() {
        return keyDistribution;
    }

    public void setKeyDistribution(Map<String, Integer> keyDistribution) {
        this.keyDistribution = keyDistribution;
    }

    public Map<String, String> getKeyToNodeMapping() {
        return keyToNodeMapping;
    }

    public void setKeyToNodeMapping(Map<String, String> keyToNodeMapping) {
        this.keyToNodeMapping = keyToNodeMapping;
    }

    public double getStandardDeviation() {
        return standardDeviation;
    }

    public void setStandardDeviation(double standardDeviation) {
        this.standardDeviation = standardDeviation;
    }
}
