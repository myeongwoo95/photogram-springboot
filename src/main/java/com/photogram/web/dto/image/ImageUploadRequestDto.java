package com.photogram.web.dto.image;

import com.photogram.domain.image.Image;
import com.photogram.domain.user.User;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.Size;
import java.util.List;

@Data
public class ImageUploadRequestDto {

    private List<MultipartFile> files;

    @Size(max = 140, message = "사진 설명을 140자 이하로 입력해주세요.")
    private String description;

    @Size(max = 30, message = "사진 대체용 설명을 30자 이하로 입력해주세요.")
    private String caption;

    @Size(max = 50, message = "위치 설명을 50자 이하로 입력해주세요.")
    private String location;

    private String isCommentActive;

    public Image toEntity(User user) {
        return Image.builder()
                .description(description)
                .caption(caption)
                .location(location)
                .user(user)
                .isCommentActive(isCommentActive)
                .build();
    }
}