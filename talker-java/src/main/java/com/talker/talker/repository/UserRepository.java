package com.talker.talker.repository;

import com.talker.talker.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Integer> {
    Optional<User> findByEmail(String usermail);
    Boolean existsByEmail(String usermail);
    Page<User> findByNameContaining(String username, Pageable pageable);
}
