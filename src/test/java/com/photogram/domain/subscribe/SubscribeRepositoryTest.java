package com.photogram.domain.subscribe;

import com.photogram.domain.user.User;
import com.photogram.domain.user.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DataJpaTest
class SubscribeRepositoryTest {

    @Autowired
    SubscribeRepository subscribeRepository;

    @Autowired
    UserRepository userRepository;

    @BeforeEach
    public void setup(){
        userRepository.save(User.builder()
                .username("testUsername1")
                .password("12341234")
                .name("testName1")
                .email("testEmail1@naver.com")
                .build());

        userRepository.save(User.builder()
                .username("testUsername2")
                .password("12341234")
                .name("testName2")
                .email("testEmail2@naver.com")
                .build());
    }

    @AfterEach
    public void cleanup(){
        userRepository.deleteAll();
        subscribeRepository.deleteAll();
    }

    @Test
    public void mSubscribe() throws Exception {
        // given
        Long fromUserId = 1L;
        Long toUserId = 2L;

        // when
        subscribeRepository.mSubscribe(fromUserId, toUserId);

        // then
        List<Subscribe> all = subscribeRepository.findAll();
        assertThat(all.get(0).getFromuser().getId(), is(fromUserId));
        assertThat(all.get(0).getToUser().getId(), is(toUserId));
    }

    @Test
    public void mUnSubscribe() throws Exception {
        // given
        Long fromUserId = 1L;
        Long toUserId = 2L;

        subscribeRepository.mSubscribe(fromUserId, toUserId);

        // when
        subscribeRepository.mUnSubscribe(fromUserId, toUserId);

        // then
        List<Subscribe> all = subscribeRepository.findAll();
        assertTrue(all.isEmpty());

    }
}