package com.sysdesign.modules.curriculum.repository;

import com.sysdesign.modules.curriculum.model.Bookmark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, UUID> {
    Optional<Bookmark> findByUserIdAndItemTypeAndItemId(UUID userId, String itemType, String itemId);
    List<Bookmark> findByUserId(UUID userId);
    boolean existsByUserIdAndItemTypeAndItemId(UUID userId, String itemType, String itemId);
    void deleteByUserIdAndItemTypeAndItemId(UUID userId, String itemType, String itemId);
}
