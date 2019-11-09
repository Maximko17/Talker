import React, { Component } from "react";
import "./drag-and-drop.css";

export default class DragAndDrop extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isImage: false
    };

    this.onChange = this.onChange.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onDeleteImage = this.onDeleteImage.bind(this);
  }

  onChange(e) {
    this.checkFileErrors(e.target.files[0]);
  }

  onDeleteImage() {
    this.props.deleteImage();
    this.setState({
      isImage: false
    });
  }

  handleFiles(file) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function() {
      let img = document.getElementById("image");
      img.src = reader.result;
    };
    this.setState({
      isImage: true
    });
    this.props.addPreviewImage(file);
  }

  checkFileErrors(file) {
    let dropMessage = document.getElementById("message");
    let errors = [];

    if (file.type == "image/png" || file.type == "image/jpeg") {
      if (file.size > 1000000) {
        errors.push(`File size ${file.name} esceeds 1МБ.It will notbe loaded`);
      } else {
        dropMessage.innerHTML = "";
        this.handleFiles(file);
      }
    } else {
      errors.push(
        `File type ${file.name} not valid.Valid file types: PNG and JPG/JPEG`
      );
    }

    dropMessage.innerHTML = errors;
  }

  onDragEnter(e) {
    let dropArea = document.getElementById("drop-area");

    e.preventDefault();
    e.stopPropagation();

    dropArea.classList.add("highlight");
  }
  onDragOver(e) {
    let dropArea = document.getElementById("drop-area");

    e.preventDefault();
    e.stopPropagation();

    dropArea.classList.add("highlight");
  }
  onDragLeave(e) {
    let dropArea = document.getElementById("drop-area");

    e.preventDefault();
    e.stopPropagation();

    dropArea.classList.remove("highlight");
  }
  onDrop(e) {
    let dropArea = document.getElementById("drop-area");

    e.preventDefault();
    e.stopPropagation();

    dropArea.classList.remove("highlight");
    let dt = e.dataTransfer;
    let files = dt.files;

    this.checkFileErrors(files[0]);
  }

  render() {
    const { isImage } = this.state;
    const { initialImage } = this.props;
    return (
      <div
        className="img-preview"
        id="drop-area"
        onDrop={this.onDrop}
        onDragEnter={this.onDragEnter}
        onDragOver={this.onDragOver}
        onDragLeave={this.onDragLeave}
      >
        {initialImage == null && !isImage ? (
          <div>
            <p>
              Upload a high-quality image using the file selection dialog or
              dragging the desired image to the selected area
            </p>
            <input
              type="file"
              id="fileElem"
              accept="image/*"
              onChange={this.onChange}
            />
            <label className="button" htmlFor="fileElem">
              <i className="fas fa-upload" />
              Upload image
            </label>
          </div>
        ) : (
          <div id="gallery">
            <img src={initialImage} alt="banner_image" id="image" />
            <div className="image-actions">
              <button type="button" onClick={this.onDeleteImage}>
                <i className="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
        )}

        <div id="message" />
      </div>
    );
  }
}
