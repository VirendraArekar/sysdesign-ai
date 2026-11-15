package com.sysdesign.modules.ai.repository;

import com.sysdesign.modules.ai.model.AiUsageLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AiUsageLogRepository extends JpaRepository<AiUsageLog, UUID> {
    List<AiUsageLog> findByUserIdOrderByCreatedAtDesc(UUID userId);

    @Query("SELECT SUM(a.totalTokens) FROM AiUsageLog a WHERE a.userId = :userId")
    Long sumTotalTokensByUserId(UUID userId);

    @Query("SELECT SUM(a.totalTokens) FROM AiUsageLog a")
    Long sumTotalTokensSystemWide();
}
