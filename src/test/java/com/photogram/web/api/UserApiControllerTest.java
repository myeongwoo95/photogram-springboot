package com.photogram.web.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.photogram.domain.user.User;
import com.photogram.domain.user.UserRepository;
import com.photogram.web.dto.user.UserUpdateRequestDto;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class UserApiControllerTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private UserRepository userRepository;

    private MockMvc mvc;

    @BeforeEach
    public void setup() {
        mvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();

        userRepository.save(User.builder()
                .name("BeforetName")
                .username("BeforeUsername")
                .password("BeforePassword")
                .email("BeforeEmail@naver.com")
                .build());
    }

    @AfterEach
    public void cleanup() throws Exception{
        userRepository.deleteAll();
    }

    @Test
    @WithMockUser
    @DisplayName("회원정보 수정")
    public void UpdateUser() throws Exception {
        // given
        String name = "홍길동";
        String username = "walle";
        String website = "www.walle.com";
        String bio = "안녕하세요";
        String email = "qwer1234@aver.com";
        String tel ="010-1234-5678";
        String gender = "남";

        UserUpdateRequestDto requestDto = UserUpdateRequestDto.builder()
                .name(name)
                .username(username)
                .website(website)
                .bio(bio)
                .email(email)
                .tel(tel)
                .gender(gender)
                .build();

        String url = "http://localhost:" + port + "/api/v1/users/" + 1L;

        // when
        mvc.perform(put(url)
                        .contentType(MediaType.APPLICATION_JSON_UTF8)
                        .content(new ObjectMapper().writeValueAsString(requestDto)))
                .andExpect(status().isOk())
                .andDo(print());

        // then
        List<User> all = userRepository.findAll();
        assertThat(all.get(0).getName()).isEqualTo(name);
        assertThat(all.get(0).getUsername()).isEqualTo(username);
        assertThat(all.get(0).getWebsite()).isEqualTo(website);
        assertThat(all.get(0).getBio()).isEqualTo(bio);
        assertThat(all.get(0).getEmail()).isEqualTo(email);
        assertThat(all.get(0).getTel()).isEqualTo(tel);
        assertThat(all.get(0).getGender()).isEqualTo(gender);
    }

    @Test
    @DisplayName("회원비밀번호 수정")
    @WithMockUser(roles="USER")
    public void updatePassword() throws Exception {

    }

}