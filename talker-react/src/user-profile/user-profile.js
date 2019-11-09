import React, { Component } from "react";
import Header from "../main-components/header/header";
import "./user-profile.css";
import Post from "./posts/post";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getDate } from "../utils/date-utils";
import {
  getUserProfile,
  subscribeToUser,
  unsubscribeFromUser
} from "../actions/user-actions";
import { getAllUserPosts } from "../actions/post-actions";
import { getProfileFollowButton } from "../utils/followers-utils";
import { Link } from "react-router-dom";
import Followers from "./folowers/followers";
import BlockedUsers from "./blocked-users/blocked-users";
import UserResponses from "./user-responses/user-responses";
import UserLikes from "./user-likes/user-likes";
import { getMessageButton } from "../utils/chat-utils";
import { notFoundException, isEmpty } from "../utils/exception-utils";

class UserProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      current_tab: "profile"
    };

    this.getScrollAction = this.getScrollAction.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.current_tab !== this.state.current_tab) {
      if (this.state.current_tab == "profile") {
        const { usermail } = this.props.match.params;
        this.props.getAllUserPosts(usermail, 2);
      }
    }
  }
  componentDidMount() {
    const { usermail } = this.props.match.params;
    this.props.getUserProfile(usermail);
    this.props.getAllUserPosts(usermail, 1);
  }

  changeTab(tab_name) {
    this.setState({
      current_tab: tab_name
    });
  }

  getScrollAction(size) {
    const { email } = this.props.user;
    this.props.getAllUserPosts(email, size);
  }

  render() {
    const { history, user, security, posts, error } = this.props;
    const { current_tab } = this.state;
    if (!isEmpty(error) && error.status === 404) {
      return notFoundException();
    }
    return (
      <div>
        <Header style={"profile"} color={user.profileTheme} />
        <div className="user-content" style={{ background: user.profileTheme }}>
          <div className="user-info">
            <div className="d-flex">
              <p className="profile-username">{user.name}</p>
              {user.id === security.user.id ? (
                <button
                  className="edit-profile"
                  onClick={() => history.push(`/profile/${user.email}/edit`)}
                >
                  Edit profile
                </button>
              ) : null}
            </div>
            <p className="profile-registr-time">
              Talker member since {getDate(user.login_date)}
            </p>
            <p className="profile-user-description">{user.description}</p>
            <p className="profile-user-followers">
              <Link to={"#"} onClick={() => this.changeTab("followings")}>
                <b>{user.totalFollowing}</b> Following{" "}
              </Link>
              <Link to={"#"} onClick={() => this.changeTab("followers")}>
                <b>{user.totalFollowers}</b> Followers .
              </Link>
              {user.facebookURL != null ? (
                <a
                  href={user.facebookURL}
                  className="profile-social"
                  target="_blank"
                  rel="noopener"
                >
                  <i className="fab fa-facebook-square" />
                </a>
              ) : null}
              {user.twitterURL != null ? (
                <a
                  href={user.twitterURL}
                  className="profile-social"
                  target="_blank"
                  rel="noopener"
                >
                  <i className="fab fa-twitter" />
                </a>
              ) : null}
              {user.instagramURL != null ? (
                <a
                  href={user.instagramURL}
                  className="profile-social"
                  target="_blank"
                  rel="noopener"
                >
                  <i className="fab fa-instagram" />
                </a>
              ) : null}
              {user.vkontakteURL != null ? (
                <a
                  href={user.vkontakteURL}
                  className="profile-social"
                  target="_blank"
                  rel="noopener"
                >
                  <i className="fab fa-vk" />
                </a>
              ) : null}
            </p>
            <div className="d-flex">
              {getMessageButton(user, security, "profile-message-button")}
              {getProfileFollowButton(
                user,
                security,
                "profile",
                "profile-block-dropdown"
              )}
            </div>
          </div>
          <div className="user-photo">
            <img src={user.photo} alt="Img" />
          </div>
        </div>

        <div className="profile-tabs">
          <button
            className={current_tab === "profile" ? "profile-tabs-active" : null}
            onClick={() => this.changeTab("profile")}
          >
            Profile
          </button>
          <button
            className={current_tab === "likes" ? "profile-tabs-active" : null}
            onClick={() => this.changeTab("likes")}
          >
            Likes
          </button>
          <button
            className={
              current_tab === "responses" ? "profile-tabs-active" : null
            }
            onClick={() => this.changeTab("responses")}
          >
            Responses
          </button>
          {user.email == security.user.email ? (
            <button
              className={
                current_tab === "blockedUsers" ? "profile-tabs-active" : null
              }
              onClick={() => this.changeTab("blockedUsers")}
            >
              Blocked users
            </button>
          ) : null}
        </div>

        {current_tab == "profile" ? (
          <Post
            user={user}
            history={history}
            showtitles={true}
            fromWhere={"profile"}
            posts={posts}
            action={this.getScrollAction}
          />
        ) : null}
        {current_tab == "likes" ? (
          <UserLikes user={user} history={history} />
        ) : null}
        {current_tab == "responses" ? (
          <UserResponses user={user} history={history} fromWhere={"profile"} />
        ) : null}
        {current_tab == "blockedUsers" ? <BlockedUsers /> : null}
        {current_tab == "followings" || current_tab == "followers" ? (
          <Followers
            type={current_tab}
            user_email={user.email}
            user_name={user.name}
          />
        ) : null}
      </div>
    );
  }
}

UserProfile.propTypes = {
  getUserProfile: PropTypes.func.isRequired,
  subscribeToUser: PropTypes.func.isRequired,
  unsubscribeFromUser: PropTypes.func.isRequired,
  getAllUserPosts: PropTypes.func.isRequired,
  error: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user.user,
  security: state.security,
  posts: state.post.posts,
  error: state.errors.error
});

export default connect(
  mapStateToProps,
  {
    getUserProfile,
    subscribeToUser,
    unsubscribeFromUser,
    getAllUserPosts
  }
)(UserProfile);
