package com.sysdesign.modules.interview.repository;

import com.sysdesign.modules.interview.model.InterviewSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface InterviewSessionRepository extends JpaRepository<InterviewSession, UUID> {
    List<InterviewSession> findByUserIdOrderByStartedAtDesc(UUID userId);
    long countByUserIdAndStatus(UUID userId, String status);
}
