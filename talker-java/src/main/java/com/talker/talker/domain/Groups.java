package com.talker.talker.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.HashSet;
import java.util.Set;

@Entity
@Data
@EqualsAndHashCode(exclude = {"users","bannedUsers"})
@Table(name = "grupe")
public class Groups {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotEmpty
    @NotNull
    private String uri;
    @NotEmpty
    @NotNull
    private String name;
    private String image;
    private String description;
    @NotEmpty
    @NotNull
    private String topic;
    @NotEmpty
    @NotNull
    private String type;
    private Integer totalFollowers;

    @Transient
    private Boolean isMeFollower;
    @Transient
    private Boolean isMeAdmin;

    @OneToOne(mappedBy = "group",cascade = CascadeType.ALL)
    private GroupBanner banner;


    @ManyToMany(mappedBy = "groups", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JsonIgnore
    private Set<User> users = new HashSet<>();

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "group")
    @JsonIgnore
    private Set<Posts> posts = new HashSet<>();

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "group")
    @JsonIgnore
    private Set<GroupsRoles> groupsRoles = new HashSet<>();

    @ManyToMany( cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(name = "groups_bans",
            joinColumns = @JoinColumn(name = "group_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id"))
    @JsonIgnore
    private Set<User> bannedUsers = new HashSet<>();



}
