package com.photogram.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Value("${file.path.profile}")
    private String uploadFolder;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        WebMvcConfigurer.super.addResourceHandlers(registry);

        // 개발 시점에 사용 가능한 코드
        registry
            .addResourceHandler("/upload/**") // url 패턴 : /upload/파일명 -> 낚아챔
            .addResourceLocations("file:///"+uploadFolder) // 실제 물리적인 경로
            .setCachePeriod(60*10*6) //1시간
            .resourceChain(true)
            .addResolver(new PathResourceResolver());


//        registry
//            .addResourceHandler("/resources/**")
//            .addResourceLocations("/resources/");

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
