package com.talker.talker.service;

import com.talker.talker.domain.Posts;
import com.talker.talker.domain.Responses;
import com.talker.talker.domain.User;
import com.talker.talker.dto.ShortResponsePageDto;
import com.talker.talker.exceptions.BadRequestEx;
import com.talker.talker.exceptions.BlockedUserEx;
import com.talker.talker.repository.ResponsesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ResponsesService {

    private final ResponsesRepository responsesRepository;
    private final FollowersService followersService;
    private final UserService userService;
    private ResponseLikesService responseLikesService;
    private final PostsService postsService;
    private final BookmarkService bookmarkService;
    private final ResponsesReportsService responsesReportsService;
    private final NotificationService notificationService;

    @Autowired
    public void setResponseLikesService(ResponseLikesService responseLikesService) {
        this.responseLikesService = responseLikesService;
    }

    public ResponsesService(ResponsesRepository responsesRepository, FollowersService followersService,
                            UserService userService,
                            PostsService postsService, BookmarkService bookmarkService,
                            ResponsesReportsService responsesReportsService, NotificationService notificationService) {
        this.responsesRepository = responsesRepository;
        this.followersService = followersService;
        this.userService = userService;
        this.postsService = postsService;
        this.bookmarkService = bookmarkService;
        this.responsesReportsService = responsesReportsService;
        this.notificationService = notificationService;
    }

    public Page<Responses> getPostResponses(String postId, Pageable pageable, String authUserEmail) {
        User authUser = userService.getUserByEmail(authUserEmail);

        Posts post = postsService.getPostById(postId);
        Page<Responses> responses = responsesRepository.findAllByPost(post, pageable);
        List<Responses> sortResponses = new ArrayList<>();

        responses.forEach(response -> {
            if (!userService.haveIBlockedThisUser(post.getUser(), response.getUser())) {
                response.getUser().setHaveIBlocked(userService.haveIBlockedThisUser(authUser, response.getUser()));
                response.getUser().setIsMeFollower(followersService.checkSubscriptionToUser(authUser, response.getUser()));
                response.setDidMeLikeThisResponse(responseLikesService.didMeLikedThisResponse(authUser, response));
                response.setDidMeSaveThisResponse(bookmarkService.didMeBookmarkThisResponse(authUser, response));
                response.setDidMeReportThisResponse(responsesReportsService.didMeReportThisResponse(authUser, response));
                sortResponses.add(response);
            }
        });
        return new PageImpl<>(sortResponses, responses.getPageable(), responses.getTotalElements());
    }

    public Responses getResponseById(Integer id) {
        return responsesRepository.findById(id).orElse(null);
    }

    public Responses newResponse(Responses response, String postid, String authUserEmail) {
        User authUser = userService.getUserByEmail(authUserEmail);
        Posts post = postsService.getPostById(postid);

        if (!userService.haveMeBlockedByThisUser(authUser, post.getUser())) {
            response.setUser(authUser);
            response.setPost(post);
            post.setTotalResponses(post.getTotalResponses() + 1);

            postsService.savePost(post);
            saveResponse(response);

            notificationService.newNotification(authUser, post.getUser(), "RESPONSE", null, response);
            return response;
        }

        return null;
    }

    public void saveResponse(Responses response) {
        responsesRepository.save(response);
    }

    public ShortResponsePageDto getUserResponses(String userEmail, String authUserEmail, Pageable pageable) {
        User authUser = userService.getUserByEmail(authUserEmail);
        User profileUser = userService.getUserByEmail(userEmail);

        if (!userService.haveMeBlockedByThisUser(authUser, profileUser)) {
            Page<Responses> allByUser = responsesRepository.findAllByUser(profileUser, pageable);
            allByUser.getContent().forEach(response -> {
                response.getUser().setHaveIBlocked(userService.haveIBlockedThisUser(authUser, response.getUser()));
                response.getUser().setIsMeFollower(followersService.checkSubscriptionToUser(authUser, response.getUser()));
                response.setDidMeLikeThisResponse(responseLikesService.didMeLikedThisResponse(authUser, response));
                response.setDidMeSaveThisResponse(bookmarkService.didMeBookmarkThisResponse(authUser, response));
                response.setDidMeReportThisResponse(responsesReportsService.didMeReportThisResponse(authUser, response));
            });
            return new ShortResponsePageDto(allByUser.getContent(), allByUser.getNumberOfElements(), allByUser.getTotalElements());
        } else {
            throw new BlockedUserEx("You were blocked by this user");
        }
    }
}
