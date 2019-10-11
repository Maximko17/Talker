import React from "react";
import { blockUser, unBlockUser } from "../actions/user-actions";
import ReportPost from "../full-post/report-post/report-post";
import BlockUser from "../full-post/block-user/block-user";
import UnblockUser from "../full-post/block-user/unblock-user/unblock-user";
import UnreportPost from "../full-post/report-post/unreport-post/unreport-post";

function getDefaultBlockButtom(userEmail, haveIBlockedUser, blockPlace) {
  if (haveIBlockedUser) {
    return (
      <div>
        <button
          className="block-red-button-active"
          data-toggle="modal"
          data-target="#unblockModal"
        >
          Blocked
        </button>
        <UnblockUser user_email={userEmail} blockPlace={blockPlace} />
      </div>
    );
  } else {
    return (
      <button
        className="block-red-button"
        onClick={blockUser(userEmail, blockPlace)}
      >
        Unblocked
      </button>
    );
  }
}
export { getDefaultBlockButtom };
function getBlockDropdown(user, auth_user, blockPlace, style, post) {
  if (user.id !== auth_user.id) {
    return (
      <div>
        <button
          type="button"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
          className={style}
        >
          <i className="fas fa-chevron-down" />
        </button>

        <div className="dropdown-menu">
          {blockPlace !== "profile" ? (
            post.didMeReportThisPost ? (
              <button
                type="button"
                className="dropdown-item block-user"
                data-toggle="modal"
                data-target={`#unreportModal${post.id}`}
              >
                Remove report
              </button>
            ) : (
              <button
                type="button"
                className="dropdown-item block-user"
                data-toggle="modal"
                data-target={`#reportModal${post.id}`}
              >
                Report story
              </button>
            )
          ) : null}

          {user.haveIBlocked ? (
            <button
              type="button"
              className="dropdown-item block-user"
              data-toggle="modal"
              data-target="#unblockModal"
            >
              Unblock user
            </button>
          ) : (
            <button
              type="button"
              className="dropdown-item block-user"
              data-toggle="modal"
              data-target="#blockModal"
            >
              Block user
            </button>
          )}
        </div>
        {blockPlace !== "profile" ? (
          post.didMeReportThisPost ? (
            <UnreportPost
              element={post}
              isOneElement={true}
              user={user}
              fromWhere={blockPlace}
              isThisResponse={false}
            />
          ) : (
            <ReportPost
              element={post}
              isOneElement={true}
              user={user}
              fromWhere={blockPlace}
              isThisResponse={false}
            />
          )
        ) : null}

        {user.haveIBlocked ? (
          <UnblockUser user_email={user.email} blockPlace={blockPlace} />
        ) : (
          <BlockUser
            user_email={user.email}
            user_name={user.name}
            blockPlace={blockPlace}
          />
        )}
      </div>
    );
  }
}

export { getBlockDropdown };
