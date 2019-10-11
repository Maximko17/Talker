import React, { Component } from "react";
import { Link } from "react-router-dom";
import MappleToolTip from "reactjs-mappletooltip";
import "./responses.css";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  getPostResponses,
  newResponse,
  bookmarkResponse,
  deleteBookmarke
} from "../../actions/response-actions";
import { getDate, getNumber } from "../../utils/date-utils";
import { Popup } from "semantic-ui-react";
import popover from "../../popover/follow-popover/popover";
import { getResponseLikeButton } from "../../utils/likes-utils";
import exceptionPopover from "../../popover/exception-popover/exception-popover";
import UnreportPost from "../report-post/unreport-post/unreport-post";
import ReportPost from "../report-post/report-post";
import TextareaAutosize from "react-autosize-textarea";

class Responses extends Component {
  constructor(props) {
    super(props);

    this.state = {
      responses_size: 3,
      onFocus: false,
      onBlur: false,
      newResponse: {
        postId: this.props.postId,
        text: ""
      },
      current_sort_name: "Sort by oldest",
      current_sort: "date",
      current_direction: "desc"
    };

    this.onClick = this.onClick.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    const { responses_size } = this.state;
    this.props.getPostResponses(
      this.props.postId,
      responses_size,
      "date",
      "desc"
    );
  }

  componentDidUpdate(nextProps, prevState) {
    const {
      responses_size,
      current_sort,
      current_sort_name,
      current_direction
    } = this.state;
    if (
      this.props.postId !== nextProps.postId ||
      responses_size != prevState.responses_size ||
      current_sort_name != prevState.current_sort_name
    ) {
      this.props.getPostResponses(
        this.props.postId,
        responses_size,
        current_sort,
        current_direction
      );
    }
  }

  onClick() {
    this.setState({ onFocus: true, onBlur: false });
  }
  onBlur() {
    this.setState({ onFocus: false, onBlur: true });
  }
  onChange(e) {
    this.setState({
      newResponse: {
        ...this.state.newResponse,
        text: e.target.value
      }
    });
  }
  onSubmit(e) {
    e.preventDefault();
    const { newResponse } = this.state;

    this.props.newResponse(newResponse);

    this.setState({
      newResponse: {
        ...this.state.newResponse,
        text: ""
      }
    });
  }

  changeSort(sort_name, sort_type, direction) {
    return this.setState({
      current_sort_name: sort_name,
      current_sort: sort_type,
      current_direction: direction
    });
  }

  getResponses(responses) {
    const { security } = this.props;

    return responses.map(response => {
      return (
        <div className="one-response" key={response.id}>
          <div className="post-user-info">
            <div>
              <img src={response.user.photo} alt="Img" />
            </div>
            <div>
              <Popup
                content={popover(response.user, security, "post")}
                trigger={
                  <Link
                    to={`/profile/${response.user.email}`}
                    style={{ color: "rgba(3, 168, 124, 1)" }}
                  >
                    {response.user.name}
                  </Link>
                }
                flowing
                hoverable
                position="top center"
              />
              <p>{getDate(response.date)}</p>
            </div>
          </div>

          <div className="response-text">{response.text}</div>
          <div className="response-action">
            <div>
              {getResponseLikeButton(
                response.didMeLikeThisResponse,
                response.id,
                security.user.id
              )}
              <span className="ml-1">{getNumber(response.totalLikes)}</span>
            </div>
            <div className="d-flex">
              {this.getBookmarkButton(
                response,
                security.user.id,
                response.user.id
              )}
              {this.getReportButton(
                response,
                security.user.id,
                response.user.id
              )}
            </div>
            {response.didMeReportThisResponse ? (
              <UnreportPost
                element={response}
                user={response.user}
                isOneElement={false}
                fromWhere={"post"}
                isThisResponse={true}
              />
            ) : (
              <ReportPost
                element={response}
                user={response.user}
                isOneElement={false}
                fromWhere={"post"}
                isThisResponse={true}
              />
            )}
          </div>
        </div>
      );
    });
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
    const {
      responses_size,
      onFocus,
      newResponse,
      current_sort_name
    } = this.state;
    const { content, totalElements } = this.props.responses;
    const { security } = this.props;

    return (
      <div className="post-responses">
        <p>Responses</p>
        <div
          className="one-response"
          onClick={this.onClick}
          onBlur={this.onBlur}
          tabIndex="-1"
        >
          <div className="post-user-info">
            <img src={security.user.photo} alt="Img" />
            <span>{onFocus ? security.user.name : "Write a response..."}</span>
          </div>
          <form onSubmit={this.onSubmit}>
            <TextareaAutosize
              className="response-textarea"
              onChange={this.onChange}
              value={newResponse.text}
            />
            {newResponse.text.length < 3 ? (
              <Popup
                content={exceptionPopover(
                  "Oops, did you mean to write something so short? Please write more and try publishing again"
                )}
                trigger={
                  <button type="button" className="publish-button">
                    Publish
                  </button>
                }
                on="click"
                hideOnScroll
                position="top center"
              />
            ) : (
              <button type="submit" className="publish-button">
                Publish
              </button>
            )}
          </form>
        </div>

        <div className="sort">
          <button
            type="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            {current_sort_name + " "}
            <i className="fas fa-chevron-down" />
          </button>
          <div className="dropdown-menu">
            <button
              onClick={() =>
                this.changeSort("Sort by most liked", "totalLikes", "desc")
              }
            >
              Sort by most liked
            </button>
            <button
              onClick={() => this.changeSort("Sort by oldest", "date", "asc")}
            >
              Sort by oldest
            </button>
            <button
              onClick={() => this.changeSort("Sort by latest", "date", "desc")}
            >
              Sort by latest
            </button>
          </div>
        </div>

        {content && this.getResponses(content)}
        <div className="text-center">
          {responses_size <= totalElements ? (
            <button
              className="show-more-responses"
              onClick={() =>
                this.setState({ responses_size: responses_size + 5 })
              }
            >
              Show more responses
            </button>
          ) : null}
        </div>
      </div>
    );
  }
}

Responses.propTypes = {
  getPostResponses: PropTypes.func.isRequired,
  newResponse: PropTypes.func.isRequired,
  error: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  error: state.errors.error,
  security: state.security,
  user: state.user.user,
  responses: state.post.responses
});

export default connect(
  mapStateToProps,
  { getPostResponses, newResponse }
)(Responses);
