package com.talker.talker.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonView;
import lombok.Data;

import javax.persistence.*;

@Entity
@Data
public class PostImages {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonView(Views.SuperShortPost.class)
    private Long id;

    private String name;
    private String sequence;

    @ManyToOne(cascade = CascadeType.PERSIST)
    @JsonIgnore
    private Posts post;
}
