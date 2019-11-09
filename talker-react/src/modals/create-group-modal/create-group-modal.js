import React, { Component } from "react";
import "./create-group-modal.css";
import { createNewGroup } from "../../actions/group-actions";
import { connect } from "react-redux";
import PropTypes from "prop-types";

class CreateGroupModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      group: {
        uri: "",
        name: "",
        type: "OPEN",
        topic: ""
      }
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState({
      group: {
        ...this.state.group,
        [e.target.name]: e.target.value
      }
    });
  }

  onSubmit(e) {
    e.preventDefault();
    this.props.createNewGroup(this.state.group, this.props.history);
  }

  render() {
    const { uri, name, type, topic } = this.state.group;
    const { toggleModal } = this.props;
    return (
      <div className="custom-modal">
        <form className="create-group-modal" onSubmit={this.onSubmit}>
          <div className="header">
            Creating new group
            <button type="button" onClick={toggleModal}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="body">
            <img
              src="https://uralcop.ru/assets/img/icons/bubbles.png"
              alt="chat_logo"
            />
            <h5>Interest group</h5>
            <div>Communicate and share content with like-minded people</div>
            <div className="input-form">
              <div className="group-input">
                <div className="title">Name:</div>
                <input
                  type={"text"}
                  placeholder={""}
                  name={"name"}
                  onChange={this.onChange}
                  value={name}
                />
              </div>
              <div className="group-input">
                <div className="title">Topic:</div>
                <input
                  type={"text"}
                  placeholder={""}
                  name={"topic"}
                  onChange={this.onChange}
                  value={topic}
                />
              </div>
              <div className="group-input">
                <div className="title">Group type:</div>
                <select
                  type={"text"}
                  name={"type"}
                  onChange={this.onChange}
                  value={type}
                >
                  <option value="OPEN">Open</option>
                  <option value="CLOSE">Close</option>
                </select>
              </div>
              <div className="group-input">
                <div className="title">Unique name:</div>
                <input
                  type={"text"}
                  name={"uri"}
                  onChange={this.onChange}
                  value={uri}
                />
              </div>
            </div>
          </div>
          <div className="footer">
            <button type="button" className="cancel" onClick={toggleModal}>
              Cancel
            </button>
            <button type="submit" className="submit">
              Create group
            </button>
          </div>
        </form>
      </div>
    );
  }
}

CreateGroupModal.propTypes = {
  createNewGroup: PropTypes.func.isRequired,
  error: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  error: state.errors.error
});
export default connect(
  mapStateToProps,
  { createNewGroup }
)(CreateGroupModal);
