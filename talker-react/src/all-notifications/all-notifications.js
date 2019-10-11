import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import "./all-notifications.css";
import Header from "../main-components/header/header";
import { getAllNotifications } from "../actions/notification-actions";
import { getDay } from "../utils/date-utils";
import { Redirect } from "react-router-dom";
import getDefaultFollowButton from "../utils/followers-utils";
import {
  deleteNotification,
  readAllNotifications
} from "../actions/notification-actions";

class AllNotifications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      url: ""
    };
    this.onScroll = this.onScroll.bind(this);
  }

  componentDidMount() {
    this.props.getAllNotifications(10);
    window.addEventListener("scroll", this.onScroll, false);
  }
  componentWillUnmount() {
    this.props.readAllNotifications();
    window.removeEventListener("scroll", this.onScroll, false);
  }

  onScroll() {
    const { currentSize, totalElements } = this.props.notifications;

    var scrollHeight = document.documentElement.scrollHeight;
    var clientHeight = document.documentElement.clientHeight;
    var scrollTop = document.documentElement.scrollTop;
    if (
      scrollTop >= scrollHeight - clientHeight - 50 &&
      currentSize < totalElements
    ) {
      this.props.getAllNotifications(currentSize + 10);
    }
  }

  getUnreadNotificationsLength(notifications) {
    let length = 0;
    notifications.forEach(notification => {
      if (!notification.watched) {
        length = length + 1;
      }
    });
    if (length !== 0) {
      return <div className="notifications-count">{length}</div>;
    } else {
      return null;
    }
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

  render() {
    const {
      notifications,
      security,
      deleteNotification,
      total_notifications
    } = this.props;
    const { redirect, url } = this.state;
    const notificationsList = [];

    if (notifications.hasNewMessages) {
      notificationsList.push(
        <div className="one-notification" key={"messages"}>
          <div className="content">
            <div className="message-notification">
              <i className="far fa-envelope" />
              <div className="message" onClick={() => this.redirect("MESSAGE")}>
                <span>You have new messages</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    notifications.content &&
      notifications.content.map((notification, index) => {
        notificationsList.push(
          <OneNotification
            key={index}
            notifications={notifications.content}
            security={security}
            index={index}
            notification={notification}
            redirectToUrl={this.redirect.bind(this)}
            deleteNotification={deleteNotification}
          />
        );
      });
    if (redirect) {
      return <Redirect push to={url} />;
    }
    return (
      <div>
        <Header style={"default"} />
        <div className="all-notifications">
          <p className="all-notifications-title">
            All notifications{" "}
            {total_notifications != 0 ? (
              <span> {total_notifications} new </span>
            ) : null}
          </p>
          {notificationsList}
        </div>
      </div>
    );
  }
}
AllNotifications.propTypes = {
  getAllNotifications: PropTypes.func.isRequired,
  deleteNotification: PropTypes.func.isRequired,
  readAllNotifications: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  notifications: state.notification.all_notifications,
  total_notifications: state.notification.total_notifications,
  security: state.security
});
export default connect(
  mapStateToProps,
  { getAllNotifications, deleteNotification, readAllNotifications }
)(AllNotifications);

export class OneNotification extends Component {
  getMessage(type) {
    switch (type) {
      case "FOLLOW":
        return "started following you";
      case "POST_LIKE":
        return "liked your post";
      case "RESPONSE_LIKE":
        return "liked your response under the post";
      case "RESPONSE":
        return "left a response under your post.";
    }
  }
  getNotificationAction({ type, fromUser, post, response }, security) {
    switch (type) {
      case "FOLLOW":
        return getDefaultFollowButton(fromUser, security, "notifications");
      case "POST_LIKE":
        return <img src={post.main_image} alt="post-image" />;
      case "RESPONSE_LIKE":
        return <img src={response.post.main_image} alt="post-image" />;
      case "RESPONSE":
        return <img src={response.post.main_image} alt="post-image" />;
    }
  }
  render() {
    const {
      id,
      type,
      date,
      fromUser,
      watched,
      post,
      response
    } = this.props.notification;
    const {
      deleteNotification,
      index,
      notifications,
      security,
      redirectToUrl
    } = this.props;
    let day = null;
    if (index !== 0) {
      if (getDay(date) !== getDay(notifications[index - 1].date)) {
        day = getDay(date);
      }
    } else {
      day = getDay(date);
    }

    return (
      <div className="one-notification">
        {day != null ? <div className="date">{day}</div> : null}
        <div className="content">
          <div onClick={() => redirectToUrl(type, fromUser, post, response)}>
            <img src={fromUser.photo} alt="user-photo" />
            <div className="ml-3">
              <span style={{ color: "black" }}>{fromUser.name}</span>
              <span style={{ marginLeft: "5px" }}>{this.getMessage(type)}</span>
              {watched ? null : <p>New</p>}
            </div>
          </div>
          <div className="notification-actions">
            {this.getNotificationAction(this.props.notification, security)}
            <div className="dropdown">
              <button
                type="button"
                id="dropdownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i className="fas fa-ellipsis-v"></i>
              </button>
              <div
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton"
              >
                <button type="button" onClick={() => deleteNotification(id)}>
                  Delete Notification
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
