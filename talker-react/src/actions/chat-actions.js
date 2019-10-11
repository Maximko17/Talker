import {
  ADD_NEW_MESSAGE,
  GET_MESSAGES,
  GET_CHATS,
  EDIT_MESSAGE,
  ADD_ONE_MESSAGE_TO_FAVORITE,
  ADD_MANY_MESSAGES_TO_FAVORITE,
  READ_UNREAD_MESSAGES,
  DELETE_MESSAGES,
  GET_UNREAD_CHATS_COUNT,
  GET_FAVORITE_MESSAGES
} from "./types";
import axios from "axios";
import { connectToChatSocket } from "../chat/websockets/message-websocket";

export const createNewChat = (
  userId,
  addNewMessageFunc,
  getChatMessagesFunc,
  changeConnectionFunc
) => async dispatch => {
  await axios.post(`/newChat/user/${userId}`).then(response => {
    connectToChatSocket(
      `/topic/chat/${response.data}`,
      addNewMessageFunc,
      changeConnectionFunc
    );
    getChatMessagesFunc(userId);
  });
};

export const getChatMessages = userId => async dispatch => {
  const res = await axios.get(
    `/chat/user/${userId}/getMessages?page=0&size=30`
  );
  dispatch({
    type: GET_MESSAGES,
    payload: res.data
  });
};

export const sendAMessage = (message, files, userId) => async dispatch => {
  try {
    const url = `/chat/sendMessage/toUser/${userId}`;
    const formData = new FormData();
    files.forEach(file => {
      formData.append("files", file);
    });
    formData.append(
      "message",
      new Blob(
        [
          JSON.stringify({
            id: message.id,
            content: message.content,
            files: message.files
          })
        ],
        {
          type: "application/json"
        }
      )
    );
    await axios.post(url, formData);
  } catch (error) {
    console.log(error);
  }
};

export const addNewMessage = message => async dispatch => {
  if (message.isEdited) {
    dispatch({
      type: EDIT_MESSAGE,
      payload: message
    });
  } else {
    dispatch({
      type: ADD_NEW_MESSAGE,
      payload: message
    });
  }
};

export const downloadFile = fileName => async dispatch => {
  const res = await axios.get(`/chat/download-file/${fileName}`);

  var a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  var json = JSON.stringify(res.data),
    blob = new Blob([json], { type: "octet/stream" }),
    url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
};

export const addManyMessagesToFavorite = (
  messages,
  cancelSelectMode
) => async dispatch => {
  await axios
    .post(`/chat/messages/addToFavorite`, { messages })
    .then(cancelSelectMode);
  dispatch({
    type: ADD_MANY_MESSAGES_TO_FAVORITE,
    payload: messages
  });
};

export const addOneMessageToFavorite = messageId => async dispatch => {
  await axios.post(`/chat/message/${messageId}/addToFavorite`);
  dispatch({
    type: ADD_ONE_MESSAGE_TO_FAVORITE,
    payload: messageId
  });
};

export const getChats = tab => async dispatch => {
  const res = await axios.get(
    tab === "" ? `/getChats?tab=all` : `/getChats?tab=unread`
  );
  dispatch({
    type: GET_CHATS,
    payload: res.data
  });
};

export const getChatsBySearch = input => async dispatch => {
  const res = await axios.get(`/chats/get-by-search?user=${input}`);
  dispatch({
    type: GET_CHATS,
    payload: res.data
  });
};

export const getFavoriteMessages = size => async dispatch => {
  const res = await axios.get(`/getFavoriteMessages?page=0&size=${size}`);
  dispatch({
    type: GET_FAVORITE_MESSAGES,
    payload: res.data
  });
};

export const countUnreadChats = () => async dispatch => {
  const res = await axios.get(`/chats/get-unread-count`);
  dispatch({
    type: GET_UNREAD_CHATS_COUNT,
    payload: res.data
  });
};

export const readUnreadMessages = userId => async dispatch => {
  await axios.post(`/chat/${userId}/read-unread-messages`);
  dispatch({
    type: READ_UNREAD_MESSAGES,
    payload: userId
  });
};

export const deleteMessages = (
  userId,
  messages,
  cancelSelectMode
) => async dispatch => {
  await axios
    .delete(`/chat/${userId}/delete-messages`, {
      data: { messages }
    })
    .then(cancelSelectMode);
  dispatch({
    type: DELETE_MESSAGES,
    payload: messages
  });
};
