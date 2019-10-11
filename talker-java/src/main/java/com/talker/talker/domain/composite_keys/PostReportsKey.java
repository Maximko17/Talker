package com.talker.talker.domain.composite_keys;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;

@Embeddable
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostReportsKey implements Serializable {

    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "post_id")
    private String postId;
}
