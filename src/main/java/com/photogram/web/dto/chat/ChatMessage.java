package com.photogram.web.dto.chat;


import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class ChatMessage {
    private String chatRoomId;
    private String writer;
    private String message;
}
