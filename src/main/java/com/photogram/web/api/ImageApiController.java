package com.photogram.web.api;

import com.photogram.config.auth.PrincipalDetails;
import com.photogram.domain.image.Image;
import com.photogram.domain.report.ReportContent;
import com.photogram.handler.ex.CustomValidationException;
import com.photogram.service.BookmarkService;
import com.photogram.service.ImageService;
import com.photogram.service.LikeService;
import com.photogram.web.dto.CMRespDto;
import com.photogram.web.dto.image.ImageUploadRequestDto;
import com.photogram.web.dto.report.ReportContentPostRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RequiredArgsConstructor
@RestController
public class ImageApiController {

    private final ImageService imageService;
    private final LikeService likeService;
    private final BookmarkService bookmarkService;

    @PostMapping("/api/v1/images/{imageId}/report")
    public ResponseEntity<?> commentReport(@PathVariable Long imageId, @Valid @RequestBody ReportContentPostRequestDto requestDto, @AuthenticationPrincipal PrincipalDetails principalDetails){
        ReportContent reportContentEnityty = imageService.컨텐츠_신고(imageId, principalDetails.getUser().getId(), requestDto);
        return new ResponseEntity<>(new CMRespDto<>(1, "컨텐츠 신고 성공", reportContentEnityty), HttpStatus.OK);
    }

    @PostMapping("/api/v1/images/{imageId}/bookmarks")
    public ResponseEntity<?> bookmarks(@PathVariable Long imageId, @AuthenticationPrincipal PrincipalDetails principalDetails){
        bookmarkService.북마크(principalDetails.getUser().getId(), imageId);
        return new ResponseEntity<>(new CMRespDto<>(1, "북마크 성공", null), HttpStatus.CREATED); // 201번 데이터를 넣었다는 뜻
    }

    @DeleteMapping("/api/v1/images/{imageId}/bookmarks")
    public ResponseEntity<?> unBookmarks(@PathVariable Long imageId, @AuthenticationPrincipal PrincipalDetails principalDetails){
        bookmarkService.북마크취소(principalDetails.getUser().getId(), imageId);
        return new ResponseEntity<>(new CMRespDto<>(1, "북마크 취소 성공", null), HttpStatus.OK);
    }

    @GetMapping("/api/v1/images/popular")
        public ResponseEntity<?> imagePopular(@PageableDefault(size=9, sort = "id", direction = Sort.Direction.DESC) Pageable pageable){
        List<Image> images = imageService.인기사진(pageable);
        return new ResponseEntity<>(new CMRespDto<>(1, "성공", images), HttpStatus.OK);
    }

    @PostMapping("/api/v1/images")
    public ResponseEntity<?> imageUpload(ImageUploadRequestDto requestDto, @AuthenticationPrincipal PrincipalDetails principalDetails) {

        if(requestDto.getFiles().isEmpty()) {
            throw new CustomValidationException("이미지가 첨부되지 않았습니다.", null);
        }

        imageService.이미지_업로드(requestDto, principalDetails);
        return new ResponseEntity<>(new CMRespDto<>(1, "이미지 업로드 성공", null), HttpStatus.OK);
    }

    @DeleteMapping("/api/v1/images/{imageId}")
    public ResponseEntity<?> imageUpload(@PathVariable Long imageId, @AuthenticationPrincipal PrincipalDetails principalDetails) {

        imageService.이미지_삭제(imageId, principalDetails.getUser().getId());
        return new ResponseEntity<>(new CMRespDto<>(1, "이미지 삭제 성공", null), HttpStatus.OK);
    }

    @GetMapping("/api/v1/images")
    public ResponseEntity<?> imageStory(@AuthenticationPrincipal PrincipalDetails principalDetails,
                                        @PageableDefault(size=3, sort = "id", direction = Sort.Direction.DESC) Pageable pageable){
        List<Image> images = imageService.이미지스토리(principalDetails.getUser().getId(), pageable);
        return new ResponseEntity<>(new CMRespDto<>(1, "성공", images), HttpStatus.OK);
    }

    @GetMapping("/api/v1/images/{imageId}")
    public ResponseEntity<?> getImageById(@PathVariable Long imageId, @AuthenticationPrincipal PrincipalDetails principalDetails){
        Image image = imageService.이미지(imageId, principalDetails.getUser().getId());
        return new ResponseEntity<>(new CMRespDto<>(1, "성공", image), HttpStatus.OK);
    }

    @PostMapping("/api/v1/images/{imageId}/likes")
    public ResponseEntity<?> likes(@PathVariable Long imageId, @AuthenticationPrincipal PrincipalDetails principalDetails){
        likeService.좋아요(imageId, principalDetails.getUser().getId());
        return new ResponseEntity<>(new CMRespDto<>(1, "좋아요 성공", null), HttpStatus.CREATED); // 201번 데이터를 넣었다는 뜻
    }

    @DeleteMapping("/api/v1/images/{imageId}/likes")
    public ResponseEntity<?> unLikes(@PathVariable Long imageId, @AuthenticationPrincipal PrincipalDetails principalDetails){
        likeService.좋아요취소(imageId, principalDetails.getUser().getId());
        return new ResponseEntity<>(new CMRespDto<>(1, "좋아요 취소 성공", null), HttpStatus.OK);
    }

}
