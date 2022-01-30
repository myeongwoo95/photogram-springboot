package com.photogram.domain.file;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.photogram.domain.image.Image;
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
public class File {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String fileUrl;

    @JsonIgnoreProperties({"user", "files"})
    @JoinColumn(name ="imageId")
    @ManyToOne
    private Image image;

}
