package com.talker.talker.controller;

import com.fasterxml.jackson.annotation.JsonView;
import com.talker.talker.domain.*;
import com.talker.talker.dto.ShortPageDto;
import com.talker.talker.dto.ShortPostPageDto;
import com.talker.talker.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.List;

@RestController
@CrossOrigin
public class PostsController {

    private final PostsService postsService;
    private final PostLikesService postLikesService;
    private final BookmarkService bookmarkService;
    private final PostReportsService postReportsService;

    public PostsController(PostsService postsService, PostLikesService postLikesService,
                           BookmarkService bookmarkService, PostReportsService postReportsService) {
        this.postsService = postsService;
        this.postLikesService = postLikesService;
        this.bookmarkService = bookmarkService;
        this.postReportsService = postReportsService;
    }

    @GetMapping("/post/{id}")
    public ResponseEntity<Posts> getPost(@PathVariable String id, Principal principal) {
        return new ResponseEntity<>(postsService.getPostById(id, principal.getName()), HttpStatus.OK);
    }

    @GetMapping("/posts/get-by-search")
    @JsonView(Views.ShortPost.class)
    public ResponseEntity<ShortPostPageDto> getBySearch(@RequestParam("posttitle") String postTitle, @PageableDefault(size = 3) Pageable pageable, Principal principal) {
        return new ResponseEntity<>(postsService.getBySearch(postTitle, pageable, principal.getName()), HttpStatus.OK);
    }

    @PostMapping(value = "/newPost", consumes = "multipart/form-data")
    public ResponseEntity<String> newPost(@RequestPart("post") Posts post,
                                          @RequestPart(value = "images", required = false) MultipartFile[] images, @RequestPart(value = "preview_image", required = false) MultipartFile previewImage, Principal principal) {
        return new ResponseEntity<>(postsService.newPost(post, images, previewImage, principal.getName()), HttpStatus.CREATED);
    }

    @GetMapping("/profile/{usermail}/allPosts")
    @JsonView(Views.ShortPost.class)
    public ResponseEntity<?> getUserPosts(@PathVariable String usermail, @PageableDefault(sort = "postDate", direction = Sort.Direction.DESC, size = 1) Pageable pageable, Principal principal) {
        return new ResponseEntity<>(postsService.getUserPosts(usermail, principal.getName(), pageable), HttpStatus.OK);
    }

    @GetMapping("/posts/{groupUri}/allPosts")
    public ResponseEntity<?> getGroupPosts(@PathVariable String groupUri, @PageableDefault(sort = "postDate", direction = Sort.Direction.DESC, size = 5) Pageable pageable, Principal principal) {
        return new ResponseEntity<>(postsService.getGroupPosts(groupUri, principal.getName(), pageable), HttpStatus.OK);
    }

    @GetMapping("/posts/all-my-posts")
    @JsonView(Views.ShortPost.class)
    public ResponseEntity<?> getUserPosts(@RequestParam("isDraft") Boolean isDraft, @PageableDefault(sort = "postDate", direction = Sort.Direction.DESC) Pageable pageable, Principal principal) {
        return new ResponseEntity<>(postsService.getUserDrafts(isDraft, principal.getName(), pageable), HttpStatus.OK);
    }

    @GetMapping("/post/{postId}/getThreeRandom")
    public ResponseEntity<Page<Posts>> getThreeRandomPosts(@PathVariable String postId, Principal principal) {
        return new ResponseEntity<>(postsService.getThreeRandomPosts(principal.getName(), postId), HttpStatus.OK);
    }

    @GetMapping("/profile/{usermail}/getLikedPosts")
    @JsonView(Views.ShortPost.class)
    public ResponseEntity<?> getLikedPosts(@PathVariable String usermail, Principal principal, @PageableDefault Pageable pageable) {
        return new ResponseEntity<>(postLikesService.getLikedPosts(usermail, principal.getName(), pageable), HttpStatus.OK);
    }

    @PostMapping("/post/{postId}/likePost")
    public void likePost(@PathVariable String postId, Principal principal) {
        postLikesService.likePost(postId, principal.getName());
    }

    @DeleteMapping("/post/{postId}/unlikePost")
    public void unlikePost(@PathVariable String postId, Principal principal) {
        postLikesService.unlikePost(postId, principal.getName());
    }

    @GetMapping("/post/getBookmarkedPosts")
    @JsonView(Views.ShortPost.class)
    public ResponseEntity<?> getBookmarkedPost(@PageableDefault(sort = "date", direction = Sort.Direction.DESC, size = 5) Pageable pageable, Principal principal) {
        return new ResponseEntity<>(bookmarkService.getBookmarkedPosts(pageable, principal.getName()), HttpStatus.OK);
    }

    @PostMapping("/post/bookmarkPost")
    public void bookmarkPost(@RequestBody Posts posts, Principal principal) {
        bookmarkService.bookmarkPost(posts, principal.getName());
    }

    @PostMapping("/post/addReport")
    public void reportPost(@RequestBody PostsReports postsReports, Principal principal) {
        postReportsService.addNewReport(postsReports, principal.getName());
    }

    @DeleteMapping("/post/deleteBookmarkedPost")
    public void deleteBookmarkedPost(@RequestBody Posts posts, Principal principal) {
        bookmarkService.deleteBookmarkedPost(posts, principal.getName());
    }

    @DeleteMapping("/post/removeReport")
    public void removeReportFromPost(@RequestBody Posts post, Principal principal) {
        postReportsService.deleteReport(post, principal.getName());
    }

    @GetMapping("/posts/getCount")
    public ResponseEntity<Long> getBookmarkedPost(@RequestParam("isDraft") Boolean isDraft, Principal principal) {
        return new ResponseEntity<>(postsService.getPostsCount(isDraft, principal.getName()),HttpStatus.OK);
    }

    @DeleteMapping("/post/{postId}/delete")
    public void deletePost(@PathVariable String postId, Principal principal) {
        postsService.deletePost(postId,principal.getName());
    }
}
