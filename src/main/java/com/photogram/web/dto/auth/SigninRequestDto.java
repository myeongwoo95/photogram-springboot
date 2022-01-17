package com.photogram.web.dto.auth;

import lombok.Data;

@Data
public class SigninRequestDto {
    private String username;
    private String password;
}
