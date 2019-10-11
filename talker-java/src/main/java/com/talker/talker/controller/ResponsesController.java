package com.talker.talker.controller;

import com.fasterxml.jackson.annotation.JsonView;
import com.talker.talker.domain.*;
import com.talker.talker.service.BookmarkService;
import com.talker.talker.service.ResponseLikesService;
import com.talker.talker.service.ResponsesReportsService;
import com.talker.talker.service.ResponsesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.security.Principal;

@RestController
@CrossOrigin
public class ResponsesController {

    private final ResponsesService responsesService;
    private final ResponseLikesService responseLikesService;
    private final BookmarkService bookmarkService;
    private final ExceptionMapHandler exceptionMapHandler;
    private final ResponsesReportsService responsesReportsService;

    public ResponsesController(ResponsesService responsesService,
                               ResponseLikesService responseLikesService, BookmarkService bookmarkService,
                               ExceptionMapHandler exceptionMapHandler, ResponsesReportsService responsesReportsService) {
        this.responsesService = responsesService;
        this.responseLikesService = responseLikesService;
        this.bookmarkService = bookmarkService;
        this.exceptionMapHandler = exceptionMapHandler;
        this.responsesReportsService = responsesReportsService;
    }

    @PostMapping("/post/{postId}/newResponse")
    public ResponseEntity<?> newResponse(@Valid @RequestBody Responses response, BindingResult result,
                                                 @PathVariable String postId, Principal principal){
        ResponseEntity<?> errorMap = exceptionMapHandler.exceptionResponse(result);
        if(errorMap != null) return errorMap;

        return new ResponseEntity<>(responsesService.newResponse(response,postId,principal.getName()),HttpStatus.OK);
    }

    @GetMapping("/post/{postId}/responses")
    public ResponseEntity<Page<Responses>> getPostResponses(@PathVariable String postId, @PageableDefault(size = 5,sort = "date",direction = Sort.Direction.DESC)Pageable pageable,Principal principal){
        return new ResponseEntity<>(responsesService.getPostResponses(postId,pageable,principal.getName()), HttpStatus.OK);
    }

    @GetMapping("/profile/{usermail}/getLikedResponses")
    @JsonView(Views.ShortResponse.class)
    public ResponseEntity<?> getLikedResponses(@PathVariable String usermail,Principal principal,@PageableDefault(size = 1) Pageable pageable){
        return new ResponseEntity<>(responseLikesService.getLikedResponses(usermail,principal.getName(),pageable), HttpStatus.OK);
    }

    @GetMapping("/profile/{usermail}/getUserResponses")
    @JsonView(Views.ShortResponse.class)
    public ResponseEntity<?> getUserResponses(@PathVariable String usermail, @PageableDefault(direction = Sort.Direction.DESC,sort = "date",size = 1) Pageable pageable,Principal principal){
        return new ResponseEntity<>(responsesService.getUserResponses(usermail,principal.getName(),pageable), HttpStatus.OK);
    }


    @PostMapping("/response/{responseId}/likeResponse")
    public void likeResponse(@PathVariable Integer responseId, Principal principal){
        responseLikesService.likeResponse(responseId,principal.getName());
    }

    @DeleteMapping("/response/{responseId}/unlikeResponse")
    public void unlikeResponse(@PathVariable Integer responseId,Principal principal){
        responseLikesService.unlikeResponse(responseId,principal.getName());

    }

    @GetMapping("/response/getBookmarkedResponses")
    public ResponseEntity<Page<Responses>> getBookmarkedResponses(@PageableDefault(sort = "date",direction = Sort.Direction.DESC,size = 5) Pageable pageable, Principal principal){
        return new ResponseEntity<>(bookmarkService.getBookmarkedResponses(pageable,principal.getName()), HttpStatus.OK);
    }

    @PostMapping("/response/bookmarkResponse")
    public void bookmarkResponse(@RequestBody Responses response,Principal principal){
        bookmarkService.bookmarkResponse(response,principal.getName());
    }

    @DeleteMapping("/response/deleteBookmarkedResponse")
    public void deleteBookmarkedResponse(@RequestBody Responses response,Principal principal){
        bookmarkService.deleteBookmarkedResponse(response, principal.getName());
    }

    @PostMapping("/response/addReport")
    public void reportResponse(@RequestBody ResponsesReports responsesReports, Principal principal){
        responsesReportsService.addNewReport(responsesReports,principal.getName());
    }

    @DeleteMapping("/response/removeReport")
    public void removeReportFromResponse(@RequestBody Responses response,Principal principal){
        responsesReportsService.deleteReport(response,principal.getName());
    }
}
