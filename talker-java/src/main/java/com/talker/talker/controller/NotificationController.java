package com.talker.talker.controller;

import com.fasterxml.jackson.annotation.JsonView;
import com.talker.talker.domain.Views;
import com.talker.talker.dto.ShortNotificationPageDto;
import com.talker.talker.dto.ShortPageDto;
import com.talker.talker.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@CrossOrigin
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/notifications/count")
    public Integer countAllNewNotifications(Principal principal){
        return notificationService.countAllNewNotifications(principal.getName());
    }

    @GetMapping("/notifications/last")
    @JsonView(Views.ShortNotification.class)
    public ShortNotificationPageDto getLastNotifications(Principal principal){
        return notificationService.getLastNotifications(principal.getName());
    }

    @GetMapping("/notifications/all")
    @JsonView(Views.ShortNotification.class)
    public ShortPageDto getAllNotifications(Principal principal, @PageableDefault Pageable pageable){
        return notificationService.getAllNotifications(principal.getName(),pageable);
    }

    @PostMapping("/notifications/read-all")
    public void getAllNotifications(Principal principal){
        notificationService.readAllNotifications(principal.getName());
    }

    @DeleteMapping("/notifications/{fromUser}/delete")
    public void deleteMessageNotifications(@PathVariable Integer fromUser,Principal principal){
        notificationService.deleteMessageNotification(fromUser,principal.getName());
    }

    @DeleteMapping("/notification/{id}/delete")
    public void deleteNotification(@PathVariable Long id){
        notificationService.deleteNotification(id);
    }
}
