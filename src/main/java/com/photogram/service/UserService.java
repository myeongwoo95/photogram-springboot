package com.photogram.service;

import com.photogram.domain.user.User;
import com.photogram.domain.user.UserRepository;
import com.photogram.handler.ex.CustomValidationApiException;
import com.photogram.web.dto.user.UserUpdateRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Service
public class UserService {
    private final UserRepository userRepository;

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
}
