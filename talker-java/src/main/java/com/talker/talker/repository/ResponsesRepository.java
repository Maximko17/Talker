package com.talker.talker.repository;

import com.talker.talker.domain.Posts;
import com.talker.talker.domain.Responses;
import com.talker.talker.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface ResponsesRepository extends JpaRepository<Responses,Integer> {
    Page<Responses> findAllByPost(Posts post, Pageable pageable);

    Page<Responses> findAllByUsersLikes(List<User> users,Pageable pageable);

    Page<Responses> findAllByUser(User user,Pageable pageable);
}
