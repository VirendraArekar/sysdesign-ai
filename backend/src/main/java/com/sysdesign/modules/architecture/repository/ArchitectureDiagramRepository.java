package com.sysdesign.modules.architecture.repository;

import com.sysdesign.modules.architecture.model.ArchitectureDiagram;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ArchitectureDiagramRepository extends JpaRepository<ArchitectureDiagram, UUID> {
    List<ArchitectureDiagram> findByUserIdOrderByUpdatedAtDesc(UUID userId);
}
