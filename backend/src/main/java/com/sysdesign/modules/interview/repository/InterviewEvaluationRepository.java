package com.sysdesign.modules.interview.repository;

import com.sysdesign.modules.interview.model.InterviewEvaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface InterviewEvaluationRepository extends JpaRepository<InterviewEvaluation, UUID> {
    Optional<InterviewEvaluation> findBySessionId(UUID sessionId);
}
