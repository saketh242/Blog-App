package com.blog.blogapp.controller;

import com.blog.blogapp.dto.BlogSearchResponse;
import com.blog.blogapp.service.BlogSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

    private final BlogSearchService blogSearchService;

    @GetMapping("/blogs")
    public BlogSearchResponse searchBlogs(
            @RequestParam(name = "q", required = false) String q,
            @RequestParam(name = "userEmail", required = false) String userEmail,
            @RequestParam(name = "tags", required = false) List<String> tags,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size
    ) {
        return blogSearchService.search(q, userEmail, tags, page, size);
    }
}

