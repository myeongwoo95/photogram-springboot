package com.photogram.web.dto.auth;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class SigninRequestDto {
    private String username;
    private String password;
}
