package com.photogram.service;

import com.photogram.domain.bookmark.BookmarkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class BookmarkService {

    private final BookmarkRepository bookmarkRepository;


    public void 북마크(Long userId, Long imageId) {
        bookmarkRepository.mBookmark(userId, imageId);
    }

    public void 북마크취소(Long userId, Long imageId) {
        bookmarkRepository.mUnBookmark(userId, imageId);
    }
}
