package com.photogram.web.api;

import com.photogram.domain.user.User;
import com.photogram.domain.user.UserRepository;
import com.photogram.web.dto.CMRespDto;
import com.photogram.web.dto.user.UserUpdateRequestDto;
import org.junit.After;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.*;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class UserApiControllerTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private UserRepository userRepository;

    @After
    public void cleanup() throws Exception{
        userRepository.deleteAll();
    }

    @Test
    public void Users_수정된다() throws Exception {
        // given
        String name = "홍길동";
        String username = "walle";
        String website = "www.walle.com";
        String bio = "안녕하세요";
        String email = "qwer1234@aver.com";
        String tel ="010-1234-5678";
        String gender = "남";

        User user = userRepository.save(User.builder()
                .name("hong")
                .username(username)
                .password("12341234")
                .email("walle@naver.com")
                .build());

        UserUpdateRequestDto requestDto = UserUpdateRequestDto.builder()
                .name(name)
                .username(username)
                .website(website)
                .bio(bio)
                .email(email)
                .tel(tel)
                .gender(gender)
                .build();

        String url = "http://localhost:" + port + "/api/v1/users/" + user.getId();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<UserUpdateRequestDto> entity = new HttpEntity(requestDto, headers);

        // when
        ResponseEntity<CMRespDto> responseEntity = restTemplate.exchange(url, HttpMethod.PUT, entity, CMRespDto.class);

        // then
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody().getCode()).isEqualTo(1);

        List<User> all = userRepository.findAll();
        assertThat(all.get(0).getName()).isEqualTo(name);

    }

}