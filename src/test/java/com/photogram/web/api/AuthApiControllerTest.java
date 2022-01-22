package com.photogram.web.api;

import com.photogram.domain.user.User;
import com.photogram.domain.user.UserRepository;
import com.photogram.web.dto.CMRespDto;
import com.photogram.web.dto.auth.SignupRequestDto;
import org.junit.After;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class AuthApiControllerTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @After
    public void cleanup() throws Exception{
        userRepository.deleteAll();
    }

    @Test
    public void 회원가입_BaseTimeEntity_테스트() throws Exception {
        // given
        String username = "walle950616";
        String password = "qwer123456";
        String name = "홍길동";
        String email = "qwer1234@naver.com";
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
//        assertThat(all.get(0).getPassword()).isEqualTo(bCryptPasswordEncoder.encode(password));
        assertThat(all.get(0).getName()).isEqualTo(name);
        assertThat(all.get(0).getEmail()).isEqualTo(email);

        System.out.println("-- BaseTimeEntity 테스트 --");
        System.out.println(all.get(0).getCreateDate());
        System.out.println(all.get(0).getModifiedDate());
    }

}