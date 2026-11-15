package com.sysdesign.modules.curriculum.repository;

import com.sysdesign.modules.curriculum.model.LearningModule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LearningModuleRepository extends JpaRepository<LearningModule, String> {
    List<LearningModule> findAllByOrderBySequenceOrderAsc();
}
