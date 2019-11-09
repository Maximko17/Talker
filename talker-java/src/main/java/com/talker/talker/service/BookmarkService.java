package com.talker.talker.service;

import com.talker.talker.domain.Posts;
import com.talker.talker.domain.Responses;
import com.talker.talker.domain.User;
import com.talker.talker.dto.ShortPostPageDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
public class BookmarkService {

    private final UserService userService;
    private final FollowersService followersService;

    public BookmarkService(UserService userService, FollowersService followersService) {
        this.userService = userService;
        this.followersService = followersService;
    }

    public Boolean didMeBookmarkThisPost(User user, Posts post) {
        return user.getBookmarkedPosts().contains(post);
    }

    public Boolean didMeBookmarkThisResponse(User user, Responses response) {
        return user.getBookmarkedResponses().contains(response);
    }

    public ShortPostPageDto<Set<Posts>> getBookmarkedPosts(Pageable pageable, String authUserEmail) {
        User authUser = userService.getUserByEmail(authUserEmail);

        Set<Posts> posts = authUser.getBookmarkedPosts();
        posts.forEach(post -> {
            post.getUser().setIsMeFollower(followersService.checkSubscriptionToUser(authUser, post.getUser()));
            post.getUser().setHaveIBlocked(userService.haveIBlockedThisUser(authUser, post.getUser()));
        });

        return new ShortPostPageDto<>( posts, pageable.getPageNumber(), 1);
    }

    public void bookmarkPost(Posts post, String authUserEmail) {
        User authUser = userService.getUserByEmail(authUserEmail);

        if (post.getUser() != null){
            if (!userService.haveIBlockedThisUser(authUser, post.getUser()) && !userService.haveMeBlockedByThisUser(authUser, post.getUser())
                    && !post.getUser().getId().equals(authUser.getId())) {
                authUser.getBookmarkedPosts().add(post);
                userService.saveUser(authUser);
            }
        }else{
            authUser.getBookmarkedPosts().add(post);
            userService.saveUser(authUser);
        }
    }

    public void deleteBookmarkedPost(Posts posts, String authUserEmail) {
        User user = userService.getUserByEmail(authUserEmail);
        user.setBookmarkedPosts(user.getBookmarkedPosts().stream().filter(bookmark -> !bookmark.getId().equals(posts.getId())).collect(Collectors.toSet()));

        userService.saveUser(user);
    }

    public Page<Responses> getBookmarkedResponses(Pageable pageable, String authUserEmail) {
        User authUser = userService.getUserByEmail(authUserEmail);

        return new PageImpl<>(authUser.getBookmarkedResponses());
    }

    public void bookmarkResponse(Responses response, String authUserEmail) {
        User authUser = userService.getUserByEmail(authUserEmail);

        if (!userService.haveIBlockedThisUser(authUser, response.getUser()) && !userService.haveMeBlockedByThisUser(authUser, response.getUser())) {
            authUser.getBookmarkedResponses().add(response);
            userService.saveUser(authUser);
        }
    }

    public void deleteBookmarkedResponse(Responses response, String authUserEmail) {
        User user = userService.getUserByEmail(authUserEmail);
        System.out.println(user.getBookmarkedResponses().contains(response));

        user.setBookmarkedResponses(user.getBookmarkedResponses().stream().filter(bookmark -> !bookmark.getId().equals(response.getId())).collect(Collectors.toList()));
        userService.saveUser(user);
    }
}
