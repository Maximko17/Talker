package com.talker.talker.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import javax.persistence.*;

import javax.persistence.Entity;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
public class Tags {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer Id;

    @Column(name = "tag_name")
    private String tagName;
    private Long mentionsCount;

    @ManyToMany(mappedBy = "tags",cascade = CascadeType.PERSIST)
    @JsonIgnore
    private List<Posts> posts = new ArrayList<>();
}
