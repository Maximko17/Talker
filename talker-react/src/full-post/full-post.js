import React, { Component } from "react";
import "./full-post.css";
import { Link } from "react-router-dom";
import MappleToolTip from "reactjs-mappletooltip";
import Responses from "./responses/responses";
import RecommendStories from "./recommend-stories/recommend-stories";
import Tags from "./tags/tags";
import { Popup } from "semantic-ui-react";
import popover from "../popover/follow-popover/popover";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  getPost,
  bookmarkPost,
  deleteBookmarke
} from "../actions/post-actions";
import { getDate, getNumber } from "../utils/date-utils";
import Header from "../main-components/header/header";
import getDefaultFollowButton from "../utils/followers-utils";
import { getPostLikeButton } from "../utils/likes-utils";
import { getBlockDropdown } from "../utils/block-utils";
import { isEmpty, postErrorMessage } from "../utils/exception-utils";

class FullPost extends Component {
  componentDidMount() {
    const { postid } = this.props.match.params;
    this.props.getPost(postid);
  }

  render() {
    const { post, security, error } = this.props;
    const { user } = this.props.post;
    if (!isEmpty(error)) {
      return postErrorMessage(this.props.match.params.postid, error.status);
    }
    if (user == undefined) {
      return null;
    }
    return (
      <div>
        <Header style={"default"} />
        <div className="full-post">
          <div className="full-post-title">{post.title}</div>
          <div className="full-post-subtitle">{post.subtitle}</div>
          <div className="post-user-info mt-4 mb-4">
            <div>
              <img src={user.photo} alt="Img" />
            </div>
            <div>
              <Popup
                content={popover(user, security, "post")}
                trigger={<Link to={"/profile/" + user.email}>{user.name}</Link>}
                flowing
                hoverable
                position="top center"
              />
              <p>
                {" "}
                {getDate(post.postDate) + " • " + post.reading_time + " min"}
              </p>
            </div>
          </div>

          <div className="post-main-photo">
            <img src={post.main_image} alt="main" />
          </div>

          <div
            className="full-post-text"
            dangerouslySetInnerHTML={{ __html: post.text }}
          />

          <Tags tags={post.tags} />

          <div className="after-post-functional">
            <div className="after-post-likes d-flex">
              <div>
                {getPostLikeButton(
                  post.didMeLikeThisPost,
                  post.id,
                  security.user.id,
                  "big-like-button",
                  "big-like-button-active",
                  true
                )}
              </div>
              <span>{getNumber(post.totalLikes)} likes</span>
            </div>
            <div className="after-post-additionals d-flex">
              <MappleToolTip>
                <button>
                  <i className="far fa-comment" />{" "}
                  <span>{getNumber(post.totalResponses)}</span>
                </button>
                <div>Write a response</div>
              </MappleToolTip>
              {security.user.id !== user.id ? (
                <MappleToolTip>
                  <button
                    style={post.didMeSaveThisPost ? { color: "black" } : null}
                    onClick={
                      post.didMeSaveThisPost
                        ? deleteBookmarke(post, true)
                        : bookmarkPost(post, true)
                    }
                  >
                    <i
                      className={
                        post.didMeSaveThisPost
                          ? "fas fa-bookmark"
                          : "far fa-bookmark"
                      }
                    />
                  </button>
                  <div>
                    {post.didMeSaveThisPost
                      ? "You bookmarked this story"
                      : "Bookmark this story to read later"}
                  </div>
                </MappleToolTip>
              ) : null}
              {getBlockDropdown(user, security.user, "post", "", post)}
            </div>
          </div>

          <div className="after-post-profile-info">
            <div className="profile-info">
              <img src={user.photo} alt="Img" />
              <div className="ml-3">
                <p>WRITTEN BY</p>
                <Link to={"/profile/" + user.email}>{user.name}</Link>
                <p>{user.description}</p>
              </div>
            </div>
            <div>{getDefaultFollowButton(user, security, "post")}</div>
          </div>
        </div>

        <div style={{ background: "ghostwhite" }}>
          <RecommendStories postId={post.id} />
          <Responses postId={post.id} />
        </div>
      </div>
    );
  }
}

FullPost.propTypes = {
  getPost: PropTypes.func.isRequired,
  error: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  post: state.post.post,
  security: state.security,
  user: state.user.user,
  error: state.errors.error
});
export default connect(
  mapStateToProps,
  { getPost }
)(FullPost);
