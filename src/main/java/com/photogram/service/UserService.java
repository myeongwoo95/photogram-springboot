package com.photogram.service;

import com.photogram.domain.user.User;
import com.photogram.domain.user.UserRepository;
import com.photogram.handler.ex.CustomApiException;
import com.photogram.handler.ex.CustomValidationApiException;
import com.photogram.web.dto.user.UserPasswordUpdateRequestDto;
import com.photogram.web.dto.user.UserUpdateRequestDto;
import lombok.RequiredArgsConstructor;
import net.coobird.thumbnailator.Thumbnailator;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Value("${file.path.profile}")
    private String uploadFolder;

    @Transactional
    public User 회원정보_수정(Long id, UserUpdateRequestDto requestDto) {

        User user =  userRepository.findById(id).orElseThrow(()->{
            return new CustomValidationApiException("존재하지 않는 사용자입니다.");
        });

        return user.update(
                requestDto.getName(),
                requestDto.getUsername(),
                requestDto.getWebsite(),
                requestDto.getBio(),
                requestDto.getEmail(),
                requestDto.getTel(),
                requestDto.getGender()
        );
    }

    @Transactional
    public User 회원비밀번호_수정(Long id, UserPasswordUpdateRequestDto requestDto) {

        User user =  userRepository.findById(id).orElseThrow(()->{
            return new CustomValidationApiException("존재하지 않는 사용자입니다.");
        });

        if(!bCryptPasswordEncoder.matches(requestDto.getCurrentPassword(), user.getPassword())){
            throw new CustomValidationApiException("비밀번호가 일치하지 않습니다.");
        }

        if(!requestDto.getNewPassword1().equals(requestDto.getNewPassword2())){
            throw new CustomValidationApiException("새로운 비밀번호를 다시 한번 확인해주시길 바랍니다.");
        }

        return user.passwordUpdate(bCryptPasswordEncoder.encode(requestDto.getNewPassword1()));

    }

    @Transactional
    public User 회원프로필사진_업로드(Long id, MultipartFile profileImageFile) {

        User userEntity = userRepository.findById(id).orElseThrow(()->{
            return new CustomApiException("유저를 찾을 수 없습니다.");
        });

        if(userEntity.getProfileImageUrl() != null && userEntity.getProfileImageUrl() != ""){
            String imageFileName = userEntity.getProfileImageUrl();
            Path imageFilePath = Paths.get(uploadFolder + imageFileName);
            Path thumbnailFilePath = Paths.get(uploadFolder + "s_" + imageFileName);

            try {
                // 이미지 삭제
                Files.deleteIfExists(imageFilePath);

                // 썸네일 삭제
                Files.deleteIfExists(thumbnailFilePath);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        UUID uuid = UUID.randomUUID();

        String imageFileName = uuid+"_"+profileImageFile.getOriginalFilename();
        Path imageFilePath = Paths.get(uploadFolder+imageFileName);

        try {
            // 이미지 저장
            Files.write(imageFilePath, profileImageFile.getBytes());

            // 썸네일 저장
            FileOutputStream thumbnail = new FileOutputStream(new File(uploadFolder, "s_" + imageFileName));
            Thumbnailator.createThumbnail(profileImageFile.getInputStream(), thumbnail, 150, 150);
            thumbnail.close();
        } catch (Exception e) {
            e.printStackTrace();
        }



        userEntity.updateProfileImageUrl(imageFileName);

        return userEntity;
    }
}
