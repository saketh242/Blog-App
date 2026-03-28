package com.blog.blogapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class BlogSearchItem {
    private Long id;
    private String title;
    private String content;
    private String userEmail;
    private List<String> tags;
}

