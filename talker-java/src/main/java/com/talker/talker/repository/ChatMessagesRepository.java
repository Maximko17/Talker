package com.talker.talker.repository;

import com.talker.talker.domain.Chat;
import com.talker.talker.domain.ChatMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessagesRepository extends JpaRepository<ChatMessage,Long> {
    List<ChatMessage> findByChat(Chat chat);
    Page<ChatMessage> findByChat(Chat chat, Pageable pageable);

}
