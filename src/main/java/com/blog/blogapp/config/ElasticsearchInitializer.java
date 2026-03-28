package com.blog.blogapp.config;

import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.web.client.HttpClientErrorException;

public class ElasticsearchInitializer implements ApplicationContextInitializer<ConfigurableApplicationContext> {

    @Override
    public void initialize(ConfigurableApplicationContext applicationContext) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = "http://localhost:9200/blogs";
            
            // Check if index exists
            try {
                restTemplate.headForHeaders(url);
                System.out.println("✅ Elasticsearch index 'blogs' already exists");
            } catch (HttpClientErrorException e) {
                if (e.getStatusCode() == HttpStatus.NOT_FOUND) {
                    // Create the index
                    String payload = "{\"settings\": {\"number_of_shards\": 1, \"number_of_replicas\": 0}}";
                    restTemplate.put(url, payload);
                    System.out.println("✅ Elasticsearch index 'blogs' created successfully");
                } else {
                    System.err.println("⚠️  Warning: Could not check index status: " + e.getStatusCode());
                }
            }
        } catch (Exception e) {
            System.err.println("⚠️  Warning: Could not initialize Elasticsearch index: " + e.getMessage());
        }
    }
}
