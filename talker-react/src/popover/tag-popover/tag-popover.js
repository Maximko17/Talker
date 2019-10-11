import React, { Component } from "react";
import "./tag-popover.css";

class TagPopover extends Component {
  render() {
    const { tags, searchMode, addTags } = this.props;
    if (tags.content == undefined || tags.content.length === 0 || !searchMode) {
      return null;
    }
    return (
      <div className="tag-popover">
        <div className="popover-arrow"></div>
        <div className="tag-popover-content">
          {tags.content.map(({ tagName, mentionsCount }, index) => {
            return (
              <div
                className="found-tag"
                key={index}
                onClick={() => addTags(tagName)}
              >
                {`${tagName}(${mentionsCount})`}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
export default TagPopover;
