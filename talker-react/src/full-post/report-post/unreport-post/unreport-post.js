import React, { Component } from "react";
import { removeReportFromPost } from "../../../actions/post-actions";
import { removeReportFromResponse } from "../../../actions/response-actions";
import { unBlockUser } from "../../../actions/user-actions";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class UnreportPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      unblockUser: false
    };

    this.onClick = this.onClick.bind(this);
    this.onCheckboxChange = this.onCheckboxChange.bind(this);
  }

  onCheckboxChange() {
    this.setState({
      unblockUser: !this.state.unblockUser
    });
  }

  onClick() {
    const { element, isOneElement, fromWhere, isThisResponse } = this.props;
    const { unblockUser } = this.state;
    if (!isThisResponse) {
      this.props.removeReportFromPost(element, isOneElement);
    } else {
      this.props.removeReportFromResponse(element);
    }

    if (unblockUser) {
      this.props.unBlockUser(element.user.email, fromWhere);
    }
  }

  render() {
    const { unblockUser } = this.state;
    const { element, user } = this.props;
    if (element == undefined) {
      return null;
    }

    return (
      <div
        className="modal fade reportModal"
        id={`unreportModal${element.id}`}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="unreport-modal"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-body">
              <h5>Remove report from this post?</h5>
              <div>
                {user.haveIBlocked ? (
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      checked={unblockUser == true}
                      onChange={this.onCheckboxChange}
                    />
                    <label>Also unblock the author of this post</label>
                  </div>
                ) : null}
                <div className="text-center mt-3">
                  <button
                    type="submit"
                    className="report"
                    data-dismiss="modal"
                    onClick={this.onClick}
                  >
                    Remove report
                  </button>
                  <button type="button" className="cancel" data-dismiss="modal">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
UnreportPost.propTypes = {
  removeReportFromPost: PropTypes.func.isRequired,
  unBlockUser: PropTypes.func.isRequired,
  removeReportFromResponse: PropTypes.func.isRequired
};

export default connect(
  null,
  { removeReportFromPost, unBlockUser, removeReportFromResponse }
)(UnreportPost);
