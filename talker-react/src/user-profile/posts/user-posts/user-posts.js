import React, { Component } from "react";
import popover from "../../../popover/follow-popover/popover";
import { getDate } from "../../../utils/date-utils";
import { Link } from "react-router-dom";
import ReportPost from "../../../full-post/report-post/report-post";
import UnreportPost from "../../../full-post/report-post/unreport-post/unreport-post";
import { Popup } from "semantic-ui-react";

export default class UserPosts extends Component {
  render() {
    const {
      user,
      post,
      security,
      history,
      fromWhere,
      getBookmarkButton,
      getReportButton
    } = this.props;
    return (
      <div className="post">
        <div className="post-user-info">
          <div>
            <img src={user.photo} alt="Img" />
          </div>
          <div>
            <Popup
              content={popover(user, security, fromWhere)}
              trigger={<Link to={`/profile/${user.email}`}>{user.name}</Link>}
              flowing
              hoverable
              position="top center"
            />
            <p>{getDate(post.postDate) + " • " + post.reading_time + " min"}</p>
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
            {getBookmarkButton(post, security.user.id, user.id)}
            {getReportButton(post, security.user.id, user.id)}
          </div>
          {post.didMeReportThisPost ? (
            <UnreportPost
              element={post}
              user={user}
              isOneElement={false}
              fromWhere={fromWhere}
              isThisResponse={false}
            />
          ) : (
            <ReportPost
              element={post}
              user={user}
              isOneElement={false}
              fromWhere={fromWhere}
              isThisResponse={false}
            />
          )}
        </div>
      </div>
    );
  }
}
