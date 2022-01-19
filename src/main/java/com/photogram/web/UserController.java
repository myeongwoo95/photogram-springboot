package com.photogram.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class UserController {

    @GetMapping("/user/collection")
    public String collection(){
        return "user/collection";
    }

    @GetMapping("/user/mypage")
    public String mypage(){
        return "user/mypage";
    }

    @GetMapping("/user/update")
    public String update(){
        return "user/update";
    }
}
