package com.talker.talker.service;

import com.talker.talker.domain.Chat;
import com.talker.talker.domain.ChatMessage;
import com.talker.talker.domain.User;
import com.talker.talker.dto.ShortChatDto;
import com.talker.talker.dto.ShortPageDto;
import com.talker.talker.exceptions.BadRequestEx;
import com.talker.talker.repository.ChatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ChatService {

    private final ChatRepository chatRepository;
    private final UserService userService;
    private final FollowersService followersService;

    public ChatService(ChatRepository chatRepository, UserService userService, FollowersService followersService) {
        this.chatRepository = chatRepository;
        this.userService = userService;
        this.followersService = followersService;
    }

    public ShortPageDto getChats(String authUserEmail, Pageable pageable, String tab) {
        User authUser = userService.getUserByEmail(authUserEmail);

        Page<Chat> allChats = chatRepository.findByUserOneOrUserTwoOrderByLastMessageTimeDesc(authUser, authUser, pageable);
        return getChatsShortPage(allChats, authUser, tab.equals("unread"));
    }

    public Chat getPrivateChat(User authUser, User chatUser) {
        return chatRepository.findByUserOneAndUserTwoOrUserOneAndUserTwo(authUser, chatUser, chatUser, authUser);
    }

    public ShortPageDto getChatsBySearch(String chatUserName, String authUserEmail, Pageable pageable) {
        User authUser = userService.getUserByEmail(authUserEmail);

        Page<Chat> foundChats = chatRepository.
                findByUserOne_NameContainingAndUserTwo_NameContainingOrUserOne_NameContainingAndUserTwo_NameContaining(authUser.getName(), chatUserName, chatUserName, authUser.getName(), pageable);
        return getChatsShortPage(foundChats, authUser, false);
    }

    public int countUnreadChats(String authUserEmail) {
        User authUser = userService.getUserByEmail(authUserEmail);
        final int[] unreadChatsCount = {0};

        List<Chat> allChats = chatRepository.findByUserOneOrUserTwo(authUser, authUser);
        allChats.forEach(chat -> {
            if (chat.getChatMessages().size() != 0) {
                ChatMessage chatMessage = chat.getChatMessages().get(chat.getChatMessages().size() - 1);
                if (!chatMessage.getWatched() && chatMessage.getUser().getId() != authUser.getId()) {
                    unreadChatsCount[0] = unreadChatsCount[0] + 1;
                }
            }
        });
        return unreadChatsCount[0];
    }

    public Long newChat(Integer chatUserId, String authUserEmail) {
        User authUser = userService.getUserByEmail(authUserEmail);
        User chatUser = userService.getUserById(chatUserId);

        if (followersService.checkSubscriptionToUser(authUser, chatUser)) {
            Chat chat = chatRepository.findByUserOneAndUserTwoOrUserOneAndUserTwo(authUser, chatUser, chatUser, authUser);

            if (chat != null) {
                return chat.getChatId();
            } else {
                Chat newChat = new Chat();
                newChat.setUserOne(authUser);
                newChat.setUserTwo(chatUser);
                newChat.setChatId(chatRepository.findTopByOrderByChatIdDesc().getChatId() + 1);
                chatRepository.save(newChat);

                return newChat.getChatId();
            }
        } else {
            throw new BadRequestEx("You're not a follower");
        }
    }

    private ShortPageDto getChatsShortPage(Page<Chat> chats, User authUser, Boolean getUnread) {
        List<ShortChatDto> shortChats = new ArrayList<>();
        chats.forEach(chat -> {
            ShortChatDto shortChatDto = new ShortChatDto();
            ChatMessage lastChatMessage = !chat.getChatMessages().isEmpty() ? chat.getChatMessages().get(chat.getChatMessages().size() - 1) : null;
            if (!chat.getUserOne().getId().equals(authUser.getId())) {
                shortChatDto.setUser(chat.getUserOne());
            } else {
                shortChatDto.setUser(chat.getUserTwo());
            }
            shortChatDto.setLastChatMessage(lastChatMessage);
            shortChatDto.setUnreadMessagesCount(chat.getChatMessages().stream().filter(message -> !message.getWatched()).count());
            shortChatDto.setChatId(chat.getChatId());

            if (!getUnread) {
                shortChats.add(shortChatDto);
            } else if (lastChatMessage != null && !lastChatMessage.getUser().getId().equals(authUser.getId())) {
                if (shortChatDto.getUnreadMessagesCount() > 0) {
                    shortChats.add(shortChatDto);
                }
            }
        });
        return new ShortPageDto(shortChats, chats.getNumberOfElements(), chats.getTotalElements());
    }

}
