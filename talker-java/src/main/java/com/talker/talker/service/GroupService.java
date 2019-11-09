package com.talker.talker.service;

import com.talker.talker.domain.GroupBanner;
import com.talker.talker.domain.Groups;
import com.talker.talker.domain.GroupsRoles;
import com.talker.talker.domain.User;
import com.talker.talker.dto.ShortGroupPageDto;
import com.talker.talker.dto.ShortPageDto;
import com.talker.talker.exceptions.NotFoundEx;
import com.talker.talker.repository.GroupRepository;
import com.talker.talker.repository.GroupRolesRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class GroupService {

    private final GroupRepository groupRepository;
    private final UserService userService;
    private final GroupRolesRepository groupRolesRepository;
    private final ImageService imageService;

    public GroupService(GroupRepository groupRepository, UserService userService,
                        GroupRolesRepository groupRolesRepository, ImageService imageService) {
        this.groupRepository = groupRepository;
        this.userService = userService;
        this.groupRolesRepository = groupRolesRepository;
        this.imageService = imageService;
    }

    public Boolean isMeFollowThisGroup(User authUser, Groups group) {
        return authUser.getGroups().contains(group);
    }

    public Boolean isMeGroupAdmin(User authUser, Groups group) {
        Optional<GroupsRoles> groupsRole = groupRolesRepository.findByGroupAndUser(group, authUser);
        if (groupsRole.isPresent()) {
            GroupsRoles role = groupsRole.get();
            return role.getRole().equals("ADMIN") || role.getRole().equals("CREATOR");
        } else {
            return false;
        }
    }

    public Boolean isUserAlreadyBanned(User user, Groups group) {
        return group.getBannedUsers().contains(user);
    }

    public Groups createNewGroup(Groups group, String authUserEmail) {
        User user = userService.getUserByEmail(authUserEmail);

        Groups newGroup = new Groups();
        newGroup.setUri(group.getUri());
        newGroup.setName(group.getName());
        newGroup.setTopic(group.getTopic());
        newGroup.setType(group.getType());
        newGroup.setImage("https://talker-basket.s3.us-east-2.amazonaws.com/groups/default-image.jpg");
        newGroup.setTotalFollowers(0);

        GroupsRoles role = new GroupsRoles();
        role.setRole("CREATOR");
        role.setGroup(newGroup);
        role.setUser(user);

        user.getGroups().add(newGroup);
        user.getGroupsRoles().add(role);
        userService.saveUser(user);

        return newGroup;
    }

    public Groups editGroup(Groups group, MultipartFile group_image, String authUserEmail) {
        User authUser = userService.getUserByEmail(authUserEmail);
        Groups updateGroup = groupRepository.findById(group.getId()).orElse(null);

        if (isMeGroupAdmin(authUser, updateGroup) && updateGroup != null) {
            updateGroup.setUri(group.getUri());
            updateGroup.setName(group.getName());
            updateGroup.setTopic(group.getTopic());
            updateGroup.setType(group.getType());
            updateGroup.setDescription(group.getDescription());
            updateGroup.setImage(imageService.saveGroupImage(group_image));

            groupRepository.save(updateGroup);
        }
        return updateGroup;
    }

    public Groups updateBanner(Groups group, MultipartFile banner_image, String authUserEmail) {
        User authUser = userService.getUserByEmail(authUserEmail);
        Groups updateGroup = groupRepository.findByUri(group.getUri());

        if (isMeGroupAdmin(authUser, updateGroup) && updateGroup != null) {
            GroupBanner banner;
            if (updateGroup.getBanner() == null){
                 banner = new GroupBanner();
                 banner.setGroup(updateGroup);
            }else{
                banner = updateGroup.getBanner();
            }
            banner.setImage(imageService.saveBannerImage(banner_image));
            updateGroup.setBanner(banner);
            groupRepository.save(updateGroup);
        }
        return null;
    }

    public Groups getGroup(String uri, String authUserEmail) {
        User authUser = userService.getUserByEmail(authUserEmail);

        Groups group = groupRepository.findByUri(uri);
        if (group != null) {
            group.setIsMeAdmin(isMeGroupAdmin(authUser, group));
            group.setIsMeFollower(isMeFollowThisGroup(authUser, group));

            return group;
        } else {
            throw new NotFoundEx("Group not found");
        }
    }

    public ShortGroupPageDto getGroups(String authUserEmail, Pageable pageable) {
        User user = userService.getUserByEmail(authUserEmail);

        Set<Groups> groups = user.getGroups().stream().limit(pageable.getPageSize()).collect(Collectors.toSet());
        if (groups.size() != 0) {
            groups.forEach(group -> group.setIsMeFollower(isMeFollowThisGroup(user, group)));
        }
        return new ShortGroupPageDto(groups, groups.size(), pageable.getPageSize());
    }

    public ShortPageDto<List<User>> getGroupUsers(String groupURI, String searchedUserName, Pageable pageable) {
        Groups group = groupRepository.findByUri(groupURI);
        Page<User> users;
        if (searchedUserName.isEmpty()) {
            users = userService.getGroupUsers(group, pageable);
        } else {
            users = userService.getGroupUsersBySearch(group, searchedUserName, pageable);
        }

        return new ShortPageDto<>(users.getContent(), users.getNumberOfElements(), users.getTotalElements());
    }

    public ShortPageDto<List<GroupsRoles>> getGroupRoles(String groupURI, String searchedUserName, Pageable pageable) {
        Groups group = groupRepository.findByUri(groupURI);
        Page<GroupsRoles> roles;
        if (searchedUserName.isEmpty()) {
            roles = groupRolesRepository.findByGroup(group, pageable);
        } else {
            roles = groupRolesRepository.findByGroupAndUser_NameContaining(group, searchedUserName, pageable);
        }
        roles.forEach(role -> {
            role.getGroup().setIsMeFollower(true);
            role.getGroup().setIsMeAdmin(true);
        });

        return new ShortPageDto<>(roles.getContent(), roles.getNumberOfElements(), roles.getTotalElements());
    }

    public GroupsRoles saveUserRole(String groupURI, GroupsRoles role, String authUsermail) {
        Groups group = groupRepository.findByUri(groupURI);
        User user = userService.getUserByEmail(role.getUser().getEmail());
        User authUser = userService.getUserByEmail(authUsermail);

        GroupsRoles userGroupRole = groupRolesRepository.findByGroupAndUser(group, user).orElse(null);

        if (isMeGroupAdmin(authUser, group)) {
            if (userGroupRole != null) {
                userGroupRole.setRole(role.getRole());
                groupRolesRepository.save(userGroupRole);
            } else {
                userGroupRole = new GroupsRoles();
                userGroupRole.setRole(role.getRole());
                userGroupRole.setUser(user);
                userGroupRole.setGroup(group);
                groupRolesRepository.save(userGroupRole);
            }
        }

        return userGroupRole;
    }

    public void deleteUserRole(String groupURI, String usermail, String authUsermail) {
        Groups group = groupRepository.findByUri(groupURI);
        User user = userService.getUserByEmail(usermail);
        User authUser = userService.getUserByEmail(authUsermail);

        GroupsRoles groupDeleteRole = groupRolesRepository.findByGroupAndUser(group, user).orElse(null);
        GroupsRoles groupAuthRole = groupRolesRepository.findByGroupAndUser(group, authUser).orElse(null);

        if (groupAuthRole != null && groupAuthRole.getRole().equals("CREATOR") && groupDeleteRole != null) {
            groupRolesRepository.delete(groupDeleteRole);
        }
    }

    public ShortPageDto<List<User>> getBannedUsers(String groupURI, String searchedUserName, Pageable pageable) {
        Groups group = groupRepository.findByUri(groupURI);
        Page<User> users = userService.getBannedGroupUsers(group, searchedUserName, pageable);
        users.forEach(user -> user.setAmIBannedInAGroup(true));

        return new ShortPageDto<>(users.getContent(), users.getNumberOfElements(), users.getTotalElements());
    }


    public void banUser(String groupURI, String usermail, String authUsermail) {
        Groups group = groupRepository.findByUri(groupURI);
        User user = userService.getUserByEmail(usermail);
        User authUser = userService.getUserByEmail(authUsermail);

        GroupsRoles role = groupRolesRepository.findByGroupAndUser(group, user).orElse(null);

        if (!isUserAlreadyBanned(user, group)) {
            if (isMeGroupAdmin(authUser, group)) {
                if (role != null) {
                    user.getGroupsRoles().remove(role);
                    group.getGroupsRoles().remove(role);
                    role.setGroup(null);
                    role.setUser(null);
                }
                group.getBannedUsers().add(user);
                groupRepository.save(group);
                userService.saveUser(user);
            }
        }

    }

    public void unbanUser(String groupURI, String usermail, String authUsermail) {
        Groups group = groupRepository.findByUri(groupURI);
        User user = userService.getUserByEmail(usermail);
        User authUser = userService.getUserByEmail(authUsermail);
        Boolean isMeAdmin = isMeGroupAdmin(authUser, group);
        Boolean isUserAlredyBanned = isUserAlreadyBanned(user, group);

        if (isUserAlredyBanned) {
            if (isMeAdmin) {
                group.getBannedUsers().remove(user);
                groupRepository.save(group);
            }
        }
    }

    public Groups getGroupByURI(String uri) {
        Groups group = groupRepository.findByUri(uri);
        if (group != null) {
            return group;
        } else {
            throw new NotFoundEx("Group not found");
        }
    }

    public void saveGroup(Groups group) {
        groupRepository.save(group);
    }


}
