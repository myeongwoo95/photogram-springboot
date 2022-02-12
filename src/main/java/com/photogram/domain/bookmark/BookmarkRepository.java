package com.photogram.domain.bookmark;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {

    // 북마크
    @Modifying
    @Query(
            value = "INSERT INTO bookmark(userId, imageId, createDate) VALUES(:userId, :imageId, now())",
            nativeQuery = true)
    void mBookmark(Long userId, Long imageId);

    // 북마크 취소
    @Modifying
    @Query(
            value = "DELETE FROM bookmark WHERE userId = :userId AND imageId = :imageId",
            nativeQuery = true)
    void mUnBookmark(Long userId, Long imageId);

    // 북마크 여부 (로그인한 유저가 이미지를 북마크했는가?)
    @Query(value = "SELECT COUNT(*) FROM bookmark WHERE userId = :principalId AND imageId = :imageId", nativeQuery = true)
    int mBookmarkState(Long principalId, Long imageId);
}
