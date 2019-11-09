import React, { Component } from "react";
import "./edit-group.css";
import Header from "../../../main-components/header/header";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getEditGroupInfo } from "../../../actions/group-actions";
import { Link } from "react-router-dom";
import GeneralSettings from "./general-settings/general-settings";
import UsersRolesSettings from "./users-settings/user-roles/user-roles";
import UsersBansSettings from "./users-settings/users-bans/users-bans";

class EditGroup extends Component {
  componentDidMount() {
    this.props.getEditGroupInfo(
      this.props.match.params.groupName,
      this.props.history
    );
  }

  render() {
    const { group, history } = this.props;
    const { search } = this.props.location;
    const params = new URLSearchParams(search);
    const tab = params.get("tab");

    if (group.uri == undefined) return null;
    return (
      <div>
        <Header style={"default"} />
        <div className="setting-title">
          <Link to={`/group/${group.uri}`}>
            <i className="fas fa-long-arrow-alt-left"></i>
            <span>{group.name + " settings"}</span>
          </Link>
        </div>
        <div className="settings-layout">
          <div className="setting">
            {tab == "general" || tab == null ? (
              <GeneralSettings group={group} />
            ) : null}
            {tab == "roles" ? (
              <UsersRolesSettings groupUri={group.uri} />
            ) : null}
            {tab == "bans" ? <UsersBansSettings groupUri={group.uri} /> : null}
          </div>
          <div className="actions">
            <Link
              to={`/group/${group.uri}/edit?tab=general`}
              className={
                tab == "general" ? "settings-tab-active" : "settings-tab"
              }
            >
              Settings
            </Link>
            <Link
              to={`/group/${group.uri}/edit?tab=roles`}
              className="settings-tab"
            >
              Users
            </Link>
            <Link
              to={`/group/${group.uri}/edit?tab=roles`}
              className={
                tab == "roles" ? "settings-subtab-active" : "settings-subtab"
              }
            >
              Roles
            </Link>
            <Link
              to={`/group/${group.uri}/edit?tab=bans`}
              className={
                tab == "bans" ? "settings-subtab-active" : "settings-subtab"
              }
            >
              Bans
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
EditGroup.propTypes = {
  getEditGroupInfo: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  group: state.group.group
});
export default connect(
  mapStateToProps,
  { getEditGroupInfo }
)(EditGroup);
