package com.talker.talker.domain;

import lombok.*;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
public class Chat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long chatId;

    @ManyToOne
    private User userOne;

    @ManyToOne
    private User userTwo;

    @OneToMany(mappedBy = "chat",cascade = CascadeType.ALL)
    private List<ChatMessage> chatMessages = new ArrayList<>();

    private Long lastMessageTime;

}

