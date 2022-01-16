package com.photogram.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        WebMvcConfigurer.super.addResourceHandlers(registry);

        // 개발 시점에 사용 가능한 코드
        registry
            .addResourceHandler("/resources/**")
            .addResourceLocations("/resources/");

        // 배포 시점에 사용 가능한 코드
        /*
        registry
      	 .addResourceHandler("/files/**")
      	 .addResourceLocations("file:/opt/files/");

         // 윈도우라면
         .addResourceLocations(“file:///C:/opt/files/“);
        */

    }
}
