package com.blog.blogapp.dto;

import lombok.Data;
import java.util.List;

@Data
public class BlogRequest {
    private String title;
    private String content;
    private List<String> tags;
}