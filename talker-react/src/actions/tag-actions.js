import axios from "axios";
import { GET_TAG_POSTS } from "./types";

export const getPostsByTag = (tagName, size, sort, dir) => async dispatch => {
  const res = await axios.get(
    `/tag/${tagName}?page=0&size=${size}&sort=${sort},${dir}`
  );

  dispatch({
    type: GET_TAG_POSTS,
    payload: res.data
  });
};
