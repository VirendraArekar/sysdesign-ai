package com.sysdesign.modules.curriculum.repository;

import com.sysdesign.modules.curriculum.model.LearningContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface LearningContentRepository extends JpaRepository<LearningContent, UUID> {
    Optional<LearningContent> findByTopicId(String topicId);
}
