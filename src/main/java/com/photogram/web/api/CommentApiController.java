package com.photogram.web.api;

import com.photogram.config.auth.PrincipalDetails;
import com.photogram.domain.comment.Comment;
import com.photogram.service.CommentService;
import com.photogram.web.dto.CMRespDto;
import com.photogram.web.dto.comment.CommentPostRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
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
public class CommentApiController {
    private final CommentService commentService;

    @PostMapping("/api/v1/comments/{commentId}/report")
    public ResponseEntity<?> commentReport(@PathVariable Long commentId, @AuthenticationPrincipal PrincipalDetails principalDetails){
        commentService.댓글_신고(commentId, principalDetails.getUser().getId());
        return new ResponseEntity<>(new CMRespDto<>(1, "댓글 신고 성공", null), HttpStatus.OK);
    }

    @DeleteMapping("api/v1/comments/{commentId}")
    public ResponseEntity<?> commentDelete(@PathVariable Long commentId, @AuthenticationPrincipal PrincipalDetails principalDetails){
        commentService.댓글_삭제(commentId, principalDetails.getUser().getId());
        return new ResponseEntity<>(new CMRespDto<>(1, "댓글 삭제 성공", null), HttpStatus.OK);
    }

    @PostMapping("/api/v1/comments/{commentId}/likes")
    public ResponseEntity<?> likes(@PathVariable Long commentId, @AuthenticationPrincipal PrincipalDetails principalDetails){
        commentService.댓글_좋아요(commentId, principalDetails.getUser().getId());
        return new ResponseEntity<>(new CMRespDto<>(1, "댓글 좋아요 성공", null), HttpStatus.CREATED); // 201번 데이터를 넣었다는 뜻
    }

    @DeleteMapping("/api/v1/comments/{commentId}/likes")
    public ResponseEntity<?> unLikes(@PathVariable Long commentId, @AuthenticationPrincipal PrincipalDetails principalDetails){
        commentService.댓글_좋아요취소(commentId, principalDetails.getUser().getId());
        return new ResponseEntity<>(new CMRespDto<>(1, "댓글 좋아요 취소 성공", null), HttpStatus.OK);
    }

    @PostMapping("api/v1/comment")
    public ResponseEntity<?> commentSave(@Valid @RequestBody CommentPostRequestDto requestDto, @AuthenticationPrincipal PrincipalDetails principalDetails,
                                         @PageableDefault(size=5, sort = "id", direction = Sort.Direction.DESC) Pageable pageable){
        Page<Comment> comments = commentService.댓글쓰기(requestDto.getContent(), requestDto.getImageId(), principalDetails.getUser().getId(), pageable);
        return new ResponseEntity<>(new CMRespDto<>(1, "댓글쓰기 성공", comments), HttpStatus.CREATED);
    }

    @GetMapping("api/v1/comments/images/{imageId}/users/{userId}")
    public ResponseEntity<?> getMyComment(@PathVariable Long imageId, @PathVariable Long userId){
        List<Comment> comments = commentService.나의_댓글_불러오기(imageId, userId);
        return new ResponseEntity<>(new CMRespDto<>(1, "나의 댓글 불러오기 성공", comments), HttpStatus.CREATED);
    }

    @GetMapping("api/v1/comments/images/{imageId}/users/except/{userId}")
    public ResponseEntity<?> getAllCommentWithoutMine(@PathVariable Long imageId, @PathVariable Long userId,
                                                      @PageableDefault(size=10, sort = "id", direction = Sort.Direction.DESC) Pageable pageable){
        List<Comment> comments = commentService.모든댓글_불러오기(imageId, userId, pageable);
        return new ResponseEntity<>(new CMRespDto<>(1, "모든 댓글 불러오기 성공", comments), HttpStatus.CREATED);
    }

}
