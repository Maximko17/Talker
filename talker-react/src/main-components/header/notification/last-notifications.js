import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Popup } from "semantic-ui-react";
import NotificationPopover from "../../../popover/notification-popover/notification-popover";
import { getLastNotifications } from "../../../actions/notification-actions";
import { getDay } from "../../../utils/date-utils";
import { Redirect } from "react-router-dom";
import {
  countAllNewNotifications,
  readAllNotifications
} from "../../../actions/notification-actions";

class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      url: ""
    };
  }

  componentDidMount() {
    this.props.getLastNotifications();
    this.props.countAllNewNotifications();
  }

  redirect(type, fromUser, post, response) {
    let url = "";
    switch (type) {
      case "MESSAGE":
        url = "/my-chats";
        break;
      case "FOLLOW":
        url = `/profile/${fromUser.email}`;
        break;
      case "POST_LIKE":
        url = `/post/${post.id}`;
        break;
      case "RESPONSE_LIKE":
        url = `/post/${response.post.id}`;
        break;
      case "RESPONSE":
        url = `/post/${response.post.id}`;
        break;
    }
    this.setState({
      redirect: true,
      url: url
    });
  }
  getMessage(type) {
    switch (type) {
      case "FOLLOW":
        return "started following you";
      case "POST_LIKE":
        return "liked your post";
      case "RESPONSE_LIKE":
        return "liked your response";
      case "RESPONSE":
        return "left a comment under your posts.";
    }
  }

  render() {
    const {
      total_notifications,
      getLastNotifications,
      readAllNotifications
    } = this.props;
    const { content, hasNewMessages } = this.props.notifications;
    const notificationList = [];
    const { redirect, url } = this.state;
    if (redirect) {
      return <Redirect push to={url} />;
    }
    if (hasNewMessages) {
      notificationList.push(
        <div className="notification" key={"messages"}>
          <div className="image">
            <i className="far fa-envelope" />
          </div>
          <div className="message" onClick={() => this.redirect("MESSAGE")}>
            <span>You have new messages</span>
          </div>
        </div>
      );
    }

    content &&
      content.map(
        ({ fromUser, type, date, post, response, watched }, index) => {
          notificationList.push(
            <div className="notification" key={index}>
              <div className="image">
                <img src={fromUser.photo} alt="photo" />
              </div>
              <div
                className="message"
                onClick={() => this.redirect(type, fromUser, post, response)}
              >
                <span>{fromUser.name + " "}</span>
                {this.getMessage(type)}
                <div className="d-flex">
                  <span className="date">{getDay(date)}</span>
                  {!watched ? <span className="new">New</span> : null}
                </div>
              </div>
            </div>
          );
        }
      );
    return (
      <div className="notifications">
        {total_notifications !== 0 ? (
          <div className="notifications-count">{total_notifications}</div>
        ) : null}
        <Popup
          content={
            <NotificationPopover
              notifications={notificationList}
              getLastNotifications={getLastNotifications}
              readAllNotifications={readAllNotifications}
            />
          }
          trigger={
            <button className="bell-button">
              <i className="far fa-bell" />
            </button>
          }
          on="click"
          position="bottom center"
        />
      </div>
    );
  }
}

Notification.propTypes = {
  getLastNotifications: PropTypes.func.isRequired,
  countAllNewNotifications: PropTypes.func.isRequired,
  readAllNotifications: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  notifications: state.notification.last_notifications,
  total_notifications: state.notification.total_notifications
});
export default connect(
  mapStateToProps,
  { getLastNotifications, countAllNewNotifications, readAllNotifications }
)(Notification);
