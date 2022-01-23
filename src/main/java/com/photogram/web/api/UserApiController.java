package com.photogram.web.api;

import com.photogram.config.auth.PrincipalDetails;
import com.photogram.domain.user.User;
import com.photogram.service.UserService;
import com.photogram.web.dto.CMRespDto;
import com.photogram.web.dto.user.UserUpdateRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
public class UserApiController {

    private final UserService userService;

    @PutMapping("/api/v1/users/{id}")
    public ResponseEntity<?> signup(@PathVariable Long id, @AuthenticationPrincipal PrincipalDetails principalDetails, @RequestBody UserUpdateRequestDto requestDto) {
        User user = userService.회원정보_수정(id, requestDto);
        principalDetails.setUser(user);
        return new ResponseEntity<>
                (new CMRespDto<>(1, "회원정보수정 성공", user), HttpStatus.OK);
    }


}
