package com.blog.blogapp.kafka.producer;

import com.blog.blogapp.event.BlogEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BlogProducer {

    private final KafkaTemplate<String, BlogEvent> kafkaTemplate;

    public void sendBlogEvent(BlogEvent event) {
        kafkaTemplate.send("blog-topic", event);
    }
}