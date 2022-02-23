package com.photogram.domain.report;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.photogram.domain.BaseTimeEntity;
import com.photogram.domain.comment.Comment;
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
                        name="report_comment_uk", // 복합키 이름
                        columnNames= {"userId", "commentId"}
                )
        }
)
@Entity
public class ReportComment extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // reporterId
    @JsonIgnoreProperties({"images"})
    @JoinColumn(name = "userId")
    @ManyToOne
    private User user;

    @JsonIgnoreProperties({"commentLikes", "image"})
    @JoinColumn(name = "commentId")
    @ManyToOne
    private Comment comment;
}
