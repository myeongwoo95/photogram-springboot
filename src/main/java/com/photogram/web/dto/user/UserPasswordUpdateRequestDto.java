package com.photogram.web.dto.user;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UserPasswordUpdateRequestDto {
    private String currentPassword;
    private String newPassword1;
    private String newPassword2;

    @Builder
    public UserPasswordUpdateRequestDto(String currentPassword, String newPassword1, String newPassword2){
        this.currentPassword = currentPassword;
        this.newPassword1 = newPassword1;
        this.newPassword2 = newPassword2;
    }

}
