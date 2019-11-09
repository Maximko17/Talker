import {
  GET_GROUP,
  GET_GROUPS,
  SUBSCRIBE_TO_GROUP,
  SUBSCRIBE_TO_GROUPS,
  UNSUBSCRIBE_FROM_GROUP,
  UNSUBSCRIBE_FROM_GROUPS
} from "../actions/types";

const initialState = {
  groups: {
    content: []
  },
  group: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_GROUP:
      return {
        ...state,
        group: action.payload
      };
    case GET_GROUPS:
      return {
        ...state,
        groups: action.payload
      };
    case SUBSCRIBE_TO_GROUP:
      return {
        ...state,
        group: {
          ...state.group,
          isMeFollower: true,
          totalFollowers: state.group.totalFollowers + 1
        }
      };
    case SUBSCRIBE_TO_GROUPS:
      return {
        ...state,
        groups: state.groups.content.map(group =>
          group.uri === action.payload
            ? {
                ...group,
                isMeFollower: true,
                totalFollowers: state.group.totalFollowers + 1
              }
            : group
        )
      };
    case UNSUBSCRIBE_FROM_GROUP:
      return {
        ...state,
        group: {
          ...state.group,
          isMeFollower: false,
          totalFollowers:
            state.group.totalFollowers !== 0
              ? state.group.totalFollowers - 1
              : state.group.totalFollowers
        }
      };
    case UNSUBSCRIBE_FROM_GROUPS:
      return {
        ...state,
        groups: state.groups.content.map(group =>
          group.uri === action.payload
            ? {
                ...group,
                isMeFollower: false,
                totalFollowers:
                  state.group.totalFollowers !== 0
                    ? state.group.totalFollowers - 1
                    : state.group.totalFollowers
              }
            : group
        )
      };

    default:
      return state;
  }
}
