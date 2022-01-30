package com.photogram.service;

import com.photogram.domain.subscribe.SubscribeRepository;
import com.photogram.handler.ex.CustomApiException;
import com.photogram.web.dto.subscribe.subscribeResponseDto;
import lombok.RequiredArgsConstructor;
import org.qlrm.mapper.JpaResultMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.util.List;

@RequiredArgsConstructor
@Service
public class SubscribeService {

    private final SubscribeRepository subscribeRepository;
    private final EntityManager em;

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
            subscribeRepository.mUnSubscribe(fromUserid, toUserId);
        } catch (Exception e) {
            throw new CustomApiException("구독 정보가 존재하지 않습니다.");
        }
    }

    @Transactional(readOnly = true)
    public List<subscribeResponseDto> 구독리스트(Long principalId, Long pageUserId) {

        // 쿼리준비
        StringBuffer sb = new StringBuffer();
        sb.append("SELECT u.id, u.username, u.name, u.profileImageUrl, ");
        sb.append("if ((SELECT TRUE FROM subscribe WHERE fromUserId = ? AND toUserId = u.id), 1, 0) subscribeState, ");
        sb.append("if ((?=u.id), 1, 0) equalUserState ");
        sb.append("FROM user u INNER JOIN subscribe s ");
        sb.append("ON u.id = s.toUserId ");
        sb.append("WHERE s.fromUserId = ?");

        // 쿼리완성 (java.persistence.Query)
        Query query = em.createNativeQuery(sb.toString())
                .setParameter(1, principalId)
                .setParameter(2, principalId)
                .setParameter(3, pageUserId);

        JpaResultMapper result = new JpaResultMapper();
        List<subscribeResponseDto> subscribeDtos = result.list(query, subscribeResponseDto.class);

        return subscribeDtos;
    }

    @Transactional(readOnly = true)
    public List<subscribeResponseDto> 팔로워리스트(Long principalId, Long pageUserId) {

        StringBuffer sb = new StringBuffer();
        sb.append("SELECT u.id, u.username, u.name, u.profileImageUrl, ");
        sb.append("if ((SELECT TRUE FROM subscribe WHERE fromUserId = ? AND toUserId = u.id), 1, 0) subscribeState, ");
        sb.append("if ((?=u.id), 1, 0) equalUserState ");
        sb.append("FROM user u INNER JOIN subscribe s ");
        sb.append("ON u.id = s.fromUserId ");
        sb.append("WHERE s.toUserId = ?");

        Query query = em.createNativeQuery(sb.toString())// java.persistence.Query
                .setParameter(1, principalId)
                .setParameter(2, principalId)
                .setParameter(3, pageUserId);

        JpaResultMapper result = new JpaResultMapper();
        List<subscribeResponseDto> subscribeDtos = result.list(query, subscribeResponseDto.class);

        return subscribeDtos;
    }
}
