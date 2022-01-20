package com.photogram.domain.user;

import lombok.*;
import javax.persistence.*;

@Getter
@NoArgsConstructor
@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 50, unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String name;

    @Column
    private String website;

    @Column
    private String bio;

    @Column(length = 320, unique = true, nullable = false)
    private String email;

    @Column(length = 15)
    private String tel;

    @Column(length = 10)
    private String gender;

    @Column
    private String profileImageUrl;

    @Column
    private String role;

    @Builder
    public User(
            String username, String password, String name,
            String website,String bio, String email, String tel,
            String gender, String profileImageUrl, String role){

        this.username = username;
        this.password = password;
        this.name = name;
        this.website = website;
        this.bio = bio;
        this.email = email;
        this.tel = tel;
        this.gender = gender;
        this.profileImageUrl = profileImageUrl;
        this.role = role;
    }

    public void updateEncodedPassword(String password) {
        this.password = password;
    }

    public void updateRole(String role){
        this.role = role;
    }
}
