package com.blog.blogapp.repository;

import com.blog.blogapp.entity.Blog;
import com.blog.blogapp.entity.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Long> {
    
    List<Blog> findByUser(User user);
    
    List<Blog> findByUserOrderByCreatedAtDesc(User user);
    
    Optional<Blog> findByIdAndUser(Long id, User user);
    
    List<Blog> findAllByOrderByCreatedAtDesc();

    @Query(value = "SELECT * FROM blogs ORDER BY RANDOM() LIMIT :limit", nativeQuery = true)
    List<Blog> findRandomBlogs(@Param("limit") int limit);
}
