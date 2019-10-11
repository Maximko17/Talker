import React, { Component } from "react";
import { onClose } from "../websockets/message-websocket";
import { connect } from "react-redux";
import {
  addNewMessage,
  getChatMessages,
  addOneMessageToFavorite,
  addManyMessagesToFavorite,
  createNewChat,
  readUnreadMessages,
  deleteMessages,
  sendAMessage,
  downloadFile
} from "../../actions/chat-actions";
import PropTypes from "prop-types";
import { deleteMessageNotification } from "../../actions/notification-actions";

import ChatView from "../chat-view";
import "./private-chat.css";
import { Link } from "react-router-dom";
import { getTime, getDay } from "../../utils/date-utils";
import TextareaAutosize from "react-autosize-textarea";
import { getUserById } from "../../actions/user-actions";
import FullImage from "../../modals/full-image/full-image";

class PrivateChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: {
        id: null,
        content: "",
        files: []
      },
      new_files: [],
      display_images: [],
      display_files: [],
      connection_type: "connecting",
      editMode: false,
      selectMode: false,
      selectedMessagesCount: 0,
      selectedMessages: [],
      openImage: null,
      imageFromMessage: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onConnectionChange = this.onConnectionChange.bind(this);
    this.editMessage = this.editMessage.bind(this);
    this.cancelEditMode = this.cancelEditMode.bind(this);
    this.selectMessage = this.selectMessage.bind(this);
    this.cancelSelectMode = this.cancelSelectMode.bind(this);
    this.unselectMessage = this.unselectMessage.bind(this);
    this.checkIfSelected = this.checkIfSelected.bind(this);
    this.addSelectedToFavourites = this.addSelectedToFavourites.bind(this);
    this.deleteSelected = this.deleteSelected.bind(this);
    this.addFiles = this.addFiles.bind(this);
    this.removeElement = this.removeElement.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }

  componentDidMount() {
    const { userId } = this.props.match.params;
    this.props.createNewChat(
      +userId,
      this.props.addNewMessage,
      this.props.getChatMessages,
      this.onConnectionChange
    );
    this.props.getUserById(userId);
  }
  componentWillUnmount() {
    onClose();
  }
  componentDidUpdate() {
    const messages = this.props.messages.content;
    const { id } = this.props.security.user;
    const { userId } = this.props.match.params;
    if (
      messages.length != 0 &&
      messages[messages.length - 1].user.id !== id &&
      !messages[messages.length - 1].watched &&
      this.state.connection_type === "established"
    ) {
      this.props.readUnreadMessages(userId);
      this.props.deleteMessageNotification(
        messages[messages.length - 1].user.id
      );
    }
  }

  editMessage(e, message) {
    this.setState({
      editMode: true,
      message: {
        id: message.id,
        content: message.content,
        files: message.files
      },
      display_images: message.files
        .filter(({ fileType }) => fileType === "image")
        .map(({ fileName }, index) => {
          const key = fileName.slice(0, 3) + index;
          return (
            <div className="chat-image" key={key}>
              <img src={fileName} />
              <div className="blackout"></div>
              <div className="delete-button">
                <button
                  type="button"
                  onClick={() => this.removeElement(fileName, key, "image")}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
          );
        }),
      display_files: message.files
        .filter(({ fileType }) => fileType !== "image")
        .map(({ fileName, fileSize }, index) => {
          const key = fileName.slice(0, 3) + index;
          return (
            <div className="add-file" key={key}>
              <div className="file-content">
                <i className="fas fa-file"></i>
                <div className="info">
                  <span>
                    {fileName.substring(fileName.indexOf("messages/") + 9)}
                  </span>
                  <span className="size">{fileSize}</span>
                </div>
              </div>
              <i
                className="fas fa-times"
                onClick={() => this.removeElement(fileName, key, "file")}
              />
            </div>
          );
        })
    });
    e.stopPropagation();
  }
  cancelEditMode() {
    this.setState({
      editMode: false,
      message: {
        id: null,
        content: "",
        files: []
      },
      new_files: [],
      display_images: [],
      display_files: []
    });
  }

  selectMessage(message) {
    const { selectedMessages, selectedMessagesCount } = this.state;
    this.setState({
      selectMode: true,
      selectedMessagesCount: selectedMessagesCount + 1,
      selectedMessages: [...selectedMessages, message]
    });
  }
  unselectMessage(messageId) {
    const { selectedMessages, selectedMessagesCount } = this.state;
    this.setState({
      ...this.state,
      selectedMessagesCount: selectedMessagesCount - 1,
      selectedMessages: selectedMessages.filter(
        selectedMessage => selectedMessage.id != messageId
      )
    });
    if (selectedMessages.length === 1) {
      this.cancelSelectMode();
    }
  }
  cancelSelectMode() {
    this.setState({
      selectMode: false,
      selectedMessagesCount: 0,
      selectedMessages: []
    });
  }
  checkIfSelected(messageId) {
    const { selectedMessages } = this.state;
    for (let i = 0; i < selectedMessages.length; i++) {
      if (selectedMessages[i].id === messageId) {
        return true;
      }
    }
    return false;
  }
  addSelectedToFavourites() {
    const { selectedMessages } = this.state;
    this.props.addManyMessagesToFavorite(
      selectedMessages,
      this.cancelSelectMode
    );
  }
  deleteSelected(userId) {
    const { selectedMessages } = this.state;
    this.props.deleteMessages(userId, selectedMessages, this.cancelSelectMode);
  }

  onSubmit(e) {
    e.preventDefault();
    const { message, new_files } = this.state;
    if (message.content.trim() !== "" || message.files.length != 0) {
      this.props.sendAMessage(
        message,
        new_files,
        +this.props.match.params.userId
      );
      this.setState({
        editMode: false,
        message: {
          id: null,
          content: "",
          files: []
        },
        new_files: [],
        display_images: [],
        display_files: []
      });
    }
  }

  onConnectionChange(connection_type) {
    if (connection_type == undefined) {
      this.setState({
        connection_type: "established hidden"
      });
    } else {
      this.setState({
        connection_type
      });
    }
  }
  onChange(content) {
    this.setState({
      ...this.state,
      message: {
        ...this.state.message,
        content: content.target.value
      }
    });
  }

  ///// ----- file Change
  addFiles(e) {
    let newFiles = [];
    let newDisplayImages = this.state.display_images;
    let newDisplayFiles = this.state.display_files;
    let errorMessage = document.getElementById("error-message");
    let errors = [];

    [...e.target.files].forEach((file, index) => {
      const key = file.name.slice(0, 3) + index;
      if (file.type == "image/png" || file.type == "image/jpeg") {
        if (file.size > 1000000) {
          errors.push(
            `File size ${file.name} esceeds 1MB.It will notbe loaded`
          );
        } else {
          errorMessage.innerHTML = "";
          newFiles = [...newFiles, file];
          newDisplayImages = [
            ...newDisplayImages,
            <div className="chat-image" key={key}>
              <img id={`image${index}`} />
              <div className="blackout"></div>
              <div className="delete-button">
                <button
                  type="button"
                  onClick={() => this.removeElement(file.name, key, "image")}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
          ];
          this.displayImages(file, index);
        }
      } else {
        errorMessage.innerHTML = "";
        newFiles = [...newFiles, file];

        newDisplayFiles = [
          ...newDisplayFiles,
          <div className="add-file" key={key}>
            <div className="file-content">
              <i className="fas fa-file"></i>
              <div className="info">
                <span>{file.name}</span>
                <span className="size">{file.size}</span>
              </div>
            </div>
            <i
              className="fas fa-times"
              onClick={() => this.removeElement(file.name, key, "file")}
            />
          </div>
        ];
      }
      errorMessage.innerHTML = errors;
    });
    this.setState({
      new_files: newFiles,
      display_images: newDisplayImages,
      display_files: newDisplayFiles
    });
  }

  displayImages(img, imgId) {
    var reader = new FileReader();
    reader.readAsDataURL(img);
    reader.onload = function(e) {
      document.getElementById(`image${imgId}`).src = reader.result;
    };
  }

  removeElement(fileName, index, type) {
    const { new_files, display_files, display_images, message } = this.state;
    this.setState({
      message: {
        ...message,
        files: message.files.filter(file => file.fileName !== fileName)
      },
      new_files: new_files.filter(file => file.name !== fileName)
    });
    if (type === "image") {
      this.setState({
        display_images: display_images.filter(img => img.key !== index)
      });
    } else {
      this.setState({
        display_files: display_files.filter(file => file.key !== index)
      });
    }
  }

  toggleModal(message, imageIndex) {
    this.setState({
      openImage: imageIndex,
      imageFromMessage: message
    });
    var modal = document.querySelector(".custom-modal");
    modal.classList.toggle("show-custom-modal");
  }

  render() {
    const {
      connection_type,
      editMode,
      selectMode,
      selectedMessagesCount,
      display_files,
      display_images,
      selectedMessages,
      openImage,
      imageFromMessage
    } = this.state;
    const { content } = this.state.message;
    const { messages, user, downloadFile } = this.props;
    const { search, pathname } = this.props.location;
    const { id } = this.props.security.user;
    let allowMessageDelete = false;
    if (selectMode) {
      allowMessageDelete =
        selectedMessages.filter(message => message.user.id !== id).length === 0;
    }
    return (
      <ChatView section="chat" tab={search} pathname={pathname}>
        <ChatUser
          user={user}
          allowMessageDelete={allowMessageDelete}
          selectMode={selectMode}
          connectionType={connection_type}
          cancelSelectMode={this.cancelSelectMode}
          selectedMessagesCount={selectedMessagesCount}
          addSelectedToFavourites={this.addSelectedToFavourites}
          deleteSelected={this.deleteSelected}
        />
        <div className="messages">
          {messages.content.length === 0 ? (
            <div id="new-chat-message">
              <span>Your chat history will be displayed here.</span>
            </div>
          ) : null}
          {messages.content.map((message, index) => {
            return (
              <ChatMessage
                key={index}
                message={message}
                editMessage={this.editMessage}
                addToFavorite={this.props.addOneMessageToFavorite}
                selectMessage={this.selectMessage}
                unselectMessage={this.unselectMessage}
                checkIfSelected={this.checkIfSelected}
                index={index}
                messages={messages.content}
                loggedUserId={id}
                downloadFile={downloadFile}
                toggleModal={this.toggleModal}
              />
            );
          })}
        </div>
        <ChatInput
          content={content}
          onChange={this.onChange}
          onSubmit={this.onSubmit}
          connection={connection_type}
          editMode={editMode}
          cancelEditMode={this.cancelEditMode}
          onFileChange={this.addFiles}
          displayFiles={display_files}
          displayImages={display_images}
        />
        <FullImage
          toggleModal={this.toggleModal}
          image={openImage}
          message={imageFromMessage}
        />
      </ChatView>
    );
  }
}
PrivateChat.propTypes = {
  addNewMessage: PropTypes.func.isRequired,
  getChatMessages: PropTypes.func.isRequired,
  createNewChat: PropTypes.func.isRequired,
  getUserById: PropTypes.func.isRequired,
  addOneMessageToFavorite: PropTypes.func.isRequired,
  addManyMessagesToFavorite: PropTypes.func.isRequired,
  deleteMessageNotification: PropTypes.func.isRequired,
  readUnreadMessages: PropTypes.func.isRequired,
  deleteMessages: PropTypes.func.isRequired,
  sendAMessage: PropTypes.func.isRequired,
  downloadFile: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  messages: state.chat.messages,
  security: state.security,
  user: state.user.user
});
export default connect(
  mapStateToProps,
  {
    addNewMessage,
    getChatMessages,
    createNewChat,
    getUserById,
    addOneMessageToFavorite,
    addManyMessagesToFavorite,
    deleteMessageNotification,
    readUnreadMessages,
    deleteMessages,
    sendAMessage,
    downloadFile
  }
)(PrivateChat);

export class ChatUser extends Component {
  render() {
    const {
      user,
      allowMessageDelete,
      selectMode,
      cancelSelectMode,
      selectedMessagesCount,
      addSelectedToFavourites,
      deleteSelected,
      connectionType
    } = this.props;
    if (!selectMode) {
      return (
        <div className="chat-user">
          <div className="back-button">
            <Link to={"/my-chats"}>
              {" "}
              <i className="fas fa-chevron-left" />
              Back
            </Link>
          </div>
          <div className="chat-user-name">
            <a href={`/profile/${user.name}`}>{user.name}</a>
            <ConnectionMessage type={connectionType} />
          </div>
          <div className="chat-user-photo">
            <img src={user.photo} alt="ph" />
          </div>
        </div>
      );
    } else {
      return (
        <div className="select-mode">
          <div className="message-count">
            {selectedMessagesCount > 1
              ? selectedMessagesCount + " messages"
              : selectedMessagesCount + " message"}

            <button type="button" onClick={cancelSelectMode}>
              <i className="fas fa-times" />
            </button>
          </div>
          <div className="select-actions">
            <button type="button" onClick={addSelectedToFavourites}>
              <i className="far fa-star" />
            </button>
            {allowMessageDelete ? (
              <button type="button" onClick={() => deleteSelected(user.id)}>
                <i className="far fa-trash-alt" />
              </button>
            ) : null}
          </div>
        </div>
      );
    }
  }
}

export class ConnectionMessage extends Component {
  render() {
    const { type } = this.props;
    switch (type) {
      case "connecting":
        return (
          <div className="connecting">
            <div className="spinner-border text-dark" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            Connecting....This may take a few seconds.
          </div>
        );
      case "established":
        return (
          <div className="established">
            <i className="fas fa-check" />
            Connection Established
          </div>
        );

      case "established hidden":
        return (
          <div className="established hidden">
            <i className="fas fa-check" />
            Connection Established
          </div>
        );
    }
  }
}

export class ChatMessage extends Component {
  getImageIndex(index) {
    this.props.toggleModal(this.props.message, index);
  }

  render() {
    const {
      loggedUserId,
      messages,
      index,
      editMessage,
      addToFavorite,
      selectMessage,
      unselectMessage,
      checkIfSelected,
      downloadFile
    } = this.props;
    const {
      id,
      user,
      content,
      date,
      isFavorite,
      watched,
      files
    } = this.props.message;
    let day = "";
    if (index !== 0) {
      if (getDay(date) !== getDay(messages[index - 1].date)) {
        day = getDay(date);
      }
    } else {
      day = getDay(date);
    }
    const isSelected = checkIfSelected(id);
    if (user.id === loggedUserId) {
      return (
        <React.Fragment>
          <div className="messages-day">{day}</div>
          <div
            className={
              isSelected || !watched
                ? "message-layout selected-message"
                : "message-layout"
            }
            onClick={() =>
              isSelected
                ? unselectMessage(id)
                : selectMessage(this.props.message)
            }
          >
            <div className="message-actions">
              <div
                className={
                  isFavorite ? "favorite-button selected" : "favorite-button"
                }
              >
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    addToFavorite(id);
                  }}
                >
                  <i className={isFavorite ? "fas fa-star" : "far fa-star"} />
                </button>
              </div>
              <div className="edit-button">
                <button
                  type="button"
                  onClick={e => editMessage(e, this.props.message)}
                >
                  <i className="fas fa-pencil-alt" />
                </button>
              </div>
            </div>
            <div className="one-my-message">
              <div className="content">
                <span>{getTime(date)}</span>
                <a href={`/profile/${user.email}`}>{user.name}</a>
                <div>{content}</div>
                <div className={files.length > 1 ? "many-files" : "one-file"}>
                  {files.map((file, index) => {
                    return (
                      <FilesView
                        file={file}
                        fileLayout={"right"}
                        openImage={this.getImageIndex.bind(this)}
                        index={index}
                        downloadFile={downloadFile}
                        key={index}
                      />
                    );
                  })}
                </div>
              </div>
              <div className="image">
                <img src={user.photo} alt="pht" />
              </div>
              <div className={isSelected ? "check selected" : "check"}>
                <button type="button">
                  <i className="fas fa-check-circle" />
                </button>
              </div>
            </div>
          </div>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <div className="messages-day">{day}</div>
          <div
            className={
              isSelected || !watched
                ? "message-layout selected-message"
                : "message-layout"
            }
            onClick={() =>
              isSelected
                ? unselectMessage(id)
                : selectMessage(this.props.message)
            }
          >
            <div className="one-user-message">
              <div className={isSelected ? "check selected" : "check"}>
                <button type="button">
                  <i className="fas fa-check-circle" />
                </button>
              </div>
              <div className="image">
                <img src={user.photo} alt="pht" />
              </div>
              <div className="content">
                <a href={`/profile/${user.email}`}>{user.name}</a>
                <span>{getTime(date)}</span>
                <div>{content}</div>
                <div className={files.length > 1 ? "many-files" : "one-file"}>
                  {files.map((file, index) => {
                    return (
                      <FilesView
                        file={file}
                        fileLayout={"left"}
                        downloadFile={downloadFile}
                        openImage={this.getImageIndex.bind(this)}
                        index={index}
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
                  isFavorite ? "favorite-button selected" : "favorite-button"
                }
              >
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    addToFavorite(id);
                  }}
                >
                  <i className={isFavorite ? "fas fa-star" : "far fa-star"} />
                </button>
              </div>
            </div>
          </div>
        </React.Fragment>
      );
    }
  }
}

export class FilesView extends Component {
  render() {
    const { fileName, fileType, fileSize } = this.props.file;
    const { downloadFile, fileLayout, openImage, index } = this.props;
    const shortFileName = fileName.substring(fileName.indexOf("messages/") + 9);
    if (fileType === "image") {
      return (
        <img
          src={fileName}
          alt="user-img"
          onClick={e => {
            e.stopPropagation();
            openImage(index);
          }}
        />
      );
    } else {
      if (fileLayout === "right") {
        return (
          <div
            className="display-files"
            onClick={e => {
              e.stopPropagation();
              downloadFile(shortFileName);
            }}
          >
            <div className="info">
              <div>{shortFileName}</div>
              <span className="size">{fileSize}</span>
            </div>
            <div>
              <i className="fas fa-file"></i>
            </div>
          </div>
        );
      } else {
        return (
          <div
            className="display-files"
            onClick={e => {
              e.stopPropagation();
              downloadFile(shortFileName);
            }}
          >
            <div>
              <i className="fas fa-file"></i>
            </div>
            <div className="info">
              <div>{shortFileName}</div>
              <span className="size">{fileSize}</span>
            </div>
          </div>
        );
      }
    }
  }
}

export class ChatInput extends Component {
  render() {
    const {
      onChange,
      onSubmit,
      content,
      connection,
      editMode,
      cancelEditMode,
      onFileChange,
      displayFiles,
      displayImages
    } = this.props;
    return (
      <form onSubmit={onSubmit} className="chat-input-form">
        {editMode ? (
          <div className="edit-message">
            Message edit
            <button type="button" onClick={cancelEditMode}>
              <i className="fas fa-times" />
            </button>
          </div>
        ) : null}
        <div id="error-message"></div>
        <div className="chat-input-layout">
          <div className="chat-input">
            <TextareaAutosize
              type="text"
              placeholder="Write a message..."
              value={content}
              onChange={onChange}
            />
            <div>
              <input type="file" id="file" multiple onChange={onFileChange} />
              <label htmlFor="file">
                <i className="fas fa-camera-retro" />
              </label>
            </div>
          </div>
          {connection === "established" ||
          connection === "established hidden" ? (
            <button type="submit">
              <i className="fas fa-arrow-circle-right" />
            </button>
          ) : (
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          )}
        </div>
        <div className="add-files">
          {displayImages}
          {displayFiles}
        </div>
      </form>
    );
  }
}
