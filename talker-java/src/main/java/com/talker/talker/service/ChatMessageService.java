package com.talker.talker.service;

import com.talker.talker.domain.Chat;
import com.talker.talker.domain.ChatMessage;
import com.talker.talker.domain.User;
import com.talker.talker.dto.ShortPageDto;
import com.talker.talker.exceptions.BadRequestEx;
import com.talker.talker.repository.ChatMessagesRepository;
import com.talker.talker.repository.ChatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.support.PagedListHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@Service
public class ChatMessageService {

    private final ChatMessagesRepository chatMessagesRepository;
    private final ChatRepository chatRepository;
    private final UserService userService;
    private final FollowersService followersService;
    private final NotificationService notificationService;
    private final ImageService imageService;

    public ChatMessageService(ChatMessagesRepository chatMessagesRepository,
                              ChatRepository chatRepository, UserService userService,
                              FollowersService followersService, NotificationService notificationService,
                              ImageService imageService) {
        this.chatMessagesRepository = chatMessagesRepository;
        this.chatRepository = chatRepository;
        this.userService = userService;
        this.followersService = followersService;
        this.notificationService = notificationService;
        this.imageService = imageService;
    }

    private Boolean amIInThisChat(User authUser, Chat chat) {
        if (chat.getUserOne().getId().equals(authUser.getId()) || chat.getUserTwo().getId().equals(authUser.getId())) {
            return true;
        } else {
            return false;
        }
    }

    private Boolean didISaveThisMessageToFavourites(User authUser, ChatMessage message) {
        return authUser.getFavoriteMessages().contains(message);
    }

    @Transactional
    public ChatMessage sendMessage(ChatMessage message, MultipartFile[] files, User authUser, User chatUser, Chat chat) {

        if (followersService.checkSubscriptionToUser(authUser, chatUser)) {
            try {
                if (chat != null && amIInThisChat(authUser, chat)) {
                    if (message.getId() != null) {
                        ChatMessage editMessage = chatMessagesRepository.findById(message.getId()).orElse(null);
                        editMessage.setContent(message.getContent());
                        editMessage.setIsEdited(true);
                        imageService.savePreviousMessagesFiles(message.getFiles(), editMessage);
                        imageService.saveMessageFiles(files, editMessage);
                        chatMessagesRepository.save(editMessage);
                        return editMessage;
                    } else {
                        message.setChat(chat);
                        message.setUser(authUser);
                        message.setWatched(false);
                        message.setIsEdited(false);
                        chat.setLastMessageTime(new Date().getTime());
                         imageService.saveMessageFiles(files, message);
                        chatRepository.save(chat);
                        chatMessagesRepository.save(message);
                        notificationService.newNotification(authUser, chatUser, "MESSAGE", null, null);
                        return message;
                    }
                }
            } catch (BadRequestEx ex) {
                throw new BadRequestEx("Something happened while sending the message");
            }
        }
        throw new BadRequestEx("This chat doesn't exist or you don't have access to this chat or you're not following this user");
    }

    public void addToFavoriteOneMessage(Long messageId, String authUserEmail) {
        User authUser = userService.getUserByEmail(authUserEmail);
        ChatMessage chatMessage = chatMessagesRepository.getOne(messageId);

        if (didISaveThisMessageToFavourites(authUser, chatMessage)) {
            authUser.getFavoriteMessages().remove(chatMessage);
        } else {
            authUser.getFavoriteMessages().add(chatMessage);
        }
        userService.saveUser(authUser);
    }

    public void addToFavoriteManyMessages(Map<String, List<ChatMessage>> chatMessages, String authUserEmail) {
        User authUser = userService.getUserByEmail(authUserEmail);

        List<ChatMessage> selectedMessages = chatMessages.get("messages");
        selectedMessages.forEach(selectedMessage -> {
            ChatMessage chatMessage = chatMessagesRepository.getOne(selectedMessage.getId());
            if (chatMessage != null && !didISaveThisMessageToFavourites(authUser, chatMessage)) {
                authUser.getFavoriteMessages().add(chatMessage);
            }
        });
        userService.saveUser(authUser);
    }

    public ShortPageDto getChatMessages(Integer chatUserId, String authUserEmail, Pageable pageable) {
        User authUser = userService.getUserByEmail(authUserEmail);
        User chatUser = userService.getUserById(chatUserId);

        Chat chat = chatRepository.findByUserOneAndUserTwoOrUserOneAndUserTwo(authUser, chatUser, chatUser, authUser);

        if (chat != null && amIInThisChat(authUser, chat)) {
            Page<ChatMessage> messages = chatMessagesRepository.findByChat(chat, pageable);
            messages.forEach(message -> {
                        if (authUser.getFavoriteMessages().contains(message)) {
                            message.setIsFavorite(true);
                        } else {
                            message.setIsFavorite(false);
                        }
                    }
            );
            return new ShortPageDto(messages.getContent(), messages.getNumberOfElements(), messages.getTotalElements());
        }
        throw new BadRequestEx("This chat doesn't exist or you don't have access to this chat or you're not following this user");
    }

    public ShortPageDto getFavoriteChatMessages(String authUserEmail,int current_size) {
        User authUser = userService.getUserByEmail(authUserEmail);

        PagedListHolder<ChatMessage> page = new PagedListHolder<>(authUser.getFavoriteMessages());
        page.setPageSize(current_size);
        page.setPage(0);
        page.getPageList().forEach(message -> message.setIsFavorite(true));

        return new ShortPageDto(page.getPageList(), current_size, page.getNrOfElements());
    }

    public Long readUnreadMessages(Integer chatUserId, String authUserEmail) {
        User authUser = userService.getUserByEmail(authUserEmail);
        User chatUser = userService.getUserById(chatUserId);

        Chat chat = chatRepository.findByUserOneAndUserTwoOrUserOneAndUserTwo(authUser, chatUser, chatUser, authUser);

        if (chat != null) {
            List<ChatMessage> chatMessages = chatMessagesRepository.findByChat(chat);
            chatMessages.stream().filter(message -> !message.getWatched()).forEach(message -> message.setWatched(true));
            chatMessagesRepository.saveAll(chatMessages);

            return chat.getChatId();
        }
        return null;
    }

    public void deleteMessages(Integer chatUserId, Map<String, List<ChatMessage>> chatMessages, String authUserEmail) {
        User authUser = userService.getUserByEmail(authUserEmail);
        User chatUser = userService.getUserById(chatUserId);

        Chat chat = chatRepository.findByUserOneAndUserTwoOrUserOneAndUserTwo(authUser, chatUser, chatUser, authUser);
        if (chat != null) {
            List<ChatMessage> messageList = chatMessages.get("messages");
            if (messageList.stream().noneMatch(message -> message.getUser().getId().equals(chatUser.getId()))) {
                chatMessagesRepository.deleteAll(chatMessages.get("messages"));
            } else {
                throw new BadRequestEx("You can delete only your messages");
            }
        }
    }
}
