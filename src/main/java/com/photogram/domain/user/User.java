package com.photogram.domain.user;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.photogram.domain.BaseTimeEntity;
import com.photogram.domain.image.Image;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.List;

@Getter
@NoArgsConstructor
@Entity
public class User extends BaseTimeEntity {

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

    @JsonIgnoreProperties({"user"})
    @OneToMany(mappedBy = "user" , fetch = FetchType.LAZY) // 여기서 user는 클래스타입이 아닌 변수
    private List<Image> images;

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

    public User update(String name, String username, String website, String bio, String email, String tel, String gender){
        this.name = name;
        this.username = username;
        this.website = website;
        this.bio = bio;
        this.email = email;
        this.tel= tel;
        this.gender= gender;

        return this;
    }

    public User passwordUpdate(String password){
        this.password = password;
        return this;
    }

    public User updateProfileImageUrl(String profileImageUrl){
        this.profileImageUrl = profileImageUrl;
        return this;
    }
}
