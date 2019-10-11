import React, { Component } from "react";
import "./full-search.css";
import Header from "../main-components/header/header";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  getPostsBySearch,
  getUsersBySearch,
  getTagsBySearch
} from "../actions/search-actions";
import SearchPosts from "./posts/posts";
import Users from "./users/users";
import Tags from "./tags/tags";

class FullSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      is_empty: true,
      typing_timeout: null,
      search_tab: "posts",
      input: ""
    };
    this.onChange = this.onChange.bind(this);
    this.changeTab = this.changeTab.bind(this);
    this.scrollPostsAction = this.scrollPostsAction.bind(this);
    this.scrollUsersAction = this.scrollUsersAction.bind(this);
    this.scrollTagsAction = this.scrollTagsAction.bind(this);
  }

  componentDidMount() {
    const { state } = this.props.location;
    if (state) {
      this.setState({
        search_tab: state.section,
        input: state.input
      });
      this.search(state.input);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.search_tab !== this.state.search_tab) {
      this.search(this.state.input);
    }
  }

  onChange(e) {
    clearTimeout(this.state.typing_timeout);
    this.setState({
      input: e.target.value,
      typing_timeout: setTimeout(() => {
        this.search(this.state.input);
      }, 1000)
    });
  }

  search(input) {
    const { search_tab } = this.state;
    this.setState({
      is_empty: false
    });
    if (input.trim() != "") {
      switch (search_tab) {
        case "posts":
          this.props.getPostsBySearch(input, 3, false);
          this.props.getUsersBySearch(input, 10, false);
          this.props.getTagsBySearch(input, 10);
          break;
        case "people":
          this.props.getUsersBySearch(input, 10, false);
          break;
        case "tags":
          this.props.getTagsBySearch(input, 10);
          break;
      }
    } else {
      this.setState({
        is_empty: true
      });
    }
  }

  changeTab(tab_name) {
    this.setState({
      search_tab: tab_name
    });
  }

  scrollPostsAction(size) {
    const { input } = this.state;
    this.props.getPostsBySearch(input, size, false);
  }
  scrollUsersAction(size) {
    const { input } = this.state;
    this.props.getUsersBySearch(input, size, false);
  }
  scrollTagsAction(size) {
    const { input } = this.state;
    this.props.getTagsBySearch(input, size);
  }

  render() {
    const { input, search_tab, is_empty } = this.state;
    const { history, posts, users, tags, security } = this.props;
    return (
      <div>
        <Header style={"default"} without_search={true} />
        <div className="full-search-layout">
          <div className="full-search-input">
            <input
              type="text"
              placeholder="Search in Talker"
              value={input}
              onChange={this.onChange}
            />
          </div>

          {!is_empty ? (
            <React.Fragment>
              <div className="search-tabs">
                <button
                  type="button"
                  className={
                    search_tab === "posts" ? "tab-button-active" : "tab-button"
                  }
                  onClick={() => this.changeTab("posts")}
                >
                  Posts
                </button>
                <button
                  type="button"
                  className={
                    search_tab === "people" ? "tab-button-active" : "tab-button"
                  }
                  onClick={() => this.changeTab("people")}
                >
                  People
                </button>
                <button
                  type="button"
                  className={
                    search_tab === "tags" ? "tab-button-active" : "tab-button"
                  }
                  onClick={() => this.changeTab("tags")}
                >
                  Tags
                </button>
              </div>

              {search_tab === "posts" ? (
                <SearchPosts
                  history={history}
                  security={security}
                  posts={posts}
                  users={users}
                  tags={tags}
                  scrollPostsAction={this.scrollPostsAction}
                />
              ) : null}
              {search_tab === "people" ? (
                <div className="found-items">
                  <Users
                    history={history}
                    security={security}
                    users={users}
                    scrollUsersAction={this.scrollUsersAction}
                  />
                </div>
              ) : null}

              {search_tab === "tags" ? (
                <div className="found-items">
                  <Tags tags={tags} scrollTagsAction={this.scrollTagsAction} />
                </div>
              ) : null}
            </React.Fragment>
          ) : null}
        </div>
      </div>
    );
  }
}

FullSearch.propTypes = {
  getPostsBySearch: PropTypes.func.isRequired,
  getUsersBySearch: PropTypes.func.isRequired,
  getTagsBySearch: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  tags: state.search.tags,
  posts: state.post.posts,
  users: state.user.users,
  security: state.security
});

export default connect(
  mapStateToProps,
  { getPostsBySearch, getUsersBySearch, getTagsBySearch }
)(FullSearch);
