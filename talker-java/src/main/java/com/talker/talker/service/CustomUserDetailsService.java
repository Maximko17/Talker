package com.talker.talker.service;

import com.talker.talker.domain.User;
import com.talker.talker.exceptions.ResourceNotFoundException;
import com.talker.talker.repository.UserRepository;
import com.talker.talker.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserService userService;

    public CustomUserDetailsService(UserService userService) {
        this.userService = userService;
    }

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String userMail) throws UsernameNotFoundException {
        User user = userService.getUserByEmail(userMail);
        if (user == null) {
            throw new UsernameNotFoundException("User not found with email : " + userMail);
        }
        return UserPrincipal.create(user);
    }

    @Transactional
    public UserDetails loadById(Integer id) {
        User user = userService.getUserById(id);
        return UserPrincipal.create(user);
    }
}
