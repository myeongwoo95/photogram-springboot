package com.photogram.domain.chat;

import com.photogram.domain.BaseTimeEntity;
import lombok.*;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter @Setter
@Entity
public class ChatRoom extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

}
