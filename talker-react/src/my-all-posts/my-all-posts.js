import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import "./my-all-posts.css";
import Header from "../main-components/header/header";
import { Link } from "react-router-dom";
import { Popup } from "semantic-ui-react";
import {
  getAllMyPosts,
  deletePost,
  getPostsCount
} from "../actions/post-actions";
import { messagesTime } from "../utils/date-utils";
import { Helmet } from "react-helmet";
import axios from "axios";

class MyAllPosts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: "drafts",
      totalDraftsCount: 0,
      totalPublishedCount: 0
    };
    this.changeTab = this.changeTab.bind(this);
  }

  componentDidMount() {
    this.props.getAllMyPosts(true, 10);
    this.getPostsCount(true);
    this.getPostsCount(false);
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.tab !== this.state.tab) {
      if (this.state.tab === "drafts") {
        return this.props.getAllMyPosts(true, 10);
      } else {
        return this.props.getAllMyPosts(false, 10);
      }
    }
  }

  getPostsCount(isDraft) {
    axios.get(`/posts/getCount?isDraft=${isDraft}`).then(response => {
      if (isDraft) {
        this.setState({
          totalDraftsCount: response.data,
          totalPublishedCount: this.state.totalPublishedCount
        });
      } else {
        this.setState({
          totalDraftsCount: this.state.totalDraftsCount,
          totalPublishedCount: response.data
        });
      }
    });
  }
  changeTab(tab_name) {
    this.setState({
      tab: tab_name
    });
  }

  getPosts(posts) {
    if (posts.content.length === 0) {
      return (
        <div className="empty-message">
          {this.state.tab === "drafts"
            ? "You have no drafts"
            : "You have no published stories"}
        </div>
      );
    }
    return posts.content.map((post, index) => {
      return (
        <div className="my-one-post" key={index}>
          <Link
            to={post.isDraft ? `/p/${post.id}/edit` : `/post/${post.id}`}
            className="title"
          >
            {post.title}
          </Link>
          <Link
            to={post.isDraft ? `/p/${post.id}/edit` : `/post/${post.id}`}
            className="subtitle"
          >
            {post.subtitle}
          </Link>
          <div className="post-info">
            {post.isDraft
              ? `Last edited - ${messagesTime(post.postDate)} /`
              : `Published on - ${messagesTime(post.postDate)} /`}
            <Popup
              content={
                <div className="my-post-action">
                  <Link to={`/p/${post.id}/edit`}>Edit draft</Link>
                  <Link to={"#"} onClick={() => this.props.deletePost(post.id)}>
                    Delete draft
                  </Link>
                </div>
              }
              position="bottom center"
              on="click"
              pinned="true"
              trigger={
                <button type="button">
                  <i className="fas fa-chevron-down"></i>
                </button>
              }
            />
          </div>
        </div>
      );
    });
  }
  render() {
    const { tab, totalDraftsCount, totalPublishedCount } = this.state;
    const { posts } = this.props;
    return (
      <div>
        <Helmet>
          <meta charSet="utf-8" />
          <title>
            {this.state.tab === "drafts"
              ? "My posts / drafts"
              : "My posts / published"}
          </title>
        </Helmet>
        <Header style={"default"} />
        <div className="all-posts-layout">
          <div className="all-posts-title">
            <span>Your stories</span>
            <div>
              <Link to={"new-post"}>Write a post</Link>
            </div>
          </div>
          <div className="profile-tabs">
            <button
              className={tab === "drafts" ? "profile-tabs-active" : null}
              onClick={() => this.changeTab("drafts")}
            >
              Drafts({totalDraftsCount})
            </button>
            <button
              className={tab === "published" ? "profile-tabs-active" : null}
              onClick={() => this.changeTab("published")}
            >
              Published(
              {totalPublishedCount})
            </button>
          </div>
          <div className="my-all-posts">{this.getPosts(posts)}</div>
        </div>
      </div>
    );
  }
}

MyAllPosts.propTypes = {
  getAllMyPosts: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  posts: state.post.posts
});
export default connect(
  mapStateToProps,
  { getAllMyPosts, deletePost }
)(MyAllPosts);
