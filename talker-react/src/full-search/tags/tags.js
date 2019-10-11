import React, { Component } from "react";
import "./tags.css";
import { Link } from "react-router-dom";

class Tags extends Component {
  render() {
    const { tags } = this.props;
    return (
      <div className="search-tags">
        {tags.content &&
          tags.content.map(({ id, tagName }) => {
            return (
              <Link to={`/tag/${tagName}`} key={id}>
                {tagName}
              </Link>
            );
          })}
      </div>
    );
  }
}
export default Tags;
