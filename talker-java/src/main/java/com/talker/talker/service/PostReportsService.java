package com.talker.talker.service;

import com.talker.talker.domain.Posts;
import com.talker.talker.domain.PostsReports;
import com.talker.talker.domain.User;
import com.talker.talker.domain.composite_keys.PostReportsKey;
import com.talker.talker.repository.PostsReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PostReportsService {

    private final PostsReportRepository postsReportRepository;
    private final UserService userService;

    public PostReportsService(PostsReportRepository postsReportRepository, UserService userService) {
        this.postsReportRepository = postsReportRepository;
        this.userService = userService;
    }

    public Boolean didMeReportThisPost(User authUser, Posts post){
    return postsReportRepository.existsByUserAndPost(authUser,post);
    }

    public void addNewReport(PostsReports postsReports,String authUserMail){
        User user = userService.getUserByEmail(authUserMail);

        PostsReports report = new PostsReports();
        report.setUser(user);
        report.setPost(postsReports.getPost());
        report.setReportType(postsReports.getReportType());

        postsReportRepository.save(report);
    }

    public void deleteReport(Posts post,String authUserMail){
        User user = userService.getUserByEmail(authUserMail);
        PostsReports report = postsReportRepository.findByUserAndPost(user,post);

        postsReportRepository.delete(report);
    }
}
