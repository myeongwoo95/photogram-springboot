package com.photogram.domain.user;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest
public class UserRepositoryTest{

    @Autowired
    UserRepository userRepository;

//    @After
//    public void cleanup(){
//        userRepository.deleteAll();
//    }

    @Test
    public void 회원정보_불러오기() throws Exception {
        // given
        String username = "walle950616";
        String password = "qwer123456";
        String name = "홍길동";
        String email = "qwer1234@naver.com";

        userRepository.save(User.builder()
                .username(username)
                .password(password)
                .name(name)
                .email(email)
                .build());

        // when
        List<User> userList = userRepository.findAll();

        // then
        User user = userList.get(0);
        assertThat(user.getUsername()).isEqualTo(username);
        assertThat(user.getPassword()).isEqualTo(password);
        assertThat(user.getName()).isEqualTo(name);
        assertThat(user.getEmail()).isEqualTo(email);
    }

    @Test
    public void 아이디_중복체크() throws Exception {
        // given
        String username = "walle";
        String password = "12341234";
        String name = "홍길동";
        String email = "walle@naver.com";

        // when
        userRepository.save(User.builder()
                .username(username)
                .password(password)
                .name(name)
                .email(email)
                .build());

        // then
        int result = userRepository.usernameCheck(username);
        assertThat(result).isEqualTo(1);
    }

    @Test
    public void 이메일_중복체크() throws Exception {
        // given
        String username = "walle";
        String password = "12341234";
        String name = "홍길동";
        String email = "walle@naver.com";

        // when
        userRepository.save(User.builder()
                .username(username)
                .password(password)
                .name(name)
                .email(email)
                .build());

        // then
        int result = userRepository.emailCheck(email);
        assertThat(result).isEqualTo(1);
    }

    @Test
    public void 유저정보_업데이트() throws Exception {
        // given
        String name = "홍길동";
        String username = "walle";
        String website = "www.test.com";
        String bio = "안녕하세요~ 저는 홍길동입니다";
        String email = "walle@naver.com";
        String tel = "010-1234-5678";
        String gender = "남성";

        User user = userRepository.save(User.builder()
                .username(username)
                .password("1234")
                .name("존시나")
                .email("testemail@naver.com")
                .build());

        // when
        user.update(name, username, website, bio, email, tel, gender);

        // then
        assertThat(user.getName()).isEqualTo(name);
        assertThat(user.getUsername()).isEqualTo(username);
        assertThat(user.getWebsite()).isEqualTo(website);
        assertThat(user.getBio()).isEqualTo(bio);
        assertThat(user.getEmail()).isEqualTo(email);
        assertThat(user.getTel()).isEqualTo(tel);
        assertThat(user.getGender()).isEqualTo(gender);
    }

}