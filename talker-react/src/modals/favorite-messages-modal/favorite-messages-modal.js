import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getFavoriteMessages } from "../../actions/chat-actions";
import { getTime } from "../../utils/date-utils";
import "./favorite-messages-modal.css";
import {
  addOneMessageToFavorite,
  downloadFile
} from "../../actions/chat-actions";
import { FilesView } from "../../chat/private-chat/private-chat";

class FavoriteMessagesModal extends Component {
  constructor(props) {
    super(props);

    this.onScroll = this.onScroll.bind(this);
  }
  componentDidMount() {
    window.addEventListener("click", this.windowOnClick.bind(this));
    this.props.getFavoriteMessages(10);
  }
  windowOnClick(event) {
    var modal = document.querySelector(".custom-modal");
    if (event.target === modal) {
      this.props.toggleModal();
    }
  }
  onScroll() {
    const { currentSize, totalElements } = this.props.messages;

    var scrollHeight = this.elem.scrollHeight;
    var clientHeight = this.elem.clientHeight;
    var scrollTop = this.elem.scrollTop;
    if (
      scrollTop >= scrollHeight - clientHeight - 5 &&
      currentSize < totalElements
    ) {
      this.props.getFavoriteMessages(currentSize + 2);
    }
  }
  render() {
    const {
      messages,
      toggleModal,
      addOneMessageToFavorite,
      downloadFile
    } = this.props;
    return (
      <div className="custom-modal">
        <div className="custom-modal-content">
          <div className="custom-modal-header">
            <span className="modal-title">Favorite messages</span>
            <span className="close-button" onClick={toggleModal}>
              ×
            </span>
          </div>
          <div
            className="fav-messages"
            onScroll={this.onScroll}
            ref={div => {
              this.elem = div;
            }}
          >
            {messages.content.map(
              ({ id, user, date, content, isFavorite, files }) => {
                return (
                  <div className="message-layout" key={id}>
                    <div className="one-fav-message">
                      <div className="image">
                        <img src={user.photo} alt="pht" />
                      </div>
                      <div className="message-content">
                        <div className="user-name">
                          <a href={`/profile/${user.email}`}>{user.name}</a>
                          <span>{getTime(date)}</span>
                        </div>
                        <div>{content}</div>
                        <div
                          className={
                            files.length > 1 ? "many-files" : "one-file"
                          }
                        >
                          {files.map((file, index) => {
                            return (
                              <FilesView
                                file={file}
                                fileLayout={"left"}
                                downloadFile={downloadFile}
                                key={index}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="message-actions">
                      <div
                        className={
                          isFavorite
                            ? "favorite-button selected"
                            : "favorite-button"
                        }
                      >
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            addOneMessageToFavorite(id);
                          }}
                        >
                          <i
                            className={
                              isFavorite ? "fas fa-star" : "far fa-star"
                            }
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>
    );
  }
}

FavoriteMessagesModal.propTypes = {
  getFavoriteMessages: PropTypes.func.isRequired,
  addOneMessageToFavorite: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  messages: state.chat.fav_messages
});

export default connect(
  mapStateToProps,
  { getFavoriteMessages, addOneMessageToFavorite }
)(FavoriteMessagesModal);
