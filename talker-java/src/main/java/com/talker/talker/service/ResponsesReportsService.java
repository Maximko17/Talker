package com.talker.talker.service;

import com.talker.talker.domain.*;
import com.talker.talker.domain.composite_keys.PostReportsKey;
import com.talker.talker.domain.composite_keys.ResponseReportKey;
import com.talker.talker.repository.ResponsesReportsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ResponsesReportsService {

    private final ResponsesReportsRepository responsesReportsRepository;
    private final UserService userService;

    public ResponsesReportsService(ResponsesReportsRepository responsesReportsRepository, UserService userService) {
        this.responsesReportsRepository = responsesReportsRepository;
        this.userService = userService;
    }

    public Boolean didMeReportThisResponse(User authUser, Responses response){
        return responsesReportsRepository.existsByUserAndResponse(authUser,response);
    }

    public void addNewReport(ResponsesReports responseReport, String authUserMail) {
        User user = userService.getUserByEmail(authUserMail);

        ResponsesReports report = new ResponsesReports();
        report.setUser(user);
        report.setResponse(responseReport.getResponse());
        report.setReportType(responseReport.getReportType());

        responsesReportsRepository.save(report);
    }

    public void deleteReport(Responses response, String authUserMail) {
        User user = userService.getUserByEmail(authUserMail);
        ResponsesReports report = responsesReportsRepository.findByUserAndResponse(user, response);

        responsesReportsRepository.delete(report);
    }
}
