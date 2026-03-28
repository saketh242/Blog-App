package com.blog.blogapp.elasticsearch.repository;

import com.blog.blogapp.elasticsearch.document.BlogDocument;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface BlogSearchRepository extends ElasticsearchRepository<BlogDocument, Long> {
}