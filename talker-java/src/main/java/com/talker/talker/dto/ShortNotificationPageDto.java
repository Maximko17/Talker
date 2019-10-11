package com.talker.talker.dto;

import com.fasterxml.jackson.annotation.JsonView;
import com.talker.talker.domain.Views;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@JsonView(Views.ShortNotification.class)
public class ShortNotificationPageDto extends ShortPageDto{

    public ShortNotificationPageDto(List<?> content, int currentSize, long totalElements,Boolean hasNewMessages) {
        super(content, currentSize, totalElements);
        this.hasNewMessages = hasNewMessages;
    }

    private Boolean hasNewMessages;
}
