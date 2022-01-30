package com.photogram.web.dto.subscribe;

import lombok.Data;

import java.math.BigInteger;

@Data
public class subscribeResponseDto {
    private Long id;
    private String username;
    private String name;
    private String profileImageUrl;
    private boolean subscribeState;
    private boolean equalUserState;

    public subscribeResponseDto(BigInteger id, String username, String name, String profileImageUrl, Integer subscribeState, Integer equalUserState){
        this.id = id.longValue();
        this.username = username;
        this.name = name;
        this.profileImageUrl = profileImageUrl;
        this.subscribeState = subscribeState == 0 ? false : true;
        this.equalUserState = equalUserState == 0 ? false : true;
    }
}
