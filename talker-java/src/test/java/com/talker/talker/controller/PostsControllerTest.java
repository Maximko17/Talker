package com.talker.talker.controller;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.talker.talker.domain.User;
import com.talker.talker.repository.PostsReportRepository;
import com.talker.talker.repository.PostsRepository;
import com.talker.talker.service.BookmarkService;
import com.talker.talker.service.PostLikesService;
import com.talker.talker.service.PostReportsService;
import com.talker.talker.service.PostsService;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.entity.ContentType;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;
import org.hamcrest.Matchers;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import java.security.Principal;
import static org.junit.Assert.*;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class PostsControllerTest {

    private PostsController postsController;
    @Mock
    private PostsService postsService;
    @Mock
    private PostLikesService postLikesService;
    @Mock
    private BookmarkService bookmarkService;
    @Mock
    private PostReportsService postReportsService;
    @Mock
    private Principal principal;

    @Before
    public void setUp() throws Exception {
        MockitoAnnotations.initMocks(this);
        postsController = new PostsController(postsService, postLikesService, bookmarkService, postReportsService);
    }

    @Test
    public void textMVCkMvc() throws Exception {
        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(postsController).build();

        mockMvc.perform(get("/"))
                .andExpect(status().isOk());
    }

    @Test
    public void getPost() {
        System.out.println(principal.getName());
        ResponseEntity postResponse = postsController.getPost("mmmmm", principal);
        assertEquals(HttpStatus.OK, postResponse.getStatusCode());
        verify(postsService, times(1)).getPostById("mmmmm", principal.getName());
    }
}