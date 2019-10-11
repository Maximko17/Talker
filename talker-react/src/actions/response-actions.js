import axios from "axios";
import {
  GET_POST_RESPONSES,
  NEW_POST_RESPONSE,
  BOOKMARK_RESPONSE,
  DELETE_RESPONSE_BOOKMARK,
  DELETE_BOOKMARKED_RESPONSE,
  GET_BOOKMARKED_RESPONSES,
  GET_ERROR,
  ADD_RESPONSE_REPORT,
  REMOVE_RESPONSE_REPORT
} from "./types";
import store from "../store";

export const getPostResponses = (
  postId,
  size,
  sort,
  direction
) => async dispatch => {
  const res = await axios.get(
    `/post/${postId}/responses?page=0&size=${size}&sort=${sort},${direction}`
  );

  dispatch({
    type: GET_POST_RESPONSES,
    payload: res.data
  });
};

export const getUserResponses = (
  usermail,
  size,
  sort,
  direction
) => async dispatch => {
  try {
    const res = await axios.get(
      `/profile/${usermail}/getUserResponses?page=0&size=${size}&sort=${sort},${direction}`
    );

    dispatch({
      type: GET_POST_RESPONSES,
      payload: res.data
    });
    dispatch({
      type: GET_ERROR,
      payload: {}
    });
  } catch (error) {
    dispatch({
      type: GET_ERROR,
      payload: error.response.data
    });
  }
};

export const newResponse = response => async dispatch => {
  try {
    const res = await axios.post(
      `/post/${response.postId}/newResponse`,
      response
    );

    dispatch({
      type: NEW_POST_RESPONSE,
      payload: res.data
    });
  } catch (error) {
    dispatch({
      type: GET_ERROR,
      payload: error.response.data
    });
  }
};

export const getBookmarkedResponses = () => async dispatch => {
  const res = await axios.get("/response/getBookmarkedResponses");

  store.dispatch({
    type: GET_BOOKMARKED_RESPONSES,
    payload: res.data
  });
};

export const bookmarkResponse = response => async dispatch => {
  await axios.post("/response/bookmarkResponse", response);

  store.dispatch({
    type: BOOKMARK_RESPONSE,
    payload: response.id
  });
};

export const deleteBookmarke = response => async dispatch => {
  await axios.delete("/response/deleteBookmarkedResponse", {
    data: response
  });

  store.dispatch({
    type: DELETE_RESPONSE_BOOKMARK,
    payload: response.id
  });
};

export const deleteBookmarkedResponse = response => async dispatch => {
  await axios.delete("/response/deleteBookmarkedResponse", {
    data: response
  });

  store.dispatch({
    type: DELETE_BOOKMARKED_RESPONSE,
    payload: response.id
  });
};

export const reportResponse = (response, reportType) => async dispatch => {
  const responseReport = {
    response: response,
    reportType: reportType
  };
  await axios.post("/response/addReport", responseReport);

  store.dispatch({
    type: ADD_RESPONSE_REPORT,
    payload: response.id
  });
};

export const removeReportFromResponse = response => async dispatch => {
  await axios.delete("/response/removeReport", {
    data: response
  });

  dispatch({
    type: REMOVE_RESPONSE_REPORT,
    payload: response.id
  });
};
