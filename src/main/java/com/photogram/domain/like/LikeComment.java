package com.photogram.domain.like;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.photogram.domain.comment.Comment;
import com.photogram.domain.user.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(
        uniqueConstraints = {
                @UniqueConstraint(
                        name="likeComment_uk", // 복합키 이름
                        columnNames= {"commentId", "userId"}
                )
        }
)
@Entity
public class LikeComment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnoreProperties({"commentLikes", "image"})
    @JoinColumn(name = "commentId")
    @ManyToOne
    private Comment comment;

    @JsonIgnoreProperties({"images"})
    @JoinColumn(name = "userId")
    @ManyToOne
    private User user;

    private LocalDateTime createDate;
    @PrePersist
    public void createDate() {
        this.createDate = LocalDateTime.now();
    }
}
