package com.photogram.web;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.test.context.junit4.SpringRunner;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class ControllersTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    public void sign페이지_로딩() throws Exception {
        // when
        String body = this.restTemplate.getForObject("/auth/sign", String.class);

        // then
        assertThat(body).contains("Google 로그인");
    }
}
