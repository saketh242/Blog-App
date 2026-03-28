package com.blog.blogapp.controller;

import com.blog.blogapp.dto.BlogRequest;
import com.blog.blogapp.dto.BlogResponse;
import com.blog.blogapp.service.BlogService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blogs")
@RequiredArgsConstructor
public class BlogController {

    private final BlogService blogService;

    @PostMapping
    public BlogResponse createBlog(@RequestBody BlogRequest request,
                           Authentication authentication) {

        String email = authentication.getName(); 

        return blogService.createBlog(request, email);
    }

    @GetMapping("/{id:\\d+}")
    public BlogResponse getBlogById(@PathVariable Long id) {
        return blogService.getBlogById(id);
    }

    @GetMapping("/feed")
    public List<BlogResponse> getFeed(@RequestParam(name = "size", defaultValue = "10") int size) {
        return blogService.getFeed(size);
    }

    @DeleteMapping("/{id:\\d+}")
    public void deleteBlog(@PathVariable Long id, Authentication authentication) {
        String email = authentication.getName();
        blogService.deleteBlog(id, email);
    }

    @PutMapping("/{id:\\d+}")
    public BlogResponse updateBlog(@PathVariable Long id,
                                   @RequestBody BlogRequest request,
                                   Authentication authentication) {
        String email = authentication.getName();
        return blogService.updateBlog(id, request, email);
    }
}