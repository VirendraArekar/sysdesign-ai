package com.sysdesign.modules.practice.service;

import com.sysdesign.common.exception.ResourceNotFoundException;
import com.sysdesign.modules.practice.dto.*;
import com.sysdesign.modules.practice.model.HldProblem;
import com.sysdesign.modules.practice.model.LldProblem;
import com.sysdesign.modules.practice.model.QuestionBankItem;
import com.sysdesign.modules.practice.repository.HldProblemRepository;
import com.sysdesign.modules.practice.repository.LldProblemRepository;
import com.sysdesign.modules.practice.repository.QuestionBankRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PracticeService {

    private final HldProblemRepository hldRepository;
    private final LldProblemRepository lldRepository;
    private final QuestionBankRepository questionBankRepository;
    private final SystemDesignCatalogService catalogService;

    public PracticeService(HldProblemRepository hldRepository,
                           LldProblemRepository lldRepository,
                           QuestionBankRepository questionBankRepository,
                           SystemDesignCatalogService catalogService) {
        this.hldRepository = hldRepository;
        this.lldRepository = lldRepository;
        this.questionBankRepository = questionBankRepository;
        this.catalogService = catalogService;
    }

    @Transactional(readOnly = true)
    public List<HldSummaryDto> getAllHldProblems() {
        return hldRepository.findAll().stream()
                .map(p -> new HldSummaryDto(p.getId(), p.getTitle(), p.getCategory(), p.getDifficulty(), p.getDescription()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public HldDetailDto getHldProblemById(String id) {
        HldProblem p = hldRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("HLD Problem not found: " + id));

        return new HldDetailDto(
                p.getId(),
                p.getTitle(),
                p.getCategory(),
                p.getDifficulty(),
                p.getDescription(),
                p.getFunctionalRequirements(),
                p.getNonFunctionalRequirements(),
                p.getCapacityEstimation(),
                p.getApiDesign(),
                p.getDatabaseSchema(),
                p.getArchitectureDiagramMermaid(),
                p.getDeepDiveTopics(),
                p.getTradeOffs()
        );
    }

    @Transactional(readOnly = true)
    public List<LldSummaryDto> getAllLldProblems() {
        return lldRepository.findAll().stream()
                .map(p -> new LldSummaryDto(
                        p.getId(),
                        p.getTitle(),
                        p.getDifficulty(),
                        p.getProblemStatement(),
                        p.getSolidPrinciplesApplied(),
                        p.getDesignPatternsUsed()
                ))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public LldDetailDto getLldProblemById(String id) {
        LldProblem p = lldRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LLD Problem not found: " + id));

        return new LldDetailDto(
                p.getId(),
                p.getTitle(),
                p.getDifficulty(),
                p.getProblemStatement(),
                p.getSolidPrinciplesApplied(),
                p.getDesignPatternsUsed(),
                p.getClassDiagramMermaid(),
                p.getJavaSolutionCode(),
                p.getUnitTestsCode(),
                p.getExtensibilityNotes()
        );
    }

    @Transactional(readOnly = true)
    public List<QuestionBankDto> getQuestions(String category, String company) {
        List<QuestionBankItem> items;
        if (company != null && !company.isBlank()) {
            items = questionBankRepository.findByCompanyTag(company);
        } else if (category != null && !category.isBlank()) {
            items = questionBankRepository.findByCategory(category);
        } else {
            items = questionBankRepository.findAll();
        }

        return items.stream()
                .map(q -> new QuestionBankDto(
                        q.getId(),
                        q.getTitle(),
                        q.getCategory(),
                        q.getDifficulty(),
                        q.getCompanyTags(),
                        q.isVerifiedPublic(),
                        q.getQuestionText(),
                        q.getModelAnswer(),
                        q.getKeyPoints()
                ))
                .collect(Collectors.toList());
    }

    public List<TopicHubSummaryDto> getTopicsHub(String type, String category, String search) {
        return catalogService.getAllSummaries(type, category, search);
    }

    public TopicHubDetailDto getTopicHubDetail(String id) {
        return catalogService.getTopicDetail(id)
                .orElseThrow(() -> new ResourceNotFoundException("Topic not found in system design hub: " + id));
    }
}
