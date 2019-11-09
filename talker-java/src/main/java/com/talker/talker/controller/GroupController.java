package com.talker.talker.controller;

import com.talker.talker.domain.Groups;
import com.talker.talker.domain.GroupsRoles;
import com.talker.talker.domain.User;
import com.talker.talker.dto.ShortGroupPageDto;
import com.talker.talker.dto.ShortPageDto;
import com.talker.talker.service.GroupService;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.security.Principal;
import java.util.List;

@RestController
@CrossOrigin
public class GroupController {

    private final GroupService groupService;
    private final ExceptionMapHandler exceptionMapHandler;

    public GroupController(GroupService groupService, ExceptionMapHandler exceptionMapHandler) {
        this.groupService = groupService;
        this.exceptionMapHandler = exceptionMapHandler;
    }

    @PostMapping("/groups/new-group")
    public ResponseEntity<?> createNewGroup(@RequestBody Groups group, Principal principal) {
        return new ResponseEntity<>(groupService.createNewGroup(group, principal.getName()), HttpStatus.CREATED);
    }

    @PutMapping(value = "/group/edit-group", consumes = "multipart/form-data")
    public ResponseEntity<?> editGroup(@Valid @RequestPart("group") Groups group, @RequestPart(value = "image", required = false) MultipartFile image,
                                       Principal principal, BindingResult result) {
        ResponseEntity<?> errorMap = exceptionMapHandler.exceptionResponse(result);
        if (errorMap != null) return errorMap;
        
        return new ResponseEntity<>(groupService.editGroup(group, image, principal.getName()), HttpStatus.OK);
    }

    @PostMapping(value = "/group/update-banner", consumes = "multipart/form-data")
    public ResponseEntity<?> updateBanner(@Valid @RequestPart("group") Groups group, @RequestPart(value = "image") MultipartFile image, Principal principal, BindingResult result) {
        ResponseEntity<?> errorMap = exceptionMapHandler.exceptionResponse(result);
        if (errorMap != null) return errorMap;

        return new ResponseEntity<>(groupService.updateBanner(group, image, principal.getName()), HttpStatus.OK);
    }

    @GetMapping("/group/{groupURI}")
    public ResponseEntity<Groups> getGroup(@PathVariable String groupURI, Principal principal) {
        return new ResponseEntity<>(groupService.getGroup(groupURI,principal.getName()), HttpStatus.OK);
    }

    @GetMapping("/group/{groupURI}/edit")
    public ResponseEntity<Groups> checkIsMeAdmin(@PathVariable String groupURI, Principal principal) {
        return new ResponseEntity<>(groupService.getGroup(groupURI,principal.getName()), HttpStatus.OK);
    }

    @GetMapping("/group/{groupURI}/users")
    public ResponseEntity<ShortPageDto<List<User>>> getGroupUsers(@PathVariable String groupURI, @RequestParam("search") String userName, @PageableDefault Pageable pageable) {
        return new ResponseEntity<>(groupService.getGroupUsers(groupURI,userName,pageable), HttpStatus.OK);
    }

    @GetMapping("/group/{groupURI}/roles")
    public ResponseEntity<ShortPageDto> getGroupRoles(@PathVariable String groupURI,@RequestParam("search") String userName, @PageableDefault Pageable pageable) {
        return new ResponseEntity<>(groupService.getGroupRoles(groupURI,userName,pageable), HttpStatus.OK);
    }

    @PostMapping("/group/{groupURI}/save-role")
    public ResponseEntity<GroupsRoles> saveUserRole(@PathVariable String groupURI, @RequestBody GroupsRoles groupRole, Principal principal) {
        return new ResponseEntity<>(groupService.saveUserRole(groupURI,groupRole,principal.getName()), HttpStatus.OK);
    }

    @DeleteMapping("/group/{groupURI}/user/{useremail}/delete-role")
    public ResponseEntity deleteUserRole(@PathVariable String groupURI,@PathVariable String useremail, Principal principal) {
        groupService.deleteUserRole(groupURI,useremail,principal.getName());
        return ResponseEntity.ok().body("Deleted");
    }

    @GetMapping("/group/{groupURI}/bans")
    public ResponseEntity<ShortPageDto> getBannedUsers(@PathVariable String groupURI,@RequestParam("search") String userName, @PageableDefault Pageable pageable) {
        return new ResponseEntity<>(groupService.getBannedUsers(groupURI,userName,pageable), HttpStatus.OK);
    }

    @PostMapping("/group/{groupURI}/user/{useremail}/ban")
    public ResponseEntity banUser(@PathVariable String groupURI,@PathVariable String useremail, Principal principal) {
        groupService.banUser(groupURI,useremail,principal.getName());
        return ResponseEntity.ok().body("Banned");
    }

    @DeleteMapping("/group/{groupURI}/user/{useremail}/unban")
    public ResponseEntity unbanUser(@PathVariable String groupURI,@PathVariable String useremail, Principal principal) {
        groupService.unbanUser(groupURI,useremail,principal.getName());
        return ResponseEntity.ok().body("Unbanned");
    }

    @GetMapping("/groups")
    public ResponseEntity<ShortGroupPageDto> getGroups(Principal principal, @PageableDefault Pageable pageable) {
        return new ResponseEntity<>(groupService.getGroups(principal.getName(), pageable), HttpStatus.OK);
    }



}
