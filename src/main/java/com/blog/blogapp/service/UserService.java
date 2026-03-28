package com.blog.blogapp.service;

import com.blog.blogapp.dto.UserProfileResponse;
import com.blog.blogapp.entity.Blog;
import com.blog.blogapp.entity.User;
import com.blog.blogapp.enums.BlogEventType;
import com.blog.blogapp.event.BlogEvent;
import com.blog.blogapp.kafka.producer.BlogProducer;
import com.blog.blogapp.repository.BlogRepository;
import com.blog.blogapp.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BlogRepository blogRepository;
    private final BlogProducer blogProducer;

    public UserProfileResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new UserProfileResponse(user.getId(), user.getEmail(), user.getName());
    }

    @Transactional
    public void deleteCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Emit delete events so Elasticsearch removes all posts owned by this user.
        List<Blog> userBlogs = blogRepository.findByUser(user);
        for (Blog blog : userBlogs) {
            BlogEvent event = BlogEvent.builder()
                    .eventType(BlogEventType.DELETED)
                    .id(blog.getId())
                    .build();
            blogProducer.sendBlogEvent(event);
        }

        userRepository.delete(user);
        log.info("Deleted account for user {}", email);
    }
}

