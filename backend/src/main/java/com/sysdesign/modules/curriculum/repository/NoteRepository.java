package com.sysdesign.modules.curriculum.repository;

import com.sysdesign.modules.curriculum.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface NoteRepository extends JpaRepository<Note, UUID> {
    Optional<Note> findByUserIdAndItemTypeAndItemId(UUID userId, String itemType, String itemId);
}
