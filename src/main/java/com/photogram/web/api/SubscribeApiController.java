package com.photogram.web.api;

import com.photogram.config.auth.PrincipalDetails;
import com.photogram.service.SubscribeService;
import com.photogram.web.dto.CMRespDto;
import com.photogram.web.dto.subscribe.SubscribeFriendsResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
public class SubscribeApiController {
    private final SubscribeService subscribeService;

    @GetMapping("/api/v1/subscribe/{toUserId}")
    public ResponseEntity<?> getFriendsList(@AuthenticationPrincipal PrincipalDetails principalDetails, @PathVariable Long toUserId){
        List<SubscribeFriendsResponseDto> list = subscribeService.친구리스트_불러오기(principalDetails.getUser().getId());
        return new ResponseEntity<>(new CMRespDto<>(1, "친구리스트_불러오기 성공", list), HttpStatus.OK);
    }

    // 구독
    @PostMapping("/api/v1/subscribe/{toUserId}")
    public ResponseEntity<?> subscribe(@AuthenticationPrincipal PrincipalDetails principalDetails, @PathVariable Long toUserId){
        subscribeService.구독하기(principalDetails.getUser().getId(), toUserId);
        return new ResponseEntity<>(new CMRespDto<>(1, "구독하기 성공", null), HttpStatus.OK);
    }

    // 구독취소
    @DeleteMapping("/api/v1/unsubscribe/{toUserId}")
    public ResponseEntity<?> unSubscribe(@AuthenticationPrincipal PrincipalDetails principalDetails, @PathVariable Long toUserId){
        subscribeService.구독취소하기(principalDetails.getUser().getId(), toUserId);
        return new ResponseEntity<>(new CMRespDto<>(1, "구독취소하기 성공", null), HttpStatus.OK);
    }

}
