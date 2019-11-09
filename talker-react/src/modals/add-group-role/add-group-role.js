import React, { Component } from "react";
import "./add-group-role.css";
import Search from "../../groups/one-group/posts-search/search";
import axios from "axios";
import { Link } from "react-router-dom";

class AddGroupRole extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: {
        content: [],
        currentSize: 0,
        totalElements: 0
      }
    };

    this.searchAction = this.searchAction.bind(this);
    this.changeRole = this.changeRole.bind(this);
  }

  componentDidMount() {
    axios
      .get(`/group/sds/users?search=`)
      .then(response => this.setState({ users: response.data }));
  }

  searchAction(userName) {
    axios
      .get(`/group/sds/users?search=${userName}`)
      .then(response => this.setState({ users: response.data }));
  }

  changeRole(e, userId) {
    console.log(userId);
    this.setState({
      users: {
        ...this.state.users,
        content: this.state.users.content.map(user =>
          user.id == userId
            ? {
                ...user,
                role: e.target.value
              }
            : user
        )
      }
    });
  }

  render() {
    const { users } = this.state;
    const { security, groupUri, saveRole, deleteRole } = this.props;
    return (
      <div className="custom-modal">
        <div className="add-group-role-model">
          <div className="header">
            <div>Add Subscriber to Team</div>
            <button type="button" onClick={this.props.toggleModal}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          <Search
            initialState={true}
            placeholder={"Subscribers Search"}
            searchAction={this.searchAction}
          />
          <div className="body">
            {users.content.length === 0 ? (
              <div className="empty-message">
                This person is not found among the team of the group.
              </div>
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
                        <p>{user.role}</p>
                      </div>
                    </div>
                    <Dropdown
                      groupUri={groupUri}
                      user={user}
                      role={user.role == undefined ? "" : user.role}
                      loggedUser={security.user}
                      changeRole={this.changeRole}
                      saveRole={saveRole}
                      key={index}
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default AddGroupRole;

class Dropdown extends Component {
  render() {
    const {
      user,
      role,
      loggedUser,
      changeRole,
      saveRole,
      groupUri
    } = this.props;
    if (user == undefined) return null;
    if (loggedUser.id !== user.id) {
      return (
        <div className="dropdown">
          <button className="dropbtn">
            <i className="fas fa-user-cog"></i>
            <i className="fas fa-caret-down"></i>
          </button>
          <div className="dropdown-content">
            <p className="title">Roles info</p>
            <div className="separator"></div>
            <div className="section">
              <div>
                <input
                  type="radio"
                  name="role"
                  value="CREATOR"
                  onChange={e => changeRole(e, user.id)}
                  checked={role === "CREATOR"}
                  id="creator"
                  className="radio"
                />
                <label htmlFor="creator">CREATOR</label>
              </div>
              <div>
                <input
                  type="radio"
                  name="role"
                  value="ADMIN"
                  onChange={e => changeRole(e, user.id)}
                  checked={role === "ADMIN"}
                  id="admin"
                  className="radio"
                />
                <label htmlFor="admin">ADMIN</label>
              </div>
              <button
                type="button"
                className="save-btn"
                onClick={() => saveRole(groupUri, user, role)}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }
}
