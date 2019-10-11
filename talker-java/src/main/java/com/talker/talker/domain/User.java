package com.talker.talker.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonView;
import lombok.*;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonView(Views.SuperShortPost.class)
    private Integer id;

    @JsonView(Views.SuperShortPost.class)
    private String name;
    @JsonView(Views.SuperShortPost.class)
    private String email;
    @JsonView(Views.SuperShortPost.class)
    private String description;
    @JsonView(Views.SuperShortPost.class)
    private String photo;
    @JsonView(Views.SuperShortPost.class)
    private Long login_date;
    @JsonView(Views.SuperShortPost.class)
    private Integer totalFollowers;
    @JsonView(Views.SuperShortPost.class)
    private Integer totalFollowing;
    private String facebookURL;
    private String twitterURL;
    private String instagramURL;
    private String vkontakteURL;
    private String profileTheme;

    @NotNull
    @Enumerated(EnumType.STRING)
    private AuthProvider provider;

    @Transient
    @JsonView(Views.SuperShortPost.class)
    private Boolean isMeFollower;
    @Transient
    private Boolean haveMeBlocked;
    @Transient
    @JsonView(Views.SuperShortPost.class)
    private Boolean haveIBlocked;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "user")
    @JsonIgnore
    private Set<Posts> posts = new HashSet<>();

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "user")
    @JsonIgnore
    private List<Responses> responses = new ArrayList<>();

    @ManyToMany
    @JoinTable(name = "users_bookmarked_posts",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "post_id"))
    @JsonIgnore
    private Set<Posts> bookmarkedPosts = new HashSet<>();

    @ManyToMany
    @JoinTable(name = "users_bookmarked_responses",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "response_id"))
    @JsonIgnore
    private List<Responses> bookmarkedResponses = new ArrayList<>();

    @ManyToMany
    @JoinTable(name = "follower_followings",
            joinColumns = @JoinColumn(name = "follower_id"),
            inverseJoinColumns = @JoinColumn(name = "following_id"))
    @JsonIgnore
    private List<User> followings = new ArrayList<>();

    @ManyToMany
    @JoinTable(name = "followings_followers",
            joinColumns = @JoinColumn(name = "following_id"),
            inverseJoinColumns = @JoinColumn(name = "follower_id"))
    @JsonIgnore
    private List<User> followers = new ArrayList<>();

    @ManyToMany
    @JoinTable(name = "users_blocked",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "blocked_id"))
    @JsonIgnore
    private List<User> blockedUsers = new ArrayList<>();

    @ManyToMany
    @JoinTable(name = "likes_posts",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "post_id"))
    @JsonIgnore
    private Set<Posts> postLikes = new HashSet<>();

    @ManyToMany
    @JoinTable(name = "likes_responses",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "response_id"))
    @JsonIgnore
    private List<Responses> responseLikes = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "user", orphanRemoval = true)
    @JsonIgnore
    private List<PostsReports> postsReports = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "userOne", orphanRemoval = true)
    @JsonIgnore
    private List<Chat> userOne = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "userTwo", orphanRemoval = true)
    @JsonIgnore
    private List<Chat> userTwo = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "toUser", orphanRemoval = true)
    @JsonIgnore
    private List<Notification> toUser = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "fromUser", orphanRemoval = true)
    @JsonIgnore
    private List<Notification> fromUser = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "user", orphanRemoval = true)
    @JsonIgnore
    private List<ChatMessage> messages = new ArrayList<>();

    @ManyToMany
    @JoinTable(name = "user_favorite_messages",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "message_id"))
    @JsonIgnore
    private List<ChatMessage> favoriteMessages = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        this.login_date = new Date().getTime();
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return getId().equals(user.getId()) &&
                getName().equals(user.getName()) &&
                getEmail().equals(user.getEmail());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId());
    }
}
