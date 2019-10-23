package com.talker.talker.service;

import com.talker.talker.domain.User;
import com.talker.talker.dto.ShortPageDto;
import com.talker.talker.exceptions.NotFoundEx;
import com.talker.talker.repository.UserRepository;
import com.talker.talker.security.TokenProvider;
import jdk.nashorn.internal.objects.annotations.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;

@Service
public class UserService {

    private final UserRepository userRepository;
    private FollowersService followersService;
    private TokenProvider tokenProvider;
    private final ImageService imageService;

    @Autowired
    public void setFollowersService(FollowersService followersService) {
        this.followersService = followersService;
    }
    @Autowired
    public void setTokenProvider(TokenProvider tokenProvider) {
        this.tokenProvider= tokenProvider;
    }

    public UserService(UserRepository userRepository,
                 ImageService imageService) {
        this.userRepository = userRepository;
        this.imageService = imageService;
    }

    public Boolean haveIBlockedThisUser(User authUser, User aimUser) {
        return authUser.getBlockedUsers().contains(aimUser);
    }

    public Boolean haveMeBlockedByThisUser(User authUser, User aimUser) {
        return aimUser.getBlockedUsers().contains(authUser);
    }

    public User getUserProfile(String usermail, String authUserEmail) {
        User authUser = getUserByEmail(authUserEmail);
        User profileUser = getUserByEmail(usermail);

        profileUser.setHaveMeBlocked(haveMeBlockedByThisUser(authUser, profileUser));
        profileUser.setHaveIBlocked(haveIBlockedThisUser(authUser, profileUser));
        profileUser.setIsMeFollower(followersService.checkSubscriptionToUser(authUser, profileUser));
        return profileUser;
    }

    public User getUserProfile(Integer id, String authUserEmail) {
        User authUser = getUserByEmail(authUserEmail);
        User profileUser = getUserById(id);

        profileUser.setHaveMeBlocked(haveMeBlockedByThisUser(authUser, profileUser));
        profileUser.setHaveIBlocked(haveIBlockedThisUser(authUser, profileUser));
        profileUser.setIsMeFollower(followersService.checkSubscriptionToUser(authUser, profileUser));
        return profileUser;
    }

    public User getUserByEmail(String usermail) {
        return userRepository.findByEmail(usermail).orElseThrow(()->new NotFoundEx("User not found"));
    }

    public User getUserById(Integer id) {
        return userRepository.findById(id).orElseThrow(()->new NotFoundEx("User not found"));
    }

    public ShortPageDto getBySearch(String username, Pageable pageable, String authUserEmail) {
        User authUser = getUserByEmail(authUserEmail);
        Page<User> users = userRepository.findByNameContaining(username, pageable);
        users.forEach(user -> {
            user.setHaveMeBlocked(haveMeBlockedByThisUser(authUser, user));
            user.setHaveIBlocked(haveIBlockedThisUser(authUser, user));
            user.setIsMeFollower(followersService.checkSubscriptionToUser(authUser, user));
        });

        return new ShortPageDto(users.getContent(), users.getNumberOfElements(), users.getTotalElements());
    }

    public String editUserProfile(User request_user, MultipartFile photo, Principal principal) {
        User authUser = getUserByEmail(principal.getName());

        authUser.setName(request_user.getName());
        authUser.setDescription(request_user.getDescription());
        authUser.setProfileTheme(request_user.getProfileTheme());
        authUser.setFacebookURL(checkUrl(request_user.getFacebookURL(), "facebook.com"));
        authUser.setInstagramURL(checkUrl(request_user.getInstagramURL(), "instagram.com"));
        authUser.setTwitterURL(checkUrl(request_user.getTwitterURL(), "twitter.com"));
        authUser.setVkontakteURL(checkUrl(request_user.getVkontakteURL(), "vk.com"));
        if (photo != null) {
            authUser.setPhoto(imageService.saveUserImage(photo));
        }
        saveUser(authUser);

        return tokenProvider.generateRefreshToken(null, authUser);
    }

    public void blockUser(String usermail, String authUserEmail) {
        User authUser = getUserByEmail(authUserEmail);
        User profileUser = getUserByEmail(usermail);

        if (!authUser.equals(profileUser) && !haveIBlockedThisUser(authUser, profileUser)) {
            authUser.getBlockedUsers().add(profileUser);
            if (authUser.getFollowings().contains(profileUser)) {
                authUser.getFollowings().remove(profileUser);
                profileUser.getFollowers().remove(authUser);
                authUser.setTotalFollowing(authUser.getTotalFollowing() - 1);
                profileUser.setTotalFollowers(profileUser.getTotalFollowers() - 1);
            }
            saveUser(authUser);
            saveUser(profileUser);
        }
    }

    public Page<User> getBlockedUsers(String authUserEmail) {
        User authUser = getUserByEmail(authUserEmail);
        authUser.getBlockedUsers().forEach(user -> user.setHaveIBlocked(true));

        return new PageImpl<>(authUser.getBlockedUsers());
    }

    public void unBlockUser(String usermail, String authUserEmail) {
        User authUser = getUserByEmail(authUserEmail);
        User profileUser = getUserByEmail(usermail);

        authUser.getBlockedUsers().remove(profileUser);
        saveUser(authUser);
    }

    public User saveUser(User user) {
        userRepository.save(user);
        return user;
    }

    private String checkUrl(String url, String siteName) {
        if (url == null) {
            return null;
        } else {
            if (url.isEmpty()) {
                return null;
            } else {
                if (StringUtils.hasText("https") && StringUtils.hasText(siteName)) {
                    return StringUtils.trimAllWhitespace(url);
                } else {
                    return null;
                }
            }
        }
    }

}
