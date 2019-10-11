package com.talker.talker.repository;

import com.talker.talker.domain.Chat;
import com.talker.talker.domain.ChatFiles;
import com.talker.talker.domain.ChatMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatFileRepository extends JpaRepository<ChatFiles,Long> {
    void deleteAllByMessage(ChatMessage message);
    Page<ChatFiles> findByMessage_ChatAndFileTypeNotOrderByIdDesc(Chat chat, String fileType, Pageable pageable);
}
