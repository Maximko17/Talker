import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import store from "../../store";
import { NEW_NOTIFICATION, READ_UNREAD_MESSAGES } from "../../actions/types";

var stompClient = null;

export function connectToNotificationSocket(topicName) {
  const socket = new SockJS("/ws");
  stompClient = Stomp.over(socket);
  stompClient.connect({}, frame => {
    console.log("Connected: " + frame);
    stompClient.subscribe(topicName, notif => {
      var notification = JSON.parse(notif.body);
      if (notification.type === "READ_UNREAD_MESSAGES") {
        store.dispatch({
          type: READ_UNREAD_MESSAGES,
          payload: notification.id
        });
      } else {
        store.dispatch({
          type: NEW_NOTIFICATION,
          payload: notification
        });
      }
    });
  });
}

export function newNotification(messageMapping, type) {
  const notification = {
    type: type
  };
  stompClient.send(`/app/${messageMapping}`, {}, JSON.stringify(notification));
}
