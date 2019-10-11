package com.talker.talker.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Data
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @NotEmpty
    private String content;
    @ManyToOne
    private User user;
    private Long date;
    private Boolean watched;

    @Transient
    private Boolean isEdited;
    @Transient
    private Boolean isFavorite;

    @PrePersist
    protected void onCreate() {
        this.date = new Date().getTime();
    }

    @ManyToOne
    @JsonIgnore
    private Chat chat;

    @ManyToMany(mappedBy = "favoriteMessages")
    @JsonIgnore
    private List<User> users = new ArrayList<>();

    @OneToMany(mappedBy = "message",cascade = CascadeType.ALL)
    private List<ChatFiles> files = new ArrayList<>();

}
