import React, { Component } from "react";
import "./post.css";
import MappleToolTip from "reactjs-mappletooltip";
import { Link } from "react-router-dom";
import popover from "../../popover/follow-popover/popover";
import { Popup } from "semantic-ui-react";
import { getDate } from "../../utils/date-utils";
import { bookmarkPost, deleteBookmarke } from "../../actions/post-actions";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { isEmpty, blockMessage1 } from "../../utils/exception-utils";
import ReportPost from "../../full-post/report-post/report-post";
import UnreportPost from "../../full-post/report-post/unreport-post/unreport-post";

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
    const { posts, showtitles } = this.props;
    const { error } = this.props;

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
          <div>
            {showtitles == true ? <p id="latest">Latest</p> : null}
            {this.getUserPosts(posts)}
          </div>
        );
      }
    }
  }

  getUserPosts(posts) {
    const { user, security, history, fromWhere } = this.props;
    let current_user;
    return (
      posts.content &&
      posts.content.map((post, index) => {
        if (fromWhere !== "profile") {
          current_user = post.user;
        } else {
          current_user = user;
        }
        return (
          <div className="post" key={index}>
            <div className="post-user-info">
              <div>
                <img src={current_user.photo} alt="Img" />
              </div>
              <div>
                <Popup
                  content={popover(current_user, security, fromWhere)}
                  trigger={
                    <Link to={`/profile/${current_user.email}`}>
                      {current_user.name}
                    </Link>
                  }
                  flowing
                  hoverable
                  position="top center"
                />
                <p>
                  {getDate(post.postDate) + " • " + post.reading_time + " min"}
                </p>
              </div>
            </div>
            <div
              id="clickable-content"
              onClick={() => history.push(`/post/${post.id}`)}
            >
              <div className="post-main-photo">
                <img src={post.main_image} alt="main" />
              </div>
              <div className="post-title">
                <p>{post.title}</p>
              </div>
              <div className="post-subtitle">
                <p>{post.subtitle}</p>
              </div>
            </div>
            <div className="post-likes">
              <div className={post.didMeLikeThisPost ? "likeButton" : null}>
                <i
                  className={
                    post.didMeLikeThisPost ? "fas fa-heart" : "far fa-heart"
                  }
                />{" "}
                {post.totalLikes}
              </div>
              <div className="d-flex">
                <p>{post.totalResponses} responses</p>
                {this.getBookmarkButton(
                  post,
                  security.user.id,
                  current_user.id
                )}
                {this.getReportButton(post, security.user.id, current_user.id)}
              </div>
              {post.didMeReportThisPost ? (
                <UnreportPost
                  element={post}
                  user={current_user}
                  isOneElement={false}
                  fromWhere={fromWhere}
                  isThisResponse={false}
                />
              ) : (
                <ReportPost
                  element={post}
                  user={current_user}
                  isOneElement={false}
                  fromWhere={fromWhere}
                  isThisResponse={false}
                />
              )}
            </div>
          </div>
        );
      })
    );
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
