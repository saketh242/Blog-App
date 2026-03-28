package com.blog.blogapp.elasticsearch.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(indexName = "blogs")
public class BlogDocument {

    @Id
    private Long id;

    private String title;

    private String content;

    private String userEmail;

    private List<String> tags;
}