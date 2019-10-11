import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getChats, getChatsBySearch } from "../../actions/chat-actions";
import "./all-chats.css";
import { getTime } from "../../utils/date-utils";
import ChatView from "../chat-view";

class AllChats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: ""
    };

    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    this.props.getChats(this.props.location.search);
  }
  componentDidUpdate(prevProps) {
    const prevTab = prevProps.location.search;
    const thisTab = this.props.location.search;
    if (prevTab !== thisTab) {
      this.props.getChats(thisTab);
    }
  }

  onChange(e) {
    this.setState(
      {
        input: e.target.value
      },
      () => {
        if (this.state.input !== "") {
          this.props.getChatsBySearch(this.state.input);
        } else {
          this.props.getChats(this.props.location.search);
        }
      }
    );
  }

  render() {
    const { input } = this.state;
    const { search, pathname } = this.props.location;
    const { chats, history } = this.props;
    const { id, photo } = this.props.security.user;
    return (
      <ChatView section="chat" tab={search} pathname={pathname}>
        <ChatsSearch value={input} onChange={this.onChange} />
        <div className="chats">
          {chats.content && chats.content.length === 0 ? (
            <div id="null-chats-message">
              <span>Chat list is empty</span>
            </div>
          ) : null}
          {chats.content &&
            chats.content.map((chat, index) => {
              return (
                <div key={index}>
                  <Chat
                    chat={chat}
                    loggedUserId={id}
                    loggedUserPhoto={photo}
                    history={history}
                  />
                </div>
              );
            })}
        </div>
      </ChatView>
    );
  }
}
AllChats.propTypes = {
  getChats: PropTypes.func.isRequired,
  getChatsBySearch: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  chats: state.chat.chats,
  security: state.security
});
export default connect(
  mapStateToProps,
  { getChats, getChatsBySearch }
)(AllChats);

export class ChatsSearch extends Component {
  render() {
    const { onChange, value } = this.props;
    return (
      <div className="message-search">
        <div>
          <i className="fas fa-search" />
        </div>
        <div className="message-search-input">
          <input
            type="text"
            placeholder="Search"
            value={value}
            onChange={onChange}
          />
        </div>
        <div>
          <i className="fas fa-plus" />
        </div>
      </div>
    );
  }
}

export class Chat extends Component {
  render() {
    const { history, loggedUserPhoto, loggedUserId } = this.props;
    const { user, lastChatMessage, unreadMessagesCount } = this.props.chat;

    if (lastChatMessage == null) {
      return (
        <div className="one-chat">
          <div
            className="one-chat-image"
            onClick={() => window.open(`/profile/${user.email}`, "_blank")}
          >
            <img src={user.photo} />
          </div>
          <div
            className="one-chat-user"
            onClick={() => history.push(`/chat/user/${user.id}`)}
          >
            <div className="one-chat-user-info">
              <div>
                <p>{user.name}</p>
              </div>
              <div>
                <span>
                  <i className="fas fa-times" />
                </span>
              </div>
            </div>
            <div></div>
          </div>
        </div>
      );
    }
    return (
      <div
        className={
          unreadMessagesCount > 0 && loggedUserId !== lastChatMessage.user.id
            ? "one-chat new-message"
            : "one-chat"
        }
      >
        <div
          className="one-chat-image"
          onClick={() => window.open(`/profile/${user.email}`, "_blank")}
        >
          <img src={user.photo} />
        </div>
        <div
          className="one-chat-user"
          onClick={() => history.push(`/chat/user/${user.id}`)}
        >
          <div className="one-chat-user-info">
            <div>
              <p>{user.name}</p>
            </div>
            <div>
              <span>{getTime(lastChatMessage.date)}</span>
              <span>
                <i className="fas fa-times" />
              </span>
            </div>
          </div>
          <div>
            {loggedUserId === lastChatMessage.user.id ? (
              <div
                className={
                  unreadMessagesCount > 0
                    ? "my-last-message unread"
                    : "my-last-message"
                }
              >
                <img src={loggedUserPhoto} />
                <span>{lastChatMessage.content}</span>
              </div>
            ) : (
              <div className="user-last-message">
                <span> {lastChatMessage.content}</span>
                {unreadMessagesCount > 0 ? (
                  <div>{unreadMessagesCount}</div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
