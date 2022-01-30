package com.photogram.service;

import com.photogram.config.auth.PrincipalDetails;
import com.photogram.domain.file.File;
import com.photogram.domain.file.FileRepository;
import com.photogram.domain.image.Image;
import com.photogram.domain.image.ImageRepository;
import com.photogram.web.dto.image.ImageUploadRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
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

    @Transactional
    public void 이미지_업로드(ImageUploadRequestDto requestDto, PrincipalDetails principalDetails) {

        // image 테이블에 저장 후
        Image image = requestDto.toEntity(principalDetails.getUser());
        Image imageEntity = imageRepository.save(image);

        List<File> files = new ArrayList<>();

        for(MultipartFile file : requestDto.getFiles()){
            UUID uuid = UUID.randomUUID();
            String FileName = uuid + "_" + file.getOriginalFilename();

            Path imageFilePath = Paths.get(uploadFolder + FileName);

            try {
                Files.write(imageFilePath, file.getBytes());
                File item = fileRepository.save(File.builder()
                        .fileUrl(FileName)
                        .image(imageEntity)
                        .build());
                files.add(item);

            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        imageEntity.updateFiles(files);
    }
}

