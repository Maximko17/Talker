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
public class NotificationUsersKey implements Serializable {

    @Column(name = "to_user")
    private Integer toUser;

    @Column(name = "from_user")
    private Integer fromUser;
}