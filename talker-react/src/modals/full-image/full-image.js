import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./full-image.css";
import { messagesTime } from "../../utils/date-utils";

class FullImage extends Component {
  componentDidMount() {
    window.addEventListener("click", this.windowOnClick.bind(this));
  }
  windowOnClick(event) {
    var modal = document.querySelector(".custom-modal");
    if (event.target === modal) {
      //   this.props.toggleModal();
    }
  }

  render() {
    const { image, message } = this.props;
    let fileName = "";
    if (image != null) {
      fileName = message.files[image].fileName;
    }
    return (
      <div className="custom-modal">
        <div className="full-image-content">
          <div className="image">
            <img src={fileName} alt="full-img" />
          </div>
          <div className="info">
            <div className="username">
              <img src={message.user && message.user.photo} alt="user img" />
              <div>
                <Link to={`/profile/${message.user && message.user.email}`}>
                  {message.user && message.user.name}
                </Link>
                <span className="date">{messagesTime(message.date)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default FullImage;
