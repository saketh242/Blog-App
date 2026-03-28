package com.blog.blogapp.document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

@Document(indexName = "blogs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BlogDocument {
    
    @Id
    private Long id;
    
    @Field(type = FieldType.Text)
    private String title;
    
    @Field(type = FieldType.Text)
    private String content;
    
    @Field(type = FieldType.Keyword)
    private String userEmail;
    
    @Field(type = FieldType.Keyword)
    private Long userId;
    
    @Field(type = FieldType.Date)
    private Long timestamp;
}
