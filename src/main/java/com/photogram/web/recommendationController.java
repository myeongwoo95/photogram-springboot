package com.photogram.web;

import com.photogram.config.auth.PrincipalDetails;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class recommendationController {
    @GetMapping("/recommendation/friends")
    public String auth(@AuthenticationPrincipal PrincipalDetails principalDetails, Model model){

        model.addAttribute("user", principalDetails.getUser());
        model.addAttribute("usersname", principalDetails.getUser().getName());
        return "recommendation/friends";
    }
}
