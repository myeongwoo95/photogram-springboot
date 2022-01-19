package com.photogram.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ChatController {
    @GetMapping("/chat/chatting")
    public String chatting(){
        return "chat/chatting";
    }
}
