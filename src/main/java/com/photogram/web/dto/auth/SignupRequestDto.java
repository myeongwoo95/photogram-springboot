package com.photogram.web.dto.auth;

import com.photogram.domain.user.User;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Setter
@Getter
@NoArgsConstructor
public class SignupRequestDto {
    @NotBlank(message = "아이디를 입력해주세요")
    @Size(min = 5, max = 20, message = "아이디는 5자 이상 20자 이하로 입력해주세요.")
    private String username;

    @NotBlank(message = "패스워드를 입력해주세요.")
    @Size(min = 8, max = 20, message = "비밀번호는 8자 이상 20자 이하로 입력해주세요.")
    private String password;

    @NotBlank(message = "이메일을 입력해주세요.")
    @Email(message = "올바른 이메일 주소를 입력해주세요.")
    private String email;

    @NotBlank(message = "성명을 입력해주세요.")
    @Size(min = 1, max = 20, message = "성명은 1자이상 20자 이하로 입력해주세요.")
    private String name;

    @Builder
    public SignupRequestDto(String username, String password, String email, String name){
        this.username = username;
        this.password = password;
        this.email = email;
        this.name = name;
    }

    public User toEntity() {
        return User.builder()
                .username(username)
                .password(password)
                .email(email)
                .name(name)
                .build();
    }

}
