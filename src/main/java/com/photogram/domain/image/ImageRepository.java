package com.photogram.domain.image;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ImageRepository extends JpaRepository<Image, Long> {

    @Query(value = "select * from image where userId in(select toUserId from subscribe where fromUserId=:principalId)", nativeQuery = true)
    List<Image> mStory(Long principalId, Pageable pageable);
}
