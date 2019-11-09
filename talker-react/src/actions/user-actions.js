import axios from "axios";
import {
  GET_USER_PROFILE,
  SUBSCRIBE_OR_BLOCK_POST_USER,
  UNSUBSCRIBE_OR_UNBLOCK_POST_USER,
  SUBSCRIBE_OR_BLOCK_POSTS_USERS,
  UNSUBSCRIBE_OR_UNBLOCK_POSTS_USERS,
  SUBSCRIBE_OR_BLOCK_RESPONSES_USERS,
  UNSUBSCRIBE_OR_UNBLOCK_RESPONSES_USERS,
  SUBSCRIBE_OR_BLOCK_PROFILE_USER,
  UNSUBSCRIBE_OR_UNBLOCK_PROFILE_USER,
  SUBSCRIBE_TO_NOTIFICATION_USER,
  UNSUBSCRIBE_FROM_NOTIFICATION_USER,
  GET_FOLLOWERS,
  SUBSCRIBE_TO_FOLLOWER_USER,
  UNSUBSCRIBE_FROM_FOLLOWER_USER,
  GET_BLOCKED_USERS,
  BLOCK_USERS,
  UNBLOCK_USERS,
  SET_CURRENT_USER,
  GET_ERROR
} from "./types";
import jwt_decode from "jwt-decode";
import store from "../store";

export const getUserProfile = usermail => async dispatch => {
  try {
    const res = await axios.get("/profile/" + usermail);

    dispatch({
      type: GET_USER_PROFILE,
      payload: res.data
    });
  } catch (error) {
    dispatch({
      type: GET_ERROR,
      payload: { status: error.response.status }
    });
  }
};

export const getUserById = id => async dispatch => {
  const res = await axios.get("/user/" + id);

  dispatch({
    type: GET_USER_PROFILE,
    payload: res.data
  });
};

export const editUserProfile = (user, history) => async dispatch => {
  try {
    const url = "/profile/edit";
    const formData = new FormData();
    formData.append("photo", user.photo);
    formData.append(
      "user",
      new Blob(
        [
          JSON.stringify({
            id: user.id,
            name: user.name,
            email: user.email,
            description: user.description,
            facebookURL: user.facebookURL,
            twitterURL: user.twitterURL,
            instagramURL: user.instagramURL,
            vkontakteURL: user.vkontakteURL,
            profileTheme: user.profileTheme
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
    const res = await axios.post(url, formData, config);

    localStorage.removeItem("refresh_token");
    localStorage.setItem("refresh_token", res.data);
    const decode_jwtToken = jwt_decode(res.data);
    store.dispatch({
      type: SET_CURRENT_USER,
      payload: decode_jwtToken
    });
    history.push(`/profile/${user.email}`);
  } catch (error) {
    console.log(error);
  }
};

export const getFollowers = usermail => async dispatch => {
  const res = await axios.get("/followers/" + usermail);

  dispatch({
    type: GET_FOLLOWERS,
    payload: res.data
  });
};

export const getFollowings = usermail => async dispatch => {
  const res = await axios.get("/followings/" + usermail);

  dispatch({
    type: GET_FOLLOWERS,
    payload: res.data
  });
};

export const getBlockedUsers = () => async dispatch => {
  const res = await axios.get(`/profile/getBlockedUsers`);

  dispatch({
    type: GET_BLOCKED_USERS,
    payload: res.data
  });
};

export const blockUser = (
  following_user_email,
  blockPlace
) => async dispatch => {
  await axios.post(`/profile/${following_user_email}/block`);

  switch (blockPlace) {
    case "profile":
      store.dispatch({
        type: SUBSCRIBE_OR_BLOCK_PROFILE_USER,
        payload: { data: following_user_email, type: "block" }
      });
      break;
    case "post":
      store.dispatch({
        type: SUBSCRIBE_OR_BLOCK_POST_USER,
        payload: { data: following_user_email, type: "block" }
      });
      break;
    case "posts":
      store.dispatch({
        type: SUBSCRIBE_OR_BLOCK_POSTS_USERS,
        payload: { data: following_user_email, type: "block" }
      });
      break;
    case "responses":
      store.dispatch({
        type: SUBSCRIBE_OR_BLOCK_RESPONSES_USERS,
        payload: { data: following_user_email, type: "block" }
      });
      break;
    case "users":
      store.dispatch({
        type: BLOCK_USERS,
        payload: following_user_email
      });
      break;
  }
};

export const unBlockUser = (
  following_user_email,
  blockPlace
) => async dispatch => {
  await axios.delete(`/profile/${following_user_email}/unblock`);

  switch (blockPlace) {
    case "profile":
      store.dispatch({
        type: UNSUBSCRIBE_OR_UNBLOCK_PROFILE_USER,
        payload: { data: following_user_email, type: "block" }
      });
      break;
    case "post":
      store.dispatch({
        type: UNSUBSCRIBE_OR_UNBLOCK_POST_USER,
        payload: { data: following_user_email, type: "block" }
      });
      break;
    case "posts":
      store.dispatch({
        type: UNSUBSCRIBE_OR_UNBLOCK_POSTS_USERS,
        payload: { data: following_user_email, type: "block" }
      });
      break;
    case "responses":
      store.dispatch({
        type: UNSUBSCRIBE_OR_UNBLOCK_RESPONSES_USERS,
        payload: { data: following_user_email, type: "block" }
      });
      break;
    case "users":
      store.dispatch({
        type: UNBLOCK_USERS,
        payload: following_user_email
      });
      break;
  }
};

export const subscribeToUser = (
  following_user,
  fromWhere
) => async dispatch => {
  await axios.post("/followers/subscribeToUser/" + following_user);

  switch (fromWhere) {
    case "post":
      store.dispatch({
        type: SUBSCRIBE_OR_BLOCK_POST_USER,
        payload: { data: following_user, type: "sub" }
      });
      break;
    case "profile":
      store.dispatch({
        type: SUBSCRIBE_OR_BLOCK_PROFILE_USER,
        payload: { data: following_user, type: "sub" }
      });
      break;
    case "posts":
      store.dispatch({
        type: SUBSCRIBE_OR_BLOCK_POSTS_USERS,
        payload: { data: following_user, type: "sub" }
      });
      break;
    case "responses":
      store.dispatch({
        type: SUBSCRIBE_OR_BLOCK_RESPONSES_USERS,
        payload: { data: following_user, type: "sub" }
      });
      break;
    case "users":
      store.dispatch({
        type: SUBSCRIBE_TO_FOLLOWER_USER,
        payload: following_user
      });
    case "notifications":
      {
        store.dispatch({
          type: SUBSCRIBE_TO_NOTIFICATION_USER,
          payload: following_user
        });
      }
      break;
  }
};

export const unsubscribeFromUser = (
  following_user,
  fromWhere
) => async dispatch => {
  await axios.delete("/followers/unsubscribeFromUser/" + following_user);

  switch (fromWhere) {
    case "post":
      store.dispatch({
        type: UNSUBSCRIBE_OR_UNBLOCK_POST_USER,
        payload: { data: following_user, type: "sub" }
      });
      break;
    case "profile":
      store.dispatch({
        type: UNSUBSCRIBE_OR_UNBLOCK_PROFILE_USER,
        payload: { data: following_user, type: "sub" }
      });
      break;
    case "posts":
      store.dispatch({
        type: UNSUBSCRIBE_OR_UNBLOCK_POSTS_USERS,
        payload: { data: following_user, type: "sub" }
      });
      break;
    case "responses":
      store.dispatch({
        type: UNSUBSCRIBE_OR_UNBLOCK_RESPONSES_USERS,
        payload: { data: following_user, type: "sub" }
      });
      break;
    case "users":
      store.dispatch({
        type: UNSUBSCRIBE_FROM_FOLLOWER_USER,
        payload: following_user
      });
    case "notifications":
      {
        store.dispatch({
          type: UNSUBSCRIBE_FROM_NOTIFICATION_USER,
          payload: following_user
        });
      }
      break;
  }
};
