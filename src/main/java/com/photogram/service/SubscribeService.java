package com.photogram.service;

import com.photogram.domain.subscribe.SubscribeRepository;
import com.photogram.handler.ex.CustomApiException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Service
public class SubscribeService {
    private final SubscribeRepository subscribeRepository;

    @Transactional
    public void 구독하기(Long fromUserid, Long toUserId) {
        try {
            subscribeRepository.mSubscribe(fromUserid, toUserId);
        } catch (Exception e) {
            throw new CustomApiException("이미 구독을 하였습니다.");
        }
    }

    @Transactional
    public void 구독취소하기(Long fromUserid, Long toUserId) {
        try {
            subscribeRepository.mSubscribe(fromUserid, toUserId);
        } catch (Exception e) {
            throw new CustomApiException("구독 정보가 존재하지 않습니다.");
        }
    }

}
