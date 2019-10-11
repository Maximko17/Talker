import React, { Component } from "react";
import "./header.css";
import { Popup } from "semantic-ui-react";
import { getUserInfo } from "../../popover/user-popover/user-popover";
import { connect } from "react-redux";
import classnames from "classnames";
import LoginPage from "../../modals/login-page/login-page";
import PublishModal from "../../modals/publish-modal/publish-modal";
import Notification from "./notification/last-notifications";
import Search from "./search/short-search";

class Header extends Component {
  toggleModal() {
    var modal = document.querySelector(".custom-modal");
    modal.classList.toggle("show-custom-modal");
  }

  getLogo(style) {
    if (this.props.isNewPostWriting) {
      return (
        <div
          className={classnames({
            "profile-header-logo": style === "profile",
            "default-header-logo": style === "default"
          })}
        >
          <div className="d-flex align-items-center">
            <div className="short-logo">T</div>
            <div className="draft">Draft</div>
            <div className="saving">{this.props.save_indicator}</div>
          </div>
        </div>
      );
    } else {
      return (
        <div
          className={classnames({
            "profile-header-logo": style === "profile",
            "default-header-logo": style === "default"
          })}
        >
          Talker
        </div>
      );
    }
  }

  buttons = (validToken, user, style = "default") => {
    if (validToken) {
      return (
        <div
          className={classnames({
            "profile-header-info": style === "profile",
            "default-header-info": style === "default"
          })}
        >
          {this.props.isNewPostWriting ? (
            <React.Fragment>
              {" "}
              <button
                className="publishPost-button"
                onClick={this.toggleModal.bind(this)}
              >
                Ready to publish?
              </button>
              <PublishModal
                toggleModal={this.toggleModal}
                post={this.props.post}
                onChange={this.props.onChange}
                addTags={this.props.addTags}
                addPreviewImage={this.props.addPreviewImage}
                deleteTag={this.props.deleteTag}
              />
            </React.Fragment>
          ) : null}
          {!this.props.without_search ? <Search style={style} /> : null}
          <Notification />
          <Popup
            content={getUserInfo(user)}
            trigger={
              <button className="userinfo-button">
                <img src={user.photo} alt="Img" />
              </button>
            }
            on="click"
            position="bottom center"
          />
        </div>
      );
    } else {
      return (
        <div
          className={classnames({
            "profile-header-info": style === "profile",
            "default-header-info": style === "default"
          })}
        >
          <Search />
          <button className="sign-in-button">Sign in</button>
          <button
            className={classnames({
              "profile-sign-up-button": style === "profile",
              "default-sign-up-button": style === "default"
            })}
            data-toggle="modal"
            data-target="#loginPage"
          >
            Get started
          </button>
          <LoginPage />
        </div>
      );
    }
  };

  render() {
    const { style, color } = this.props;
    const { validToken, user } = this.props.security;
    return (
      <div
        className={classnames({
          "profile-header": style === "profile",
          "default-header": style === "default"
        })}
        style={style === "profile" ? { background: color } : null}
      >
        <div className="header-content">
          {this.getLogo(style)}
          {this.buttons(validToken, user, style)}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  security: state.security
});

export default connect(
  mapStateToProps,
  null
)(Header);
