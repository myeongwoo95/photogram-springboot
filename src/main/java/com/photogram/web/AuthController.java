package com.photogram.web;

import com.photogram.domain.user.User;
import com.photogram.service.AuthService;
import com.photogram.web.dto.auth.SigninRequestDto;
import com.photogram.web.dto.auth.SignupRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.validation.Valid;

@RequiredArgsConstructor
@RequestMapping("/auth")
@Controller
public class AuthController {

//    private final AuthService authService;

    @GetMapping("/sign")
    public String auth(){
        return "auth/sign";
    }
//
//    @PostMapping("/auth/signup")
//    public String signup(@Valid SignupRequestDto signupDto, BindingResult bindingResult) {
//        User user = signupDto.toEntity();
//        authService.회원가입(user);
//        return "redirect:/auth/sign";
//    }

}
