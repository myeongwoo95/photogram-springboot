package com.photogram.service;

import com.photogram.domain.user.User;
import com.photogram.domain.user.UserRepository;
import com.photogram.handler.ex.CustomValidationApiException;
import com.photogram.web.dto.user.UserPasswordUpdateRequestDto;
import com.photogram.web.dto.user.UserUpdateRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Transactional
    public User 회원정보_수정(Long id, UserUpdateRequestDto requestDto) {

        User user =  userRepository.findById(id).orElseThrow(()->{
            return new CustomValidationApiException("존재하지 않는 사용자입니다.");
        });

        return user.update(
                requestDto.getName(),
                requestDto.getUsername(),
                requestDto.getWebsite(),
                requestDto.getBio(),
                requestDto.getEmail(),
                requestDto.getTel(),
                requestDto.getGender()
        );
    }

    @Transactional
    public User 회원비밀번호_수정(Long id, UserPasswordUpdateRequestDto requestDto) {

        User user =  userRepository.findById(id).orElseThrow(()->{
            return new CustomValidationApiException("존재하지 않는 사용자입니다.");
        });

        if(!bCryptPasswordEncoder.matches(requestDto.getCurrentPassword(), user.getPassword())){
            throw new CustomValidationApiException("비밀번호가 일치하지 않습니다.");
        }

        if(!requestDto.getNewPassword1().equals(requestDto.getNewPassword2())){
            throw new CustomValidationApiException("새로운 비밀번호를 다시 한번 확인해주시길 바랍니다.");
        }

        return user.passwordUpdate(bCryptPasswordEncoder.encode(requestDto.getNewPassword1()));

    }
}
