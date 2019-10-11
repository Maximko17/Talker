package com.talker.talker.service;

import com.talker.talker.domain.Notification;
import com.talker.talker.domain.Posts;
import com.talker.talker.domain.Responses;
import com.talker.talker.domain.User;
import com.talker.talker.dto.ShortNotificationPageDto;
import com.talker.talker.dto.ShortPageDto;
import com.talker.talker.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserService userService;
    private final FollowersService followersService;
    private final SimpMessagingTemplate simpMessagingTemplate;

    public NotificationService(NotificationRepository notificationRepository, UserService userService, FollowersService followersService, SimpMessagingTemplate simpMessagingTemplate) {
        this.notificationRepository = notificationRepository;
        this.userService = userService;
        this.followersService = followersService;
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    public Notification newNotification(User fromUser, User toUser, String type, Posts post, Responses response) {
        if (!fromUser.equals(toUser)) {
            Notification notification = new Notification();
            notification.setFromUser(fromUser);
            notification.setToUser(toUser);
            notification.setType(type);
            notification.setWatched(false);
            if (post != null) {
                notification.setPost(post);
            }
            if (response != null) {
                notification.setResponse(response);
            }
            notificationRepository.save(notification);

            simpMessagingTemplate.convertAndSend("/topic/notification/" + toUser.getId(), notification);
            return notification;
        }
        return null;
    }

    public Integer countAllNewNotifications(String authUserEmail) {
        User authUser = userService.getUserByEmail(authUserEmail);
        return notificationRepository.countAllByToUserAndTypeNotAndWatchedFalse(authUser, "MESSAGE");
    }

    public ShortNotificationPageDto getLastNotifications(String authUserEmail) {
        User authUser = userService.getUserByEmail(authUserEmail);
        List<Notification> notifications = notificationRepository.findTop10ByToUserAndTypeNotOrderByDateDesc(authUser, "MESSAGE");
        Boolean hasNewMessages = notificationRepository.existsByToUserAndType(authUser, "MESSAGE");

        return new ShortNotificationPageDto(notifications, 10, 10, hasNewMessages);
    }

    public ShortPageDto getAllNotifications(String authUserEmail, Pageable pageable) {
        User authUser = userService.getUserByEmail(authUserEmail);
        Page<Notification> notifications = notificationRepository.findAllByToUserAndTypeNotOrderByDateDesc(authUser, "MESSAGE", pageable);
        Boolean hasNewMessages = notificationRepository.existsByToUserAndType(authUser, "MESSAGE");
        notifications.forEach(notification -> notification.getFromUser().setIsMeFollower(followersService.checkSubscriptionToUser(authUser, notification.getFromUser())));

        return new ShortNotificationPageDto(notifications.getContent(), notifications.getNumberOfElements(), notifications.getTotalElements(), hasNewMessages);
    }

    public void readAllNotifications(String authUserEmail) {
        User authUser = userService.getUserByEmail(authUserEmail);
        List<Notification> notifications = notificationRepository.findAllByToUserAndTypeNot(authUser, "MESSAGE");
        notifications.forEach(notification -> notification.setWatched(true));

        notificationRepository.saveAll(notifications);
    }


    @Transactional
    public void deleteMessageNotification(Integer fromUserId, String authUserEmail) {
        User fromUser = userService.getUserById(fromUserId);
        User toUser = userService.getUserByEmail(authUserEmail);

        notificationRepository.deleteAllByFromUserAndToUserAndType(fromUser, toUser, "MESSAGE");
    }

    public void deleteNotification(Long id) {
        notificationRepository.deleteById(id);
    }
}
