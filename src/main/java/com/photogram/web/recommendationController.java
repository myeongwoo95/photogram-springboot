package com.photogram.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/recommendation")
public class recommendationController {

    @GetMapping("/friends")
    public String auth(){
        return "recommendation/friends";
    }
}
