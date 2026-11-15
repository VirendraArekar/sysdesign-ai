package com.sysdesign.modules.ai.service;

import java.util.List;
import java.util.Map;

public interface AiProvider {
    String generateResponse(String systemPrompt, String userMessage);
    String generateFollowUpQuestion(String problemTitle, String level, String stage, List<Map<String, String>> conversationHistory);
    String generateStructuredEvaluation(String problemTitle, String level, List<Map<String, String>> conversationHistory);
}
