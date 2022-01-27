package com.photogram.web.dto.image;

import com.photogram.domain.image.ImageProfile;
import com.photogram.domain.user.User;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class ImageProfileUploadRequestDto {

    private MultipartFile file;

    public ImageProfile toEntity(String imageProfileUrl, User user) {
        return ImageProfile.builder()
                .imageProfileUrl(imageProfileUrl)
                .user(user)
                .build();
    }
}
