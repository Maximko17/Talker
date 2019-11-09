package com.talker.talker.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonView;
import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.util.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Posts{

    @Id
    @JsonView(Views.SuperShortPost.class)
    private String id;

    @JsonView(Views.SuperShortPost.class)
    private String title;

    @JsonView(Views.ShortPost.class)
    private String subtitle;
    @JsonView(Views.ShortPost.class)
    private String main_theme;
    @Size(max = 10000)
    private String text;
    @JsonView(Views.SuperShortPost.class)
    private String main_image;
    @Column(name = "post_date")
    @JsonView(Views.ShortPost.class)
    private Long postDate;
    @JsonView(Views.ShortPost.class)
    private Short reading_time;
    @JsonView(Views.SuperShortPost.class)
    private Integer totalLikes;
    @JsonView(Views.SuperShortPost.class)
    private Integer totalResponses;
    @JsonView(Views.ShortPost.class)
    private Boolean isDraft;

    @Transient
    @JsonView(Views.ShortPost.class)
    private Boolean didMeLikeThisPost;
    @Transient
    @JsonView(Views.ShortPost.class)
    private Boolean didMeSaveThisPost;
    @Transient
    @JsonView(Views.ShortPost.class)
    private Boolean didMeReportThisPost;

    @ManyToOne
    @JsonView(Views.SuperShortPost.class)
    private User user;

    @ManyToOne
    private Groups group;

    @ManyToMany
    @JoinTable(name = "posts_tags",
    joinColumns = @JoinColumn(name = "post_id"),
    inverseJoinColumns = @JoinColumn(name = "tag_id"))
    private List<Tags> tags = new ArrayList<>();

    @ManyToMany(mappedBy = "bookmarkedPosts")
    @JsonIgnore
    private Set<User> users = new HashSet<>();

    @ManyToMany(mappedBy = "postLikes")
    @JsonIgnore
    private Set<User> usersLikes = new HashSet<>();

    @OneToMany(mappedBy = "post",cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Responses> responses = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL,mappedBy = "user",orphanRemoval = true)
    @JsonIgnore
    private List<PostsReports> postsReports =new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL,mappedBy = "post")
    @JsonIgnore
    private List<PostImages> postImages = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL,mappedBy = "post")
    @JsonIgnore
    private List<Notification> notifications = new ArrayList<>();

    @PrePersist
    protected void onCreate(){
        this.postDate = new Date().getTime();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Posts)) return false;
        Posts posts = (Posts) o;
        return getId().equals(posts.getId()) &&
                Objects.equals(getTitle(), posts.getTitle()) &&
                Objects.equals(getSubtitle(), posts.getSubtitle()) &&
                Objects.equals(getMain_theme(), posts.getMain_theme()) &&
                Objects.equals(getText(), posts.getText()) &&
                Objects.equals(getPostDate(), posts.getPostDate());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId());
    }
}
