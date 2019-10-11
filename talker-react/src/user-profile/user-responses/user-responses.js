import React, { Component } from "react";
import "./user-responses.css";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getUserResponses } from "../../actions/response-actions";
import { getDate } from "../../utils/date-utils";
import popover from "../../popover/follow-popover/popover";
import { Popup } from "semantic-ui-react";
import { Link } from "react-router-dom";
import MappleToolTip from "reactjs-mappletooltip";
import { getResponseLikeButton } from "../../utils/likes-utils";
import {
  bookmarkResponse,
  deleteBookmarke
} from "../../actions/response-actions";
import { isEmpty, blockMessage1 } from "../../utils/exception-utils";
import UnreportPost from "../../full-post/report-post/unreport-post/unreport-post";
import ReportPost from "../../full-post/report-post/report-post";

class UserResponses extends Component {
  constructor(props) {
    super(props);
    this.onScroll = this.onScroll.bind(this);
  }

  componentDidMount() {
    const { liked_responses, user } = this.props;
    if (!liked_responses) {
      this.props.getUserResponses(user.email, 2, "date", "asc");
    }
    window.addEventListener("scroll", this.onScroll, false);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.onScroll, false);
  }

  onScroll() {
    const { currentSize, totalElements } = this.props.responses;
    const { liked_responses, user } = this.props;

    var scrollHeight = document.documentElement.scrollHeight;
    var clientHeight = document.documentElement.clientHeight;
    var scrollTop = document.documentElement.scrollTop;

    if (
      scrollTop >= scrollHeight - clientHeight - 5 &&
      currentSize < totalElements
    ) {
      if (!liked_responses) {
        this.props.getUserResponses(user.email, currentSize + 2, "date", "asc");
      } else {
        this.props.getLikedResponses(user.email, currentSize + 2);
      }
    }
  }

  getResponses(responses) {
    const { user, security, fromWhere } = this.props;
    let current_user;
    return (
      responses &&
      responses.map(response => {
        if (fromWhere !== "profile") {
          current_user = response.user;
        } else {
          current_user = user;
        }
        return (
          <div className="user-response" key={response.id}>
            <div>
              <div className="post-user-info">
                <div>
                  <img src={current_user.photo} alt="Img" />
                </div>
                <div>
                  <Popup
                    content={popover(current_user, security, fromWhere)}
                    trigger={
                      <Link to={`/profile/${current_user.email}`}>
                        {current_user.name}
                      </Link>
                    }
                    flowing
                    hoverable
                    position="top center"
                  />
                  <p>{getDate(response.date)}</p>
                </div>
              </div>
              <div
                className="user-response-body"
                onClick={() =>
                  this.props.history.push(`/post/${response.post.id}`)
                }
              >
                <div>
                  <p>{response.post.title}</p>
                  <p>{response.post.user.name}</p>
                </div>
                <div>
                  <i className="fas fa-heart" />
                  {response.post.totalLikes}
                  <i className="fas fa-comment" />
                  {response.post.totalResponses}
                </div>
              </div>
              <div className="user-response-text">{response.text}</div>
              <div className="post-likes">
                <div>
                  {getResponseLikeButton(
                    response.didMeLikeThisResponse,
                    response.id,
                    security.user.id
                  )}
                  {response.totalLikes}
                </div>
                <div className="d-flex">
                  {this.getBookmarkButton(
                    response,
                    security.user.id,
                    current_user.id
                  )}
                  {this.getReportButton(
                    response,
                    security.user.id,
                    current_user.id
                  )}
                </div>
                {response.didMeReportThisResponse ? (
                  <UnreportPost
                    element={response}
                    user={current_user}
                    isOneElement={false}
                    fromWhere={fromWhere}
                    isThisResponse={true}
                  />
                ) : (
                  <ReportPost
                    element={response}
                    user={current_user}
                    isOneElement={false}
                    fromWhere={fromWhere}
                    isThisResponse={true}
                  />
                )}
              </div>
            </div>
          </div>
        );
      })
    );
  }

  getReportButton(response, securityId, currentUserId) {
    if (securityId !== currentUserId) {
      return (
        <MappleToolTip>
          <button
            type="button"
            id="bookmark"
            style={response.didMeReportThisResponse ? { color: "black" } : null}
            data-toggle="modal"
            data-target={
              response.didMeReportThisResponse
                ? `#unreportModal${response.id}`
                : `#reportModal${response.id}`
            }
          >
            <i
              className={
                response.didMeReportThisResponse ? "fas fa-flag" : "far fa-flag"
              }
            />
          </button>
          <div>
            {response.didMeReportThisResponse
              ? "You reported this response"
              : "Report this response"}
          </div>
        </MappleToolTip>
      );
    } else {
      return null;
    }
  }

  getBookmarkButton(response, securityId, currentUserId) {
    if (securityId !== currentUserId) {
      return (
        <MappleToolTip>
          <button
            id="bookmark"
            style={response.didMeSaveThisResponse ? { color: "black" } : null}
            onClick={
              response.didMeSaveThisResponse
                ? deleteBookmarke(response)
                : bookmarkResponse(response)
            }
          >
            <i
              className={
                response.didMeSaveThisResponse
                  ? "fas fa-bookmark"
                  : "far fa-bookmark"
              }
            />
          </button>
          <div>
            {response.didMeSaveThisResponse
              ? "You bookmarked this response"
              : "Bookmark this response to read later"}
          </div>
        </MappleToolTip>
      );
    } else {
      return null;
    }
  }

  render() {
    const { responses, liked_responses } = this.props;
    const { error } = this.props;

    if (!isEmpty(error)) {
      return blockMessage1();
    } else {
      return (
        <div className="user-responses">
          <div className="user-responses-title">
            {liked_responses ? null : "Responses"}
          </div>
          {this.getResponses(responses.content)}
        </div>
      );
    }
  }
}

UserResponses.propTypes = {
  getUserResponses: PropTypes.func.isRequired,
  error: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  responses: state.post.responses,
  security: state.security,
  error: state.errors.error
});

export default connect(
  mapStateToProps,
  {
    getUserResponses
  }
)(UserResponses);
