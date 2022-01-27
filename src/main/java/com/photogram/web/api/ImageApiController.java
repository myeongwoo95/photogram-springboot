package com.photogram.web.api;

import com.photogram.service.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
public class ImageApiController {

    private final ImageService imageService;





}
