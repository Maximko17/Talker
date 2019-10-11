import React from "react";
import Header from "../main-components/header/header";
import RecommendStories from "../full-post/recommend-stories/recommend-stories";

export const blockMessage1 = () => {
  return (
    <div className="null-content">
      <p>You were blocked by this user</p>
    </div>
  );
};

export const notFoundException = () => {
  return (
    <div>
      <Header style={"default"} />
      <div className="not-found-post-message">
        <p>404 NOT FOUND</p>
      </div>
      <RecommendStories postId={null} />
    </div>
  );
};

export const postErrorMessage = (postId, errorStatus) => {
  if (errorStatus === 404) {
    return notFoundException();
  } else {
    return (
      <div>
        <Header style={"default"} />
        <div className="block-post-message">
          <p>Sorry you can not see this post. The author has blocked you</p>
        </div>
        <RecommendStories postId={postId} />
      </div>
    );
  }
};

export const isEmpty = obj => {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }

  return true;
};
