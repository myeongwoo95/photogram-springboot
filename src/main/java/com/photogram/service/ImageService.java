package com.photogram.service;

import com.photogram.config.auth.PrincipalDetails;
import com.photogram.domain.image.ImageRepository;
import com.photogram.web.dto.image.ImageUploadRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class ImageService {

    private final ImageRepository imageRepository;

    public void 사진_업로드(ImageUploadRequestDto requestDto, PrincipalDetails principalDetails) {
    }


}


