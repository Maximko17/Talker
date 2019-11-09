import {
  GET_USER_PROFILE,
  CHANGE_USER_ROLE_IN_GROUP,
  SUBSCRIBE_OR_BLOCK_PROFILE_USER,
  UNSUBSCRIBE_OR_UNBLOCK_PROFILE_USER,
  EXCLUDE_FROM_GROUP,
  SUBSCRIBE_TO_FOLLOWER_USER,
  UNSUBSCRIBE_FROM_FOLLOWER_USER,
  CHANGE_BAN_STATE_IN_GROUP,
  GET_FOLLOWERS,
  GET_BLOCKED_USERS,
  BLOCK_USERS,
  UNBLOCK_USERS,
  GET_GROUP_USERS
} from "../actions/types";

const initialState = {
  user: {},
  users: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_USER_PROFILE:
      return {
        ...state,
        user: action.payload
      };
    case GET_FOLLOWERS:
      return {
        ...state,
        users: action.payload
      };
    case GET_GROUP_USERS:
      return {
        ...state,
        users: action.payload
      };
    case CHANGE_USER_ROLE_IN_GROUP:
      return {
        ...state,
        users: {
          ...state.users,
          content: state.users.content.map(role =>
            role.user.id == action.payload.id
              ? {
                  ...role,
                  role: action.payload.role
                }
              : role
          )
        }
      };
    case CHANGE_BAN_STATE_IN_GROUP:
      return {
        ...state,
        users: {
          ...state.users,
          content: state.users.content.map(user =>
            user.email == action.payload
              ? {
                  ...user,
                  amIBannedInAGroup: !user.amIBannedInAGroup
                }
              : user
          )
        }
      };
    case EXCLUDE_FROM_GROUP:
      return {
        ...state,
        users: {
          content: state.users.content.filter(
            role => role.user.email != action.payload
          ),
          totalElements: state.users.totalElements - 1,
          currentSize: state.users.currentSize - 1
        }
      };
    case GET_BLOCKED_USERS:
      return {
        ...state,
        users: action.payload
      };

    case BLOCK_USERS:
      return {
        ...state,
        users: {
          ...state.users,
          content: state.users.content.map(user =>
            user.id == action.payload
              ? {
                  ...user,
                  haveIBlocked: true
                }
              : user
          )
        }
      };

    case UNBLOCK_USERS:
      return {
        ...state,
        users: {
          ...state.users,
          content: state.users.content.map(user =>
            user.id == action.payload
              ? {
                  ...user,
                  haveIBlocked: false
                }
              : user
          )
        }
      };

    case SUBSCRIBE_TO_FOLLOWER_USER:
      return {
        ...state,
        users: {
          ...state.users,
          content: state.users.content.map(user =>
            user.id === action.payload
              ? {
                  ...user,
                  totalFollowers: user.totalFollowers + 1,
                  isMeFollower: true
                }
              : user
          )
        }
      };

    case UNSUBSCRIBE_FROM_FOLLOWER_USER:
      return {
        ...state,
        users: {
          ...state.users,
          content: state.users.content.map(user =>
            user.id === action.payload
              ? {
                  ...user,
                  totalFollowers: user.totalFollowers - 1,
                  isMeFollower: false
                }
              : user
          )
        }
      };

    case SUBSCRIBE_OR_BLOCK_PROFILE_USER:
      if (action.payload.type === "sub") {
        return {
          ...state,
          user: {
            ...state.user,
            totalFollowers: state.user.totalFollowers + 1,
            isMeFollower: true
          }
        };
      } else {
        return {
          ...state,
          user: {
            ...state.user,
            totalFollowers:
              state.user.totalFollowers >= 1
                ? state.user.totalFollowers - 1
                : state.user.totalFollowers,
            isMeFollower: false,
            haveIBlocked: true
          }
        };
      }

    case UNSUBSCRIBE_OR_UNBLOCK_PROFILE_USER:
      if (action.payload.type === "sub") {
        return {
          ...state,
          user: {
            ...state.user,
            totalFollowers: state.user.totalFollowers - 1,
            isMeFollower: false
          }
        };
      } else {
        return {
          ...state,
          user: {
            ...state.user,
            haveIBlocked: false
          }
        };
      }

    default:
      return state;
  }
}
