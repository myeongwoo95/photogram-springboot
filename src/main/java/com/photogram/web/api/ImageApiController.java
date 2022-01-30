package com.photogram.web.api;

import com.photogram.config.auth.PrincipalDetails;
import com.photogram.handler.ex.CustomValidationException;
import com.photogram.service.ImageService;
import com.photogram.web.dto.CMRespDto;
import com.photogram.web.dto.image.ImageUploadRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
public class ImageApiController {

    private final ImageService imageService;

    @PostMapping("/api/v1/images")
    public ResponseEntity<?> imageUpload(ImageUploadRequestDto requestDto, @AuthenticationPrincipal PrincipalDetails principalDetails) {

        if(requestDto.getFiles().isEmpty()) {
            throw new CustomValidationException("이미지가 첨부되지 않았습니다.", null);
        }

        imageService.이미지_업로드(requestDto, principalDetails);
        return new ResponseEntity<>(new CMRespDto<>(1, "이미지 업로드 성공", null), HttpStatus.OK);
    }



}
