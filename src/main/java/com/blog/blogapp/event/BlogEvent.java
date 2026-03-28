package com.blog.blogapp.event;

import lombok.*;

import java.util.List;

import com.blog.blogapp.enums.BlogEventType;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BlogEvent {

    private Long id;
    private String title;
    private String content;
    private String userEmail;
    private List<String> tags;
    private BlogEventType eventType;
}