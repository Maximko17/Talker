import React, { Component } from "react";
import Post from "../user-profile/posts/post";
import Header from "../main-components/header/header";
import "./full-tags.css";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getPostsByTag } from "../actions/tag-actions";
import Archive from "./archive/archive";

class FullTags extends Component {
  constructor(props) {
    super(props);

    this.state = {
      current_tab: "top-stories",
      current_sort_name: "Sort by oldest",
      current_sort: "totalLikes",
      current_direction: "desc"
    };

    this.getScrollAction = this.getScrollAction.bind(this);
    this.changeSort = this.changeSort.bind(this);
  }

  componentDidMount() {
    const { tagname } = this.props.match.params;
    this.props.getPostsByTag(tagname, 2, "totalLikes", "desc");
  }

  componentDidUpdate(prevPorops, prevState) {
    const { current_sort_name, current_sort, current_direction } = this.state;
    const { tagname } = this.props.match.params;

    if (current_sort_name != prevState.current_sort_name) {
      this.props.getPostsByTag(tagname, 3, current_sort, current_direction);
    }
  }

  changeSort(sort_name, sort_type, direction) {
    this.setState({
      current_sort_name: sort_name,
      current_sort: sort_type,
      current_direction: direction
    });
  }

  changeTab(tab_name) {
    this.setState({
      current_tab: tab_name
    });
  }

  getScrollAction(size) {
    const { current_sort, current_direction } = this.state;
    const { tagname } = this.props.match.params;

    this.props.getPostsByTag(tagname, size, current_sort, current_direction);
  }

  render() {
    const { tagname } = this.props.match.params;
    const { current_tab } = this.state;
    const { history, posts } = this.props;
    return (
      <div>
        <Header style={"default"} />
        <div className="full-tags">
          <div className="tag-title">
            <p>TAGGED IN</p>
            <p>{tagname}</p>
          </div>
          <div className="content">
            <div className="related-tags">
              <p className="related-tags-title">Related tags</p>
            </div>
            <div className="tags-posts">
              <div className="tags-tabs">
                <button
                  className={
                    current_tab === "top-stories" ? "tab-active" : null
                  }
                  onClick={() => this.changeTab("top-stories")}
                >
                  Top stories
                </button>
                <button
                  className={current_tab === "archive" ? "tab-active" : null}
                  onClick={() => this.changeTab("archive")}
                >
                  Archive
                </button>
              </div>
              {current_tab === "archive" ? (
                <Archive
                  tagname={tagname}
                  current_sort_name={this.state.current_sort_name}
                  changeSort={this.changeSort}
                />
              ) : null}
              {
                <Post
                  history={history}
                  posts={posts}
                  fromWhere={"posts"}
                  showtitles={false}
                  action={this.getScrollAction}
                />
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

FullTags.propTypes = {
  getPostsByTag: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  posts: state.post.posts,
  security: state.security
});
export default connect(
  mapStateToProps,
  { getPostsByTag }
)(FullTags);
