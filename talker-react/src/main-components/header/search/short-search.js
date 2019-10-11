import React, { Component } from "react";
import "./short-search.css";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import SearchPopover from "../../../popover/search-popover/search-popover";
import {
  getPostsBySearch,
  getUsersBySearch,
  getTagsBySearch
} from "../../../actions/search-actions";
import { Redirect } from "react-router-dom";

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search_mode: false,
      input: "",
      riderect: false,
      url: "",
      section: ""
    };

    this.onChange = this.onChange.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.redirect = this.redirect.bind(this);
  }

  onClick() {
    const { search_mode, input } = this.state;
    if (input.trim() == "") {
      this.setState({
        search_mode: !search_mode
      });
    }
  }
  onBlur() {
    const { input } = this.state;
    if (input.trim() == "") {
      this.setState({
        search_mode: false
      });
    }
  }
  onChange(e) {
    this.setState(
      {
        input: e.target.value
      },
      () => {
        this.props.getPostsBySearch(this.state.input, 3, true);
        this.props.getUsersBySearch(this.state.input, 3, true);
        this.props.getTagsBySearch(this.state.input, 3);
      }
    );
  }

  redirect(type, to, section) {
    let url = "";
    switch (type) {
      case "ALL":
        url = `/search`;
        break;
      case "MORE_USERS":
        url = `/search`;
        break;
      case "MORE_POSTS":
        url = `/search`;
        break;
      case "MORE_TAGS":
        url = `/search`;
        break;
      case "POST":
        url = `/post/${to}`;
        break;
      case "USER":
        url = `/profile/${to}`;
        break;
      case "TAG":
        url = `/tag/${to}`;
        break;
    }
    this.setState({
      redirect: true,
      section: section,
      url: url
    });
  }

  render() {
    const { input, search_mode, redirect, url, section } = this.state;
    const { users, posts, tags } = this.props.search;
    const { style } = this.props;
    if (redirect) {
      return (
        <Redirect push to={{ pathname: url, state: { input, section } }} />
      );
    }
    return (
      <div className="short-search">
        <button type="buton" className="search-button" onClick={this.onClick}>
          <i className="fas fa-search" />
        </button>
        <input
          type="text"
          placeholder="Search in Talker"
          className={search_mode ? "search-input-active" : "search-input"}
          value={input}
          onChange={this.onChange}
          onBlur={this.onBlur}
          autoFocus={true}
          style={
            style === "default"
              ? { borderBottom: " 1px solid black" }
              : { borderBottom: " 1px solid white", color: "white" }
          }
        />
        {search_mode && input.trim() != "" ? (
          <SearchPopover
            input={input}
            users={users}
            posts={posts}
            tags={tags}
            redirectTo={this.redirect}
          />
        ) : null}
      </div>
    );
  }
}

Search.propTypes = {
  getPostsBySearch: PropTypes.func.isRequired,
  getUsersBySearch: PropTypes.func.isRequired,
  getTagsBySearch: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  search: state.search
});

export default connect(
  mapStateToProps,
  { getPostsBySearch, getUsersBySearch, getTagsBySearch }
)(Search);
