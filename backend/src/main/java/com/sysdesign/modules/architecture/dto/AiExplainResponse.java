package com.sysdesign.modules.architecture.dto;

import java.util.ArrayList;
import java.util.List;

public class AiExplainResponse {

    private String elevatorPitch;
    private List<StepFlowItem> stepByStepFlow = new ArrayList<>();
    private List<TradeOffItem> tradeOffs = new ArrayList<>();
    private List<FailureModeItem> failureModes = new ArrayList<>();
    private List<InterviewerQuestionItem> interviewerQuestions = new ArrayList<>();
    private String fullPresentationScript;

    public AiExplainResponse() {}

    public String getElevatorPitch() {
        return elevatorPitch;
    }

    public void setElevatorPitch(String elevatorPitch) {
        this.elevatorPitch = elevatorPitch;
    }

    public List<StepFlowItem> getStepByStepFlow() {
        return stepByStepFlow;
    }

    public void setStepByStepFlow(List<StepFlowItem> stepByStepFlow) {
        this.stepByStepFlow = stepByStepFlow;
    }

    public List<TradeOffItem> getTradeOffs() {
        return tradeOffs;
    }

    public void setTradeOffs(List<TradeOffItem> tradeOffs) {
        this.tradeOffs = tradeOffs;
    }

    public List<FailureModeItem> getFailureModes() {
        return failureModes;
    }

    public void setFailureModes(List<FailureModeItem> failureModes) {
        this.failureModes = failureModes;
    }

    public List<InterviewerQuestionItem> getInterviewerQuestions() {
        return interviewerQuestions;
    }

    public void setInterviewerQuestions(List<InterviewerQuestionItem> interviewerQuestions) {
        this.interviewerQuestions = interviewerQuestions;
    }

    public String getFullPresentationScript() {
        return fullPresentationScript;
    }

    public void setFullPresentationScript(String fullPresentationScript) {
        this.fullPresentationScript = fullPresentationScript;
    }

    public static class StepFlowItem {
        private int stepNumber;
        private String component;
        private String action;
        private String protocol;
        private String latency;
        private String interviewerTalkingPoint;

        public StepFlowItem() {}

        public StepFlowItem(int stepNumber, String component, String action, String protocol, String latency, String interviewerTalkingPoint) {
            this.stepNumber = stepNumber;
            this.component = component;
            this.action = action;
            this.protocol = protocol;
            this.latency = latency;
            this.interviewerTalkingPoint = interviewerTalkingPoint;
        }

        public int getStepNumber() { return stepNumber; }
        public void setStepNumber(int stepNumber) { this.stepNumber = stepNumber; }
        public String getComponent() { return component; }
        public void setComponent(String component) { this.component = component; }
        public String getAction() { return action; }
        public void setAction(String action) { this.action = action; }
        public String getProtocol() { return protocol; }
        public void setProtocol(String protocol) { this.protocol = protocol; }
        public String getLatency() { return latency; }
        public void setLatency(String latency) { this.latency = latency; }
        public String getInterviewerTalkingPoint() { return interviewerTalkingPoint; }
        public void setInterviewerTalkingPoint(String interviewerTalkingPoint) { this.interviewerTalkingPoint = interviewerTalkingPoint; }
    }

    public static class TradeOffItem {
        private String decision;
        private String chosenOption;
        private String alternativeOption;
        private String whyChosen;
        private String capPerspective;

        public TradeOffItem() {}

        public TradeOffItem(String decision, String chosenOption, String alternativeOption, String whyChosen, String capPerspective) {
            this.decision = decision;
            this.chosenOption = chosenOption;
            this.alternativeOption = alternativeOption;
            this.whyChosen = whyChosen;
            this.capPerspective = capPerspective;
        }

        public String getDecision() { return decision; }
        public void setDecision(String decision) { this.decision = decision; }
        public String getChosenOption() { return chosenOption; }
        public void setChosenOption(String chosenOption) { this.chosenOption = chosenOption; }
        public String getAlternativeOption() { return alternativeOption; }
        public void setAlternativeOption(String alternativeOption) { this.alternativeOption = alternativeOption; }
        public String getWhyChosen() { return whyChosen; }
        public void setWhyChosen(String whyChosen) { this.whyChosen = whyChosen; }
        public String getCapPerspective() { return capPerspective; }
        public void setCapPerspective(String capPerspective) { this.capPerspective = capPerspective; }
    }

    public static class FailureModeItem {
        private String component;
        private String failureScenario;
        private String mitigation;
        private String blastRadius;

        public FailureModeItem() {}

        public FailureModeItem(String component, String failureScenario, String mitigation, String blastRadius) {
            this.component = component;
            this.failureScenario = failureScenario;
            this.mitigation = mitigation;
            this.blastRadius = blastRadius;
        }

        public String getComponent() { return component; }
        public void setComponent(String component) { this.component = component; }
        public String getFailureScenario() { return failureScenario; }
        public void setFailureScenario(String failureScenario) { this.failureScenario = failureScenario; }
        public String getMitigation() { return mitigation; }
        public void setMitigation(String mitigation) { this.mitigation = mitigation; }
        public String getBlastRadius() { return blastRadius; }
        public void setBlastRadius(String blastRadius) { this.blastRadius = blastRadius; }
    }

    public static class InterviewerQuestionItem {
        private String question;
        private String interviewerIntent;
        private String suggestedAnswer;

        public InterviewerQuestionItem() {}

        public InterviewerQuestionItem(String question, String interviewerIntent, String suggestedAnswer) {
            this.question = question;
            this.interviewerIntent = interviewerIntent;
            this.suggestedAnswer = suggestedAnswer;
        }

        public String getQuestion() { return question; }
        public void setQuestion(String question) { this.question = question; }
        public String getInterviewerIntent() { return interviewerIntent; }
        public void setInterviewerIntent(String interviewerIntent) { this.interviewerIntent = interviewerIntent; }
        public String getSuggestedAnswer() { return suggestedAnswer; }
        public void setSuggestedAnswer(String suggestedAnswer) { this.suggestedAnswer = suggestedAnswer; }
    }
}
