package com.talker.talker.service;

import com.talker.talker.domain.Posts;
import com.talker.talker.domain.User;
import com.talker.talker.dto.ShortPostPageDto;
import com.talker.talker.exceptions.BlockedUserEx;
import com.talker.talker.repository.PostsRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class PostLikesService {

    private final UserService userService;
    private final PostsRepository postsRepository;
    private final BookmarkService bookmarkService;
    private final PostReportsService postReportsService;
    private final FollowersService followersService;
    private final NotificationService notificationService;

    public PostLikesService(UserService userService, PostsRepository postsRepository,
                            BookmarkService bookmarkService, PostReportsService postReportsService,
                            FollowersService followersService, NotificationService notificationService) {
        this.userService = userService;
        this.postsRepository = postsRepository;
        this.bookmarkService = bookmarkService;
        this.postReportsService = postReportsService;
        this.followersService = followersService;
        this.notificationService = notificationService;
    }

    public Boolean didMeLikedThisPost(User authUser, Posts aimPost){
        return authUser.getPostLikes().contains(aimPost);
    }

    public ShortPostPageDto<List<Posts>> getLikedPosts(String profileUsername, String authUserEmail, Pageable pageable){
        User profileUser = userService.getUserByEmail(profileUsername);
        User authUser = userService.getUserByEmail(authUserEmail);

        if (!userService.haveMeBlockedByThisUser(authUser,profileUser)) {
            Page<Posts> posts = postsRepository.findByUsersLikes(Collections.singletonList(profileUser), pageable);
            posts.forEach(post -> {
                post.setDidMeLikeThisPost(didMeLikedThisPost(authUser, post));
                post.setDidMeSaveThisPost(bookmarkService.didMeBookmarkThisPost(authUser, post));
                post.getUser().setHaveIBlocked(userService.haveIBlockedThisUser(authUser,post.getUser()));
                post.getUser().setIsMeFollower(followersService.checkSubscriptionToUser(authUser,post.getUser()));
                post.setDidMeReportThisPost(postReportsService.didMeReportThisPost(authUser,post));
            });
            return new ShortPostPageDto<>(posts.getContent() ,posts.getNumberOfElements(), posts.getTotalElements());
        }else{
            throw new BlockedUserEx("You were blocked by this user");
        }
    }

    public void likePost(String postId,String authUserEmail){
        User user = userService.getUserByEmail(authUserEmail);
        Posts post = postsRepository.findById(postId).orElse(null);

        if (!user.getPostLikes().contains(post)){
            post.setTotalLikes(post.getTotalLikes() + 1);
            user.getPostLikes().add(post);

            postsRepository.save(post);
            userService.saveUser(user);

            notificationService.newNotification(user,post.getUser(),"POST_LIKE",post,null);
        }
    }

    public void unlikePost(String postId,String authUserEmail){
        User user = userService.getUserByEmail(authUserEmail);
        Posts post = postsRepository.findById(postId).orElse(null);

        if (user.getPostLikes().contains(post)){
            post.setTotalLikes(post.getTotalLikes() - 1);
            user.getPostLikes().remove(post);

            postsRepository.save(post);
            userService.saveUser(user);
        }
    }
}
