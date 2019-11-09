package com.talker.talker.repository;

import com.talker.talker.domain.Notification;
import com.talker.talker.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface NotificationRepository extends JpaRepository<Notification, Long> {
    Page<Notification> findAllByToUserAndTypeNotOrderByDateDesc(User user,String type, Pageable pageable);
    List<Notification> findTop10ByToUserAndTypeNotOrderByDateDesc(User user,String type);
    List<Notification> findAllByToUserAndTypeNot(User user,String type);
    Integer countAllByToUserAndTypeNotAndWatchedFalse(User user,String type);
    Boolean existsByToUserAndType(User user,String type);

    void deleteAllByFromUserAndToUserAndType(User fromUser,User toUser,String type);
}
