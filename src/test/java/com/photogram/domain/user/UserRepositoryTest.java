package com.photogram.domain.user;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@DataJpaTest
public class UserRepositoryTest{

    @Autowired
    UserRepository userRepository;

    String username = "walle";
    String password = "12341234";
    String name = "홍길동";
    String email = "walle@naver.com";

    @BeforeEach
    public void setup(){
        // given
        userRepository.save(User.builder()
                .username(username)
                .password(password)
                .name(name)
                .email(email)
                .build());
    }

    @Test
    public void 회원정보_불러오기() throws Exception {

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
        // when
        int result = userRepository.usernameCheck(username);

        // then
        assertThat(result).isEqualTo(1);
    }

    @Test
    public void 이메일_중복체크() throws Exception {
        // when
        int result = userRepository.emailCheck(email);

        // then
        assertThat(result).isEqualTo(1);
    }

    @Test
    public void 유저정보_업데이트() throws Exception {
        // given
        String website = "www.test.com";
        String bio = "안녕하세요~ 저는 홍길동입니다";
        String tel = "010-1234-5678";
        String gender = "남성";

        // when
        List<User> userList = userRepository.findAll();
        User user = userList.get(0);
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

    @Test
    public void 유저패스워드_업데이트() throws Exception {
        // given
        String newPasswowrd = "12345678";

        // when
        List<User> userList = userRepository.findAll();
        User user = userList.get(0);
        user.passwordUpdate(newPasswowrd);

        // then
        assertThat(user.getPassword()).isEqualTo(newPasswowrd);
    }


}