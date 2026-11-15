package com.sysdesign.modules.practice.repository;

import com.sysdesign.modules.practice.model.QuestionBankItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface QuestionBankRepository extends JpaRepository<QuestionBankItem, UUID> {
    List<QuestionBankItem> findByCategory(String category);
    List<QuestionBankItem> findByDifficulty(String difficulty);

    @Query(value = "SELECT * FROM question_bank WHERE :company = ANY(company_tags)", nativeQuery = true)
    List<QuestionBankItem> findByCompanyTag(@Param("company") String company);
}
