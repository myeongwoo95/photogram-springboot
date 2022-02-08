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

@RequiredArgsConstructor
@RestController
public class CommentApiController {
    private final CommentService commentService;

    @PostMapping("api/v1/comment")
    public ResponseEntity<?> commentSave(@Valid @RequestBody CommentPostRequestDto requestDto, @AuthenticationPrincipal PrincipalDetails principalDetails,
                                         @PageableDefault(size=5, sort = "id", direction = Sort.Direction.DESC) Pageable pageable){
        Page<Comment> comments = commentService.댓글쓰기(requestDto.getContent(), requestDto.getImageId(), principalDetails.getUser().getId(), pageable);
        return new ResponseEntity<>(new CMRespDto<>(1, "댓글쓰기 성공", comments), HttpStatus.CREATED);
    }

    @DeleteMapping("api/comment/{id}")
    public ResponseEntity<?> commentDelete(@PathVariable Long id){
        return null;
    }

}
