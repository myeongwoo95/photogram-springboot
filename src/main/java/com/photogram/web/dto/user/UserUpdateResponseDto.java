package com.photogram.web.dto.user;

import com.photogram.domain.user.User;
import lombok.Getter;

@Getter
public class UserUpdateResponseDto {
    private String username;
    private String website;
    private String bio;
    private String email;
    private String tel;
    private String gender;

    public UserUpdateResponseDto(User entity) {
        this.username= entity.getUsername();
        this.website = entity.getWebsite();
        this.bio = entity.getBio();
        this.email = entity.getEmail();
        this.tel = entity.getTel();
        this.gender = entity.getGender();
    }
}
