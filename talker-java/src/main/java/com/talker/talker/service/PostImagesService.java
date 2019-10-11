package com.talker.talker.service;

import com.talker.talker.domain.PostImages;
import com.talker.talker.repository.PostImagesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PostImagesService {

    private final PostImagesRepository postImagesRepository;

    public PostImagesService(PostImagesRepository postImagesRepository) {
        this.postImagesRepository = postImagesRepository;
    }

    public void saveImage(PostImages image){
        postImagesRepository.save(image);
    }
}
