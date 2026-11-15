package com.sysdesign.modules.simulators.dto;

import java.util.List;

public class ConsistentHashingRequest {

    private List<String> serverNodes;
    private int virtualNodesPerServer = 100;
    private List<String> testKeys;

    public ConsistentHashingRequest() {}

    public List<String> getServerNodes() {
        return serverNodes;
    }

    public void setServerNodes(List<String> serverNodes) {
        this.serverNodes = serverNodes;
    }

    public int getVirtualNodesPerServer() {
        return virtualNodesPerServer;
    }

    public void setVirtualNodesPerServer(int virtualNodesPerServer) {
        this.virtualNodesPerServer = virtualNodesPerServer;
    }

    public List<String> getTestKeys() {
        return testKeys;
    }

    public void setTestKeys(List<String> testKeys) {
        this.testKeys = testKeys;
    }
}
