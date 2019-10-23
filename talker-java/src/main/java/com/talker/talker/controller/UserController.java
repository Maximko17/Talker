package com.talker.talker.controller;

import com.talker.talker.domain.User;
import com.talker.talker.dto.ShortPageDto;
import com.talker.talker.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;

@RestController
@CrossOrigin
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile/{usermail}")
    public ResponseEntity<User> getUserProfile(@PathVariable String usermail, Principal principal){
        return new ResponseEntity<>(userService.getUserProfile(usermail,principal.getName()), HttpStatus.OK);
    }

    @GetMapping("/profiles/get-by-search")
    public ResponseEntity<ShortPageDto> getBySearch(@RequestParam("username") String username, @PageableDefault(size = 3) Pageable pageable, Principal principal){
        return new ResponseEntity<>(userService.getBySearch(username,pageable,principal.getName()), HttpStatus.OK);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable Integer userId, Principal principal){
        return new ResponseEntity<>(userService.getUserProfile(userId,principal.getName()), HttpStatus.OK);
    }

    @PostMapping(value = "/profile/edit",consumes = {"multipart/form-data"})
    public ResponseEntity<String> editUserProfile(@RequestPart("user") User user,
                                                  @RequestPart(value = "photo",required = false) MultipartFile photo, Principal principal){
       return new ResponseEntity<>(userService.editUserProfile(user,photo,principal),HttpStatus.OK);
    }

    @GetMapping("/profile/getBlockedUsers")
    public ResponseEntity<Page<User>> getBlockedUsers(Principal principal){
        return new ResponseEntity<>(userService.getBlockedUsers(principal.getName()), HttpStatus.OK);
    }

    @PostMapping("/profile/{usermail}/block")
    public void blockUserProfile(@PathVariable String usermail, Principal principal){
        userService.blockUser(usermail,principal.getName());
    }

    @DeleteMapping("/profile/{usermail}/unblock")
    public void unBlockUserProfile(@PathVariable String usermail, Principal principal){
        userService.unBlockUser(usermail,principal.getName());
    }


}
