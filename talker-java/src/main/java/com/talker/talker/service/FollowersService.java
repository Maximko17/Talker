package com.talker.talker.service;

import com.talker.talker.domain.Groups;
import com.talker.talker.domain.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Service;

@Service
public class FollowersService {

    private UserService userService;
    private NotificationService notificationService;
    private GroupService groupService;

    @Autowired
    public void setUserService(UserService userService) {
        this.userService = userService;
    }
    @Autowired
    public void setNotificationService(NotificationService notificationService) {
        this.notificationService = notificationService;
    }
    @Autowired
    public void setGroupService(GroupService groupService) {
        this.groupService = groupService;
    }

    public Boolean checkSubscriptionToUser(User followerUser, User followingUser) {
        return followingUser.getFollowers().contains(followerUser);
    }

    public Page<User> getFollowers(String profileUserEmail, String authUserEmail) {
        User authUser = userService.getUserByEmail(authUserEmail);
        User profileUser = userService.getUserByEmail(profileUserEmail);

        profileUser.getFollowers().forEach(follower -> {
            follower.setIsMeFollower(checkSubscriptionToUser(authUser, follower));
            follower.setHaveIBlocked(userService.haveIBlockedThisUser(authUser, follower));
        });

        return new PageImpl<>(profileUser.getFollowers());
    }

    public Page<User> getFollowings(String profileUserEmail, String authUserEmail) {
        User authUser = userService.getUserByEmail(authUserEmail);
        User profileUser = userService.getUserByEmail(profileUserEmail);

        profileUser.getFollowings().forEach(following -> {
                    following.setIsMeFollower(checkSubscriptionToUser(authUser,following));
                    following.setHaveIBlocked(userService.haveIBlockedThisUser(authUser, following));
                }
        );

        return new PageImpl<>(profileUser.getFollowings());
    }


    public void subscribeToUser(Integer following, String follower) {
        User followingUser = userService.getUserById(following);
        User followerUser = userService.getUserByEmail(follower);

        if (!followingUser.getFollowers().contains(followerUser) && !followingUser.equals(followerUser)
                && !userService.haveIBlockedThisUser(followerUser, followingUser) && !userService.haveMeBlockedByThisUser(followerUser,followingUser)) {
            followingUser.getFollowers().add(followerUser);
            followerUser.getFollowings().add(followingUser);

            followingUser.setTotalFollowers(followingUser.getTotalFollowers() + 1);
            followerUser.setTotalFollowing(followerUser.getTotalFollowing() + 1);

            userService.saveUser(followingUser);
            userService.saveUser(followerUser);

            notificationService.newNotification(followerUser,followingUser,"FOLLOW",null,null);
        }
    }

    public void unsubscribeFromUser(Integer following, String follower) {
        User followingUser = userService.getUserById(following);
        User followerUser = userService.getUserByEmail(follower);

        if (followingUser.getFollowers().contains(followerUser)) {
            followingUser.getFollowers().remove(followerUser);
            followerUser.getFollowings().remove(followingUser);

            followingUser.setTotalFollowers(followingUser.getTotalFollowers() - 1);
            followerUser.setTotalFollowing(followerUser.getTotalFollowing() - 1);

            userService.saveUser(followingUser);
            userService.saveUser(followerUser);
        }
    }

    public void subscribeToGroup(String groupURI, String follower) {
        Groups group = groupService.getGroupByURI(groupURI);
        User followerUser = userService.getUserByEmail(follower);

        if (!followerUser.getGroups().contains(group)){
            followerUser.getGroups().add(group);
            group.setTotalFollowers(group.getTotalFollowers() + 1);
            group.getUsers().add(followerUser);

            userService.saveUser(followerUser);
        }
    }

    public void unsubscribeFromGroup(String groupURI, String follower) {
        Groups group = groupService.getGroupByURI(groupURI);
        User followerUser = userService.getUserByEmail(follower);

        if (followerUser.getGroups().contains(group)){
            followerUser.getGroups().remove(group);
            group.setTotalFollowers(group.getTotalFollowers() - 1);
            group.getUsers().remove(followerUser);

            userService.saveUser(followerUser);
        }

    }


}
