package com.photogram.web.dto.image;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.Size;
import java.util.List;

@Data
public class ImageUploadRequestDto {

    private List<MultipartFile> file;

    @Size(max = 300, message = "사진 설명을 300자 이하로 입력해주세요.")
    private String description;

    @Size(max = 50, message = "사진 설명을 50자 이하로 입력해주세요.")
    private String caption;

//    public Image toEntity(String postImageUrl, User user) {
//        return Image.builder()
//                .caption(caption)
//                .postImageUrl(postImageUrl)
//                .user(user)
//                .build();
//    }
}