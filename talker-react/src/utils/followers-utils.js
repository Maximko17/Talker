import React from "react";
import LoginPage from "../modals/login-page/login-page";
import { subscribeToUser, unsubscribeFromUser } from "../actions/user-actions";
import { getDefaultBlockButtom, getBlockDropdown } from "./block-utils";

export default function getDefaultFollowButton(
  followingUser,
  security,
  fromWhere
) {
  if (security.validToken) {
    if (security.user.email != followingUser.email) {
      if (!followingUser.haveIBlocked) {
        if (followingUser.isMeFollower) {
          return (
            <button
              className="medium-follow-button-active"
              onClick={unsubscribeFromUser(followingUser.id, fromWhere)}
            >
              Following
            </button>
          );
        } else {
          return (
            <button
              className="medium-follow-button"
              onClick={subscribeToUser(followingUser.id, fromWhere)}
            >
              Follow
            </button>
          );
        }
      } else {
        return getDefaultBlockButtom(
          followingUser.email,
          followingUser.haveIBlocked,
          fromWhere
        );
      }
    } else {
      return null;
    }
  } else {
    return (
      <div>
        <button
          className="medium-follow-button"
          data-toggle="modal"
          data-target="#loginPage"
        >
          Follow
        </button>
        <LoginPage />
      </div>
    );
  }
}

function getProfileFollowButton(
  followingUser,
  security,
  fromWhere,
  dropdown_style
) {
  if (security.validToken) {
    if (security.user.email != followingUser.email) {
      if (!followingUser.haveIBlocked) {
        if (followingUser.isMeFollower) {
          return (
            <div className="d-flex">
              <button
                className="profile-follow-btn-active"
                onClick={unsubscribeFromUser(followingUser.id, fromWhere)}
              >
                Following
              </button>
              {getBlockDropdown(
                followingUser,
                security,
                "profile",
                dropdown_style
              )}
            </div>
          );
        } else {
          return (
            <div className="d-flex">
              <button
                className="profile-follow-btn"
                onClick={subscribeToUser(followingUser.id, fromWhere)}
              >
                Follow
              </button>
              {getBlockDropdown(
                followingUser,
                security,
                "profile",
                dropdown_style
              )}
            </div>
          );
        }
      } else {
        return getDefaultBlockButtom(
          followingUser.email,
          followingUser.haveIBlocked,
          "profile"
        );
      }
    } else {
      return null;
    }
  } else {
    return (
      <div>
        <button
          className="profile-follow-btn"
          data-toggle="modal"
          data-target="#loginPage"
        >
          Follow
        </button>
        <button className="profile-follow-more">
          {" "}
          <i className="fas fa-chevron-down" />
        </button>
        <LoginPage />
      </div>
    );
  }
}

export { getProfileFollowButton };
