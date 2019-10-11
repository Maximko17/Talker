import React from "react";
import "./user-popover.css";
import { Link } from "react-router-dom";
import { logout } from "../../actions/security-actions";

export function getUserInfo(user) {
  return (
    <div className="user-popover">
      <div className="first-section">
        <div>
          <img src={user.photo} alt="Img" />
        </div>
        <div className="ml-2">
          <p>{user.name} </p>
          <p>{user.email}</p>
        </div>
      </div>
      <div className="second-section">
        <Link to={"/new-post"}>New post</Link>
        <Link to={`/my-posts`}>My posts</Link>
        <Link to={"/my-chats"}>Chats</Link>
      </div>
      <div className="third-section">
        <Link to={"/bookmarks"}>Bookmarks</Link>
      </div>
      <div className="fourth-section">
        <Link to={`/profile/${user.email}`}>Profile</Link>
        <Link to={"/"} onClick={() => logout()}>
          Sign out
        </Link>
      </div>
    </div>
  );
}
