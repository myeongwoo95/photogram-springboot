package com.photogram.web.dto.user;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UserPasswordUpdateRequestDto {
    String currentPassword;
    String newPasswowrd1;
    String newPasswowrd2;

    @Builder
    public UserPasswordUpdateRequestDto(String currentPassword, String newPasswowrd1, String newPasswowrd2){
        this.currentPassword = currentPassword;
        this.newPasswowrd1 = newPasswowrd1;
        this.newPasswowrd2 = newPasswowrd2;
    }

}
