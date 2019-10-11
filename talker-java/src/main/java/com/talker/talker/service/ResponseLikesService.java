package com.talker.talker.service;

import com.talker.talker.domain.Responses;
import com.talker.talker.domain.User;
import com.talker.talker.dto.ShortResponsePageDto;
import com.talker.talker.exceptions.BlockedUserEx;
import com.talker.talker.repository.ResponsesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class ResponseLikesService {

    private final ResponsesService responsesService;
    private final ResponsesRepository responsesRepository;
    private final UserService userService;
    private final BookmarkService bookmarkService;
    private final ResponsesReportsService responsesReportsService;
    private final FollowersService followersService;
    private final NotificationService notificationService;

    public ResponseLikesService(ResponsesService responsesService, ResponsesRepository responsesRepository,
                                UserService userService, BookmarkService bookmarkService,
                                ResponsesReportsService responsesReportsService, FollowersService followersService,
                                NotificationService notificationService) {
        this.responsesService = responsesService;
        this.responsesRepository = responsesRepository;
        this.userService = userService;
        this.bookmarkService = bookmarkService;
        this.responsesReportsService = responsesReportsService;
        this.followersService = followersService;
        this.notificationService = notificationService;
    }

    public Boolean didMeLikedThisResponse(User user, Responses response) {
        return user.getResponseLikes().contains(response);
    }

    public ShortResponsePageDto getLikedResponses(String profileUsername,String authUserEmail, Pageable pageable) {
        User profileUser = userService.getUserByEmail(profileUsername);
        User authUser = userService.getUserByEmail(authUserEmail);

        if (!userService.haveMeBlockedByThisUser(authUser,profileUser)) {
            Page<Responses> responses = responsesRepository.findAllByUsersLikes(Collections.singletonList(profileUser), pageable);
            responses.forEach(response -> {
                response.setDidMeLikeThisResponse(didMeLikedThisResponse(authUser, response));
                response.setDidMeSaveThisResponse(bookmarkService.didMeBookmarkThisResponse(authUser, response));
                response.setDidMeReportThisResponse(responsesReportsService.didMeReportThisResponse(authUser,response));
                response.getUser().setHaveIBlocked(userService.haveIBlockedThisUser(authUser,response.getUser()));
                response.getUser().setIsMeFollower(followersService.checkSubscriptionToUser(authUser,response.getUser()));
            });
            return new ShortResponsePageDto(responses.getContent(),responses.getNumberOfElements(), responses.getTotalElements());
        }else {
            throw new BlockedUserEx("You were blocked by this user");
        }
    }

    public void likeResponse(Integer responseId, String authUserEmail) {
        User user = userService.getUserByEmail(authUserEmail);
        Responses response = responsesService.getResponseById(responseId);

        if (!user.getResponseLikes().contains(response)) {
            response.setTotalLikes(response.getTotalLikes() + 1);
            user.getResponseLikes().add(response);

            responsesService.saveResponse(response);
            userService.saveUser(user);

           notificationService.newNotification(user,response.getUser(),"RESPONSE_LIKE",null,response);
        }
    }

    public void unlikeResponse(Integer responseId, String authUserEmail) {
        User user = userService.getUserByEmail(authUserEmail);
        Responses response = responsesService.getResponseById(responseId);

        if (user.getResponseLikes().contains(response)) {
            response.setTotalLikes(response.getTotalLikes() - 1);
            user.getResponseLikes().remove(response);

            responsesService.saveResponse(response);
            userService.saveUser(user);
        }
    }


}
