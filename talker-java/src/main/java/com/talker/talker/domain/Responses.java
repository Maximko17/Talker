package com.talker.talker.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonView;
import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Data
public class Responses {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonView(Views.SuperShortResponse.class)
    private Integer id;

    @Size(min = 3,max = 500)
    @JsonView(Views.SuperShortResponse.class)
    @NotNull
    private String text;
    @JsonView(Views.SuperShortResponse.class)
    private Long date;
    @JsonView(Views.ShortResponse.class)
    private Integer totalLikes;

    @Transient
    @JsonView(Views.ShortResponse.class)
    private Boolean didMeLikeThisResponse;
    @Transient
    @JsonView(Views.ShortResponse.class)
    private Boolean didMeSaveThisResponse;
    @Transient
    @JsonView(Views.ShortResponse.class)
    private Boolean didMeReportThisResponse;

    @ManyToOne
    @JsonView(Views.ShortResponse.class)
    private User user;

    @ManyToOne
    @JsonView(Views.SuperShortResponse.class)
    private Posts post;

    @ManyToMany(mappedBy = "responseLikes")
    @JsonIgnore
    private List<User> usersLikes = new ArrayList<>();

    @ManyToMany(mappedBy = "bookmarkedResponses")
    @JsonIgnore
    private List<User> users = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL,mappedBy = "response")
    @JsonIgnore
    private List<Notification> notifications = new ArrayList<>();

    @PrePersist
    protected void onCreate(){
        this.date = new Date().getTime();
        this.totalLikes = 0;
    }

}
