package com.sysdesign.modules.interview.repository;

import com.sysdesign.modules.interview.model.InterviewMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface InterviewMessageRepository extends JpaRepository<InterviewMessage, UUID> {
    List<InterviewMessage> findBySessionIdOrderBySequenceOrderAsc(UUID sessionId);
}
