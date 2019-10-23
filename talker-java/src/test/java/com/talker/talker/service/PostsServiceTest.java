package com.talker.talker.service;

import com.talker.talker.domain.Posts;
import com.talker.talker.domain.User;
import com.talker.talker.exceptions.BadRequestEx;
import com.talker.talker.exceptions.NotFoundEx;
import com.talker.talker.repository.PostsRepository;
import com.talker.talker.repository.UserRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import java.util.Optional;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;
import static org.mockito.MockitoAnnotations.initMocks;

public class PostsServiceTest {

    @InjectMocks
    private PostsService postService;
    @Mock
    private PostsRepository repository;
    @Mock
    private UserService userService;
    @Mock
    private PostLikesService postLikesService;
    @Mock
    private FollowersService followersService;
    @Mock
    private BookmarkService bookmarkService;
    @Mock
    private PostReportsService postReportsService;

    private Posts postRep;

    @Before
    public void setUp() throws Exception {
        initMocks(this);

        User user = new User();
        user.setId(1);
        user.setEmail("max@mail.ru");
        user.setHaveMeBlocked(false);

        postRep = new Posts();
        postRep.setId("one");
        postRep.setTitle("FIRST POST");
        postRep.setUser(user);
    }

    @Test
    public void getPostById() {
        when(repository.findById(anyString())).thenReturn(Optional.of(postRep));

        Posts servPost = postService.getPostById(anyString());
        assertNotNull(servPost);
        assertEquals(postRep.getTitle(), servPost.getTitle());

        verify(repository, times(1)).findById(anyString());
    }

    @Test
    public void getPostByIdWithAuthUserEmail() {
        when(repository.findById(anyString())).thenReturn(Optional.of(postRep));

        Posts servPost = postService.getPostById("one",anyString());
        assertNotNull(servPost);
        assertEquals(postRep.getTitle(), servPost.getTitle());

        verify(repository, times(1)).findById(anyString());
    }

    @Test
    public void postNotFoundEx() {
        when(repository.findById(anyString())).thenReturn(null);
        assertThrows(NullPointerException.class, () -> postService.getPostById("Two"));
    }
}