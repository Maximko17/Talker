import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Header from "../../main-components/header/header";
import "./edit-profile.css";
import { getUserProfile, editUserProfile } from "../../actions/user-actions";
import { Popup } from "semantic-ui-react";

class EditUserProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {}
    };
  }

  componentDidMount() {
    const { usermail } = this.props.match.params;
    this.props.getUserProfile(usermail);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user) {
      this.setState({
        user: { ...nextProps.user }
      });
    }
  }

  onSubmit(e) {
    e.preventDefault();
    const { user } = this.state;
    const { history } = this.props;

    this.props.editUserProfile(user, history);
  }

  onChange(e) {
    this.setState({
      user: {
        ...this.state.user,
        [e.target.name]: e.target.value
      }
    });
  }

  changeUserPhoto(e) {
    var reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById("userPhoto").src = e.target.result;
    };
    reader.readAsDataURL(e.target.files[0]);

    this.setState({
      user: {
        ...this.state.user,
        photo: e.target.files[0]
      }
    });
  }

  checkURL(word, input) {
    if (input != null) {
      if (input.indexOf(word) != -1 && input.indexOf("https") != -1) {
        return <i className="fas fa-check" />;
      } else {
        return <i className="fas fa-times" />;
      }
    } else {
      return null;
    }
  }

  changeTheme(color) {
    this.setState({
      user: {
        ...this.state.user,
        profileTheme: color
      }
    });
  }

  render() {
    const { user } = this.state;
    const { history } = this.props;
    return (
      <div>
        <Header style={"profile"} color={user.profileTheme} />
        <form
          className="user-content"
          style={{ background: user.profileTheme }}
          onSubmit={this.onSubmit.bind(this)}
        >
          <div className="user-info">
            <input
              type="text"
              name="name"
              placeholder="Write your name"
              className="edit-username"
              value={user.name}
              onChange={this.onChange.bind(this)}
              autoFocus={true}
            />
            <textarea
              type="text"
              name="description"
              placeholder="Write short bio about yourself"
              className="edit-description"
              value={user.description}
              onChange={this.onChange.bind(this)}
            />
            <p className="socials-title">
              Link to yourself in other social networks.
            </p>
            <SocialLinks
              user={user}
              onChange={this.onChange.bind(this)}
              checkURL={this.checkURL}
            />
            <button className="save-button" type="submit">
              Save
            </button>
            <button
              className="cancel-button"
              onClick={() => history.push(`/profile/${user.email}`)}
            >
              Cancel
            </button>
          </div>
          <div className="edit-user-photo">
            <img
              src={
                user.photo
              }
              alt="Img"
              id="userPhoto"
            />
            <label htmlFor="file" className="edit-user-photo-button">
              <i className="fas fa-camera" />
            </label>
            <input
              type="file"
              id="file"
              name="photo"
              onChange={this.changeUserPhoto.bind(this)}
            />
          </div>
        </form>
        <div className="profile-themes">
          <p>Profile themes:</p>
          <button
            onClick={() => this.changeTheme("#f5a30c")}
            style={{ background: "#f5a30c" }}
          />
          <button
            onClick={() => this.changeTheme("#6a0bff")}
            style={{ background: "#6a0bff" }}
          />
          <button
            onClick={() => this.changeTheme("#04c260")}
            style={{ background: "#04c260" }}
          />
          <button
            onClick={() => this.changeTheme("#bf062e")}
            style={{ background: "#bf062e" }}
          />
          <button
            onClick={() => this.changeTheme("#bd0bb7")}
            style={{ background: "#bd0bb7" }}
          />
          <button
            onClick={() => this.changeTheme("#363636")}
            style={{ background: "#363636" }}
          />
          <button
            onClick={() => this.changeTheme("#1583c2")}
            style={{ background: "#1583c2" }}
          />
        </div>
      </div>
    );
  }
}

EditUserProfile.propTypes = {
  getUserProfile: PropTypes.func.isRequired,
  editUserProfile: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  security: state.security,
  user: state.user.user
});

export default connect(
  mapStateToProps,
  { getUserProfile, editUserProfile }
)(EditUserProfile);

class SocialLinks extends Component {
  render() {
    const { user } = this.props;
    return (
      <div className="profile-user-socials">
        <Popup
          trigger={
            <a
              href={"#"}
              onClick={() => {
                return false;
              }}
            >
              <i className="fab fa-facebook-square" />
            </a>
          }
          flowing
          hoverable
        >
          <div className="socials-info">
            <p>Link to your Facebook profile</p>
            <div className="d-flex">
              <input
                type="text"
                name="facebookURL"
                placeholder="Url"
                value={user.facebookURL}
                onChange={this.props.onChange}
              />
              {this.props.checkURL("facebook.com", user.facebookURL)}
            </div>
          </div>
        </Popup>

        <Popup
          trigger={
            <a href={"#"}>
              <i className="fab fa-twitter" />
            </a>
          }
          flowing
          hoverable
        >
          <div className="socials-info">
            <p>Link to your Twitter profile</p>
            <div className="d-flex">
              <input
                type="text"
                name="twitterURL"
                placeholder="Url"
                value={user.twitterURL}
                onChange={this.props.onChange}
              />
              {this.props.checkURL("twitter.com", user.twitterURL)}
            </div>
          </div>
        </Popup>

        <Popup
          trigger={
            <a href={"#"}>
              <i className="fab fa-instagram" />
            </a>
          }
          flowing
          hoverable
        >
          <div className="socials-info">
            <p>Link to your Instagram profile</p>
            <div className="d-flex">
              <input
                type="text"
                name="instagramURL"
                placeholder="Url"
                value={user.instagramURL}
                onChange={this.props.onChange}
              />
              {this.props.checkURL("instagram.com", user.instagramURL)}
            </div>
          </div>
        </Popup>

        <Popup
          trigger={
            <a href={"#"}>
              <i className="fab fa-vk" />
            </a>
          }
          flowing
          hoverable
        >
          <div className="socials-info">
            <p>Link to your Vk profile</p>
            <div className="d-flex">
              <input
                type="text"
                name="vkontakteURL"
                placeholder="Url"
                value={user.vkontakteURL}
                onChange={this.props.onChange}
              />
              {this.props.checkURL("vk.com", user.vkontakteURL)}
            </div>
          </div>
        </Popup>
      </div>
    );
  }
}

export { SocialLinks };
