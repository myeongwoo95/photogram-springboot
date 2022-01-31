package com.photogram.domain.like;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface LikesRespository extends JpaRepository<Likes, Long> {

    @Modifying
    @Query(value="insert into likes(imageId, userId, createDate) values(:imageId, :principalId, now())", nativeQuery = true)
    int mLikes(Long imageId, Long principalId);

    @Modifying
    @Query(value="delete from likes where imageId = :imageId and userId = :principalId", nativeQuery = true)
    int mUnLikes(Long imageId, Long principalId);

}
