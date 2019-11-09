import React, { Component } from "react";
import "./one-group.css";
import Header from "../../main-components/header/header";
import { getGroup, getGroupUsers } from "../../actions/group-actions";
import { getAllGroupPosts } from "../../actions/post-actions";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getGroupFollowButton } from "../../utils/followers-utils";
import { Link } from "react-router-dom";
import Banner from "./banner/banner";
import Post from "../../user-profile/posts/post";
import Search from "./posts-search/search";

class OneGroup extends Component {
  componentDidMount() {
    const { groupName } = this.props.match.params;
    this.props.getGroup(groupName);
    this.props.getAllGroupPosts(groupName, 1);
    this.props.getGroupUsers(groupName, 6);
  }

  getScrollAction(size) {
    this.props.getAllGroupPosts(this.props.match.params.groupName, size);
  }

  render() {
    const { group, posts, security, history, users } = this.props;
    return (
      <div>
        <Header style={"default"} />
        <div className="group">
          <Banner banner={group.banner} />
          <div className="group-header">
            <div className="group-header-content">
              <div className="group-photo">
                <img src={group.image} alt="group_img" id="group_img" />
              </div>
              <div className="info">
                <p className="name">{group.name}</p>
                <p className="topic">{group.topic}</p>
                <p className="followers-count">
                  {group.totalFollowers + " followers"}
                </p>
              </div>
            </div>
            {getGroupFollowButton(group, security, "group")}
          </div>

          <div className="group-content">
            <div className="group-posts">
              <div className="group-section">
                <div className="section-header">
                  <div className="tab">Description</div>
                </div>
                <div className="section-content d-flex align-items-start">
                  <i className="fas fa-info"></i>
                  <span>{group.description}</span>
                </div>
              </div>
              <Search
                initialState={false}
                placeholder={"What do you want to find?"}
              />
              <Post
                group={group}
                history={history}
                posts={posts}
                fromWhere={"group"}
                showtitles={false}
                action={this.getScrollAction.bind(this)}
              />
            </div>
            <div className="group-actions">
              <div className="action-window">
                <Link
                  to={`/group/${group.uri}/edit?tab=general`}
                  className="action-row"
                >
                  <i className="fas fa-cog"></i>
                  <span>Settings</span>
                </Link>
                <div className="separator"></div>
                <Link to={`/group/${group.uri}/edit`} className="action-row">
                  <i className="far fa-comment"></i>
                  <span>Group chat</span>
                </Link>

                <Link to={`/group/${group.uri}/edit`} className="action-row">
                  <i className="far fa-bell"></i>
                  <span>Turn on notifications</span>
                </Link>
              </div>

              <div className="action-window">
                <Link to={`/group/${group.uri}/friends`} className="action-row">
                  <div className="user-title">
                    Followers <span> {users.totalElements}</span>
                  </div>
                </Link>
                <div className="group-users">
                  {users.content &&
                    users.content.map((user, index) => {
                      return (
                        <Link to={`/profile/${user.email}`} key={index}>
                          <img src={user.photo} alt="usr_img" />
                        </Link>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

OneGroup.propTypes = {
  getGroup: PropTypes.func.isRequired,
  getGroupUsers: PropTypes.func.isRequired,
  getAllGroupPosts: PropTypes.func.isRequired,
  error: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  group: state.group.group,
  users: state.user.users,
  posts: state.post.posts,
  security: state.security,
  error: state.errors.error
});
export default connect(
  mapStateToProps,
  { getGroup, getAllGroupPosts, getGroupUsers }
)(OneGroup);
