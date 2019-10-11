package com.talker.talker.repository;

import com.talker.talker.domain.*;
import com.talker.talker.domain.composite_keys.ResponseReportKey;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ResponsesReportsRepository extends JpaRepository<ResponsesReports, ResponseReportKey> {
    Boolean existsByUserAndResponse(User user, Responses response);

    ResponsesReports findByUserAndResponse(User user, Responses response);
}
