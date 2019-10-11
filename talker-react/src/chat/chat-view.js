import React, { Component } from "react";
import Header from "../main-components/header/header";
import "./chat-view.css";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { countUnreadChats } from "../actions/chat-actions";
import FavoriteMessagesModal from "../modals/favorite-messages-modal/favorite-messages-modal";

class ChatView extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.countUnreadChats();
  }

  render() {
    let { unread_chats_count, tab, section, pathname } = this.props;
    unread_chats_count =
      unread_chats_count !== 0 ? <div>{unread_chats_count}</div> : null;
    return (
      <div style={{ height: "100%" }}>
        <Header style={"default"} />
        <div className="chat-layout">
          <LeftBlock messagesCount={unread_chats_count} />
          <div className="chat-view">{this.props.children}</div>
          <RightBlock section={section} tab={tab} pathname={pathname} />
        </div>
      </div>
    );
  }
}

ChatView.propTypes = {
  countUnreadChats: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  unread_chats_count: state.chat.unread_chats_count
});
export default connect(
  mapStateToProps,
  { countUnreadChats }
)(ChatView);

export class LeftBlock extends Component {
  render() {
    const { messagesCount } = this.props;
    return (
      <div className="left-block">
        <div className="link">
          <Link to={"/my-chats"}>
            <i className="fas fa-comments" />
            Chats
          </Link>
          {messagesCount}
        </div>
        <div>
          <Link to={"/my-followings"}>
            <i className="fas fa-user" />
            Followings
          </Link>
        </div>
      </div>
    );
  }
}

export class RightBlock extends Component {
  toggleModal() {
    var modal = document.querySelector(".custom-modal");
    modal.classList.toggle("show-custom-modal");
  }

  render() {
    const { section, tab, pathname } = this.props;
    switch (section) {
      case "chat":
        return (
          <div className="right-block">
            <Link
              to={"/my-chats"}
              className={
                tab === "" && pathname.indexOf("my-chats") !== -1
                  ? "active"
                  : null
              }
            >
              All chats
            </Link>
            <Link
              to={"/my-chats?tab=unread"}
              className={tab.indexOf("unread") !== -1 ? "active" : null}
            >
              Unread
            </Link>
            <button type="button" onClick={this.toggleModal.bind(this)}>
              Favorite messages
            </button>
            <FavoriteMessagesModal toggleModal={this.toggleModal} />
          </div>
        );

      default:
        return null;
    }
  }
}
