package com.photogram.domain.like;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface LikeCommentRespository extends JpaRepository<LikeComment, Long> {

    @Modifying
    @Query(value="insert into likeComment(commentId, userId, createDate) values(:commentId, :principalId, now())", nativeQuery = true)
    int mLikes(Long commentId, Long principalId);

    @Modifying
    @Query(value="delete from likeComment where commentId = :commentId and userId = :principalId", nativeQuery = true)
    int mUnLikes(Long commentId, Long principalId);

    int deleteByCommentId(Long commentId);
}
