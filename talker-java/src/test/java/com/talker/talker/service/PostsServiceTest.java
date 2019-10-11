package com.talker.talker.service;

import com.talker.talker.domain.Posts;
import com.talker.talker.repository.PostsRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Optional;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class PostsServiceTest {

    @InjectMocks
    private PostsService postsService;
    @Mock
    private PostsRepository postsRepository;

    @Before
    public void setUp(){
    }

    @Test
    public void getPostById() {
        Posts post = new Posts();
        post.setId("2zde");

        when(postsRepository.findById("2zde")).thenReturn(Optional.of(post));
        assertEquals("2zde",post.getId());
        verify(postsRepository,times(1)).findById("2zde");
    }
}