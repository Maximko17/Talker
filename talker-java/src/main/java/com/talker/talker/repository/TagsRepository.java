package com.talker.talker.repository;

import com.talker.talker.domain.Tags;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TagsRepository extends JpaRepository<Tags,Integer> {
    Tags findByTagName(String tagName);
    Page<Tags> findByTagNameContaining(String tagName, Pageable pageable);
}
