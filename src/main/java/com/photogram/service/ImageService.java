package com.photogram.service;

import com.photogram.config.auth.PrincipalDetails;
import com.photogram.domain.file.File;
import com.photogram.domain.file.FileRepository;
import com.photogram.domain.image.Image;
import com.photogram.domain.image.ImageRepository;
import com.photogram.handler.ex.CustomApiException;
import com.photogram.web.dto.image.ImageUploadRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class ImageService {

    private final ImageRepository imageRepository;
    private final FileRepository fileRepository;

    @Value("${file.path.image}")
    private String uploadFolder;

    @Transactional(readOnly = true)
    public List<Image> 인기사진(Pageable pageable) {
        List<Image> images = imageRepository.mPopular(pageable);

        images.forEach(image -> {
            image.setLikeCount(image.getLikes().size()); // like count
        });

        return images;
    }

    @Transactional
    public void 이미지_업로드(ImageUploadRequestDto requestDto, PrincipalDetails principalDetails) {

        // image 테이블에 저장 후
        Image image = requestDto.toEntity(principalDetails.getUser());
        Image imageEntity = imageRepository.save(image);

        List<File> files = new ArrayList<>();

        for(MultipartFile file : requestDto.getFiles()){
            UUID uuid = UUID.randomUUID();
            String FileName = uuid + "_" + file.getOriginalFilename();
            String type = file.getContentType();

            Path imageFilePath = Paths.get(uploadFolder + FileName);

            try {
                Files.write(imageFilePath, file.getBytes());
                File item = fileRepository.save(File.builder()
                        .fileUrl(FileName)
                        .image(imageEntity)
                        .type(type)
                        .build());
                files.add(item);

            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        imageEntity.updateFiles(files);
    }

    @Transactional(readOnly = true)
    public List<Image> 이미지스토리(Long principalId, Pageable pageable) {
        List<Image> images = imageRepository.mStory(principalId, pageable);

        images.forEach(image -> {

            image.setLikeCount(image.getLikes().size()); // like count

            image.getLikes().forEach(like ->{  // 해당 이미지에 좋아요한 사람들을 모두 찾아서
                if(like.getUser().getId() == principalId) {  // 현재 로그인한 유저가 이 이미지를 좋아요를 했는지 안했는지 찾는것
                    image.setLikeState(true);
                }
            });

        });

        return images;
    }

    @Transactional(readOnly = true)
    public Image 이미지(Long imageId, Long principalId) {
        Image image = imageRepository.findById(imageId).orElseThrow(()->{
            return new CustomApiException("존재하지 않는 이미지입니다.");
        });

        image.setLikeCount(image.getLikes().size());
        image.getLikes().forEach(like ->{
            if(like.getUser().getId() == principalId) {  // 현재 로그인한 유저가 이 이미지를 좋아요를 했는지 안했는지 찾는것
                image.setLikeState(true);
            }
        });


        return image;
    }
}


