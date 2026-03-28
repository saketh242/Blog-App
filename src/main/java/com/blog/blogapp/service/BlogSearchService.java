package com.blog.blogapp.service;

import com.blog.blogapp.dto.BlogSearchItem;
import com.blog.blogapp.dto.BlogSearchResponse;
import com.blog.blogapp.elasticsearch.document.BlogDocument;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.query.Criteria;
import org.springframework.data.elasticsearch.core.query.CriteriaQuery;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BlogSearchService {

    private final ElasticsearchOperations elasticsearchOperations;

    public BlogSearchResponse search(String q,
                                    String userEmail,
                                    List<String> tags,
                                    int page,
                                    int size) {

        int safePage = Math.max(0, page);
        int safeSize = Math.min(Math.max(1, size), 50);

        Criteria criteria = new Criteria();

        String queryText = q == null ? "" : q.trim();
        if (!queryText.isEmpty()) {
            Criteria text = new Criteria("title").contains(queryText)
                    .or(new Criteria("content").contains(queryText));
            criteria = criteria.and(text);
        }

        String email = userEmail == null ? "" : userEmail.trim();
        if (!email.isEmpty()) {
            String lowerEmail = email.toLowerCase();
            Criteria emailCriteria = new Criteria("userEmail").is(email)
                    .or(new Criteria("userEmail").is(lowerEmail))
                    .or(new Criteria("userEmail").contains(email))
                    .or(new Criteria("userEmail").contains(lowerEmail));
            criteria = criteria.and(emailCriteria);
        }

        if (tags != null && !tags.isEmpty()) {
            List<String> normalizedTags = tags.stream()
                    .filter(t -> t != null && !t.trim().isEmpty())
                    .map(String::trim)
                    .distinct()
                    .toList();
            if (!normalizedTags.isEmpty()) {
                criteria = criteria.and(new Criteria("tags").in(normalizedTags));
            }
        }

        CriteriaQuery query = new CriteriaQuery(criteria);
        query.setPageable(PageRequest.of(safePage, safeSize));

        SearchHits<BlogDocument> hits = elasticsearchOperations.search(query, BlogDocument.class);

        List<BlogSearchItem> items = hits.getSearchHits()
                .stream()
                .map(SearchHit::getContent)
                .map(d -> new BlogSearchItem(d.getId(), d.getTitle(), d.getContent(), d.getUserEmail(), d.getTags()))
                .toList();

        return new BlogSearchResponse(hits.getTotalHits(), safePage, safeSize, items);
    }
}

