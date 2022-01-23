package com.photogram.web;

import com.photogram.config.auth.PrincipalDetails;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class UserController {

    @GetMapping("/user/collection")
    public String collection(){
        return "user/collection";
    }

    @GetMapping("/user/mypage")
    public String mypage(@AuthenticationPrincipal PrincipalDetails principalDetails, Model model){

        model.addAttribute("user", principalDetails.getUser());
        model.addAttribute("usersname", principalDetails.getUser().getName());
        return "user/mypage";
    }

    @GetMapping("/user/update")
    public String update(@AuthenticationPrincipal PrincipalDetails principalDetails, Model model){

        model.addAttribute("user", principalDetails.getUser());
        model.addAttribute("usersname", principalDetails.getUser().getName());
        return "user/update";
    }
}
