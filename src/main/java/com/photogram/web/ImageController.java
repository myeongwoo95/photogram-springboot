package com.photogram.web;

import com.photogram.config.auth.PrincipalDetails;
import com.photogram.service.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@RequiredArgsConstructor
@Controller
public class ImageController {

    private final ImageService imageService;

    @GetMapping({"/", "/image/story"})
    public String story(@AuthenticationPrincipal PrincipalDetails principalDetails, Model model){

        model.addAttribute("user", principalDetails.getUser());
        model.addAttribute("usersname", principalDetails.getUser().getName());
        return "image/story";
    }

    @GetMapping("/image/explore")
    public String explore(@AuthenticationPrincipal PrincipalDetails principalDetails, Model model){

        model.addAttribute("user", principalDetails.getUser());
        model.addAttribute("usersname", principalDetails.getUser().getName());
        return "image/explore";
    }

}

