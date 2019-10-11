import {
  GET_ALL_NOTIFICATIONS,
  GET_LAST_NOTIFICATIONS,
  NEW_NOTIFICATION,
  DELETE_NOTIFICATION,
  DELETE_MESSAGE_NOTIFICATIONS,
  COUNT_NOTIFICATIONS,
  READ_ALL_NOTIFICATIONS
} from "./types";
import axios from "axios";
import store from "../store";

export const newNotification = notification => async dispatch => {
  store.dispatch({
    type: NEW_NOTIFICATION,
    payload: notification
  });
};

export const countAllNewNotifications = () => async dispatch => {
  const res = await axios.get(`/notifications/count`);

  dispatch({
    type: COUNT_NOTIFICATIONS,
    payload: res.data
  });
};

export const getLastNotifications = () => async dispatch => {
  const res = await axios.get(`/notifications/last`);
  dispatch({
    type: GET_LAST_NOTIFICATIONS,
    payload: res.data
  });
};

export const getAllNotifications = size => async dispatch => {
  const res = await axios.get(`/notifications/all?page=0&size=${size}`);
  dispatch({
    type: GET_ALL_NOTIFICATIONS,
    payload: res.data
  });
};

export const readAllNotifications = () => async dispatch => {
  await axios.post(`/notifications/read-all`);
  dispatch({
    type: READ_ALL_NOTIFICATIONS,
    payload: null
  });
};

export const deleteMessageNotification = fromUser => async dispatch => {
  await axios.delete(`/notifications/${fromUser}/delete`);
  dispatch({
    type: DELETE_MESSAGE_NOTIFICATIONS,
    payload: fromUser
  });
};

export const deleteNotification = id => async dispatch => {
  await axios.delete(`/notification/${id}/delete`);
  dispatch({
    type: DELETE_NOTIFICATION,
    payload: id
  });
};
