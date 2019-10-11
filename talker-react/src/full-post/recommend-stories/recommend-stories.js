import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./recommend-stories.css";
import { Popup } from "semantic-ui-react";
import popover from "../../popover/follow-popover/popover";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  getThreeRandomPosts,
  bookmarkPost,
  deleteBookmarke
} from "../../actions/post-actions";
import { getDate, getNumber } from "../../utils/date-utils";
import { likePost, unlikePost } from "../../actions/like-actions";
import { getPostLikeButton } from "../../utils/likes-utils";

class RecommendStories extends Component {
  componentDidMount() {
    this.props.getThreeRandomPosts(this.props.postId);
  }

  onPostClick(postId) {
    return (window.location.href = `/post/${postId}`);
  }
  getPosts(posts) {
    const { security } = this.props;
    return (
      posts &&
      posts.map(post => {
        return (
          <div className="after-post-recomendation" key={posts.indexOf(post)}>
            <div
              className="after-post-recomendation-image"
              onClick={() => this.onPostClick(post.id)}
            >
              <img src={post.main_image} alt="Img" />
            </div>
            <div style={{ margin: "5px 15px" }}>
              <div className="after-post-recomendation-section">
                <p>Related rates</p>
              </div>
              <div
                className="after-post-recomendation-title"
                onClick={() => this.onPostClick(post.id)}
              >
                <p>{post.title}</p>
              </div>
              <div className="after-post-recomendation-profile">
                <div>
                  <img src={post.user.photo} alt="Img" />
                </div>
                <div>
                  <Popup
                    content={popover(post.user, security, "post")}
                    trigger={
                      <Link to={`/profile/${post.user.email}`}>
                        {post.user.name}
                      </Link>
                    }
                    flowing
                    hoverable
                    position="top center"
                  />
                  <p>
                    {getDate(post.postDate) + " • " + post.reading_time} min
                  </p>
                </div>
                <div>
                  {getPostLikeButton(
                    post.didMeLikeThisPost,
                    post.id,
                    security.user.id,
                    "unlikeButton",
                    "likeButton",
                    false
                  )}
                  <span>{getNumber(post.totalLikes)}</span>
                </div>
                <div>|</div>
                <div>
                  <button
                    data-toggle="tooltip"
                    data-placement="bottom"
                    title={
                      post.didMeSaveThisPost
                        ? "You bookmarked this story"
                        : "Bookmark this story to read later"
                    }
                    style={post.didMeSaveThisPost ? { color: "black" } : null}
                    onClick={
                      post.didMeSaveThisPost
                        ? deleteBookmarke(post, false)
                        : bookmarkPost(post, false)
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
                </div>
              </div>
            </div>
          </div>
        );
      })
    );
  }

  render() {
    const { posts } = this.props;
    return (
      <div>
        <div className="after-post-recomendations-title">More from Talker</div>
        <div className="after-post-recomendations">
          {this.getPosts(posts.content)}
        </div>
      </div>
    );
  }
}

RecommendStories.propTypes = {
  getThreeRandomPosts: PropTypes.func.isRequired,
  likePost: PropTypes.func.isRequired,
  unlikePost: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  posts: state.post.posts,
  security: state.security,
  user: state.user.user
});

export default connect(
  mapStateToProps,
  {
    getThreeRandomPosts,
    likePost,
    unlikePost
  }
)(RecommendStories);
