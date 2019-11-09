package com.talker.talker.repository;

import com.talker.talker.domain.Groups;
import com.talker.talker.domain.GroupsRoles;
import com.talker.talker.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GroupRolesRepository extends JpaRepository<GroupsRoles,Long> {
    Optional<GroupsRoles> findByGroupAndUser(Groups group, User user);
    Page<GroupsRoles> findByGroupAndUser_NameContaining(Groups group, String userName,Pageable pageable);
    Page<GroupsRoles> findByGroup(Groups group, Pageable pageable);
}
