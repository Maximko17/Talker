import React, { Component } from "react";
import "./notification-popover.css";
import { Link } from "react-router-dom";

class NotificationPopover extends Component {
  componentWillUnmount() {
    this.props.readAllNotifications();
  }
  render() {
    const { notifications } = this.props;
    return (
      <div className="notification-popover">
        {notifications}
        <div className="older-notifications">
          <Link to="/all-notifications">Older notifications</Link>
        </div>
      </div>
    );
  }
}
export default NotificationPopover;
