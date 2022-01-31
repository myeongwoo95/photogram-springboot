package com.photogram.service;

import com.photogram.domain.like.LikesRespository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Service
public class LikeService {

    private final LikesRespository likeRepository;

    @Transactional
    public void 좋아요(Long imageId, Long principalId) {
        likeRepository.mLikes(imageId, principalId);
    }

    @Transactional
    public void 좋아요취소(Long imageId, Long principalId) {
        likeRepository.mUnLikes(imageId, principalId);
    }


}
