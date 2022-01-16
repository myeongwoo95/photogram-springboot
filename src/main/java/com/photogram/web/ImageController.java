package com.photogram.web;

import org.hibernate.annotations.SelectBeforeUpdate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ImageController {

    @GetMapping({"/", "/image/story"})
    public String story(){
        return "image/story";
    }

    @GetMapping("/image/explore")
    public String explore(){
        return "image/explore";
    }
}
