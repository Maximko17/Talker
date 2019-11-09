package com.talker.talker.service;

import com.talker.talker.domain.Groups;
import com.talker.talker.domain.Posts;
import com.talker.talker.domain.User;
import com.talker.talker.dto.ShortGroupPageDto;
import com.talker.talker.dto.ShortPageDto;
import com.talker.talker.dto.ShortPostPageDto;
import com.talker.talker.exceptions.BlockedUserEx;
import com.talker.talker.exceptions.NotFoundEx;
import com.talker.talker.repository.PostsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@Service
public class PostsService {

    private final PostsRepository postsRepository;
    private final UserService userService;
    private final FollowersService followersService;
    private final PostLikesService postLikesService;
    private final BookmarkService bookmarkService;
    private final PostReportsService postReportsService;
    private final ImageService imageService;
    private final GroupService groupService;
    private TagsService tagsService;

    @Autowired
    public void setTagsService(TagsService tagsService) {
        this.tagsService = tagsService;
    }

    public PostsService(PostsRepository postsRepository, UserService userService, FollowersService followersService,
                        PostLikesService postLikesService, BookmarkService bookmarkService, PostReportsService postReportsService,
                        ImageService imageService, GroupService groupService) {
        this.postsRepository = postsRepository;
        this.userService = userService;
        this.followersService = followersService;
        this.postLikesService = postLikesService;
        this.bookmarkService = bookmarkService;
        this.postReportsService = postReportsService;
        this.imageService = imageService;
        this.groupService = groupService;
    }

    public Posts getPostById(String id, String authUserEmail) {
        Posts post = getPostById(id);
        User authUser = userService.getUserByEmail(authUserEmail);

        if (post.getUser() != null) {
            User profileUser = userService.getUserById(post.getUser().getId());
            if (!userService.haveMeBlockedByThisUser(authUser, profileUser)) {
                post.getUser().setHaveMeBlocked(false);
                post.getUser().setHaveIBlocked(userService.haveIBlockedThisUser(authUser, profileUser));
                post.getUser().setIsMeFollower(followersService.checkSubscriptionToUser(authUser, profileUser));
            } else {
                throw new BlockedUserEx("You were blocked by this user.");
            }
        } else {
            Groups group = post.getGroup();
            post.getGroup().setIsMeFollower(groupService.isMeFollowThisGroup(authUser, group));
        }
        post.setDidMeLikeThisPost(postLikesService.didMeLikedThisPost(authUser, post));
        post.setDidMeSaveThisPost(bookmarkService.didMeBookmarkThisPost(authUser, post));
        post.setDidMeReportThisPost(postReportsService.didMeReportThisPost(authUser, post));

        return post;
    }

    public Posts getPostById(String id) {
        return postsRepository.findById(id).orElseThrow(() -> new NotFoundEx("Post not found"));
    }

    public ShortPostPageDto<List<Posts>> getUserPosts(String usermail, String authUserEmail, Pageable pageable) {
        User profileUser = userService.getUserByEmail(usermail);
        User authUser = userService.getUserByEmail(authUserEmail);

        if (!userService.haveMeBlockedByThisUser(authUser, profileUser)) {
            Page<Posts> posts = postsRepository.findByUserAndIsDraft(profileUser, false, pageable);
            posts.forEach(post -> {
                post.getUser().setHaveMeBlocked(false);
                post.getUser().setHaveIBlocked(userService.haveIBlockedThisUser(authUser, profileUser));
                post.setDidMeLikeThisPost(postLikesService.didMeLikedThisPost(authUser, post));
                post.setDidMeSaveThisPost(bookmarkService.didMeBookmarkThisPost(authUser, post));
                post.setDidMeReportThisPost(postReportsService.didMeReportThisPost(authUser, post));
            });
            return new ShortPostPageDto<>(posts.getContent(), posts.getNumberOfElements(), posts.getTotalElements());
        } else {
            throw new BlockedUserEx("You were blocked by this user.");
        }
    }

    public ShortPostPageDto<List<Posts>> getUserDrafts(Boolean isDraft, String authUserEmail, Pageable pageable) {
        User authUser = userService.getUserByEmail(authUserEmail);

        Page<Posts> posts = postsRepository.findByUserAndIsDraft(authUser, isDraft, pageable);
        return new ShortPostPageDto<>(posts.getContent(), posts.getNumberOfElements(), posts.getTotalElements());
    }


    public String newPost(Posts post, MultipartFile[] images, MultipartFile preview_image, String authUserEmail) {
        User authUser = userService.getUserByEmail(authUserEmail);

        Posts newPost;
        if (post.getId() == null) {
            newPost = new Posts();
            newPost.setId((String) UUID.randomUUID().toString().replace("-", "").subSequence(0, 12));
        } else {
            newPost = postsRepository.getById(post.getId());
            if (post.getIsDraft()) {
                newPost.setId(post.getId());
            } else {
                newPost.setId(generateFullPostId(post, post.getId()));
            }
        }
        newPost.setTitle(post.getTitle());
        newPost.setSubtitle((post.getSubtitle()));
        newPost.setText(post.getText());
        newPost.setMain_image(imageService.savePostPreviewImage(preview_image));
        newPost.setPostImages(imageService.savePostImages(images, newPost));
        newPost.setPostDate(new Date().getTime());
        newPost.setReading_time((short) countReadingTime(post.getText()));
        newPost.setTags(tagsService.saveTags(post.getTags(), newPost));
        newPost.setUser(authUser);
        newPost.setTotalResponses(0);
        newPost.setTotalLikes(0);
        newPost.setIsDraft(post.getIsDraft());
        savePost(newPost);

        return newPost.getId();
    }

    private String generateFullPostId(Posts post, String prevId) {
        if (!post.getTitle().equals("")) {
            return post.getTitle().toLowerCase().replaceAll("\\s+", "-") +
                    "-" +
                    prevId;
        } else if (!post.getSubtitle().equals("")) {
            return post.getSubtitle().toLowerCase().replaceAll("\\s+", "-") +
                    "-" +
                    prevId;
        } else {
            return post.getSubtitle().toLowerCase().replaceAll("\\s+", "-") +
                    "-" +
                    prevId;
        }
    }

    public Page<Posts> getThreeRandomPosts(String userMail, String postId) {
        User authUser = userService.getUserByEmail(userMail);

        List<Posts> randomPosts = new ArrayList<>();
        List<Posts> posts = postsRepository.findTop3ByIdNotAndIsDraftOrderById(postId, false);
        posts.forEach(post -> {
            if (post.getUser() != null) {
                if (!userService.haveIBlockedThisUser(authUser, post.getUser()) && !userService.haveMeBlockedByThisUser(authUser, post.getUser())) {
                    post.getUser().setIsMeFollower(followersService.checkSubscriptionToUser(authUser, post.getUser()));
                }
            }else{
                 post.getGroup().setIsMeFollower(groupService.isMeFollowThisGroup(authUser,post.getGroup()));
            }
            post.setDidMeLikeThisPost(postLikesService.didMeLikedThisPost(authUser, post));
            post.setDidMeSaveThisPost(bookmarkService.didMeBookmarkThisPost(authUser, post));
            randomPosts.add(post);
        });
        return new PageImpl<>(randomPosts);
    }

    public ShortPostPageDto<List<Posts>> getBySearch(String postTitle, Pageable pageable, String authUserEmail) {
        User authUser = userService.getUserByEmail(authUserEmail);
        Page<Posts> posts = postsRepository.findByTitleContainingAndIsDraft(postTitle, false, pageable);

        posts.forEach(post -> {
            post.getUser().setHaveIBlocked(userService.haveIBlockedThisUser(authUser, post.getUser()));
            post.setDidMeLikeThisPost(postLikesService.didMeLikedThisPost(authUser, post));
            post.setDidMeSaveThisPost(bookmarkService.didMeBookmarkThisPost(authUser, post));
            post.setDidMeReportThisPost(postReportsService.didMeReportThisPost(authUser, post));
            post.getUser().setIsMeFollower(followersService.checkSubscriptionToUser(authUser, post.getUser()));
        });
        return new ShortPostPageDto<>(posts.getContent(), posts.getNumberOfElements(), posts.getTotalElements());
    }

    public Page<Posts> findByTag(List<com.talker.talker.domain.Tags> tag, Pageable pageable) {
        return postsRepository.findByTagsAndIsDraft(tag, false, pageable);
    }

    public ShortPageDto getGroupPosts(String groupURI, String authUserEmail, Pageable pageable) {
        Groups group = groupService.getGroupByURI(groupURI);
        User authUser = userService.getUserByEmail(authUserEmail);
        Boolean isMeFollowThisGroup = groupService.isMeFollowThisGroup(authUser, group);

        Page<Posts> posts = postsRepository.findByGroup(group, pageable);
        posts.forEach(post -> {
            post.setDidMeLikeThisPost(postLikesService.didMeLikedThisPost(authUser, post));
            post.setDidMeSaveThisPost(bookmarkService.didMeBookmarkThisPost(authUser, post));
            post.setDidMeReportThisPost(postReportsService.didMeReportThisPost(authUser, post));
            post.getGroup().setIsMeFollower(isMeFollowThisGroup);
        });

        return new ShortPageDto(posts.getContent(), posts.getNumberOfElements(), posts.getTotalElements());

    }

    public void savePost(Posts post) {
        postsRepository.save(post);
    }

    public void deletePost(String id, String authUserEmail) {
        User authUser = userService.getUserByEmail(authUserEmail);
        Posts post = postsRepository.getById(id);

        if (post.getUser().equals(authUser)) {
            postsRepository.deleteById(id);
        }
    }

    public Long getPostsCount(Boolean isDraft, String authUserEmail) {
        User authUser = userService.getUserByEmail(authUserEmail);
        return postsRepository.countByUserAndIsDraft(authUser, isDraft);
    }

    private int countReadingTime(String text) {
        if (!text.isEmpty()) {
            long letterCount = text.chars().filter(Character::isLetter).count();
            return Math.round(letterCount / 1500);
        }
        return 0;
    }
}
