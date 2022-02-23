package com.photogram.domain.chat;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.photogram.domain.user.User;
import lombok.*;

import javax.persistence.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
public class ChatConnect {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnoreProperties({"images"})
    @JoinColumn(name = "userId")
    @ManyToOne
    private User user;

    @JoinColumn(name = "chatRoomId")
    @ManyToOne
    private ChatRoom chatRoom;

}
