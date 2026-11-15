package com.sysdesign.modules.practice.repository;

import com.sysdesign.modules.practice.model.LldProblem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LldProblemRepository extends JpaRepository<LldProblem, String> {
    List<LldProblem> findByDifficulty(String difficulty);
}
