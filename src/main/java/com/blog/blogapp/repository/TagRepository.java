package com.blog.blogapp.repository;

import com.blog.blogapp.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {
    
    Optional<Tag> findByName(String name);

    List<Tag> findTop10ByNameStartingWithIgnoreCaseOrderByNameAsc(String prefix);

    List<Tag> findAllByOrderByNameAsc();
}
