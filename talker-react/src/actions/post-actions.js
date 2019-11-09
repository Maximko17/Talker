import axios from "axios";
import {
  GET_POST,
  GET_ALL_USER_POSTS,
  GET_ALL_GROUP_POSTS,
  GET_THREE_RANDOM_POSTS,
  BOOKMARK_POST,
  GET_BOOKMARKED_POSTS,
  DELETE_BOOKMARKED_POST,
  DELETE_BOOKMARK,
  GET_ERROR,
  ADD_POST_REPORT,
  REMOVE_POST_REPORT,
  DELETE_POST
} from "./types";
import store from "../store";

export const getPost = id => async dispatch => {
  try {
    const res = await axios.get("/post/" + id);

    dispatch({
      type: GET_POST,
      payload: res.data
    });
    dispatch({
      type: GET_ERROR,
      payload: {}
    });
  } catch (error) {
    dispatch({
      type: GET_ERROR,
      payload: { status: error.response.status }
    });
  }
};

export const savePost = (
  post,
  history,
  changeSaveIndicator,
  postUrl
) => async dispatch => {
  try {
    const url = "/newPost";
    const formData = new FormData();
    formData.append("preview_image", post.main_image);
    post.postImages.forEach(element => {
      formData.append("images", element.file);
    });
    formData.append(
      "post",
      new Blob(
        [
          JSON.stringify({
            id: post.id,
            title: post.title,
            subtitle: post.subtitle,
            text: post.text,
            postImages: post.postImages,
            tags: post.tags,
            isDraft: post.isDraft
          })
        ],
        {
          type: "application/json"
        }
      )
    );
    const config = {
      headers: {
        "Content-Type": undefined
      }
    };
    if (postUrl === "/new-post") {
      await axios
        .post(url, formData, config)
        .then(response => history.push(`/p/${response.data}/edit`));
    } else {
      await axios.post(url, formData, config);
    }
    changeSaveIndicator(true);
  } catch (error) {
    dispatch({
      type: GET_ERROR,
      payload: error.response.data
    });
  }
};

export const getAllUserPosts = (usermail, size) => async dispatch => {
  try {
    const res = await axios.get(
      `/profile/${usermail}/allPosts?page=0&size=${size}&sort=postDate,desc`
    );

    dispatch({
      type: GET_ALL_USER_POSTS,
      payload: res.data
    });
    dispatch({
      type: GET_ERROR,
      payload: {}
    });
  } catch (error) {
    dispatch({
      type: GET_ERROR,
      payload: { status: error.response.status }
    });
  }
};

export const getAllGroupPosts = (groupURI, size) => async dispatch => {
  try {
    const res = await axios.get(
      `/posts/${groupURI}/allPosts?page=0&size=${size}&sort=postDate,desc`
    );

    dispatch({
      type: GET_ALL_GROUP_POSTS,
      payload: res.data
    });
    dispatch({
      type: GET_ERROR,
      payload: {}
    });
  } catch (error) {
    dispatch({
      type: GET_ERROR,
      payload: { status: error.response.status }
    });
  }
};

export const getAllMyPosts = (isDraft, size) => async dispatch => {
  try {
    const res = await axios.get(
      `/posts/all-my-posts?isDraft=${isDraft}&page=0&size=${size}&sort=postDate,desc`
    );

    dispatch({
      type: GET_ALL_USER_POSTS,
      payload: res.data
    });
  } catch (error) {
    dispatch({
      type: GET_ERROR,
      payload: error.response.data
    });
  }
};

export const getBookmarkedPosts = () => async dispatch => {
  const res = await axios.get("/post/getBookmarkedPosts");

  store.dispatch({
    type: GET_BOOKMARKED_POSTS,
    payload: res.data
  });
};

export const bookmarkPost = (post, isOnePost) => async dispatch => {
  try {
    await axios.post("/post/bookmarkPost", post);

    store.dispatch({
      type: BOOKMARK_POST,
      payload: { postId: post.id, isOnePost }
    });
  } catch (error) {
    dispatch({
      type: GET_ERROR,
      payload: { status: error.response.status }
    });
  }
};

export const deleteBookmarke = (post, isOnePost) => async dispatch => {
  await axios.delete("/post/deleteBookmarkedPost", {
    data: post
  });

  store.dispatch({
    type: DELETE_BOOKMARK,
    payload: { postId: post.id, isOnePost }
  });
};

export const deleteBookmarkedPost = post => async dispatch => {
  await axios.delete("/post/deleteBookmarkedPost", {
    data: post
  });

  store.dispatch({
    type: DELETE_BOOKMARKED_POST,
    payload: post.id
  });
};

export const reportPost = (post, reportType, isOnePost) => async dispatch => {
  const postReport = {
    post: post,
    reportType: reportType
  };
  await axios.post("/post/addReport", postReport);

  dispatch({
    type: ADD_POST_REPORT,
    payload: { postId: post.id, isOnePost }
  });
};

export const removeReportFromPost = (post, isOnePost) => async dispatch => {
  await axios.delete("/post/removeReport", {
    data: post
  });

  dispatch({
    type: REMOVE_POST_REPORT,
    payload: { postId: post.id, isOnePost }
  });
};

export const getThreeRandomPosts = postId => async dispatch => {
  const res = await axios.get(`/post/${postId}/getThreeRandom`);
  dispatch({
    type: GET_THREE_RANDOM_POSTS,
    payload: res.data
  });
};

export const deletePost = postId => async dispatch => {
  try {
    await axios.delete(`/post/${postId}/delete`);
    dispatch({
      type: DELETE_POST,
      payload: postId
    });
  } catch (error) {
    console.log(error);
  }
};
