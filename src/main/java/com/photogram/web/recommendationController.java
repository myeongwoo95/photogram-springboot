package com.photogram.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class recommendationController {
    @GetMapping("/recommendation/friends")
    public String auth(){
        return "recommendation/friends";
    }
}
