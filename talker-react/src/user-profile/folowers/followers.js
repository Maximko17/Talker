import React, { Component } from "react";
import "./followers.css";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getFollowers, getFollowings } from "../../actions/user-actions";
import getDefaultFollowButton from "../../utils/followers-utils";
import { getMessageButton } from "../../utils/chat-utils";
import { isEmpty, blockMessage1 } from "../../utils/exception-utils";
import TextareaAutosize from "react-autosize-textarea/lib";

class Followers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: ""
    };

    this.onQueryChange = this.onQueryChange.bind(this);
  }

  onQueryChange(e) {
    this.setState({ query: e.target.value });
  }
  componentDidMount() {
    const { type, user_email } = this.props;
    if (type == "followers") {
      this.props.getFollowers(user_email);
    } else {
      this.props.getFollowings(user_email);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.type != this.props.type) {
      const { type, user_email } = this.props;
      if (type == "followers") {
        this.props.getFollowers(user_email);
      } else {
        this.props.getFollowings(user_email);
      }
    }
  }

  getUsers(users) {
    const { security } = this.props;
    return (
      users &&
      users.map(user => {
        return (
          <div className="follower" key={user.id}>
            <div
              className="follower-image"
              onClick={() => (window.location.href = `/profile/${user.email}`)}
            >
              <img src={user.photo} alt="img" />
            </div>
            <div className="follower-info">
              <div
                onClick={() =>
                  (window.location.href = `/profile/${user.email}`)
                }
              >
                <p>{user.name}</p>
                <p>{user.description}</p>
              </div>
              {getMessageButton(user, security, "default-message-button")}
              {getDefaultFollowButton(user, security, "users")}
            </div>
          </div>
        );
      })
    );
  }

  render() {
    const { type, users, user_name } = this.props;
    const { error } = this.props;
    const { query } = this.state;

    if (!isEmpty(error)) {
      return blockMessage1();
    } else {
      return (
        <div className="followers">
          <div className="followers-title">
            {type == "followers"
              ? `${user_name} is followed by `
              : `${user_name} follows`}
          </div>
          <div>
            <TextareaAutosize
              type="text"
              value={query}
              placeholder="Search"
              onChange={this.onQueryChange}
            />
          </div>
          {this.getUsers(users.content)}
        </div>
      );
    }
  }
}

Followers.propTypes = {
  getFollowings: PropTypes.func.isRequired,
  getFollowers: PropTypes.func.isRequired,
  error: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  users: state.user.users,
  security: state.security,
  error: state.errors.error
});

export default connect(
  mapStateToProps,
  {
    getFollowers,
    getFollowings
  }
)(Followers);
