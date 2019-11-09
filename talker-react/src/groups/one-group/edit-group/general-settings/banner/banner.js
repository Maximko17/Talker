import React, { Component } from "react";
import DragAndDrop from "../../../../../modals/publish-modal/drag-and-drop/drag-and-drop";

export default class Banner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      banner: {
        id: null,
        image: null,
        shortMessage: "",
        instLink: ""
      }
    };

    this.onBannerInfoChange = this.onBannerInfoChange.bind(this);
    this.addBannerImage = this.addBannerImage.bind(this);
    this.deleteBannerImage = this.deleteBannerImage.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.banner != null) {
      if (nextProps.banner.id !== prevState.banner.id) {
        return {
          banner: nextProps.banner
        };
      }
    } else return null;
  }

  onBannerInfoChange(e) {
    this.setState({
      banner: {
        ...this.state.banner,
        [e.target.name]: e.target.value
      }
    });
  }
  addBannerImage(image) {
    this.setState({
      banner: {
        ...this.state.banner,
        image
      }
    });
  }
  deleteBannerImage() {
    this.setState({
      banner: {
        ...this.state.banner,
        image: null
      }
    });
  }

  onSubmit(e) {
    e.preventDefault();
    this.props.saveBanner(this.state.banner, this.props.groupUri);
  }

  render() {
    const { banner } = this.state;

    if (banner == null) return null;
    return (
      <form className="group-section" onSubmit={this.onSubmit}>
        <div className="section-header">
          <div className="tab">Banner information</div>
        </div>
        <div className="section-content">
          <DragAndDrop
            initialImage={banner.image}
            addPreviewImage={this.addBannerImage}
            deleteImage={this.deleteBannerImage}
          />
          <p className="subtitle">
            You can add a link to your site and also to other social networks
          </p>

          <div className="input-form">
            <div className="group-input">
              <div className="title">Website:</div>
              <input
                type={"text"}
                placeholder={""}
                name={"name"}
                // onChange={this.onChange}
                // value={name}
              />
            </div>
            <div className="group-input">
              <div className="title">Instagram:</div>
              <input
                type={"text"}
                placeholder={""}
                name={"instLink"}
                onChange={this.onBannerInfoChange}
                value={banner.instLink}
              />
            </div>
            <div className="group-input">
              <div className="title">Telegram:</div>
              <input
                type={"text"}
                placeholder={""}
                name={"topic"}
                // onChange={this.onChange}
                // value={type}
              />
            </div>
            <div className="group-input">
              <div className="title">VKontakte:</div>
              <input
                type={"text"}
                name={"uri"}
                // onChange={this.onChange}
                // value={uri}
              />
            </div>
            <div className="group-input">
              <div className="title">Facebook:</div>
              <input
                type={"text"}
                name={"uri"}
                // onChange={this.onChange}
                // value={uri}
              />
            </div>
            <div className="group-input">
              <div className="title">Spotify:</div>
              <input
                type={"text"}
                name={"uri"}
                // onChange={this.onChange}
                // value={uri}
              />
            </div>
            <div className="group-input">
              <div className="title">LinkedIn:</div>
              <input
                type={"text"}
                name={"uri"}
                // onChange={this.onChange}
                // value={uri}
              />
            </div>
            <div className="group-input">
              <div className="title">YouTube:</div>
              <input
                type={"text"}
                name={"uri"}
                // onChange={this.onChange}
                // value={uri}
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
