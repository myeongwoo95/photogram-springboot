package com.photogram.domain.image;

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
public class ImageProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int Long;

    @Column(unique = true, nullable = false)
    private String imageProfileUrl;

    @JoinColumn(name = "userId")
    @OneToOne
    private User user;


}
