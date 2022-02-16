package com.photogram.domain.comment;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    @Query(value = "SELECT * FROM comment WHERE imageId = :imageId", nativeQuery = true)
    Page<Comment> commentList(Long imageId, Pageable pageable);

    @Query(value = "SELECT * FROM comment WHERE imageId = :imageId AND userId = :userId", nativeQuery = true)
    Optional<List<Comment>> myCommentList(Long imageId, Long userId);

    @Query(value = "SELECT * FROM comment WHERE imageId = :imageId AND userId != :userId", nativeQuery = true)
    Optional<List<Comment>> CommentListWithoutMine(Long imageId, Long userId, Pageable pageable);

    @Modifying
    @Query(value = "DELETE FROM comment where imageId = :imageId", nativeQuery = true)
    int deleteByImageId(Long imageId);

    List<Comment> findAllByImageId(Long imageId);
}
