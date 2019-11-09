package com.talker.talker.repository;

import com.talker.talker.domain.ChatFiles;
import com.talker.talker.domain.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatFileRepository extends JpaRepository<ChatFiles,Long> {
    void deleteAllByMessage(ChatMessage message);
}
