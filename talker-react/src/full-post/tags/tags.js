import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./tags.css";

class Tags extends Component {
  showTags(tags) {
    return tags.map(tag => {
      return (
        <Link to={"/tag/" + tag.tagName} key={tag.id}>
          {tag.tagName}
        </Link>
      );
    });
  }

  render() {
    const { tags } = this.props;
    return <div className="full-post-tags">{tags && this.showTags(tags)}</div>;
  }
}
export default Tags;
