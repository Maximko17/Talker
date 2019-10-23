import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

var stompClient = null;
var socket = null;

export function connectToChatSocket(topicName, addMessage, changeConnection) {
  socket = new SockJS("/ws");
  stompClient = Stomp.over(socket);
  stompClient.connect(
    {},
    frame => onChatConnected(frame, topicName, addMessage, changeConnection),
    onError(changeConnection)
  );
}

function onChatConnected(frame, topicName, addMessage, changeConnection) {
  console.log("Connected: " + frame);
  stompClient.subscribe(topicName, message => {
    addMessage(JSON.parse(message.body));
  });
  changeConnection("established");
  setTimeout(changeConnection, 3000);
}

function onError(changeConnection) {
  changeConnection("connecting");
}

export function onClose() {
  stompClient.disconnect();
  console.log("closed");
}
