import React, { Component } from "react";
import TextareaAutosize from "react-autosize-textarea";

export default class General extends Component {
  constructor(props) {
    super(props);
    this.state = {
      group: {
        id: "",
        uri: "",
        name: "",
        image: "",
        topic: "",
        type: "",
        description: ""
      }
    };

    this.onGeneralInfoChange = this.onGeneralInfoChange.bind(this);
    this.addGroupImage = this.addGroupImage.bind(this);
    this.deleteGroupImage = this.deleteGroupImage.bind(this);
    this.onImageChange = this.onImageChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.group.id !== prevState.group.id) {
      return {
        group: {
          id: nextProps.group.id,
          uri: nextProps.group.uri,
          name: nextProps.group.name,
          topic: nextProps.group.topic,
          type: nextProps.group.type,
          description: nextProps.group.description,
          image: nextProps.group.image
        }
      };
    } else return null;
  }

  handleFiles(file) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function() {
      let img = document.getElementById("img");
      img.src = reader.result;
    };
    this.addGroupImage(file);
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

  onGeneralInfoChange(e) {
    this.setState({
      group: {
        ...this.state.group,
        [e.target.name]: e.target.value
      }
    });
  }
  addGroupImage(image) {
    this.setState({
      group: {
        ...this.state.group,
        image
      }
    });
  }
  deleteGroupImage() {
    this.setState({
      group: {
        ...this.state.group,
        image:
          "https://talker-basket.s3.us-east-2.amazonaws.com/groups/default-image.jpg"
      }
    });
  }
  onImageChange(e) {
    this.checkFileErrors(e.target.files[0]);
  }

  onSubmit(e) {
    e.preventDefault();
    this.props.editGroup(this.state.group);
  }

  render() {
    const { name, topic, type, uri, description, image } = this.state.group;
    return (
      <form className="group-section" onSubmit={this.onSubmit}>
        <div className="section-header">
          <div className="tab">General information</div>
        </div>
        <div className="section-content">
          <div className="group-photo">
            <img src={image} alt="group_img" id="img" />
            <input
              type="file"
              id="group_img"
              name="image"
              accept="image/*"
              onChange={this.onImageChange}
            />
            <label htmlFor="group_img" className="group-photo-upload">
              <i className="fas fa-file-upload"></i>
              <span>Refresh image</span>
            </label>
            <label htmlFor="group_img" className="group-photo-remove">
              <button type="button" onClick={this.deleteGroupImage}>
                <i className="fas fa-times"></i>
              </button>
            </label>
          </div>
          <div className="input-form">
            <div className="group-input">
              <div className="title">Name:</div>
              <input
                type={"text"}
                placeholder={""}
                name={"name"}
                onChange={this.onGeneralInfoChange}
                value={name}
              />
            </div>
            <div className="group-input">
              <div className="title">Topic:</div>
              <input
                type={"text"}
                placeholder={""}
                name={"topic"}
                onChange={this.onGeneralInfoChange}
                value={topic}
              />
            </div>
            <div className="group-input">
              <div className="title">Description:</div>
              <TextareaAutosize
                type={"text"}
                placeholder={""}
                name={"description"}
                onChange={this.onGeneralInfoChange}
                value={description}
              />
            </div>
            <div className="group-input">
              <div className="title">Group type:</div>
              <select
                type={"text"}
                name={"type"}
                onChange={this.onGeneralInfoChange}
                value={type}
              >
                <option value="OPEN">Open</option>
                <option value="CLOSE">Close</option>
              </select>
            </div>
            <div className="group-input">
              <div className="title">Page address:</div>
              <input
                type={"text"}
                name={"uri"}
                onChange={this.onGeneralInfoChange}
                value={uri}
              />
            </div>
          </div>
        </div>
        <div className="section-footer">
          <button type="submit">Save</button>
        </div>
      </form>
    );
  }
}
