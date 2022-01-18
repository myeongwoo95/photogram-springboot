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

@Controller
public class AuthController {

    @GetMapping("/auth/sign")
    public String auth(){
        return "auth/sign";
    }

}
