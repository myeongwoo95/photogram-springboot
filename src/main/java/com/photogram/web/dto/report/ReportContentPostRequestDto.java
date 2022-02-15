package com.photogram.web.dto.report;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class ReportContentPostRequestDto {

    @NotBlank
    private String message;
}
