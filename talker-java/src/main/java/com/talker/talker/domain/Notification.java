package com.talker.talker.domain;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonView;
import lombok.Data;
import javax.persistence.*;
import java.util.Date;

@Entity
@Data
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonView(Views.ShortNotification.class)
    private Long id;

    @JsonView(Views.ShortNotification.class)
    private Boolean watched;
    @JsonView(Views.ShortNotification.class)
    private String type;
    @JsonView(Views.ShortNotification.class)
    private Long date;

    @ManyToOne
    @JsonIgnore
    private User toUser;

    @ManyToOne
    @JsonView(Views.ShortNotification.class)
    private User fromUser;

    @ManyToOne(cascade = CascadeType.PERSIST)
    @JsonView(Views.ShortNotification.class)
    private Posts post;

    @ManyToOne(cascade = CascadeType.PERSIST)
    @JsonView(Views.ShortNotification.class)
    private Responses response;

    @PrePersist
    protected void onCreate() {
        this.date = new Date().getTime();
    }

}
