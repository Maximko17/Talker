package com.talker.talker.dto;


import com.talker.talker.domain.ChatMessage;
import com.talker.talker.domain.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ShortChatDto {

    private Long chatId;
    private User user;
    private ChatMessage lastChatMessage;
    private Long unreadMessagesCount;
}
