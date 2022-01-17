package com.photogram.web.dto;

import junit.framework.TestCase;
import org.junit.Test;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;


public class SampleResponseDtoTest{

    @Test
    public void 롬복_기능_테스트() throws Exception {
        // given
        String name = "test";
        int amount = 1000;

        // when
        SampleResponseDto dto = new SampleResponseDto(name, amount);

        // then
        assertThat(dto.getName()).isEqualTo(name);
        assertThat(dto.getAmount()).isEqualTo(amount);
    }

}