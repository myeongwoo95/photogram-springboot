package com.photogram.web.dto.comment;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
public class CommentDepthPostRequestDto {
    @NotNull
    private Long imageId;

    @NotNull
    private Long commentId;

    private Long toUserId;

    @NotBlank
    private String content;

}
