import {
  GET_ALL_NOTIFICATIONS,
  GET_LAST_NOTIFICATIONS,
  NEW_NOTIFICATION,
  DELETE_NOTIFICATION,
  DELETE_MESSAGE_NOTIFICATIONS,
  SUBSCRIBE_TO_NOTIFICATION_USER,
  UNSUBSCRIBE_FROM_NOTIFICATION_USER,
  COUNT_NOTIFICATIONS,
  READ_ALL_NOTIFICATIONS
} from "../actions/types";

const initialState = {
  total_notifications: 0,
  all_notifications: {},
  last_notifications: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_NOTIFICATIONS:
      return {
        ...state,
        all_notifications: action.payload
      };
    case GET_LAST_NOTIFICATIONS:
      return {
        ...state,
        last_notifications: action.payload
      };

    case READ_ALL_NOTIFICATIONS:
      return {
        ...state,
        total_notifications: 0
      };

    case COUNT_NOTIFICATIONS:
      return {
        ...state,
        total_notifications: action.payload
      };

    case NEW_NOTIFICATION: {
      if (action.payload.type === "MESSAGE") {
        return {
          ...state,
          all_notifications:
            state.all_notifications.content != undefined
              ? {
                  ...state.all_notifications,
                  hasNewMessages: true
                }
              : state.all_notifications,
          last_notifications: {
            ...state.last_notifications,
            hasNewMessages: true
          }
        };
      } else {
        return {
          total_notifications: state.total_notifications + 1,
          all_notifications:
            state.all_notifications.content != undefined
              ? {
                  ...state.all_notifications,
                  content: [action.payload, ...state.all_notifications.content]
                }
              : state.all_notifications,
          last_notifications: {
            ...state.last_notifications,
            content: [action.payload, ...state.last_notifications.content]
          }
        };
      }
    }
    case DELETE_MESSAGE_NOTIFICATIONS: {
      return {
        ...state,
        all_notifications:
          state.all_notifications.content != undefined
            ? {
                ...state.all_notifications,
                content: state.all_notifications.content.filter(
                  notification => notification.fromUser.id !== action.payload
                )
              }
            : state.all_notifications,
        last_notifications: {
          ...state.last_notifications,
          content: state.last_notifications.content.filter(
            notification => notification.fromUser.id !== action.payload
          )
        }
      };
    }

    case DELETE_NOTIFICATION: {
      return {
        total_notifications: state.total_notifications - 1,
        all_notifications:
          state.all_notifications.content != undefined
            ? {
                ...state.all_notifications,
                content: state.all_notifications.content.filter(
                  notification => notification.id !== action.payload
                )
              }
            : state.all_notifications,
        last_notifications: {
          ...state.last_notifications,
          content: state.last_notifications.content.filter(
            notification => notification.id !== action.payload
          )
        }
      };
    }

    case SUBSCRIBE_TO_NOTIFICATION_USER:
      return {
        ...state,
        all_notifications:
          state.all_notifications.content != undefined
            ? {
                ...state.all_notifications,
                content: state.all_notifications.content.map(notification =>
                  notification.fromUser.id === action.payload
                    ? {
                        ...notification,
                        fromUser: {
                          ...notification.fromUser,
                          isMeFollower: true
                        }
                      }
                    : notification
                )
              }
            : state.all_notifications
      };

    case UNSUBSCRIBE_FROM_NOTIFICATION_USER:
      return {
        ...state,
        all_notifications:
          state.all_notifications.content != undefined
            ? {
                ...state.all_notifications,
                content: state.all_notifications.content.map(notification =>
                  notification.fromUser.id === action.payload
                    ? {
                        ...notification,
                        fromUser: {
                          ...notification.fromUser,
                          isMeFollower: false
                        }
                      }
                    : notification
                )
              }
            : state.all_notifications
      };

    default:
      return state;
  }
}
