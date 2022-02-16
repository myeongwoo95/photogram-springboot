package com.photogram.domain.image;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.photogram.domain.BaseTimeEntity;
import com.photogram.domain.comment.Comment;
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

    @OneToMany(mappedBy = "image", cascade = { CascadeType.REMOVE })
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

    @JsonIgnoreProperties({"image"})
    @OneToMany(mappedBy = "image")
    private List<Likes> likes;

    @Transient
    private boolean likeState;

    @Transient
    private int likeCount;

    @Transient
    private boolean bookmarkState;

    @OrderBy("id DESC") // javax.persistence
    @JsonIgnoreProperties({"image"}) // 무한참조 방지
    @OneToMany(mappedBy = "image")
    private List<Comment> comments;

    @Transient
    private int commentCount;

    public void updateFiles(List<File> files) {
        this.files = files;
    }
}