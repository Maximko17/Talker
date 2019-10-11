import React, { Component } from "react";
import { Redirect } from "react-router-dom";

export default class OAuth2RedirectHandler extends Component {
  getUrlParameter(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");

    var results = regex.exec(this.props.location.search);
    return results === null
      ? ""
      : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  render() {
    const accessToken = this.getUrlParameter("accessToken");
    const refreshToken = this.getUrlParameter("refreshToken");
    const error = this.getUrlParameter("error");

    if (accessToken && refreshToken) {
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);
      return (
        <Redirect
          to={{
            pathname: "/",
            state: { from: this.props.location }
          }}
        />
      );
    } else {
      return (
        <Redirect
          to={{
            pathname: "/?error",
            state: {
              from: this.props.location,
              error: error
            }
          }}
        />
      );
    }
  }
}
