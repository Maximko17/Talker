import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Popup } from "semantic-ui-react";
import popover from "../popover/follow-popover/popover";
import { getBookmarkedPosts } from "../actions/post-actions";
import Header from "../main-components/header/header";
import "./bookmark.css";
import { getDate } from "../utils/date-utils";
import { deleteBookmarkedPost } from "../actions/post-actions";

class Bookmarks extends Component {
  componentDidMount() {
    this.props.getBookmarkedPosts();
  }

  onClick(postId) {
    this.props.history.push(`/post/${postId}`);
  }

  getBookmarks(bookmarks) {
    const { security } = this.props;
    return (
      bookmarks &&
      bookmarks.map((bookmark, index) => {
        return (
          <div className="bookmark" key={index}>
            <div className="bookmark-content">
              <div onClick={() => this.onClick(bookmark.id)}>
                <div className="bookmark-title">{bookmark.title}</div>
                <div className="bookmark-subtitle">{bookmark.subtitle}</div>
              </div>
              <div className="bookmark-info">
                <Popup
                  content={popover(bookmark.user, security, "posts")}
                  trigger={
                    <Link to={`/profile/${bookmark.user.email}`}>
                      {bookmark.user.name}
                    </Link>
                  }
                  flowing
                  hoverable
                  position="top center"
                />
                <p> • </p>
                <p>{getDate(bookmark.postDate)}</p>
                <p> • </p>
                <p>{bookmark.reading_time + " min"}</p>
              </div>
              <button
                className="remove-bookmark"
                onClick={deleteBookmarkedPost(bookmark)}
              >
                Remove
              </button>
            </div>
            <div className="bookmark-img">
              <img src={bookmark.main_image} alt="img" />
            </div>
          </div>
        );
      })
    );
  }

  render() {
    const { content } = this.props.posts;
    return (
      <div>
        <Header style={"default"} />
        <div className="bookmarks">
          <p className="bookmarks-title">Bookmarks</p>
          {this.getBookmarks(content)}
        </div>
      </div>
    );
  }
}

Bookmarks.propTypes = {
  getBookmarkedPosts: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  posts: state.post.posts,
  security: state.security
});
export default connect(
  mapStateToProps,
  { getBookmarkedPosts }
)(Bookmarks);
