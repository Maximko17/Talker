import React, { Component } from "react";
import "./user.css";
import getDefaultFollowButton from "../../utils/followers-utils";

class Users extends Component {
  constructor(props) {
    super(props);

    this.onScroll = this.onScroll.bind(this);
  }

  componentDidMount() {
    window.addEventListener("scroll", this.onScroll, false);
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this.onScroll, false);
  }
  onScroll() {
    const { currentSize, totalElements } = this.props.users;

    var scrollHeight = document.documentElement.scrollHeight;
    var clientHeight = document.documentElement.clientHeight;
    var scrollTop = document.documentElement.scrollTop;
    if (
      scrollTop >= scrollHeight - clientHeight - 5 &&
      currentSize < totalElements
    ) {
      this.props.scrollUsersAction(currentSize + 5);
    }
  }
  render() {
    const { users, security } = this.props;
    return (
      <div>
        {users.content &&
          users.content.map(({ id, name, description, photo, ...user }) => {
            return (
              <div className="search-user" key={id}>
                <img src={photo} />
                <div className="content">
                  <div>
                    <p className="name">{name}</p>
                    <p className="descr">{description}</p>
                  </div>
                  <div>{getDefaultFollowButton(user, security, "search")}</div>
                </div>
              </div>
            );
          })}
      </div>
    );
  }
}
export default Users;
