package com.photogram.service;

import com.photogram.domain.user.User;
import com.photogram.domain.user.UserRepository;
import com.photogram.handler.ex.CustomApiException;
import com.photogram.web.dto.auth.SignupRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.Query;

@RequiredArgsConstructor
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Transactional
    public void 회원가입(SignupRequestDto requestDto) {
        if(1 <= 아이디_중복체크(requestDto)) {
            throw new CustomApiException("이미 존재하는 아이디 입니다");
        }

        if(1 <= 이메일_중복체크(requestDto)) {
            throw new CustomApiException("이미 존재하는 이메일 입니다");
        }

        User user = requestDto.toEntity();

        String rawPassword = user.getPassword();
        String encPassword = bCryptPasswordEncoder.encode(rawPassword);
        user.updateEncodedPassword(encPassword);
        user.updateRole("ROLE_USER");
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public int 아이디_중복체크(SignupRequestDto requestDto) {
        return userRepository.usernameCheck(requestDto.getUsername());
    }

    @Transactional(readOnly = true)
    public int 이메일_중복체크(SignupRequestDto requestDto) {
        return userRepository.emailCheck(requestDto.getEmail());
    }
}
