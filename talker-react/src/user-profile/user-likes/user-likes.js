import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getLikedPosts, getLikedResponses } from "../../actions/like-actions";
import Post from "../posts/post";
import UserResponses from "../user-responses/user-responses";
import "./user-likes.css";
import { isEmpty, blockMessage1 } from "../../utils/exception-utils";

class UserLikes extends Component {
  state = {
    current_tab: "posts"
  };

  componentDidMount() {
    const { user } = this.props;
    this.props.getLikedPosts(user.email, 1);
  }

  componentDidUpdate(prevProps, prevState) {
    const { current_tab } = this.state;
    const { user } = this.props;
    if (current_tab != prevState.current_tab) {
      if (current_tab == "posts") {
        this.props.getLikedPosts(user.email, 1);
      } else {
        this.props.getLikedResponses(user.email, 2);
      }
    }
  }

  changeTab(tab_name) {
    this.setState({
      current_tab: tab_name
    });
  }

  render() {
    const { user, responses, posts, history } = this.props;
    const { current_tab } = this.state;
    const { error } = this.props;

    if (!isEmpty(error)) {
      return blockMessage1();
    } else {
      return (
        <div className="user-likes">
          <p className="likes-title">Likes from {user.name}</p>
          <div className="likes-tabs">
            <button
              className={current_tab === "posts" ? "profile-tabs-active" : null}
              onClick={() => this.changeTab("posts")}
            >
              Posts
            </button>
            <button
              className={
                current_tab === "responses" ? "profile-tabs-active" : null
              }
              onClick={() => this.changeTab("responses")}
            >
              Responses
            </button>
          </div>
          {current_tab == "posts" ? (
            <Post
              user={user}
              history={history}
              showtitles={false}
              user_email={user.email}
              posts={posts}
              fromWhere={"posts"}
              action={this.props.getLikedPosts}
            />
          ) : null}
          {current_tab == "responses" ? (
            <UserResponses
              user={user}
              history={history}
              user_email={user.email}
              responses={responses}
              liked_responses={true}
              fromWhere={"responses"}
              getLikedResponses={this.props.getLikedResponses}
            />
          ) : null}
        </div>
      );
    }
  }
}

UserLikes.propTypes = {
  getLikedPosts: PropTypes.func.isRequired,
  getLikedResponses: PropTypes.func.isRequired,
  error: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  posts: state.post.posts,
  responses: state.post.responses,
  security: state.security,
  error: state.errors.error
});

export default connect(
  mapStateToProps,
  {
    getLikedPosts,
    getLikedResponses
  }
)(UserLikes);
