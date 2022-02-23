package com.photogram.service;

import com.photogram.domain.chat.ChatConnect;
import com.photogram.domain.chat.ChatConnectRepository;
import com.photogram.domain.chat.ChatRoom;
import com.photogram.domain.chat.ChatRoomRepository;
import com.photogram.domain.user.User;
import com.photogram.domain.user.UserRepository;
import com.photogram.handler.ex.CustomApiException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Service
public class ChatService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatConnectRepository chatConnectRepository;
    private final UserRepository userRepository;

    @Transactional
    public ChatConnect 채팅방_생성(Long roomOwnerUserId) {

        User userEntity = userRepository.findById(roomOwnerUserId).orElseThrow(()->{
           return new CustomApiException("존재하지 않은 유저입니다");
        });

        ChatRoom chatRoom = new ChatRoom();
        ChatRoom chatRoomEntity = chatRoomRepository.save(chatRoom);

        ChatConnect chatConnect = new ChatConnect();
        chatConnect.setUser(userEntity);
        chatConnect.setChatRoom(chatRoomEntity);

        chatConnectRepository.save(chatConnect);

        return chatConnect;
    }
}
