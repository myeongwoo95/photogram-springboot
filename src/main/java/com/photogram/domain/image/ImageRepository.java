package com.photogram.domain.image;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ImageRepository extends JpaRepository<Image, Long> {

    @Query(value = "select * from image where userId in(select toUserId from subscribe where fromUserId=:principalId)", nativeQuery = true)
    List<Image> mStory(Long principalId, Pageable pageable);

    @Query(value = "SELECT i.* FROM image i INNER JOIN (SELECT imageId, COUNT(imageId) likeCount FROM likes GROUP BY imageId) c ON i.id = c.imageId ORDER BY likeCount DESC", nativeQuery = true)
    List<Image> mPopular(Pageable pageable);

}
