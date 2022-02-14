package com.photogram.domain.report;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface ReportCommentRepository extends JpaRepository<ReportComment, Long> {

    Optional<ReportComment> findByCommentId(Long commentId);

    @Query(value = "delete ReportComment where commentId = :commentId", nativeQuery = true)
    int deleteAllByCommentId(Long commentId);

}
