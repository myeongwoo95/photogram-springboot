package com.photogram.domain.image;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.photogram.domain.BaseTimeEntity;
import com.photogram.domain.file.File;
import com.photogram.domain.like.Likes;
import com.photogram.domain.user.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
public class Image extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "image")
    @Column(nullable = false)
    private List<File> files;

    @Column(length = 140)
    private String description;

    @Column(length = 30)
    private String caption;

    @Column(length = 50)
    private String location;

    @JsonIgnoreProperties({"images"})
    @JoinColumn(name = "userId")
    @ManyToOne
    private User user;

    @Column(nullable = false)
    private String isCommentActive;

    // 댓글
    @JsonIgnoreProperties({"image"})
    @OneToMany(mappedBy = "image")
    private List<Likes> likes;

    //DB에 컬럼이 만들어지지 않는다.
    @Transient // javax.Persistence
    private boolean likeState;

    @Transient
    private int likeCount;
    // 댓글

    public void updateFiles(List<File> files) {
        this.files = files;
    }
}