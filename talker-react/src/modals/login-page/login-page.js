import React, { Component } from "react";
import "./login-page.css";

export default class LoginPage extends Component {
  render() {
    return (
      <div
        className="modal fade"
        id="loginPage"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalCenterTitle">
                Join Talker!
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <p>
                Create an account to receive great stories in your inbox,
                personalize your homepage, and follow authors and topics that
                you love.
              </p>
              <a
                href="https://talker-2.herokuapp.com/oauth2/authorize/google?redirect_uri=https://talker-2.herokuapp.com/oauth2/redirect"
                className="google-btn"
              >
                <img
                  src="http://pluspng.com/img-png/google-logo-png-open-2000.png"
                  alt="google-logo"
                />
                Sign up with Google
              </a>
              <a href="#" className="facebook-btn">
                <img
                  src="https://image.flaticon.com/icons/png/512/124/124010.png"
                  alt="google-logo"
                />
                Sign up with Facebook
              </a>
              <br />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
