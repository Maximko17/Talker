package com.talker.talker.repository;

import com.talker.talker.domain.Groups;
import com.talker.talker.domain.Posts;
import com.talker.talker.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostsRepository extends JpaRepository<Posts, String> {
    Page<Posts> findByUserAndIsDraft(User user, Boolean isDraft, Pageable pageable);

    Page<Posts> findByTagsAndIsDraft(List tags, Boolean isDraft, Pageable pageable);

    Page<Posts> findByUsersLikes(List<User> users, Pageable pageable);

    Page<Posts> findByGroup(Groups group, Pageable pageable);

    Posts getById(String id);

    List<Posts> findTop3ByIdNotAndIsDraftOrderById(String id,Boolean isDraft);

    Page<Posts> findByTitleContainingAndIsDraft(String title, Boolean isDraft, Pageable pageable);

    Long countByUserAndIsDraft(User user,Boolean isDraft);
}
