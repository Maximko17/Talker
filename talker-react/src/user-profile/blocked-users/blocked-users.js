import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getBlockedUsers } from "../../actions/user-actions";
import "./blocked-users.css";
import { getDefaultBlockButtom } from "../../utils/block-utils";

class BlockedUsers extends Component {
  componentDidMount() {
    this.props.getBlockedUsers();
  }

  getUsers(users) {
    return (
      users &&
      users.map(user => {
        return (
          <div className="follower" key={user.id}>
            <div className="follower-image">
              <img
                src={
                  user.photo
                }
                alt="img"
              />
            </div>
            <div className="follower-info">
              <div
                style={{ cursor: "pointer" }}
                onClick={() =>
                  (window.location.href = `/profile/${user.email}`)
                }
              >
                <p>{user.name}</p>
                <p>{user.description}</p>
              </div>
              {getDefaultBlockButtom(user.email, user.haveIBlocked, "users")}
            </div>
          </div>
        );
      })
    );
  }

  render() {
    const { users } = this.props;
    return (
      <div className="followers">
        <div className="followers-title">Blocked users</div>
        {this.getUsers(users.content)}
      </div>
    );
  }
}

BlockedUsers.propTypes = {
  getBlockedUsers: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  users: state.user.users,
  security: state.security
});
export default connect(
  mapStateToProps,
  { getBlockedUsers }
)(BlockedUsers);
