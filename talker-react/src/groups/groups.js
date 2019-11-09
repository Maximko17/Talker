import React, { Component } from "react";
import "./groups.css";
import Header from "../main-components/header/header";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import GroupsSearch from "./groups-search/groups-search";
import CreateGroupModal from "../modals/create-group-modal/create-group-modal";
import { getGroups } from "../actions/group-actions";

class Groups extends Component {
  constructor(props) {
    super(props);

    this.toggleModal = this.toggleModal.bind(this);
  }

  componentDidMount() {
    this.props.getGroups(10);
  }

  toggleModal() {
    var modal = document.querySelector(".custom-modal");
    modal.classList.toggle("show-custom-modal");
  }
  render() {
    const { history, groups } = this.props;
    return (
      <div>
        <Header style={"default"} />
        <div className="all-groups">
          <div className="groups-info">
            <div className="tab">
              All groups <span>40</span>
            </div>
            <button className="create-group" onClick={this.toggleModal}>
              Create group
            </button>
            <CreateGroupModal
              toggleModal={this.toggleModal}
              history={history}
            />
          </div>
          <GroupsSearch />
          {groups.content.map((group, index) => {
            return <EachGroup group={group} history={history} key={index} />;
          })}
        </div>
      </div>
    );
  }
}

Groups.propTypes = {
  getGroups: PropTypes.func.isRequired,
  error: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  groups: state.group.groups,
  security: state.security,
  error: state.errors.error
});
export default connect(
  mapStateToProps,
  { getGroups }
)(Groups);

class EachGroup extends Component {
  render() {
    const { uri, image, name, topic, totalFollowers } = this.props.group;
    const { history } = this.props;
    return (
      <div className="each-group" onClick={() => history.push(`/group/${uri}`)}>
        <div className="each-group-info">
          <img src={image} alt="grp-img" />
          <div>
            <p className="name">{name}</p>
            <p className="topic">{topic}</p>
            <p className="followers-count">{totalFollowers + " followers"}</p>
          </div>
        </div>
        <div className="each-group-actions">
          <i className="fas fa-ellipsis-h"></i>
        </div>
      </div>
    );
  }
}
