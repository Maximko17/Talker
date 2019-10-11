import axios from "axios";
import {
  LIKE_POST,
  UNLIKE_POST,
  LIKE_RESPONSE,
  UNLIKE_RESPONSE,
  GET_LIKED_POSTS,
  GET_LIKED_RESPONSES
} from "./types";
import store from "../store";

export const getLikedPosts = (user_email, size) => async dispatch => {
  const res = await axios.get(
    `/profile/${user_email}/getLikedPosts?page=0&size=${size}`
  );

  dispatch({
    type: GET_LIKED_POSTS,
    payload: res.data
  });
};

export const getLikedResponses = (user_email, size) => async dispatch => {
  const res = await axios.get(
    `/profile/${user_email}/getLikedResponses?page=0&size=${size}`
  );

  dispatch({
    type: GET_LIKED_RESPONSES,
    payload: res.data
  });
};

export const likePost = (postId, isOnePost) => async dispatch => {
  await axios.post(`/post/${postId}/likePost`);

  store.dispatch({
    type: LIKE_POST,
    payload: { postId, isOnePost }
  });
};

export const unlikePost = (postId, isOnePost) => async dispatch => {
  await axios.delete(`/post/${postId}/unlikePost`);

  store.dispatch({
    type: UNLIKE_POST,
    payload: { postId, isOnePost }
  });
};

export const likeResponse = responseId => async dispatch => {
  await axios.post(`/response/${responseId}/likeResponse`);

  store.dispatch({
    type: LIKE_RESPONSE,
    payload: responseId
  });
};

export const unlikeResponse = responseId => async dispatch => {
  await axios.delete(`/response/${responseId}/unlikeResponse`);

  store.dispatch({
    type: UNLIKE_RESPONSE,
    payload: responseId
  });
};
