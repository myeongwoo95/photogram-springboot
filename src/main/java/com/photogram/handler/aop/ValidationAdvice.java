package com.photogram.handler.aop;

import com.photogram.handler.ex.CustomValidationApiException;
import com.photogram.handler.ex.CustomValidationException;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

import java.util.HashMap;
import java.util.Map;

@Component
@Aspect
public class ValidationAdvice {

    //for API(RestController)
    @Around("execution(* com.photogram.web.api.*Controller.*(..))")
    public Object apiAdvice(ProceedingJoinPoint proceddingJoinPoint) throws Throwable {
        Object[] args = proceddingJoinPoint.getArgs();

        for (Object arg: args) {
            if(arg instanceof BindingResult) {
                BindingResult bindingResult = (BindingResult) arg;
                if(bindingResult.hasErrors()) {
                    Map<String, String> errorMap = new HashMap<>();

                    for(FieldError error: bindingResult.getFieldErrors()) {
                        errorMap.put(error.getField(), error.getDefaultMessage());
                        System.out.println(error.getDefaultMessage());
                    }

                    throw new CustomValidationApiException("유효성 검사 실패하였습니다.", errorMap);
                }
            }
        }
        return proceddingJoinPoint.proceed(); // 이때 핵심로직 메서드가 실행됨
    }

    //for normal Controller
    @Around("execution(* com.photogram.web.*Controller.*(..))")
    public Object advice(ProceedingJoinPoint proceddingJoinPoint) throws Throwable {
        Object[] args = proceddingJoinPoint.getArgs();

        for (Object arg: args) {
            if(arg instanceof BindingResult) {
                BindingResult bindingResult = (BindingResult) arg;
                if(bindingResult.hasErrors()) {
                    Map<String, String> errorMap = new HashMap<>();

                    for(FieldError error: bindingResult.getFieldErrors()) {
                        errorMap.put(error.getField(), error.getDefaultMessage());
                        System.out.println(error.getDefaultMessage());
                    }

                    throw new CustomValidationException("유효성 검사 실패하였습니다.", errorMap);
                }
            }
        }
        return proceddingJoinPoint.proceed();
    }
}
