package com.photogram.service;

import com.photogram.domain.user.User;
import com.photogram.domain.user.UserRepository;
import com.photogram.web.dto.subscribe.subscribeResponseDto;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class SubscribeServiceTest {

    @Autowired
    UserRepository userRepository;

    @Autowired
    SubscribeService subscribeService;

    @BeforeEach
    public void setup(){
        userRepository.save(User.builder()
                .username("walle")
                .password("12341234")
                .name("홍길동")
                .email("hong@naver.com")
                .build());

        userRepository.save(User.builder()
                .username("dog")
                .password("12341234")
                .name("아무개")
                .email("dog@naver.com")
                .build());
    }

    @AfterEach
    public void cleanup(){
        userRepository.deleteAll();
    }

    @Test
    public void 팔로워리스트_불러오기() throws Exception {
        // given
        subscribeService.구독하기(1L, 2L);

        // when
        List<subscribeResponseDto> all = subscribeService.팔로워리스트(1L, 2L);

        // then
        assertThat(all.get(0).getName()).isEqualTo("홍길동");
    }

    @Test
    public void 구독리스트_불러오기() throws Exception {
        // given


        // when

        // then
    }


}