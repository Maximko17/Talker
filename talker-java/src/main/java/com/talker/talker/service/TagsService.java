package com.talker.talker.service;

import com.talker.talker.domain.Posts;
import com.talker.talker.domain.Tags;
import com.talker.talker.domain.User;
import com.talker.talker.dto.ShortPageDto;
import com.talker.talker.dto.ShortPostPageDto;
import com.talker.talker.repository.TagsRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class TagsService {

    private final TagsRepository tagsRepository;
    private final  PostLikesService postLikesService;
    private final FollowersService followersService;
    private final PostsService postsService;
    private final UserService userService;
    private final BookmarkService bookmarkService;
    private final PostReportsService postReportsService;

    public TagsService(TagsRepository tagsRepository, PostLikesService postLikesService,
                       FollowersService followersService, PostsService postsService,
                       UserService userService, BookmarkService bookmarkService,
                       PostReportsService postReportsService) {
        this.tagsRepository = tagsRepository;
        this.postLikesService = postLikesService;
        this.followersService = followersService;
        this.postsService = postsService;
        this.userService = userService;
        this.bookmarkService = bookmarkService;
        this.postReportsService = postReportsService;
    }

    public ShortPostPageDto<Set<Posts>> getPostsByTag(String tag, String authUserEmail, Pageable pageable) {
        Tags tags = tagsRepository.findByTagName(tag);
        User authUser = userService.getUserByEmail(authUserEmail);

        Page<Posts> posts = postsService.findByTag(Collections.singletonList(tags), pageable);
        Set<Posts> sortedPosts = new HashSet<>();

        posts.forEach(post -> {
            if (!userService.haveIBlockedThisUser(authUser, post.getUser())) {
                post.setDidMeLikeThisPost(postLikesService.didMeLikedThisPost(authUser, post));
                post.getUser().setIsMeFollower(followersService.checkSubscriptionToUser(authUser, post.getUser()));
                post.setDidMeSaveThisPost(bookmarkService.didMeBookmarkThisPost(authUser, post));
                post.setDidMeReportThisPost(postReportsService.didMeReportThisPost(authUser, post));
                sortedPosts.add(post);
            }
        });

        return new ShortPostPageDto<>(sortedPosts, posts.getNumberOfElements(), posts.getTotalElements());
    }

    public ShortPageDto getBySearch(String tagName, Pageable pageable) {
        Page<Tags> tags = tagsRepository.findByTagNameContaining(tagName, pageable);
        return new ShortPageDto(tags.getContent(), tags.getNumberOfElements(), tags.getTotalElements());
    }

    public List<Tags> saveTags(List<Tags> tags, Posts post) {
        if (tags.size() <= 5) {
            List<Tags> newTags = new ArrayList<>();
            if (!tags.isEmpty()) {
                tags.forEach(tag -> {
                    Tags newTag = tagsRepository.findByTagName(tag.getTagName());
                    if (newTag != null) {
                        newTag.getPosts().add(post);
                        newTag.setMentionsCount(newTag.getMentionsCount() + 1);
                    } else {
                        newTag = new Tags();
                        newTag.setTagName(tag.getTagName());
                        newTag.getPosts().add(post);
                        newTag.setMentionsCount(1L);
                    }
                    tagsRepository.save(newTag);
                    newTags.add(newTag);
                });
                return newTags;
            } else {
                return Collections.emptyList();
            }
        } else {
            return null;
        }
    }
}
