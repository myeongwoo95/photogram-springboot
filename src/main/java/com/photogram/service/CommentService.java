package com.photogram.service;

import com.photogram.domain.comment.Comment;
import com.photogram.domain.comment.CommentRepository;
import com.photogram.domain.image.Image;
import com.photogram.domain.user.User;
import com.photogram.domain.user.UserRepository;
import com.photogram.handler.ex.CustomApiException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final UserRepository userRepository;

    @Transactional
    public Page<Comment> 댓글쓰기(String content, Long imageId, Long userId, Pageable pageable) {

        Image image = new Image();
        image.setId(imageId);

        User userEntity = userRepository.findById(userId).orElseThrow(()->{
            return new CustomApiException("유저 아이디를 찾을 수 없습니다.");
        });

        Comment comment = new Comment();

        comment.setContent(content);
        comment.setImage(image);
        comment.setUser(userEntity);

        commentRepository.save(comment);
        Page<Comment> comments = commentRepository.commentList(imageId, pageable);
        return comments;
    }

    @Transactional
    public void 댓글삭제() {

    }

    public List<Comment> 나의_댓글_불러오기(Long imageId, Long userId) {
        List<Comment> myComments = commentRepository.myCommentList(imageId, userId).orElseThrow(()->{
            return new CustomApiException("등록된 정보가 존재하지 않습니다");
        });

        return myComments;
    }

    public List<Comment> 모든댓글_불러오기(Long imageId, Long userId, Pageable pageable) {

        List<Comment> myComments = commentRepository.CommentListWithoutMine(imageId, userId, pageable).orElseThrow(()->{
            return new CustomApiException("등록된 정보가 존재하지 않습니다");
        });

        return myComments;
    }
}
