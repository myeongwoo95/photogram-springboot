package com.photogram.web.api;

import com.photogram.domain.user.User;
import com.photogram.domain.user.UserRepository;
import com.photogram.web.dto.CMRespDto;
import com.photogram.web.dto.auth.SignupRequestDto;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class AuthApiControllerTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    private MockMvc mvc;

    @BeforeEach
    public void setup() {
        mvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();
    }

    @AfterEach
    public void cleanup() throws Exception{
        userRepository.deleteAll();
    }

    @Test
    @DisplayName("회원가입 테스트")
    public void signup() throws Exception {
        // given
        String username = "testUserName";
        String password = "testPassword";
        String name = "testName";
        String email = "testEmail@naver.com";
        SignupRequestDto requestDto = SignupRequestDto.builder()
                .username(username)
                .password(password)
                .name(name)
                .email(email)
                .build();

        String url = "http://localhost:" + port + "/auth/signup";

        // when
        ResponseEntity<CMRespDto> responseEntity = restTemplate.postForEntity(url, requestDto, CMRespDto.class);

        // then
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody().getCode()).isEqualTo(1);

        List<User> all = userRepository.findAll();
        assertThat(all.get(0).getUsername()).isEqualTo(username);
        assertThat(all.get(0).getName()).isEqualTo(name);
        assertThat(all.get(0).getEmail()).isEqualTo(email);
        assertThat(all.get(0).getCreateDate()).isNotNull();
        assertThat(all.get(0).getModifiedDate()).isNotNull();

    }

}