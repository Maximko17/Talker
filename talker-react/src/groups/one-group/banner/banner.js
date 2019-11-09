import React, { Component } from "react";
import "./banner.css";

export default class Banner extends Component {
  render() {
    const { banner } = this.props;
    if (banner == undefined) return null;
    return (
      <div className="group-banner">
        <img src={banner.image} alt="group_img" />
        <div className="social-media">
          <span>{banner.shortMessage}</span>
          <a target={"_blank"} href="https://www.instagram.com/">
            <img
              src="https://i.pinimg.com/originals/a2/5f/4f/a25f4f58938bbe61357ebca42d23866f.png"
              alt="inst_img"
            />
          </a>
          <a target={"_blank"} href="https://www.instagram.com/">
            <img
              src="https://avatanplus.com/files/resources/mid/58bd313b4b8a515aa3084fad.png"
              alt="inst_img"
            />
          </a>
          <a target={"_blank"} href="https://www.instagram.com/">
            <img
              src="https://cdn3.iconfinder.com/data/icons/popular-services-brands-vol-2/512/telegram-512.png"
              alt="inst_img"
            />
          </a>
        </div>
      </div>
    );
  }
}
