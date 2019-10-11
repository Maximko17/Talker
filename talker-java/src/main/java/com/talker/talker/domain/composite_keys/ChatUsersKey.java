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
public class ChatUsersKey implements Serializable {

    @Column(name = "user_one")
    private Integer userOneId;

    @Column(name = "user_two")
    private Integer userTwoId;
}
