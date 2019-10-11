import axios from "axios";
import {
  GET_FOUND_USERS,
  GET_FOUND_POSTS,
  GET_FOUND_TAGS,
  GET_ALL_USER_POSTS,
  GET_FOLLOWERS
} from "./types";

export const getUsersBySearch = (
  username,
  size,
  shortSearch
) => async dispatch => {
  const res = await axios.get(
    `/profiles/get-by-search?username=${username}&page=0&size=${size}`
  );

  if (shortSearch) {
    dispatch({
      type: GET_FOUND_USERS,
      payload: res.data
    });
  } else {
    dispatch({
      type: GET_FOLLOWERS,
      payload: res.data
    });
  }
};

export const getPostsBySearch = (
  posttitle,
  size,
  shortSearch
) => async dispatch => {
  const res = await axios.get(
    `/posts/get-by-search?posttitle=${posttitle}&page=0&size=${size}`
  );

  if (shortSearch) {
    dispatch({
      type: GET_FOUND_POSTS,
      payload: res.data
    });
  } else {
    dispatch({
      type: GET_ALL_USER_POSTS,
      payload: res.data
    });
  }
};

export const getTagsBySearch = (tagname, size) => async dispatch => {
  const res = await axios.get(
    `/tags/get-by-search?tagname=${tagname}&page=0&size=${size}`
  );

  dispatch({
    type: GET_FOUND_TAGS,
    payload: res.data
  });
};
