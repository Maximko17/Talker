import React, { Component } from "react";
import "./user-roles.css";
import Search from "../../../posts-search/search";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  getGroupRoles,
  saveGroupRoles,
  deleteGroupRole,
  banUser
} from "../../../../../actions/group-actions";
import AddGroupRole from "../../../../../modals/add-group-role/add-group-role";
import { CHANGE_USER_ROLE_IN_GROUP } from "../../../../../actions/types";
import store from "../../../../../store";
import { Link } from "react-router-dom";

class UsersRolesSettings extends Component {
  constructor(props) {
    super(props);

    this.onScroll = this.onScroll.bind(this);
    this.searchRoles = this.searchRoles.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.changeRoles = this.changeRoles.bind(this);
  }

  componentDidMount() {
    this.props.getGroupRoles(this.props.groupUri);
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

  searchRoles(userName) {
    return this.props.getGroupRoles(this.props.groupUri, userName);
  }

  changeRoles(e, userId) {
    store.dispatch({
      type: CHANGE_USER_ROLE_IN_GROUP,
      payload: { role: e.target.value, id: userId }
    });
  }

  toggleModal() {
    var modal = document.querySelector(".custom-modal");
    modal.classList.toggle("show-custom-modal");
  }

  render() {
    const { roles, security, groupUri } = this.props;
    const totalElements =
      roles.totalElements === 0 ? null : roles.totalElements;
    if (roles.content == undefined) return null;
    return (
      <div className="group-section">
        <div className="section-header d-flex justify-content-between align-items-baseline">
          <div className="tab">
            Members information <span>{totalElements}</span>
          </div>
          <button
            type="button"
            className="add-member"
            onClick={this.toggleModal}
          >
            Add member
          </button>
        </div>
        <div className="search-members">
          <Search
            initialState={true}
            placeholder={"Group team search"}
            searchAction={this.searchRoles}
          />
          <AddGroupRole
            toggleModal={this.toggleModal}
            security={security}
            groupUri={groupUri}
            saveRole={this.props.saveGroupRoles}
            deleteRole={this.props.deleteGroupRole}
          />
        </div>
        {roles.content.length === 0 ? (
          <div className="empty-message">
            This person is not found among the team of the group.
          </div>
        ) : (
          roles.content.map((role, index) => {
            return (
              <Role
                groupUri={groupUri}
                usr_role={role}
                loggedUser={security.user}
                changeRoles={this.changeRoles}
                saveRole={this.props.saveGroupRoles}
                deleteRole={this.props.deleteGroupRole}
                banUser={this.props.banUser}
                key={index}
              />
            );
          })
        )}
      </div>
    );
  }
}
UsersRolesSettings.propTypes = {
  getGroupRoles: PropTypes.func.isRequired,
  deleteGroupRole: PropTypes.func.isRequired,
  banUser: PropTypes.func.isRequired,
  saveGroupRoles: PropTypes.func.isRequired,
  error: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  roles: state.user.users,
  security: state.security,
  error: state.errors.error
});
export default connect(
  mapStateToProps,
  { getGroupRoles, saveGroupRoles, deleteGroupRole, banUser }
)(UsersRolesSettings);

class Role extends Component {
  state = {
    excludeFromTeam: false,
    excludeFromGroup: false
  };

  toggleFromTeamConfirmWindow = () => {
    this.setState({
      excludeFromTeam: !this.state.excludeFromTeam,
      excludeFromGroup: false
    });
  };
  toggleFromGroupConfirmWindow = () => {
    this.setState({
      excludeFromGroup: !this.state.excludeFromGroup,
      excludeFromTeam: false
    });
  };

  render() {
    const {
      groupUri,
      loggedUser,
      changeRoles,
      saveRole,
      deleteRole,
      banUser
    } = this.props;
    const { user, role } = this.props.usr_role;
    const { excludeFromGroup, excludeFromTeam } = this.state;
    if (user == undefined) return null;

    const excludeFromTeamBlock = (
      <div className="confirm-block">
        <p>Are you sure want to exclude this user from the team?</p>
        <button
          type="button"
          className="confirm"
          onClick={() => deleteRole(groupUri, user.email)}
        >
          Exclude
        </button>
        <button
          type="button"
          className="cancel"
          onClick={this.toggleFromTeamConfirmWindow}
        >
          Cancel
        </button>
      </div>
    );

    const excludeFromGroupBlock = (
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
    );

    return (
      <div className="member">
        <div className="info">
          <Link to={`/profile/${user.email}`}>
            <img src={user.photo} alt="usr_img" />
          </Link>
          <div className="info">
            <Link to={`/profile/${user.email}`}>{user.name}</Link>
            <p>{role}</p>
          </div>
        </div>
        <div>
          {loggedUser.id !== user.id ? (
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
                      onChange={e => changeRoles(e, user.id)}
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
                      onChange={e => changeRoles(e, user.id)}
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
                <p className="title">Action</p>
                <div className="separator"></div>
                <div className="section">
                  <a href="#" onClick={this.toggleFromTeamConfirmWindow}>
                    Exclude from team
                  </a>
                  {excludeFromTeam ? excludeFromTeamBlock : null}
                  <a href="#" onClick={this.toggleFromGroupConfirmWindow}>
                    Ban user
                  </a>
                  {excludeFromGroup ? excludeFromGroupBlock : null}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}
