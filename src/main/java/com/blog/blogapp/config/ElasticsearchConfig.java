package com.blog.blogapp.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;

@Configuration
@ConditionalOnProperty(name = "spring.elasticsearch.enabled", havingValue = "true", matchIfMissing = false)
@EnableElasticsearchRepositories(
    basePackages = "com.blog.blogapp.elasticsearch.repository",
    considerNestedRepositories = true
)
public class ElasticsearchConfig {
    // Index creation is handled by ElasticsearchInitializer
}
