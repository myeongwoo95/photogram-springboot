package com.photogram.web;

import junit.framework.TestCase;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@WebMvcTest(controllers = AuthController.class)
public class AuthControllerTest extends TestCase {

    @Autowired
    private MockMvc mvc;

    @Test
    public void sign페이지가_정상적으로_호출된다() throws Exception{

        mvc.perform(get("/auth/sign"))
                .andExpect(status().isOk());
    }

    @Test
    public void 회원가입_테스트() throws Exception {
        String username = "walle950616";
        String password = "qwer123456";
        String name = "홍길동";
        String email = "qwer1234@naver.com";

        mvc.perform(post("/auth/signup")
                .param("username", username)
                .param("password", password)
                .param("name", name)
                .param("email", email))
                .andExpect(status().isOk());
    }

}