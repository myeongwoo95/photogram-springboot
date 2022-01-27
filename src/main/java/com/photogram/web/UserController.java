package com.photogram.web;

import com.photogram.config.auth.PrincipalDetails;
import com.photogram.handler.ex.CustomException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class UserController {

    @GetMapping("/user/{id}/collection")
    public String collection(@AuthenticationPrincipal PrincipalDetails principalDetails, Model model){

        model.addAttribute("user", principalDetails.getUser());
        model.addAttribute("usersname", principalDetails.getUser().getName());
        return "user/collection";
    }

    @GetMapping("/user/{id}/profile")
    public String mypageProfile(@AuthenticationPrincipal PrincipalDetails principalDetails, Model model){

        model.addAttribute("user", principalDetails.getUser());
        model.addAttribute("usersname", principalDetails.getUser().getName());
        return "user/mypage";
    }

    @GetMapping("/user/{id}/bookmark")
    public String mypageBookmark(@AuthenticationPrincipal PrincipalDetails principalDetails, Model model){

        model.addAttribute("user", principalDetails.getUser());
        model.addAttribute("usersname", principalDetails.getUser().getName());
        return "user/mypage";
    }

    @GetMapping("/user/{id}/update")
    public String update(@PathVariable Long id, @AuthenticationPrincipal PrincipalDetails principalDetails, Model model){

        if(id != principalDetails.getUser().getId()){
            throw new CustomException("잘못된 접근입니다");
        }

        model.addAttribute("user", principalDetails.getUser());
        model.addAttribute("usersname", principalDetails.getUser().getName());
        return "user/update";
    }
}
