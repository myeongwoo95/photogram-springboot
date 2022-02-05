package com.photogram.domain.commentDepth;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.photogram.domain.BaseTimeEntity;
import com.photogram.domain.comment.Comment;
import com.photogram.domain.image.Image;
import com.photogram.domain.user.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
public class CommentDepth extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn(name ="imageId")
    @ManyToOne
    private Image image;

    @JoinColumn(name ="commentId")
    @ManyToOne
    private Comment comment;

    @Column
    private Long toUserId;

    @JsonIgnoreProperties({"images"})
    @JoinColumn(name ="userId")
    @ManyToOne
    private User user;

    @Column(length = 100, nullable = false)
    private String content;






}
