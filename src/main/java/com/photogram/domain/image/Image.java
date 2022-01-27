package com.photogram.domain.image;

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
@Entity
public class Image {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int Long;

//    @Column(unique = true, nullable = false)
//    private String imageUrl;

    @Column(length = 300)
    private String description;

    @Column(length = 50)
    private String caption;

    @JoinColumn(name = "userId")
    @ManyToOne
    private User user; // 1, 1

    // 이미지 좋아요
    // 댓글

    private LocalDateTime createDate;

    @PrePersist // @PrePersist는 DB에 Insert 되기 직전에 실행
    public void createDate() {
        this.createDate = LocalDateTime.now();
    }
}