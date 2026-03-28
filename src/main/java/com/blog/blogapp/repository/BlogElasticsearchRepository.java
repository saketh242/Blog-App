package com.blog.blogapp.repository;

import com.blog.blogapp.document.BlogDocument;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BlogElasticsearchRepository extends ElasticsearchRepository<BlogDocument, Long> {
    
    List<BlogDocument> findByTitle(String title);
    
    List<BlogDocument> findByUserEmail(String userEmail);
    
    List<BlogDocument> findByTitleOrContent(String title, String content);
}
