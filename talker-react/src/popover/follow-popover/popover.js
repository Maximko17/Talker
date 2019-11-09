import React from "react";
import "./popover.css";
import { getDate } from "../../utils/date-utils";
import getDefaultFollowButton, {
  getGroupFollowButton
} from "../../utils/followers-utils";

export default function popover(object, security, fromWhere) {
  if (object.uri == undefined) {
    return (
      <div className="popover-info">
        <div>
          <div className="popover-user-info">
            <p>{object.name}</p>
            <p>Talker member since {getDate(object.login_date)}</p>
            <p>{object.description}</p>
          </div>
          <div className="popover-user-image">
            <img src={object.photo} alt="Img" />
          </div>
        </div>
        <div className="popover-followers-info">
          <span>Followed by {object.totalFollowers} people</span>
          {getDefaultFollowButton(object, security, fromWhere)}
        </div>
      </div>
    );
  } else {
    return (
      <div className="popover-info">
        <div>
          <div className="popover-user-info">
            <p>{object.name}</p>
            <p>Topic: {object.topic}</p>
            <p>{object.description}</p>
          </div>
          <div className="popover-user-image">
            <img src={object.image} alt="Img" />
          </div>
        </div>
        <div className="popover-followers-info">
          <span>Followed by {object.totalFollowers} people</span>
          {getGroupFollowButton(object, security, fromWhere)}
        </div>
      </div>
    );
  }
}
