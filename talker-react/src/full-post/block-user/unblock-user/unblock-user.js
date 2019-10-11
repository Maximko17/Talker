import React, { Component } from "react";
import { unBlockUser } from "../../../actions/user-actions";
import "./unblock-user.css";

class UnblockUser extends Component {
  render() {
    const { user_email, blockPlace } = this.props;
    return (
      <div
        className="modal fade"
        id="unblockModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="unblock-modal"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-body">
              <h5>{`Unblock this user?`}</h5>
              <div className="text-center">
                <button
                  className="unblock"
                  data-dismiss="modal"
                  onClick={unBlockUser(user_email, blockPlace)}
                >
                  Unblock
                </button>
                <button type="button" className="cancel" data-dismiss="modal">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default UnblockUser;
