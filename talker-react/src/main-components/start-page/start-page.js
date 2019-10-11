import React, { Component } from "react";
import Header from "../header/header";
import "./start-page.css";
import { connect } from "react-redux";
import RecommendStories from "../../full-post/recommend-stories/recommend-stories";

class StartPage extends Component {
  render() {
    const { security } = this.props;
    return (
      <div>
        <Header style={"default"} />
        {!security.validToken ? (
          <div className="start-page">
            <p>Welcome to Talker</p>
            <p>Please login or register to open all possibilities</p>
            <span>(If you are already logged in just reload the page)</span>
          </div>
        ) : (
          <div>
            <RecommendStories postId={null} />
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  security: state.security
});
export default connect(
  mapStateToProps,
  {}
)(StartPage);
