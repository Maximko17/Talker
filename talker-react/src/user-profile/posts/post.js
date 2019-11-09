import React, { Component } from "react";
import "./post.css";
import MappleToolTip from "reactjs-mappletooltip";
import { bookmarkPost, deleteBookmarke } from "../../actions/post-actions";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { isEmpty, blockMessage1 } from "../../utils/exception-utils";
import UserPosts from "./user-posts/user-posts";
import GroupPosts from "./group-posts/group-posts";

class Post extends Component {
  constructor(props) {
    super(props);
    this.onScroll = this.onScroll.bind(this);
  }

  componentDidMount() {
    window.addEventListener("scroll", this.onScroll, false);
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this.onScroll, false);
  }

  onScroll() {
    const { posts } = this.props;
    const { currentSize, totalElements } = posts;

    var scrollHeight = document.documentElement.scrollHeight;
    var clientHeight = document.documentElement.clientHeight;
    var scrollTop = document.documentElement.scrollTop;
    if (
      scrollTop >= scrollHeight - clientHeight - 5 &&
      currentSize < totalElements
    ) {
      this.props.action(currentSize + 1);
    }
  }

  render() {
    const {
      posts,
      showtitles,
      user,
      group,
      security,
      history,
      fromWhere,
      error
    } = this.props;

    if (!isEmpty(error)) {
      return blockMessage1();
    } else {
      if (posts.content && posts.content.length === 0) {
        return (
          <div className="null-content">
            <p>User has no posts yet</p>
          </div>
        );
      } else {
        return (
          // {showtitles == true ? <p id="latest">Latest</p> : null}
          posts.content &&
          posts.content.map((post, index) => {
            if (post.user != null) {
              return (
                <div>
                  <UserPosts
                    user={fromWhere === "profile" ? user : post.user}
                    post={post}
                    security={security}
                    history={history}
                    fromWhere={fromWhere}
                    getBookmarkButton={this.getBookmarkButton}
                    getReportButton={this.getReportButton}
                    key={index}
                  />
                </div>
              );
            } else {
              return (
                <GroupPosts
                  group={fromWhere === "group" ? group : post.group}
                  post={post}
                  security={security}
                  history={history}
                  fromWhere={fromWhere}
                  getBookmarkButton={this.getBookmarkButton}
                  getReportButton={this.getReportButton}
                  key={index}
                />
              );
            }
          })
        );
      }
    }
  }

  getBookmarkButton(post, securityId, currentUserId) {
    if (securityId !== currentUserId) {
      return (
        <MappleToolTip>
          <button
            id="bookmark"
            style={post.didMeSaveThisPost ? { color: "black" } : null}
            onClick={
              post.didMeSaveThisPost
                ? deleteBookmarke(post, false)
                : bookmarkPost(post, false)
            }
          >
            <i
              className={
                post.didMeSaveThisPost ? "fas fa-bookmark" : "far fa-bookmark"
              }
            />
          </button>
          <div>
            {post.didMeSaveThisPost
              ? "You bookmarked this story"
              : "Bookmark this story to read later"}
          </div>
        </MappleToolTip>
      );
    } else {
      return null;
    }
  }

  getReportButton(post, securityId, currentUserId) {
    if (securityId !== currentUserId) {
      return (
        <MappleToolTip>
          <button
            type="button"
            id="bookmark"
            style={post.didMeReportThisPost ? { color: "black" } : null}
            data-toggle="modal"
            data-target={
              post.didMeReportThisPost
                ? `#unreportModal${post.id}`
                : `#reportModal${post.id}`
            }
          >
            <i
              className={
                post.didMeReportThisPost ? "fas fa-flag" : "far fa-flag"
              }
            />
          </button>
          <div>
            {post.didMeReportThisPost
              ? "You reported this story"
              : "Report this story"}
          </div>
        </MappleToolTip>
      );
    } else {
      return null;
    }
  }
}

Post.propTypes = {
  error: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  security: state.security,
  error: state.errors.error
});

export default connect(
  mapStateToProps,
  {}
)(Post);
