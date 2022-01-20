package com.photogram.config;

import com.photogram.config.oauth.OAuth2DetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@RequiredArgsConstructor
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    private final OAuth2DetailsService OAuth2DetailsService;

    @Bean
    public BCryptPasswordEncoder encoder() {
        return new BCryptPasswordEncoder();
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable()
            .headers().frameOptions().disable()
            .and()
                .authorizeRequests()
                .antMatchers("/", "/image/**", "/user/**", "/chat/**", "/recommendation/**").authenticated()
                .anyRequest().permitAll()
            .and()
                .formLogin()
                .loginPage("/auth/sign")
                .loginProcessingUrl("/auth/login")
            .defaultSuccessUrl("/")
            .and()
                .logout()
                .logoutSuccessUrl("/auth/sign")
            .and()
                .oauth2Login()
                .userInfoEndpoint()
                .userService(OAuth2DetailsService);
    }

}
