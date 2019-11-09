import { combineReducers } from "redux";
import userReducer from "./user-reducer";
import securityReducer from "./security-reducer";
import postReducer from "./post-reducer";
import errorReducer from "./error-reducer";
import chatReducer from "./chat-reducer";
import notificationReducer from "./notifications-reducer";
import searchReducer from "./search-reducer";
import groupReducer from "./group-reducer";

export default combineReducers({
  user: userReducer,
  post: postReducer,
  chat: chatReducer,
  group: groupReducer,
  notification: notificationReducer,
  search: searchReducer,
  errors: errorReducer,
  security: securityReducer
});
