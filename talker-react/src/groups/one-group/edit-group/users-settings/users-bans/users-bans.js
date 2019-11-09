import React, { Component } from "react";
import "./users-bans.css";
import Search from "../../../posts-search/search";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  getBannedUsers,
  banUser,
  unbanUser
} from "../../../../../actions/group-actions";
import { Link } from "react-router-dom";

class UsersBansSettings extends Component {
  constructor(props) {
    super(props);

    this.onScroll = this.onScroll.bind(this);
    this.searchBannedUsers = this.searchBannedUsers.bind(this);
  }

  componentDidMount() {
    this.props.getBannedUsers(this.props.groupUri);
    window.addEventListener("scroll", this.onScroll, false);
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this.onScroll, false);
  }

  onScroll() {
    const { currentSize, totalElements } = this.props.roles;

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

  searchBannedUsers(userName) {
    this.props.getBannedUsers(this.props.groupUri, userName);
  }

  render() {
    const { users, security, groupUri } = this.props;
    const totalElements =
      users.totalElements === 0 ? null : users.totalElements;
    if (users.content == undefined) return null;
    return (
      <div className="group-section">
        <div className="section-header d-flex justify-content-between align-items-baseline">
          <div className="tab">
            Banned users <span>{totalElements}</span>
          </div>
        </div>
        <div className="search-members">
          <Search
            initialState={true}
            placeholder={"Group team search"}
            searchAction={this.searchBannedUsers}
          />
        </div>
        {users.content.length === 0 ? (
          <div className="empty-message">Banned user not found</div>
        ) : (
          users.content.map((user, index) => {
            return (
              <div className="member" key={index}>
                <div className="info">
                  <Link to={`/profile/${user.email}`}>
                    <img src={user.photo} alt="usr_img" />
                  </Link>
                  <div className="info">
                    <Link to={`/profile/${user.email}`}>{user.name}</Link>
                  </div>
                </div>
                <Dropdown
                  groupUri={groupUri}
                  user={user}
                  loggedUser={security.user}
                  banUser={this.props.banUser}
                  unbanUser={this.props.unbanUser}
                />
              </div>
            );
          })
        )}
      </div>
    );
  }
}

UsersBansSettings.propTypes = {
  getBannedUsers: PropTypes.func.isRequired,
  unbanUser: PropTypes.func.isRequired,
  banUser: PropTypes.func.isRequired,
  error: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  users: state.user.users,
  security: state.security,
  error: state.errors.error
});
export default connect(
  mapStateToProps,
  { getBannedUsers, unbanUser, banUser }
)(UsersBansSettings);

class Dropdown extends Component {
  state = {
    excludeFromGroup: false
  };

  toggleFromGroupConfirmWindow = () => {
    this.setState({
      excludeFromGroup: !this.state.excludeFromGroup
    });
  };

  render() {
    const { user, loggedUser, banUser, unbanUser, groupUri } = this.props;
    if (user == undefined) return null;
    const { excludeFromGroup } = this.state;
    if (loggedUser.id !== user.id) {
      if (user.amIBannedInAGroup) {
        return (
          <button
            className="block-red-button-active"
            onClick={() => unbanUser(groupUri, user.email)}
          >
            Unblock
          </button>
        );
      } else {
        return (
          <div className="dropdown">
            <button className="dropbtn">
              <i className="fas fa-user-cog"></i>
              <i className="fas fa-caret-down"></i>
            </button>
            <div className="dropdown-content">
              <div className="section">
                <a href="#" onClick={this.toggleFromGroupConfirmWindow}>
                  <i className="fas fa-ban"></i>
                  Ban user
                </a>
                {excludeFromGroup ? (
                  <div className="confirm-block">
                    <p>Are you sure want to ban this user?</p>
                    <button
                      type="button"
                      className="confirm"
                      onClick={() => banUser(groupUri, user.email)}
                    >
                      Ban
                    </button>
                    <button
                      type="button"
                      className="cancel"
                      onClick={this.toggleFromGroupConfirmWindow}
                    >
                      Cancel
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        );
      }
    }
    return null;
  }
}
