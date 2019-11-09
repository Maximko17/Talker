package com.talker.talker.repository;

import com.talker.talker.domain.PostImages;
import com.talker.talker.domain.Posts;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostImagesRepository extends JpaRepository<PostImages,Long> {
    List<PostImages> getAllByPostOrderBySequence(Posts post);
}
