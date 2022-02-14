package com.photogram.domain.report;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.photogram.domain.comment.Comment;
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
@Table(
        uniqueConstraints = {
                @UniqueConstraint(
                        name="report_uk", // 복합키 이름
                        columnNames= {"userId", "commentId"}
                )
        }
)
@Entity
public class ReportComment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnoreProperties({"images"})
    @JoinColumn(name = "userId")
    @ManyToOne
    private User user;

    @JsonIgnoreProperties({"commentLikes", "image"})
    @JoinColumn(name = "commentId")
    @ManyToOne
    private Comment comment;
}
