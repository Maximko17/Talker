package com.talker.talker.controller;

import com.talker.talker.domain.Posts;
import com.talker.talker.domain.User;
import com.talker.talker.service.PostsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MockMvcBuilder;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.RequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.security.Principal;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.mockito.MockitoAnnotations.initMocks;


class PostsControllerTest {

    @InjectMocks
    private PostsController postsController;

    @Mock
    private PostsService postsService;

    @Mock
    private Principal principal;

    private Posts post;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        initMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(postsController).build();

        User user = new User();
        user.setId(1);
        user.setName("MAX");
        user.setHaveMeBlocked(true);

        post = new Posts();
        post.setId("one");
        post.setTitle("first post");
        post.setSubtitle("This is my first post");
        post.setIsDraft(true);
        post.setUser(user);

    }

    @Test
    void getPost() throws Exception {
        when(postsService.getPostById(anyString())).thenReturn(post);
        when(principal.getName()).thenReturn("me");

        RequestBuilder requestBuilder = MockMvcRequestBuilders
                .get("/post/one")
                .principal(principal)
                .accept(MediaType.APPLICATION_JSON);

        MvcResult result = mockMvc.perform(requestBuilder).andReturn();
        MockHttpServletResponse response = result.getResponse();
        int status = response.getStatus();
        assertEquals(200, status);

        verify(postsService,atLeastOnce()).getPostById(anyString());


//        ResponseEntity<Posts> re = postsController.getPost(post.getId(), principal);
//        assertSame(re.getStatusCode(), HttpStatus.OK);
//        assertNotNull(re.getBody());
//        assertEquals(post.getTitle(),re.getBody().getTitle());
//        assertEquals(post.getSubtitle(),re.getBody().getSubtitle());
//        assertSame(post.getIsDraft(), re.getBody().getIsDraft());
//        assertTrue(re.getBody().getUser().getHaveMeBlocked());
    }
}