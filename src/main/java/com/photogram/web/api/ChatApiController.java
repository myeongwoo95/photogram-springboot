package com.photogram.web.api;

import com.photogram.config.auth.PrincipalDetails;
import com.photogram.domain.chat.ChatConnect;
import com.photogram.service.ChatService;
import com.photogram.web.dto.CMRespDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
public class ChatApiController {

    private final ChatService chatService;

    @PostMapping("/api/v1/chat")
    public ResponseEntity<?> commentReport(@AuthenticationPrincipal PrincipalDetails principalDetails){
        ChatConnect chatConnectEntity = chatService.채팅방_생성(principalDetails.getUser().getId());
        return new ResponseEntity<>(new CMRespDto<>(1, "채팅방 생성 성공", chatConnectEntity), HttpStatus.OK);
    }
}
