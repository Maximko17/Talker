import React, { Component } from "react";
import Header from "../main-components/header/header";
import "./new-post.css";
import { Popup } from "semantic-ui-react";
import MappleToolTip from "reactjs-mappletooltip";
import TextareaAutosize from "react-autosize-textarea";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { savePost, getPost } from "../actions/post-actions";

class NewPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      post: {
        id: null,
        title: "",
        subtitle: "",
        text: "",
        postImages: [],
        main_image: "",
        tags: [],
        isDraft: true
      },
      components: [],
      save_indicator: "",
      typing_timeout: null
    };

    this.onChange = this.onChange.bind(this);
    this.addImage = this.addImage.bind(this);
    this.addParagraph = this.addParagraph.bind(this);
    this.onElementFocus = this.onElementFocus.bind(this);
    this.onElementBlur = this.onElementBlur.bind(this);
    this.removeElement = this.removeElement.bind(this);
    this.changeSaveIndicator = this.changeSaveIndicator.bind(this);
    this.addPreviewImage = this.addPreviewImage.bind(this);
    this.addTags = this.addTags.bind(this);
    this.deleteTag = this.deleteTag.bind(this);
  }

  componentDidMount() {
    if (this.props.match.url !== "/new-post") {
      this.props.getPost(this.props.match.params.postId);
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      Object.keys(nextProps.post).length != 0 &&
      nextProps.post.id !== prevState.post.id
    ) {
      return {
        post: {
          ...prevState.post,
          id: nextProps.post.id,
          title: nextProps.post.title,
          subtitle: nextProps.post.subtitle,
          text: nextProps.post.text,
          tags: nextProps.post.tags
        },
        save_indicator: "Saved"
      };
    }
    return null;
  }

  // -------------------------------------------------- POST INFO -------------------------------------------------------//
  changeSaveIndicator(saved) {
    this.setState({
      save_indicator: saved ? "Saved" : "Saving..."
    });
  }

  onChange(e) {
    clearTimeout(this.state.typing_timeout);
    this.changeSaveIndicator(false);
    this.setState({
      post: {
        ...this.state.post,
        [e.target.name]: e.target.value
      },
      typing_timeout: setTimeout(() => {
        this.props.savePost(
          this.state.post,
          this.props.history,
          this.changeSaveIndicator,
          this.props.match.url
        );
      }, 1000)
    });
  }

  onInput(e) {
    // clearTimeout(this.state.typing_timeout);
    // this.changeSaveIndicator(false);
    this.setState(
      {
        post: {
          ...this.state.post,
          text: e.target.innerHTML
        }
        // typing_timeout: setTimeout(() => {
        //   this.props.savePost(
        //     this.state.post,
        //     this.props.history,
        //     this.changeSaveIndicator,
        //     this.props.match.url
        //   );
        // }, 1000)
      },
      () => {
        console.log(this.state.post.text);
      }
    );
  }

  addPreviewImage(main_image) {
    clearTimeout(this.state.typing_timeout);
    this.changeSaveIndicator(false);
    this.setState({
      post: {
        ...this.state.post,
        main_image
      },
      typing_timeout: setTimeout(() => {
        this.props.savePost(
          this.state.post,
          this.props.history,
          this.changeSaveIndicator,
          this.props.match.url
        );
      }, 500)
    });
  }

  addTags(newTag) {
    clearTimeout(this.state.typing_timeout);
    this.changeSaveIndicator(false);
    this.setState({
      post: {
        ...this.state.post,
        tags: [...this.state.post.tags, { tagName: newTag }]
      },
      typing_timeout: setTimeout(() => {
        this.props.savePost(
          this.state.post,
          this.props.history,
          this.changeSaveIndicator,
          this.props.match.url
        );
      }, 1000)
    });
  }
  deleteTag(tagToDel) {
    clearTimeout(this.state.typing_timeout);
    this.changeSaveIndicator(false);
    this.setState({
      post: {
        ...this.state.post,
        tags: this.state.post.tags.filter(tag => tag.tagName !== tagToDel)
      },
      typing_timeout: setTimeout(() => {
        this.props.savePost(
          this.state.post,
          this.props.history,
          this.changeSaveIndicator,
          this.props.match.url
        );
      }, 500)
    });
  }

  addImage(e) {
    let errorMessage = document.getElementById("error-message");
    let errors = [];
    const file = e.target.files[0];
    if (file.type == "image/png" || file.type == "image/jpeg") {
      if (file.size > 1000000) {
        errors.push(`File size ${file.name} esceeds 1MB.It will not be loaded`);
      } else {
        errorMessage.innerHTML = "";
        this.handleFiles(file);
      }
    } else {
      errors.push(
        `File type ${file.name} not valid.Valid file types: PNG and JPG/JPEG`
      );
    }
    errorMessage.innerHTML = errors;
  }

  addParagraph() {
    const { components } = this.state;
    const paragraphId = components.length;
    this.setState({
      ...this.state,
      components: [
        ...components,
        <div className="add-paragraph" key={paragraphId}>
          {/* <div>
            <button
              type="button"
              id={`deleteParagraph${paragraphId}`}
              className="delete-element-button"
              onClick={() => this.removeElement(paragraphId, "paragraph")}
            >
              <i className="far fa-trash-alt" />
            </button>
          </div> */}
          <div className="points">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </div>
        </div>
      ]
    });
  }

  removeElement(index, elemType) {
    const { components, post } = this.state;
    if (elemType === "image") {
      components.splice(index, 1);
      post.postImages.splice(index, 1);
      this.setState({
        post: {
          ...post,
          images: post.postImages
        },
        components: components
      });
    } else {
      components.splice(index, 1);
      this.setState({
        components: components
      });
    }
  }

  handleFiles(file) {
    const { post, components } = this.state;
    const index = components.length;
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.setState({
        post: {
          ...post,
          postImages: [
            ...post.postImages,
            {
              file: file,
              description: "",
              alt: "Image"
            }
          ]
        },
        components: [
          ...components,
          <Popup
            trigger={
              <div
                className="add-image"
                onFocus={() => this.onElementFocus(index)}
                onBlur={() => this.onElementBlur(index)}
                id={`image${index}`}
                contentEditable={false}
              >
                <div>
                  <img src={reader.result} tabIndex="-1" />
                </div>
                <input
                  type="text"
                  id={`imageDescr${index}`}
                  placeholder="Type caption for image (optional)"
                />
              </div>
            }
            key={index}
            content={
              <div className="image-popup">
                <button
                  type="button"
                  onClick={() => this.removeElement(index, "image")}
                >
                  <i className="far fa-trash-alt" />
                </button>
              </div>
            }
            position="top center"
            on="click"
          />
        ]
      });
    };
  }

  //------------------------------------------------------TEXT DECORATION---------------------------------------------------------//
  onElementFocus(elementId) {
    console.log("FOCUS");
    const img = document.getElementById(`image${elementId}`);
    const imgDescr = document.getElementById(`imageDescr${elementId}`);
    imgDescr.style.visibility = "visible";
    img.style.border = "3px solid #03a87c";
  }
  onElementBlur(elementId) {
    console.log("BLUR");
    const img = document.getElementById(`image${elementId}`);
    const imgDescr = document.getElementById(`imageDescr${elementId}`);
    imgDescr.style.visibility = "hidden";
    img.style = "null";
  }

  onKeyPress(e) {
    if (e.key == "Enter") {
      document.execCommand("formatBlock", false, "p");
      return false;
    }
  }
  makeBold() {
    // var listId = window.getSelection().getRangeAt(0).startContainer.parentNode;
    // listId.style = "padding-left: 20px; border-left: 2px solid black";

    document.execCommand("bold", false, null);
    document.execCommand("italic", false, null);
  }
  selectionIsBold() {
    var isBold = false;
    if (document.queryCommandState) {
      isBold = document.queryCommandState("bold");
    }
    return isBold;
  }

  onSelect() {
    if (this.selectionIsBold()) {
      console.log("bold");
    } else {
      console.log("no");
    }
  }

  render() {
    const { title, subtitle } = this.state.post;
    const { save_indicator } = this.state;
    const { components } = this.state;
    return (
      <div>
        <Header
          style={"default"}
          post={this.state.post}
          onChange={this.onChange}
          isNewPostWriting={true}
          save_indicator={save_indicator}
          addTags={this.addTags}
          addPreviewImage={this.addPreviewImage}
          deleteTag={this.deleteTag}
          without_search={true}
        />
        <div className="new-post-layout" id="parend-div">
          <TextareaAutosize
            type="text"
            name="title"
            className="add-title"
            placeholder="Title"
            value={title}
            onChange={this.onChange}
            autoFocus={true}
          />
          <TextareaAutosize
            type="text"
            name="subtitle"
            className="add-subtitle"
            placeholder="Subtitle(optional)"
            value={subtitle}
            onChange={this.onChange}
          />

          <div
            contentEditable={true}
            onInput={this.onInput.bind(this)}
            onKeyPress={this.onKeyPress.bind(this)}
            onSelect={this.onSelect.bind(this)}
            suppressContentEditableWarning={true}
            className="editableArea"
          >
            {components.map(item => {
              return item;
            })}
          </div>

          <ToolKit
            length={components.length}
            addText={this.addText}
            addImage={this.addImage}
            addParagraph={this.addParagraph}
            makeBold={this.makeBold.bind(this)}
          />
          <div id="error-message" />
        </div>
      </div>
    );
  }
}

NewPost.propTypes = {
  getPost: PropTypes.func.isRequired,
  savePost: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  post: state.post.post
});
export default connect(
  mapStateToProps,
  { getPost, savePost }
)(NewPost);

class ToolKit extends Component {
  render() {
    const { length, addText, addImage, addParagraph, makeBold } = this.props;
    return (
      <div className="start-kit">
        <p>{length === 0 ? "What will be first?" : "What will be next?"}</p>
        <MappleToolTip>
          <button type="button" onClick={makeBold}>
            B
          </button>
          <div>Bold</div>
        </MappleToolTip>
        <MappleToolTip>
          <div>
            <label htmlFor="file">
              <i className="far fa-image" />
            </label>
            <input
              type="file"
              id="file"
              name="file"
              accept="image/*"
              onChange={addImage}
            />
          </div>
          <div>Image</div>
        </MappleToolTip>
        <MappleToolTip>
          <button type="button" onClick={addParagraph}>
            --
          </button>
          <div>Paragraph</div>
        </MappleToolTip>
      </div>
    );
  }
}

export { ToolKit };
