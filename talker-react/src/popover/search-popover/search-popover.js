import React, { Component } from "react";
import "./search-popover.css";

class SearchPopover extends Component {
  getUsers() {
    const { users, redirectTo } = this.props;
    if (users.content == undefined || users.content.length === 0) {
      return null;
    }
    return (
      <div>
        <div className="title">
          <span className="section">PEOPLE</span>
          <span
            className="more"
            onClick={() => redirectTo("MORE_USERS", "", "people")}
          >
            MORE
          </span>
        </div>
        <div className="found-users">
          {users.content.map(({ id, photo, name, email }) => {
            return (
              <div
                className="item"
                key={id}
                onClick={() => redirectTo("USER", email)}
              >
                <img src={photo} alt="usr-ph" />
                <span className="name">{name}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  getPosts() {
    const { posts, redirectTo } = this.props;
    if (posts.content == undefined || posts.content.length === 0) {
      return null;
    }

    return (
      <div>
        <div className="title">
          <span className="section">PUBLICATIONS</span>
          <span
            className="more"
            onClick={() => redirectTo("MORE_POSTS", "", "posts")}
          >
            MORE
          </span>
        </div>
        <div className="found-publications">
          {posts.content.map(({ id, main_image, title }) => {
            return (
              <div
                className="item"
                key={id}
                onClick={() => redirectTo("POST", id)}
              >
                <img src={main_image} alt="pbl-ph" />
                <span className="name">{title}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  getTags() {
    const { tags, redirectTo } = this.props;
    if (tags.content == undefined || tags.content.length === 0) {
      return null;
    }

    return (
      <div>
        <div className="title">
          <span className="section">TAGS</span>
          <span
            className="more"
            onClick={() => redirectTo("MORE_TAGS", "", "tags")}
          >
            MORE
          </span>
        </div>
        <div className="found-tags">
          {tags.content.map(({ id, tagName }) => {
            return (
              <div
                className="item"
                key={id}
                onClick={() => redirectTo("TAG", tagName)}
              >
                <i className="fas fa-hashtag"></i>
                <span className="name">{tagName}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  render() {
    const { redirectTo, input } = this.props;
    return (
      <div className="search-popover">
        <div
          className="search-all"
          onClick={() => redirectTo("ALL", "", "posts")}
        >
          <i className="fas fa-search" />
          <span>{`Search for '${input}'`}</span>
        </div>
        {this.getUsers()}
        {this.getPosts()}
        {this.getTags()}
      </div>
    );
  }
}
export default SearchPopover;
