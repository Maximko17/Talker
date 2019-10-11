import React, { Component } from "react";
import "./publish-modal.css";
import TextareaAutosize from "react-autosize-textarea";
import DragAndDrop from "./drag-and-drop/drag-and-drop";
import { getTagsBySearch } from "../../actions/search-actions";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ContentEditable from "react-contenteditable";
import TagPopover from "../../popover/tag-popover/tag-popover";

class PublishModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tag: "",
      searchMode: false
    };

    this.onPostSubmit = this.onPostSubmit.bind(this);
    this.newTag = this.newTag.bind(this);
    this.addTags = this.addTags.bind(this);
  }

  componentDidMount() {
    window.addEventListener("click", this.windowOnClick.bind(this));
  }
  windowOnClick(event) {
    var modal = document.querySelector(".custom-modal");
    if (event.target === modal) {
      this.props.toggleModal();
    }
  }
  onPostSubmit() {
    const { post } = this.props;
    console.log(post);
    // this.props.savePost(post);
  }
  newTag(evt) {
    const tag = evt.target.value;
    if (tag.slice(-6) === "&nbsp;") {
      return this.addTags(tag.split("&")[0]);
    } else {
      if (tag.trim() === "") {
        return this.setState({ tag: "", searchMode: false });
      }
      return this.setState({ tag: tag, searchMode: true }, () =>
        this.props.getTagsBySearch(this.state.tag, 5)
      );
    }
  }

  addTags(newTag) {
    if (newTag.trim() !== "") {
      if (
        this.props.post.tags.filter(
          tag => tag.tagName.toLowerCase() === newTag.toLowerCase()
        ).length == 0
      )
        this.props.addTags(newTag);
      return this.setState({
        tag: "",
        searchMode: false
      });
    }
  }

  render() {
    const {
      onChange,
      found_tags,
      addPreviewImage,
      deleteTag,
      post
    } = this.props;
    const { title, subtitle } = this.props.post;
    const { searchMode } = this.state;
    return (
      <div className="custom-modal">
        <div id="publish-modal">
          <div className="post-preview">
            <p>Post preview</p>
            <DragAndDrop addPreviewImage={addPreviewImage} />
            <TextareaAutosize
              type="text"
              name="title"
              className="title-preview"
              placeholder="Write a preview title"
              value={title}
              onChange={onChange}
            />
            <TextareaAutosize
              type="text"
              name="subtitle"
              placeholder="Write a preview subtitle..."
              className="subtitle-preview"
              value={subtitle}
              onChange={onChange}
            />
          </div>

          <div className="more-info">
            <div className="post-tags">
              <p>
                Add or change tags (up to 5) so readers know what your story is
                about
              </p>
              <div className="add-tags">
                {post.tags.map((tag, index) => {
                  return (
                    <div className="add-tag" key={index}>
                      <span>{tag.tagName}</span>
                      <button
                        type="button"
                        onClick={() => deleteTag(tag.tagName)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  );
                })}
                <ContentEditable
                  html={this.state.tag}
                  disabled={false}
                  className={"new-tag"}
                  onChange={this.newTag}
                />
                <TagPopover
                  searchMode={searchMode}
                  tags={found_tags}
                  addTags={this.addTags}
                />
              </div>
            </div>
            <div className="text-left mt-5">
              <button
                type="submit"
                className="publish"
                data-dismiss="modal"
                onClick={this.onPostSubmit.bind(this)}
              >
                Publish now
              </button>
              <button
                type="button"
                className="publish-cancel"
                onClick={this.props.toggleModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
PublishModal.propTypes = {
  getTagsBySearch: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  found_tags: state.search.tags
});

export default connect(
  mapStateToProps,
  { getTagsBySearch }
)(PublishModal);
