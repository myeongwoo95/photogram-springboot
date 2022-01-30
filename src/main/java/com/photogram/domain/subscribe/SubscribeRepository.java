package com.photogram.domain.subscribe;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface SubscribeRepository  extends JpaRepository<Subscribe, Long> {
    // 구독
    @Modifying
    @Query(
            value = "INSERT INTO subscribe(fromUserId, toUserId, createDate) VALUES(:fromUserId, :toUserId, now())",
            nativeQuery = true)
    void mSubscribe(Long fromUserId, Long toUserId);

    // 구독취소
    @Modifying
    @Query(
            value = "DELETE FROM subscribe WHERE fromUserId = :fromUserId AND toUserId = :toUserId",
            nativeQuery = true)
    void mUnSubscribe(Long fromUserId, Long toUserId);

    // 구독여부 (로그인한 유저가 페이지 유저를 팔로잉 했는가?
    @Query(value = "SELECT COUNT(*) FROM subscribe WHERE fromUserId = :principalId AND toUserId = :pageUserId", nativeQuery = true)
    int mSubscribeState(Long principalId, Long pageUserId);

    // 페이지 유저의 팔로우 숫자
    @Query(value = "SELECT COUNT(*) FROM subscribe WHERE fromUserId = :pageUserId", nativeQuery = true)
    int mSubscribeCount(Long pageUserId);

    // 페이지 유저의 팔로워 숫자
    @Query(value = "SELECT COUNT(*) FROM subscribe WHERE toUserId = :pageUserId", nativeQuery = true)
    int mSubscribeFollowerCount(Long pageUserId);

}
