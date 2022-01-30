package com.photogram.web.dto.subscribe;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class subscribeResponseDto {
    private Long id;
    private String username;
    private String name;
    private String profileImageUrl;
    private Integer subscribeState;
    private Integer equalUserState;
}
