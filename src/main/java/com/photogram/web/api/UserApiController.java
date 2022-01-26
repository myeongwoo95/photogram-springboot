package com.photogram.web.api;

import com.photogram.config.auth.PrincipalDetails;
import com.photogram.domain.user.User;
import com.photogram.service.UserService;
import com.photogram.web.dto.CMRespDto;
import com.photogram.web.dto.user.UserPasswordUpdateRequestDto;
import com.photogram.web.dto.user.UserUpdateRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
public class UserApiController {

    private final UserService userService;

    @PutMapping("/api/v1/users/{id}")
    public ResponseEntity<?> UpdateUser(@PathVariable Long id, @AuthenticationPrincipal PrincipalDetails principalDetails, @RequestBody UserUpdateRequestDto requestDto) {
        User userEntity = userService.회원정보_수정(id, requestDto);
        principalDetails.setUser(userEntity);
        return new ResponseEntity<>
                (new CMRespDto<>(1, "회원정보수정 성공", userEntity), HttpStatus.OK);
    }

    @PutMapping("/api/v1/users/{id}/attributes/password")
    public ResponseEntity<?> updatePassword(@PathVariable Long id, @AuthenticationPrincipal PrincipalDetails principalDetails, @RequestBody UserPasswordUpdateRequestDto requestDto) {
        User userEntity = userService.회원비밀번호_수정(id, requestDto);
        principalDetails.setUser(userEntity);
        return new ResponseEntity<>
                (new CMRespDto<>(1, "비밀번호 변경 성공", userEntity), HttpStatus.OK);
    }



}
