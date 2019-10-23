package com.talker.talker.controller;

import com.talker.talker.domain.*;
import com.talker.talker.dto.ShortPageDto;
import com.talker.talker.service.ChatMessageService;
import com.talker.talker.service.ChatService;
import com.talker.talker.service.ImageService;
import com.talker.talker.service.UserService;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin
public class ChatController {

    private final ChatService chatService;
    private final ChatMessageService chatMessageService;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final ImageService imageService;
    private final UserService userService;

    public ChatController(ChatService chatService, ChatMessageService chatMessageService,
                          SimpMessagingTemplate simpMessagingTemplate, ImageService imageService,
                          UserService userService) {
        this.chatService = chatService;
        this.chatMessageService = chatMessageService;
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.imageService = imageService;
        this.userService = userService;
    }

    @PostMapping(value = "/chat/sendMessage/toUser/{userId}", consumes = "multipart/form-data")
    public void sendMessageToUser(@RequestPart("message") ChatMessage chatMessage, @PathVariable Integer userId, Principal principal, @RequestPart("files") MultipartFile[] files) {
        User authUser = userService.getUserByEmail(principal.getName());
        User chatUser = userService.getUserById(userId);

        Chat chat = chatService.getPrivateChat(authUser, chatUser);
        ChatMessage messageToSend = chatMessageService.sendMessage(chatMessage, files, authUser, chatUser, chat);
        simpMessagingTemplate.convertAndSend("/topic/chat." + chat.getChatId(), messageToSend);
    }

    @GetMapping("/chat/download-file/{fileName}")
    public ResponseEntity downloadFile(@PathVariable String fileName) throws IOException {
        return imageService.downloadObjectFrom_AWS_S3(fileName);
    }

    @PostMapping("/chat/message/{messageId}/addToFavorite")
    public void addToFavoriteOneMessage(@PathVariable Long messageId, Principal principal) {
        chatMessageService.addToFavoriteOneMessage(messageId, principal.getName());
    }

    @PostMapping("/chat/messages/addToFavorite")
    public void addToFavoriteManyMessages(@RequestBody Map<String, List<ChatMessage>> chatMessages, Principal principal) {
        chatMessageService.addToFavoriteManyMessages(chatMessages, principal.getName());
    }

    @GetMapping("/chats/get-unread-count")
    public Integer getUnreadChatsCount(Principal principal) {
        return chatService.countUnreadChats(principal.getName());
    }

    @GetMapping("/chat/user/{userId}/getMessages")
    public ResponseEntity<ShortPageDto> getChatMessages(@PathVariable Integer userId, Principal principal, @PageableDefault Pageable pageable) {
        return new ResponseEntity<>(chatMessageService.getChatMessages(userId, principal.getName(), pageable), HttpStatus.OK);
    }

    @GetMapping("/getChats")
    public ResponseEntity<ShortPageDto> getChats(Principal principal, @PageableDefault Pageable pageable, @RequestParam("tab") String tab) {
        return new ResponseEntity<>(chatService.getChats(principal.getName(), pageable, tab), HttpStatus.OK);
    }

    @GetMapping("/getFavoriteMessages")
    public ResponseEntity<ShortPageDto> getFavoriteMessages(Principal principal,@RequestParam("size") int size) {
        return new ResponseEntity<>(chatMessageService.getFavoriteChatMessages(principal.getName(),size), HttpStatus.OK);
    }

    @GetMapping("/chats/get-by-search")
    public ResponseEntity<ShortPageDto> getChatsBySearch(@RequestParam("user") String user, Principal principal, @PageableDefault Pageable pageable) {
        return new ResponseEntity<>(chatService.getChatsBySearch(user, principal.getName(), pageable), HttpStatus.OK);
    }

    @PostMapping("/newChat/user/{userId}")
    public ResponseEntity<Long> createNewChar(@PathVariable Integer userId, Principal principal) {
        return new ResponseEntity<>(chatService.newChat(userId, principal.getName()), HttpStatus.OK);
    }

    @PostMapping("/chat/{userId}/read-unread-messages")
    public void readUnreadMessages(@PathVariable Integer userId, Principal principal) {
        Long chatId = chatMessageService.readUnreadMessages(userId, principal.getName());

        Notification newNotification = new Notification();
        newNotification.setType("READ_UNREAD_MESSAGES");
        newNotification.setId(chatId);

        simpMessagingTemplate.convertAndSend("/topic/notification/3", newNotification);
        simpMessagingTemplate.convertAndSend("/topic/notification/2", newNotification);
    }

    @DeleteMapping("/chat/{userId}/delete-messages")
    public void deleteMessages(@PathVariable Integer userId, @RequestBody Map<String, List<ChatMessage>> chatMessages, Principal principal) {
        chatMessageService.deleteMessages(userId, chatMessages, principal.getName());
    }
}