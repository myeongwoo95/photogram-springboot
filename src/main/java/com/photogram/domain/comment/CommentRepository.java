package com.photogram.domain.comment;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CommentRepository extends JpaRepository<Comment, Long> {


    @Query(value = "SELECT * FROM comment WHERE imageId = :imageId", nativeQuery = true)
    Page<Comment> commentList(Long imageId, Pageable pageable);

}
