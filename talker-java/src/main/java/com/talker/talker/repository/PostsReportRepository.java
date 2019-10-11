package com.talker.talker.repository;

import com.talker.talker.domain.Posts;
import com.talker.talker.domain.PostsReports;
import com.talker.talker.domain.User;
import com.talker.talker.domain.composite_keys.PostReportsKey;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostsReportRepository extends JpaRepository<PostsReports, PostReportsKey> {
    Boolean existsByUserAndPost(User user, Posts post);

    PostsReports findByUserAndPost(User user, Posts post);
}
