package com.photogram.web.api;

import com.photogram.service.AuthService;
import com.photogram.web.dto.CMRespDto;
import com.photogram.web.dto.auth.SignupRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RequiredArgsConstructor
@RestController
public class AuthApiController {
    private final AuthService authService;

    @PostMapping("/auth/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequestDto requestDto, BindingResult bindingResult) {
        authService.회원가입(requestDto);
        return new ResponseEntity<>
                (new CMRespDto<>(1, "회원가입 성공", null), HttpStatus.OK);
    }
}
