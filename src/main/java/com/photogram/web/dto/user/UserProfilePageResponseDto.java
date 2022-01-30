package com.photogram.web.dto.user;

import com.photogram.domain.user.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserProfilePageResponseDto {

    private User user;

    private boolean pageOwnerState;

    // 이미지 관련
    private int imageCount;
    private boolean isThereImage;
    private boolean isThereCollection;
    private boolean isThereTag;

    // 구독관련
    private boolean subscribeState;
    private int subscribeCount;
    private int followerCount;

}
