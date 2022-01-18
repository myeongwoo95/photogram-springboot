package com.photogram.domain.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    @Query(value="SELECT COUNT(*) AS cnt FROM user WHERE username = :username", nativeQuery = true)
    int usernameCheck(String username);

    @Query(value="SELECT COUNT(*) AS cnt FROM user WHERE email = :email", nativeQuery = true)
    int emailCheck(String email);
}
