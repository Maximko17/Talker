import {
  GET_FOUND_USERS,
  GET_FOUND_POSTS,
  GET_FOUND_TAGS
} from "../actions/types";

const initialState = {
  users: {},
  posts: {},
  tags: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_FOUND_USERS:
      return {
        ...state,
        users: action.payload
      };
    case GET_FOUND_POSTS:
      return {
        ...state,
        posts: action.payload
      };
    case GET_FOUND_TAGS:
      return {
        ...state,
        tags: action.payload
      };

    default:
      return state;
  }
}
