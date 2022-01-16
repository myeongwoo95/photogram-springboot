package com.photogram.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@EnableWebSecurity
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        //super.configure(auth);
        /* 이거 때문에 기본 도메인 접속 시 요청을 가로채서 로그인 페이지로 리다이렉션 하는거
         *  super 삭제 - 기존 시큐리티가 가지고 있는 기능이 다 비활성화 됨
         */

        http.csrf().disable(); // csrf 비활성화

        http.authorizeRequests()
            .antMatchers().authenticated() // 인증이 필요하고, 권한이 없으면 loginPage("/auth/signin")로 돌림
            .anyRequest().permitAll() // 그외 모든 요청은 허용하겠다.
            .and()
            .formLogin() // 로그인 페이지와 로그인 성공 및 실패 처리등을 사용하겠다는 의미, formLogin은 form안의 input 태그들로 로그인하는것
            .loginPage("/auth/sign") //사용자가 따로 만든 로그인 페이지를 사용하려고 할때 설정
            .loginProcessingUrl("/auth/signin") //(post) 사용자 이름과 암호를 제출할 URL , 스프링 시큐리티가 이 주소로 요청이 들어오면 (UserDetailsService가) 낚아채서 로그인 프로세스 진행
            .defaultSuccessUrl("/"); // 정상적으로 인증성공 했을 경우 이동하는 페이지를 설정


    }
}
