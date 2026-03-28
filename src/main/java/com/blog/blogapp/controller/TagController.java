package com.blog.blogapp.controller;

import com.blog.blogapp.dto.TagResponse;
import com.blog.blogapp.service.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
public class TagController {

    private final TagService tagService;

    @GetMapping
    public List<TagResponse> listTags() {
        return tagService.listTags();
    }

    @GetMapping("/suggest")
    public List<TagResponse> suggestTags(@RequestParam(name = "q", required = false) String q) {
        return tagService.suggestTags(q);
    }
}

