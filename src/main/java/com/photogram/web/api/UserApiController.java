package com.photogram.web.api;

import com.photogram.config.auth.PrincipalDetails;
import com.photogram.domain.user.User;
import com.photogram.service.SubscribeService;
import com.photogram.service.UserService;
import com.photogram.web.dto.CMRespDto;
import com.photogram.web.dto.user.UserPasswordUpdateRequestDto;
import com.photogram.web.dto.subscribe.subscribeResponseDto;
import com.photogram.web.dto.user.UserUpdateRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RequiredArgsConstructor
@RestController
public class UserApiController {

    private final UserService userService;
    private final SubscribeService subscribeService;

    @GetMapping("/api/v1/users/keyword/{keyword}")
    public ResponseEntity<?> getUsersByKeyword(@PathVariable String keyword, @AuthenticationPrincipal PrincipalDetails principalDetails) {
        List<User> users = userService.유저검색(keyword, principalDetails.getUser().getId());
        return new ResponseEntity<>
                (new CMRespDto<>(1, "검색 ajax 성공", users), HttpStatus.OK);
    }

    @GetMapping("/api/v1/users/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id, @AuthenticationPrincipal PrincipalDetails principalDetails) {
        User userEntity = userService.유저정보(id);
        return new ResponseEntity<>
                (new CMRespDto<>(1, "유저정보 가져오기 성공", userEntity), HttpStatus.OK);
    }

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

    @PutMapping("/api/v1/users/{id}/attributes/image")
    public ResponseEntity<?> imageProfileUpload(@PathVariable Long id, MultipartFile profileImageFile, @AuthenticationPrincipal PrincipalDetails principalDetails) {
        User userEntity = userService.회원프로필사진_업로드(id, profileImageFile);
        principalDetails.setUser(userEntity);
        return new ResponseEntity<>(new CMRespDto<>(1, "프로필사진변경 성공", null), HttpStatus.OK);
    }

    @GetMapping("/api/v1/users/{pageUserId}/subscribes")
    public ResponseEntity<?> subscribeList(@PathVariable Long pageUserId, @AuthenticationPrincipal PrincipalDetails principalDetails){
        List<subscribeResponseDto> subscribeDto = subscribeService.구독리스트(principalDetails.getUser().getId(), pageUserId);
        return new ResponseEntity<>(new CMRespDto<>(1, "구독자 리스트 가져오기 성공", subscribeDto), HttpStatus.OK);
    }

    @GetMapping("/api/v1/users/{pageUserId}/followers")
    public ResponseEntity<?> followerList(@PathVariable Long pageUserId, @AuthenticationPrincipal PrincipalDetails principalDetails){
        List<subscribeResponseDto> subscribeDto = subscribeService.팔로워리스트(principalDetails.getUser().getId(), pageUserId);
        return new ResponseEntity<>(new CMRespDto<>(1, "팔로워 리스트 가져오기 성공", subscribeDto), HttpStatus.OK);
    }

}
