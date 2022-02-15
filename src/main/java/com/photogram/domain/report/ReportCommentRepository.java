package com.photogram.domain.report;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface ReportCommentRepository extends JpaRepository<ReportComment, Long> {

    ReportComment findByCommentId(Long commentId);

    @Modifying
    @Query(value = "delete from ReportComment where commentId = :commentId", nativeQuery = true)
    int deleteAllByCommentId(Long commentId);

    @Query(value = "SELECT COUNT(*) FROM reportcomment WHERE commentId = :commentId AND userId = :userId", nativeQuery = true)
    int mDuplicateCheck(Long commentId, Long userId);
}
