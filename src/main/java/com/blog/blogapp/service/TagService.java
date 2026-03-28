package com.blog.blogapp.service;

import com.blog.blogapp.dto.TagResponse;
import com.blog.blogapp.entity.Tag;
import com.blog.blogapp.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TagService {

    private final TagRepository tagRepository;

    public List<TagResponse> listTags() {
        return tagRepository.findAllByOrderByNameAsc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<TagResponse> suggestTags(String q) {
        String query = q == null ? "" : q.trim();
        if (query.isEmpty()) {
            return List.of();
        }

        return tagRepository.findTop10ByNameStartingWithIgnoreCaseOrderByNameAsc(query)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private TagResponse toResponse(Tag tag) {
        return new TagResponse(tag.getId(), tag.getName());
    }
}

