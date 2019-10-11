import React, { Component } from "react";
import "./posts.css";
import Post from "../../user-profile/posts/post";
import getDefaultFollowButton from "../../utils/followers-utils";
import { Link } from "react-router-dom";

class SearchPosts extends Component {
  render() {
    const {
      history,
      posts,
      tags,
      users,
      scrollPostsAction,
      security
    } = this.props;
    return (
      <div className="seacrh-posts">
        <div className="posts">
          <div className="section">POSTS</div>
          <Post
            history={history}
            posts={posts}
            showtitles={false}
            fromWhere={"posts"}
            action={scrollPostsAction}
          />
        </div>
        <div className="others">
          {tags.content && tags.content.length !== 0 ? (
            <div className="tags">
              <div className="section">TAGS</div>
              <div className="search-tags">
                {tags.content.map(({ id, tagName }) => {
                  return (
                    <Link to={`/tag/${tagName}`} key={id}>
                      {tagName}
                    </Link>
                  );
                })}
              </div>
            </div>
          ) : null}
          {users.content && users.content.length !== 0 ? (
            <div className="people">
              <div className="section">PEOPLE</div>
              {users.content.map(user => {
                return (
                  <div className="search-user" key={user.id}>
                    <img src={user.photo} />
                    <div className="content">
                      <div>
                        <p className="name">{user.name}</p>
                        <p className="descr">{user.description}</p>
                      </div>
                      <div>
                        {getDefaultFollowButton(user, security, "users")}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}
export default SearchPosts;
