package com.photogram.handler;

import com.photogram.handler.ex.CustomApiException;
import com.photogram.handler.ex.CustomException;
import com.photogram.handler.ex.CustomValidationApiException;
import com.photogram.handler.ex.CustomValidationException;
import com.photogram.util.Script;
import com.photogram.web.dto.CMRespDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;

@RestController
@ControllerAdvice
public class ControllerExceptionHandler {
	 @ExceptionHandler(CustomException.class)
	 public String customException(CustomException e) {
		 return Script.back(e.getMessage());
	 }
	 
	 @ExceptionHandler(CustomApiException.class)
	 public ResponseEntity<?> apiException(CustomApiException e) {
		 return new ResponseEntity<>(new CMRespDto<>(-1, e.getMessage(), null), HttpStatus.BAD_REQUEST);
	 }
	
	 @ExceptionHandler(CustomValidationException.class)
	 public String validationException(CustomValidationException e) {
		 if(e.getErrorMap() == null) {
			 return Script.back(e.getMessage());
		 }else {
			 return Script.back(e.getErrorMap().toString());
		 }
	 }
	 
	 @ExceptionHandler(CustomValidationApiException.class)
	 public ResponseEntity<?> validationApiException(CustomValidationApiException e) {
		 return new ResponseEntity<>(new CMRespDto<>(-1, e.getMessage(), e.getErrorMap()), HttpStatus.BAD_REQUEST);
	 }
	 
}
