package com.photogram.domain.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername (String username);

    @Query(value="SELECT COUNT(*) AS cnt FROM user WHERE username = :username", nativeQuery = true)
    int usernameCheck(String username);

    @Query(value="SELECT COUNT(*) AS cnt FROM user WHERE email = :email", nativeQuery = true)
    int emailCheck(String email);

    @Query(value="SELECT * FROM user WHERE (username LIKE '%:keyword%' OR NAME LIKE '%:keyword%') AND id NOT IN(:principalId)", nativeQuery = true)
    List<User> mGetUsersByKeyword(String keyword, Long principalId);
}
