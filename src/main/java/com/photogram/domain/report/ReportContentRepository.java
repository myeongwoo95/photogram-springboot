package com.photogram.domain.report;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ReportContentRepository extends JpaRepository<ReportContent, Long> {

    @Query(value = "SELECT COUNT(*) FROM reportcontent WHERE imageId = :imageId AND userId = :userId", nativeQuery = true)
    int mDuplicateCheck(Long imageId, Long userId);
}
