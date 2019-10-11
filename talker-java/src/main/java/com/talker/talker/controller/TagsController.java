package com.talker.talker.controller;

import com.fasterxml.jackson.annotation.JsonView;
import com.talker.talker.domain.Posts;
import com.talker.talker.domain.Tags;
import com.talker.talker.domain.Views;
import com.talker.talker.dto.ShortPageDto;
import com.talker.talker.service.TagsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@CrossOrigin
public class TagsController {

    private final TagsService tagsService;

    public TagsController(TagsService tagsService) {
        this.tagsService = tagsService;
    }

    @GetMapping("/tag/{tagname}")
    @JsonView(Views.ShortPost.class)
    public ResponseEntity<?> getPostsByTags(@PathVariable String tagname, Principal principal,
                                                      @PageableDefault Pageable pageable){
        return new ResponseEntity<>(tagsService.getPostsByTag(tagname,principal.getName(),pageable), HttpStatus.OK);
    }

    @GetMapping("/tags/get-by-search")
    public ResponseEntity<ShortPageDto> getBySearch(@RequestParam("tagname") String tagName, @PageableDefault(size = 3) Pageable pageable){
        return new ResponseEntity<>(tagsService.getBySearch(tagName,pageable), HttpStatus.OK);
    }


}
