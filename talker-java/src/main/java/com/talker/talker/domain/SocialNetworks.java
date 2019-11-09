package com.talker.talker.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Data
public class SocialNetworks {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "socialNetwork", orphanRemoval = true)
    @JsonIgnore
    private Set<UsersSocialNetworks> usersSocialNetworks = new HashSet<>();
}
