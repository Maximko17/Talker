import React, { Component } from "react";
import ChatView from "../chat-view";
import Followers from "../../user-profile/folowers/followers";

export default class Friends extends Component {
  render() {
    return (
      <ChatView>
        <Followers />
      </ChatView>
    );
  }
}
