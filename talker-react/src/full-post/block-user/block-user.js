import React, { Component } from "react";
import "./block-user.css";
import { blockUser } from "../../actions/user-actions";

class BlockUser extends Component {
  render() {
    const { user_email, user_name, blockPlace } = this.props;
    return (
      <div
        className="modal fade"
        id="blockModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="block-modal"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-body">
              <h5>Effects of blocking</h5>
              <ul>
                <li>
                  Their posts will be removed from your feed, and you won't see
                  them in the future. You won't be able to follow them.
                </li>
                <li> You can see their profile, but not their posts.</li>
                <li>
                  Any responses they've left on your posts won't be visible to
                  readers unless they visit the blocked user's profile page.
                </li>
                <li>
                  Blocked users cannot leave notes, recommend, or otherwise
                  interact with your content. They can @mention you, but you
                  will not be notified.
                </li>
                <li>
                  Blocked users will not be able to follow you or view your
                  content while logged in. If a blocked user visits your
                  profile, they’ll see a message that they’ve been blocked.
                </li>
              </ul>
            </div>
            <div className="modal-footer">
              <h5>{`Block ${user_name}?`}</h5>
              <div className="text-center">
                <button
                  className="block"
                  data-dismiss="modal"
                  onClick={blockUser(user_email, blockPlace)}
                >
                  Block
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
export default BlockUser;
