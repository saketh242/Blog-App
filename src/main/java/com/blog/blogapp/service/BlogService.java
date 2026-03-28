package com.blog.blogapp.service;

import com.blog.blogapp.dto.BlogRequest;
import com.blog.blogapp.dto.BlogResponse;
import com.blog.blogapp.dto.UserBlogResponse;
import com.blog.blogapp.entity.*;
import com.blog.blogapp.enums.BlogEventType;
import com.blog.blogapp.event.BlogEvent;
import com.blog.blogapp.kafka.producer.BlogProducer;
import com.blog.blogapp.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BlogService {

    private final BlogRepository blogRepository;
    private final TagRepository tagRepository;
    private final UserRepository userRepository;
    private final BlogProducer blogProducer;

    public BlogResponse createBlog(BlogRequest request, String userEmail) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Tag> tagEntities = new ArrayList<>();
        List<String> tagNames = new ArrayList<>(); // ✅ for event

        if (request.getTags() != null) {

            if (request.getTags().size() > 4) {
                throw new RuntimeException("Max 4 tags allowed");
            }

            for (String tagName : request.getTags()) {

                Tag tag = tagRepository.findByName(tagName)
                        .orElseGet(() -> tagRepository.save(
                                Tag.builder().name(tagName).build()
                        ));

                tagEntities.add(tag);
                tagNames.add(tag.getName());
            }
        }

        Blog blog = Blog.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .user(user)
                .tags(tagEntities)
                .build();

        Blog savedBlog = blogRepository.save(blog);

        BlogEvent event = BlogEvent.builder()
                .id(savedBlog.getId())
                .eventType(BlogEventType.CREATED)
                .title(savedBlog.getTitle())
                .content(savedBlog.getContent())
                .userEmail(user.getEmail())
                .tags(tagNames)
                .build();

        blogProducer.sendBlogEvent(event);

        return convertToResponse(savedBlog);
    }

    private BlogResponse convertToResponse(Blog blog) {
        UserBlogResponse userResponse = new UserBlogResponse(
                blog.getUser().getId(),
                blog.getUser().getEmail(),
                blog.getUser().getName()
        );

        return new BlogResponse(
                blog.getId(),
                blog.getTitle(),
                blog.getContent(),
                userResponse,
                blog.getCreatedAt(),
                blog.getUpdatedAt()
        );
    }

    public BlogResponse getBlogById(Long id) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog with "  + id + " not found"));

        return convertToResponse(blog);
    }

    public void deleteBlog(Long id, String email) {
    Blog blog = blogRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Blog with " + id + " not found"));

    if (!blog.getUser().getEmail().equals(email)) {
        throw new RuntimeException("Unauthorized to delete this blog");
    }

    blogRepository.delete(blog);

    // publish delete event → consumer handles ES removal
    BlogEvent event = BlogEvent.builder()
            .eventType(BlogEventType.DELETED)
            .id(id)
            .build();

    blogProducer.sendBlogEvent(event);
    }

    public BlogResponse updateBlog(Long id, BlogRequest request, String userEmail) {

        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog with " + id + " not found"));

        if (!blog.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized to update this blog");
        }

        List<Tag> tagEntities = new ArrayList<>();
        List<String> tagNames = new ArrayList<>();

        if (request.getTags() != null) {

            if (request.getTags().size() > 4) {
                throw new RuntimeException("Max 4 tags allowed");
            }

            for (String tagName : request.getTags()) {
                Tag tag = tagRepository.findByName(tagName)
                        .orElseGet(() -> tagRepository.save(
                                Tag.builder().name(tagName).build()
                        ));

                tagEntities.add(tag);
                tagNames.add(tag.getName());
            }

            blog.setTags(tagEntities);
        }

        if (request.getTitle() != null) {
            blog.setTitle(request.getTitle());
        }
        if (request.getContent() != null) {
            blog.setContent(request.getContent());
        }

        Blog saved = blogRepository.save(blog);

        BlogEvent event = BlogEvent.builder()
                .id(saved.getId())
                .eventType(BlogEventType.UPDATED)
                .title(saved.getTitle())
                .content(saved.getContent())
                .userEmail(saved.getUser().getEmail())
                .tags(request.getTags() == null ? null : tagNames)
                .build();

        blogProducer.sendBlogEvent(event);

        return convertToResponse(saved);
    }

    public List<BlogResponse> getFeed(int size) {
        int safeSize = Math.max(1, Math.min(size, 30));
        return blogRepository.findRandomBlogs(safeSize)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }
}