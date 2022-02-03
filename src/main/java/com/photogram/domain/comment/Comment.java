package com.photogram.domain.comment;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.photogram.domain.BaseTimeEntity;
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
public class Comment extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100, nullable = false)
    private String content;

    @JsonIgnoreProperties({"images"})
    @JoinColumn(name ="userId")
    @ManyToOne
    private User user;

    @JoinColumn(name ="imageId")
    @ManyToOne
    private Image image;

}
