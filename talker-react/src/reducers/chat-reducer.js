import {
  ADD_NEW_MESSAGE,
  GET_MESSAGES,
  GET_CHATS,
  EDIT_MESSAGE,
  ADD_ONE_MESSAGE_TO_FAVORITE,
  ADD_MANY_MESSAGES_TO_FAVORITE,
  READ_UNREAD_MESSAGES,
  GET_UNREAD_CHATS_COUNT,
  DELETE_MESSAGES,
  GET_FAVORITE_MESSAGES
} from "../actions/types";

const initialState = {
  unread_chats_count: null,
  chats: {},
  messages: {
    content: [],
    currentSize: 0,
    totalElements: 0
  },
  fav_messages: {
    content: [],
    currentSize: 0,
    totalElements: 0
  }
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_MESSAGES:
      return {
        ...state,
        messages: action.payload
      };

    case GET_FAVORITE_MESSAGES:
      return {
        ...state,
        fav_messages: action.payload
      };

    case ADD_NEW_MESSAGE:
      return {
        ...state,
        messages: {
          ...state.messages,
          content: [...state.messages.content, action.payload]
        }
      };

    case EDIT_MESSAGE:
      return {
        ...state,
        messages: {
          ...state.messages,
          content: state.messages.content.map(message =>
            message.id === action.payload.id
              ? {
                  ...message,
                  content: action.payload.content,
                  files: action.payload.files
                }
              : message
          )
        }
      };

    case ADD_ONE_MESSAGE_TO_FAVORITE:
      return {
        ...state,
        messages:
          state.messages.content != undefined
            ? {
                ...state.messages,
                content: state.messages.content.map(message =>
                  message.id === action.payload
                    ? message.isFavorite == false
                      ? {
                          ...message,
                          isFavorite: true
                        }
                      : {
                          ...message,
                          isFavorite: false
                        }
                    : message
                )
              }
            : state.messages,
        fav_messages:
          state.fav_messages.content != undefined
            ? {
                ...state.fav_messages,
                content: state.fav_messages.content.map(message =>
                  message.id === action.payload
                    ? message.isFavorite == false
                      ? {
                          ...message,
                          isFavorite: true
                        }
                      : {
                          ...message,
                          isFavorite: false
                        }
                    : message
                )
              }
            : state.fav_messages
      };

    case ADD_MANY_MESSAGES_TO_FAVORITE:
      return {
        ...state,
        messages: {
          ...state.messages,
          content: state.messages.content.map(favmessage => {
            return checkIfExist(action.payload, favmessage, "favourites")
              ? {
                  ...favmessage,
                  isFavorite: true
                }
              : favmessage;
          })
        }
      };

    case GET_CHATS:
      return {
        ...state,
        messages: {
          content: [],
          currentSize: 0,
          totalElements: 0
        },
        chats: action.payload
      };

    case GET_UNREAD_CHATS_COUNT:
      return {
        ...state,
        unread_chats_count: action.payload
      };

    case READ_UNREAD_MESSAGES:
      return {
        ...state,
        unread_chats_count: state.unread_chats_count - 1,
        chats:
          state.chats.content != undefined
            ? state.chats.content.map(chat =>
                chat.chatId === action.payload.message
                  ? {
                      ...chat,
                      lastChatMessage: {
                        ...chat.lastChatMessage,
                        watched: true
                      },
                      unreadMessagesCount: 0
                    }
                  : chat
              )
            : state.chats,
        messages: {
          ...state.messages,
          content:
            state.messages.content.length !== 0
              ? state.messages.content.map(message =>
                  message != null
                    ? {
                        ...message,
                        watched: true
                      }
                    : message
                )
              : state.messages
        }
      };

    case DELETE_MESSAGES:
      return {
        ...state,
        messages: {
          ...state.messages,
          content: state.messages.content.filter(
            favmessage =>
              favmessage.id !==
              checkIfExist(action.payload, favmessage, "delete")
          )
        }
      };

    default:
      return state;
  }
}

function checkIfExist(array, value, type) {
  if (type === "favourites") {
    for (let i = 0; i < array.length; i++) {
      if (array[i].id === value.id && value.isFavorite == false) {
        return true;
      }
    }
    return false;
  } else {
    for (let i = 0; i < array.length; i++) {
      if (array[i].id === value.id) {
        return array[i].id;
      }
    }
    return false;
  }
}
