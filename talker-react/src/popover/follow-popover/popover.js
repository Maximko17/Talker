import React from "react";
import "./popover.css";
import { getDate } from "../../utils/date-utils";
import getDefaultFollowButton from "../../utils/followers-utils";

export default function popover(user, security, fromWhere) {
  return (
    <div className="popover-info">
      <div>
        <div className="popover-user-info">
          <p>{user.name}</p>
          <p>Talker member since {getDate(user.login_date)}</p>
          <p>{user.description}</p>
        </div>
        <div className="popover-user-image">
          <img src={user.photo} alt="Img" />
        </div>
      </div>
      <div className="popover-followers-info">
        <span>Followed by {user.totalFollowers} people</span>
        {getDefaultFollowButton(user, security, fromWhere)}
      </div>
    </div>
  );
}
