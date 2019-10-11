package com.talker.talker.repository;

import com.talker.talker.domain.Chat;
import com.talker.talker.domain.User;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatRepository extends JpaRepository<Chat,Long> {
    Chat findByUserOneAndUserTwoOrUserOneAndUserTwo (User one,User two,User three,User four);
    Page<Chat> findByUserOne_NameContainingAndUserTwo_NameContainingOrUserOne_NameContainingAndUserTwo_NameContaining(String one,String two,String three,String four, Pageable pageable);
    Page<Chat> findByUserOneOrUserTwoOrderByLastMessageTimeDesc(User one, User two, Pageable pageable);
    List<Chat> findByUserOneOrUserTwo(User one, User two);
    Chat findTopByOrderByChatIdDesc();
}

