package com.sysdesign.modules.curriculum.repository;

import com.sysdesign.modules.curriculum.model.LearningProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface LearningProgressRepository extends JpaRepository<LearningProgress, UUID> {
    Optional<LearningProgress> findByUserIdAndTopicId(UUID userId, String topicId);
    List<LearningProgress> findByUserId(UUID userId);
    long countByUserIdAndStatus(UUID userId, String status);
}
