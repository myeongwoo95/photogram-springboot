package com.photogram.web.dto.user;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UserUpdateRequestDto {

    private String name;
    private String username;
    private String website;
    private String bio;
    private String email;
    private String tel;
    private String gender;

    @Builder
    public UserUpdateRequestDto(String name, String username, String website, String bio, String email, String tel, String gender){
        this.name = name;
        this.username = username;
        this.website = website;
        this.bio = bio;
        this.email = email;
        this.tel = tel;
        this.gender = gender;
    }

}
