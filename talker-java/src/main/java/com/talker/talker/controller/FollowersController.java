package com.talker.talker.controller;

import com.talker.talker.domain.User;
import com.talker.talker.service.FollowersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@CrossOrigin
public class FollowersController {

    private final FollowersService followersService;

    public FollowersController(FollowersService followersService) {
        this.followersService = followersService;
    }

    @GetMapping("/followers/{usermail}")
    public ResponseEntity<Page<User>> getUserFollowers(@PathVariable String usermail,Principal principal){
        return new ResponseEntity<>(followersService.getFollowers(usermail,principal.getName()), HttpStatus.OK);
    }

    @GetMapping("/followings/{usermail}")
    public ResponseEntity<Page<User>> getUserFollowings(@PathVariable String usermail,Principal principal){
        return new ResponseEntity<>(followersService.getFollowings(usermail,principal.getName()), HttpStatus.OK);
    }

    @PostMapping("/followers/subscribeToUser/{userId}")
    public void createUserChannel(@PathVariable Integer userId, Principal principal){
        followersService.subscribeToUser(userId,principal.getName());
    }

    @DeleteMapping("/followers/unsubscribeFromUser/{userId}")
    public void deleteUserChannel(@PathVariable Integer userId, Principal principal){
        followersService.unsubscribeFromUser(userId,principal.getName());
    }
}
