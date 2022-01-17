package com.photogram.web.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class SampleResponseDto {
    private final String name;
    private final int amount;
}
