package com.sysdesign.modules.practice.repository;

import com.sysdesign.modules.practice.model.HldProblem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HldProblemRepository extends JpaRepository<HldProblem, String> {
    List<HldProblem> findByCategory(String category);
    List<HldProblem> findByDifficulty(String difficulty);
}
