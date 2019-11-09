package com.talker.talker.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;

@Entity
@Data
@EqualsAndHashCode(exclude = "group")
public class GroupBanner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String image;
    private String shortMessage;
    private String instLink;
    private String vkLink;
    private String fbLink;
    private String tgLink;
    private String sptfyLink;
    private String InLink;
    private String webSiteLink;

    @OneToOne(cascade = CascadeType.PERSIST)
    @JsonIgnore
    private Groups group;
}
