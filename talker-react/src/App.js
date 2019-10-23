import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import UserProfile from "./user-profile/user-profile";
import FullPost from "./full-post/full-post";
import { Provider } from "react-redux";
import store from "./store";
import ScrollOnTop from "./utils/scroll-on-top";
import jwt_decode from "jwt-decode";
import { SET_CURRENT_USER } from "./actions/types";
import { logout } from "./actions/security-actions";
import setJWTToken from "./utils/security-utils";
import Bookmarks from "./boomarks/bookmarks";
import FullTags from "./full-tags/full-tags";
import EditUserProfile from "./user-profile/edit-profile/edit-profile";
import StartPage from "./main-components/start-page/start-page";
import NewPost from "./new-post/new-post";
import PrivateChat from "./chat/private-chat/private-chat";
import AllChats from "./chat/all-chats/all-chats";
import Friends from "./chat/friends/friends";
import { connectToNotificationSocket } from "./chat/websockets/notification-websocket";
import AllNotifications from "./all-notifications/all-notifications";
import FullSearch from "./full-search/full-search";
import OAuth2RedirectHandler from "./oauth2/oauth2-redirect-handler";
import MyAllPosts from "./my-all-posts/my-all-posts";

const accessToken = localStorage.access_token;
if (accessToken) {
  setJWTToken(accessToken);

  const refreshToken = localStorage.refresh_token;
  const decode_jwtToken = jwt_decode(refreshToken);
  store.dispatch({
    type: SET_CURRENT_USER,
    payload: decode_jwtToken
  });

  const current_time = Date.now() / 1000;
  if (decode_jwtToken.exp < current_time) {
    store.dispatch(logout());
    window.location.href = "/";
  }
  connectToNotificationSocket(`/topic/notification.${decode_jwtToken.id}`);
}
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <ScrollOnTop>
            <Route exact path="/" component={StartPage} />
            <Route exact path="/profile/:usermail" component={UserProfile} />
            <Route
              exact
              path="/profile/:usermail/edit"
              component={EditUserProfile}
            />
            <Route exact path="/post/:postid" component={FullPost} />
            <Route exact path="/new-post" component={NewPost} />
            <Route exact path="/p/:postId/edit" component={NewPost} />
            <Route exact path="/my-posts" component={MyAllPosts} />
            <Route exact path="/bookmarks" component={Bookmarks} />
            <Route exact path="/tag/:tagname" component={FullTags} />
            <Route exact path="/chat/user/:userId" component={PrivateChat} />
            <Route exact path="/my-chats" component={AllChats} />
            <Route exact path="/search" component={FullSearch} />
            <Route exact path="/my-followings" component={Friends} />
            <Route
              exact
              path="/oauth2/redirect"
              component={OAuth2RedirectHandler}
            />

            <Route
              exact
              path="/all-notifications"
              component={AllNotifications}
            />
          </ScrollOnTop>
        </Router>
      </Provider>
    );
  }
}

export default App;
