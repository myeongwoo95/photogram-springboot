package com.photogram.web.dto.subscribe;

import lombok.Data;

import java.math.BigInteger;

@Data
public class SubscribeFriendsResponseDto {
    private Long id;
    private String username;
    private String name;
    private String profileImageUrl;

    public SubscribeFriendsResponseDto(BigInteger id, String username, String name, String profileImageUrl){
        this.id = id.longValue();
        this.username = username;
        this.name = name;
        this.profileImageUrl = profileImageUrl;
    }

}
