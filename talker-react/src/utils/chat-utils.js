import React from "react";
import LoginPage from "../modals/login-page/login-page";
import { Link } from "react-router-dom";

export function getMessageButton(user, security, style) {
  if (security.validToken) {
    if (user.isMeFollower && (!user.haveMeBlocked || !user.haveIBlocked)) {
      return (
        <Link to={`/chat/user/${user.id}`} className={style}>
          Message
        </Link>
      );
    } else {
      return null;
    }
  } else {
    return (
      <div>
        <Link
          to={"#"}
          className="profile-message-button"
          data-toggle="modal"
          data-target="#loginPage"
        >
          Message
        </Link>
        <LoginPage />
      </div>
    );
  }
}
