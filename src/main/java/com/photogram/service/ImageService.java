package com.photogram.service;

import com.photogram.config.auth.PrincipalDetails;
import com.photogram.domain.bookmark.BookmarkRepository;
import com.photogram.domain.comment.CommentRepository;
import com.photogram.domain.file.File;
import com.photogram.domain.file.FileRepository;
import com.photogram.domain.image.Image;
import com.photogram.domain.image.ImageRepository;
import com.photogram.domain.like.LikeCommentRespository;
import com.photogram.domain.like.LikesRespository;
import com.photogram.domain.report.ReportCommentRepository;
import com.photogram.domain.report.ReportContent;
import com.photogram.domain.report.ReportContentRepository;
import com.photogram.domain.user.User;
import com.photogram.domain.user.UserRepository;
import com.photogram.handler.ex.CustomApiException;
import com.photogram.web.dto.image.ImageUploadRequestDto;
import com.photogram.web.dto.report.ReportContentPostRequestDto;
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
    private final BookmarkRepository bookmarkRepository;
    private final ReportContentRepository reportContentRepository;
    private final ReportCommentRepository reportCommentRepository;
    private final UserRepository userRepository;
    private final LikesRespository likesRespository;
    private final LikeCommentRespository likeCommentRespository;
    private final CommentRepository commentRepository;


    @Value("${file.path.image}")
    private String uploadFolder;

    @Transactional
    public void ?????????_??????(Long imageId, Long userId) {
        User userEntity = userRepository.findById(userId).orElseThrow(()->{
            return new CustomApiException("????????? ??????????????? ????????????.");
        });

        Image imageEntity = imageRepository.findById(imageId).orElseThrow(()->{
            return new CustomApiException("????????? ???????????? ????????????.");
        });

        if(imageEntity.getUser().getId() != userId){
            throw new CustomApiException("???????????? ????????? ????????? ????????????.");
        }

        List<File> files = fileRepository.findAllByImageId(imageId);

        files.forEach((file)->{
            Path imageFilePath = Paths.get(uploadFolder + file.getFileUrl());

            try {
                boolean result = Files.deleteIfExists(imageFilePath);

                if(result == true){
                    fileRepository.delete(file);
                }


            } catch (Exception e) {
                e.printStackTrace();
            }
        });

        bookmarkRepository.deleteByImageId(imageId);
        likesRespository.deleteByImageId(imageId);

        commentRepository.findAllByImageId(imageId).forEach((comment)->{
            likeCommentRespository.deleteByCommentId(comment.getId());
            reportCommentRepository.deleteAllByCommentId(comment.getId());
            commentRepository.delete(comment);
        });

        reportContentRepository.deleteByImageId(imageId);
        imageRepository.delete(imageEntity);
    }

    @Transactional
    public ReportContent ?????????_??????(Long imageId, Long userId, ReportContentPostRequestDto requestDto) {
        User userEntity = userRepository.findById(userId).orElseThrow(()->{
            return new CustomApiException("????????? ??????????????? ????????????.");
        });

        Image ImageEntity = imageRepository.findById(imageId).orElseThrow(()->{
            return new CustomApiException("????????? ???????????? ????????????.");
        });

        int result = reportContentRepository.mDuplicateCheck(imageId, userId);

        if(result == 1){
            throw new CustomApiException("?????? ???????????? ??????????????????.");
        }

        ReportContent reportContentEntity = new ReportContent();
        reportContentEntity.setUser(userEntity);
        reportContentEntity.setImage(ImageEntity);
        reportContentEntity.setMessage(requestDto.getMessage());

        return reportContentRepository.save(reportContentEntity);
    }

    @Transactional(readOnly = true)
    public List<Image> ????????????(Pageable pageable) {
        List<Image> images = imageRepository.mPopular(pageable);

        images.forEach(image -> {
            image.setLikeCount(image.getLikes().size()); // like count
        });

        return images;
    }

    @Transactional
    public void ?????????_?????????(ImageUploadRequestDto requestDto, PrincipalDetails principalDetails) {

        // image ???????????? ?????? ???
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
    public List<Image> ??????????????????(Long principalId, Pageable pageable) {
        List<Image> images = imageRepository.mStory(principalId, pageable);

        images.forEach(image -> {

            // ????????? ????????? ??????
            image.setLikeCount(image.getLikes().size()); // like count
            image.getLikes().forEach(like ->{  // ?????? ???????????? ???????????? ???????????? ?????? ?????????
                if(like.getUser().getId() == principalId) {  // ?????? ???????????? ????????? ??? ???????????? ???????????? ????????? ???????????? ?????????
                    image.setLikeState(true);
                }
            });

            // ????????? ??????
            if(bookmarkRepository.mBookmarkState(principalId, image.getId()) >= 1){
                image.setBookmarkState(true);
            }

            // ?????? ????????? ??????
            image.getComments().forEach(comment -> {
                comment.setLikeCommentCount(comment.getCommentLikes().size());

                comment.getCommentLikes().forEach((commentLike)->{
                    if(commentLike.getUser().getId() == principalId){
                        comment.setLikeCommentState(true);
                    }
                });

            });

        });
        return images;
    }

    @Transactional(readOnly = true)
    public Image ?????????(Long imageId, Long principalId) {
        Image image = imageRepository.findById(imageId).orElseThrow(()->{
            return new CustomApiException("???????????? ?????? ??????????????????.");
        });

        // ????????? ????????? ??????
        image.setLikeCount(image.getLikes().size());
        image.getLikes().forEach(like ->{
            if(like.getUser().getId() == principalId) {  // ?????? ???????????? ????????? ??? ???????????? ???????????? ????????? ???????????? ?????????
                image.setLikeState(true);
            }
        });

        // ????????? ??????
        if(bookmarkRepository.mBookmarkState(principalId, image.getId()) >= 1){
            image.setBookmarkState(true);
        }

        // ?????? ????????? ??????
        image.getComments().forEach((comment)->{
            comment.setLikeCommentCount(comment.getCommentLikes().size());
            comment.getCommentLikes().forEach((commentLike)->{
                if(commentLike.getUser().getId() == principalId){
                    comment.setLikeCommentState(true);
                }
            });
        });

        return image;
    }

}


