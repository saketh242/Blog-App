package com.blog.blogapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class BlogSearchResponse {
    private long total;
    private int page;
    private int size;
    private List<BlogSearchItem> items;
}

