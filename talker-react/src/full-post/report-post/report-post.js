import React, { Component } from "react";
import "./report-post.css";
import { reportPost } from "../../actions/post-actions";
import { blockUser } from "../../actions/user-actions";
import { reportResponse } from "../../actions/response-actions";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class ReportPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reportType: "",
      blockThisUser: false
    };

    this.onClick = this.onClick.bind(this);
    this.onCheckboxChange = this.onCheckboxChange.bind(this);
    this.onRadioChange = this.onRadioChange.bind(this);
  }

  onRadioChange(e) {
    this.setState({
      reportType: e.target.value
    });
  }

  onCheckboxChange() {
    this.setState({
      blockThisUser: !this.state.blockThisUser
    });
  }

  onClick() {
    const { element, isOneElement, fromWhere, isThisResponse } = this.props;
    const { reportType, blockThisUser } = this.state;
    if (!isThisResponse) {
      this.props.reportPost(element, reportType, isOneElement);
    } else {
      this.props.reportResponse(element, reportType);
    }
    if (blockThisUser) {
      this.props.blockUser(element.user.email, fromWhere);
    }
  }

  render() {
    const { reportType, blockThisUser } = this.state;
    const { element, user } = this.props;
    if (element == undefined) {
      return null;
    }

    return (
      <div
        className="modal fade reportModal"
        id={`reportModal${element.id}`}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="report-modal"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-body">
              <h5>Report this post?</h5>
              <div>
                <div className="radio">
                  <input
                    type="radio"
                    value="spam"
                    checked={reportType === "spam"}
                    onChange={this.onRadioChange}
                  />
                  <label>Spam</label>
                </div>
                <div className="radio">
                  <input
                    type="radio"
                    value="harassment"
                    checked={reportType === "harassment"}
                    onChange={this.onRadioChange}
                  />
                  <label>Harassment</label>
                </div>
                <div className="radio">
                  <input
                    type="radio"
                    value="rulesViolation"
                    checked={reportType === "rulesViolation"}
                    onChange={this.onRadioChange}
                  />
                  <label>Rules Violation</label>
                </div>

                {!user.haveIBlocked ? (
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      checked={blockThisUser == true}
                      onChange={this.onCheckboxChange}
                    />
                    <label>Also block the author of this post</label>
                  </div>
                ) : null}
                <div className="text-center mt-3">
                  <button
                    type="button"
                    className="report"
                    data-dismiss="modal"
                    onClick={this.onClick}
                  >
                    Report
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

ReportPost.propTypes = {
  reportPost: PropTypes.func.isRequired,
  blockUser: PropTypes.func.isRequired,
  reportResponse: PropTypes.func.isRequired
};

export default connect(
  null,
  { reportPost, blockUser, reportResponse }
)(ReportPost);
