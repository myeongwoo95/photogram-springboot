package com.photogram.domain.report;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.photogram.domain.BaseTimeEntity;
import com.photogram.domain.image.Image;
import com.photogram.domain.user.User;
import lombok.*;

import javax.persistence.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter @Setter
@Table(
        uniqueConstraints = {
                @UniqueConstraint(
                        name="report_content_uk", // 복합키 이름
                        columnNames= {"userId", "imageId"}
                )
        }
)
@Entity
public class ReportContent extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // reporterId
    @JsonIgnoreProperties({"images"})
    @JoinColumn(name = "userId")
    @ManyToOne
    private User user;

    @JsonIgnoreProperties({"files", "likes", "comments"})
    @JoinColumn(name = "imageId")
    @ManyToOne
    private Image image;

    @Column(nullable = false)
    private String message;

}
