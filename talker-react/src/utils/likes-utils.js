import React from "react";
import {
  likePost,
  unlikePost,
  likeResponse,
  unlikeResponse
} from "../actions/like-actions";

export const getPostLikeButton = (
  didMeLiked,
  postId,
  userId,
  style,
  activeStyle,
  isOnePost
) => {
  if (didMeLiked) {
    return (
      <button className={activeStyle} onClick={unlikePost(postId, isOnePost)}>
        <i className="fas fa-heart" />
      </button>
    );
  } else {
    return (
      <button className={style} onClick={likePost(postId, isOnePost)}>
        <i className="far fa-heart" />
      </button>
    );
  }
};

export const getResponseLikeButton = (didMeLiked, responseId, userId) => {
  if (didMeLiked) {
    return (
      <button
        className="likeButton"
        onClick={unlikeResponse(responseId, userId)}
      >
        <i className="fas fa-heart" />
      </button>
    );
  } else {
    return (
      <button
        className="unlikeButton"
        onClick={likeResponse(responseId, userId)}
      >
        <i className="far fa-heart" />
      </button>
    );
  }
};
