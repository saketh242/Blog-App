package com.blog.blogapp.kafka.consumer;

import com.blog.blogapp.elasticsearch.document.BlogDocument;
import com.blog.blogapp.elasticsearch.repository.BlogSearchRepository;
import com.blog.blogapp.event.BlogEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BlogConsumer {

    private final BlogSearchRepository blogSearchRepository;

    @KafkaListener(topics = "blog-topic", groupId = "blog-group")
    public void consume(BlogEvent event) {

        switch (event.getEventType()) {

            case CREATED, UPDATED -> {
                BlogDocument doc = BlogDocument.builder()
                        .id(event.getId())
                        .title(event.getTitle())
                        .content(event.getContent())
                        .userEmail(event.getUserEmail())
                        .tags(event.getTags())
                        .build();
                blogSearchRepository.save(doc);
                System.out.println("✅ Saved/Updated in Elasticsearch");
            }

            case DELETED -> {
                blogSearchRepository.deleteById(event.getId());
                System.out.println("✅ Deleted from Elasticsearch");
            }
        }
    }
}