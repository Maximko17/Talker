import {
  GET_POST,
  GET_ALL_USER_POSTS,
  GET_THREE_RANDOM_POSTS,
  GET_POST_RESPONSES,
  LIKE_POST,
  UNLIKE_POST,
  LIKE_RESPONSE,
  UNLIKE_RESPONSE,
  BOOKMARK_POST,
  DELETE_BOOKMARKED_POST,
  NEW_POST_RESPONSE,
  GET_BOOKMARKED_POSTS,
  SUBSCRIBE_OR_BLOCK_POST_USER,
  UNSUBSCRIBE_OR_UNBLOCK_POST_USER,
  DELETE_BOOKMARK,
  GET_TAG_POSTS,
  BOOKMARK_RESPONSE,
  DELETE_RESPONSE_BOOKMARK,
  DELETE_BOOKMARKED_RESPONSE,
  GET_LIKED_POSTS,
  GET_LIKED_RESPONSES,
  ADD_POST_REPORT,
  REMOVE_POST_REPORT,
  ADD_RESPONSE_REPORT,
  REMOVE_RESPONSE_REPORT,
  SUBSCRIBE_OR_BLOCK_POSTS_USERS,
  UNSUBSCRIBE_OR_UNBLOCK_POSTS_USERS,
  SUBSCRIBE_OR_BLOCK_RESPONSES_USERS,
  UNSUBSCRIBE_OR_UNBLOCK_RESPONSES_USERS,
  DELETE_POST
} from "../actions/types";

const initialState = {
  post: {},
  posts: {
    content: [],
    currentSize: 0,
    totalElements: 0
  },
  responses: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_POST:
      return {
        ...state,
        post: action.payload
      };
    case DELETE_POST:
      return {
        ...state,
        posts: {
          ...state.posts,
          content: state.posts.content.filter(
            post => post.id !== action.payload
          )
        }
      };
    case GET_ALL_USER_POSTS:
      return {
        ...state,
        post: {},
        posts: action.payload
      };
    case GET_THREE_RANDOM_POSTS:
      return {
        ...state,
        posts: action.payload
      };
    case GET_BOOKMARKED_POSTS:
      return {
        ...state,
        post: {},
        posts: action.payload
      };
    case GET_TAG_POSTS:
      return {
        post: {},
        responses: {},
        posts: action.payload
      };
    case GET_POST_RESPONSES:
      return {
        ...state,
        responses: action.payload
      };
    case NEW_POST_RESPONSE:
      return {
        ...state,
        post: {
          ...state.post,
          totalResponses: state.post.totalResponses + 1
        },
        responses: {
          ...state.responses,
          content: [action.payload, ...state.responses.content]
        }
      };

    case GET_LIKED_POSTS:
      return {
        ...state,
        posts: action.payload
      };
    case GET_LIKED_RESPONSES:
      return {
        ...state,
        responses: action.payload
      };

    case LIKE_POST:
      if (action.payload.isOnePost) {
        return {
          ...state,
          post: {
            ...state.post,
            didMeLikeThisPost: true,
            totalLikes: state.post.totalLikes + 1
          }
        };
      } else {
        return {
          ...state,
          posts: {
            ...state.posts,
            content: state.posts.content.map(post =>
              post.id === action.payload.postId
                ? {
                    ...post,
                    didMeLikeThisPost: true,
                    totalLikes: post.totalLikes + 1
                  }
                : post
            )
          }
        };
      }

    case UNLIKE_POST:
      if (action.payload.isOnePost) {
        return {
          ...state,
          post: {
            ...state.post,
            didMeLikeThisPost: false,
            totalLikes: state.post.totalLikes - 1
          }
        };
      } else {
        return {
          ...state,
          posts: {
            ...state.posts,
            content: state.posts.content.map(post =>
              post.id === action.payload.postId
                ? {
                    ...post,
                    didMeLikeThisPost: false,
                    totalLikes: post.totalLikes - 1
                  }
                : post
            )
          }
        };
      }

    case BOOKMARK_POST:
      if (action.payload.isOnePost) {
        return {
          ...state,
          post: {
            ...state.post,
            didMeSaveThisPost: true
          }
        };
      } else {
        return {
          ...state,
          posts: {
            ...state.posts,
            content: state.posts.content.map(post =>
              post.id === action.payload.postId
                ? {
                    ...post,
                    didMeSaveThisPost: true
                  }
                : post
            )
          }
        };
      }

    case DELETE_BOOKMARK:
      if (action.payload.isOnePost) {
        return {
          ...state,
          post: {
            ...state.post,
            didMeSaveThisPost: false
          }
        };
      } else {
        return {
          ...state,
          posts: {
            ...state.posts,
            content: state.posts.content.map(post =>
              post.id === action.payload.postId
                ? {
                    ...post,
                    didMeSaveThisPost: false
                  }
                : post
            )
          }
        };
      }

    case DELETE_BOOKMARKED_POST:
      return {
        ...state,
        posts: {
          ...state.posts,
          content: state.posts.content.filter(
            post => post.id !== action.payload
          )
        }
      };

    case BOOKMARK_RESPONSE:
      return {
        ...state,
        responses: {
          ...state.responses,
          content: state.responses.content.map(response =>
            response.id === action.payload
              ? {
                  ...response,
                  didMeSaveThisResponse: true
                }
              : response
          )
        }
      };

    case DELETE_RESPONSE_BOOKMARK:
      return {
        ...state,
        responses: {
          ...state.responses,
          content: state.responses.content.map(response =>
            response.id === action.payload
              ? {
                  ...response,
                  didMeSaveThisResponse: false
                }
              : response
          )
        }
      };

    case DELETE_BOOKMARKED_RESPONSE:
      return {
        ...state,
        responses: {
          ...state.responses,
          content: state.responses.content.filter(
            response => response.id !== action.payload
          )
        }
      };

    case LIKE_RESPONSE:
      return {
        ...state,
        responses: {
          ...state.responses,
          content: state.responses.content.map(response =>
            response.id === action.payload
              ? {
                  ...response,
                  didMeLikeThisResponse: true,
                  totalLikes: response.totalLikes + 1
                }
              : response
          )
        }
      };

    case UNLIKE_RESPONSE:
      return {
        ...state,
        responses: {
          ...state.responses,
          content: state.responses.content.map(response =>
            response.id === action.payload
              ? {
                  ...response,
                  didMeLikeThisResponse: false,
                  totalLikes: response.totalLikes - 1
                }
              : response
          )
        }
      };

    case ADD_POST_REPORT:
      if (action.payload.isOnePost) {
        return {
          ...state,
          post: {
            ...state.post,
            didMeReportThisPost: true
          }
        };
      } else {
        return {
          ...state,
          posts: {
            ...state.posts,
            content: state.posts.content.map(post =>
              post.id === action.payload.postId
                ? {
                    ...post,
                    didMeReportThisPost: true
                  }
                : post
            )
          }
        };
      }

    case REMOVE_POST_REPORT:
      if (action.payload.isOnePost) {
        return {
          ...state,
          post: {
            ...state.post,
            didMeReportThisPost: false
          }
        };
      } else {
        return {
          ...state,
          posts: {
            ...state.posts,
            content: state.posts.content.map(post =>
              post.id === action.payload.postId
                ? {
                    ...post,
                    didMeReportThisPost: false
                  }
                : post
            )
          }
        };
      }

    case ADD_RESPONSE_REPORT:
      return {
        ...state,
        responses: {
          ...state.responses,
          content: state.responses.content.map(response =>
            response.id === action.payload
              ? {
                  ...response,
                  didMeReportThisResponse: true
                }
              : response
          )
        }
      };

    case REMOVE_RESPONSE_REPORT:
      return {
        ...state,
        responses: {
          ...state.responses,
          content: state.responses.content.map(response =>
            response.id === action.payload
              ? {
                  ...response,
                  didMeReportThisResponse: false
                }
              : response
          )
        }
      };

    case SUBSCRIBE_OR_BLOCK_POSTS_USERS:
      return {
        ...state,
        posts: {
          ...state.posts,
          content: state.posts.content.map(post =>
            post.user.email === action.payload.data
              ? action.payload.type === "sub"
                ? {
                    ...post,
                    user: {
                      ...post.user,
                      isMeFollower: true
                    }
                  }
                : {
                    ...post,
                    user: {
                      ...post.user,
                      haveIBlocked: true
                    }
                  }
              : post
          )
        }
      };
    case UNSUBSCRIBE_OR_UNBLOCK_POSTS_USERS:
      return {
        ...state,
        posts: {
          ...state.posts,
          content: state.posts.content.map(post =>
            post.user.email === action.payload.data
              ? action.payload.type === "sub"
                ? {
                    ...post,
                    user: {
                      ...post.user,
                      isMeFollower: false
                    }
                  }
                : {
                    ...post,
                    user: {
                      ...post.user,
                      haveIBlocked: false
                    }
                  }
              : post
          )
        }
      };

    case SUBSCRIBE_OR_BLOCK_RESPONSES_USERS:
      return {
        ...state,
        responses: {
          ...state.responses,
          content: state.responses.content.map(response =>
            response.user.id === action.payload.data
              ? action.payload.type === "sub"
                ? {
                    ...response,
                    user: {
                      ...response.user,
                      isMeFollower: true
                    }
                  }
                : {
                    ...response,
                    user: {
                      ...response.user,
                      haveIBlocked: true
                    }
                  }
              : response
          )
        }
      };
    case UNSUBSCRIBE_OR_UNBLOCK_RESPONSES_USERS:
      return {
        ...state,
        responses: {
          ...state.responses,
          content: state.responses.content.map(response =>
            response.user.id === action.payload.data
              ? action.payload.type === "sub"
                ? {
                    ...response,
                    user: {
                      ...response.user,
                      isMeFollower: false
                    }
                  }
                : {
                    ...response,
                    user: {
                      ...response.user,
                      haveIBlocked: false
                    }
                  }
              : response
          )
        }
      };

    case SUBSCRIBE_OR_BLOCK_POST_USER:
      if (!isEmptyObject(state.post)) {
        if (state.post.user.email === action.payload.data) {
          return {
            ...state,
            post: {
              ...state.post,
              user:
                action.payload.type === "sub"
                  ? {
                      ...state.post.user,
                      totalFollowers: state.post.user.totalFollowers + 1,
                      isMeFollower: true
                    }
                  : {
                      ...state.post.user,
                      totalFollowers:
                        state.post.user.totalFollowers >= 1
                          ? state.post.user.totalFollowers - 1
                          : state.post.user.totalFollowers,
                      isMeFollower: false,
                      haveIBlocked: true
                    }
            },
            posts: {
              ...state.posts,
              content: state.posts.content.map(post =>
                post.user.id == action.payload.data
                  ? {
                      ...post,
                      user:
                        action.payload.type === "sub"
                          ? {
                              ...post.user,
                              totalFollowers: post.user.totalFollowers + 1,
                              isMeFollower: true
                            }
                          : {
                              ...post.user,
                              haveIBlocked: true
                            }
                    }
                  : post
              )
            },
            responses: {
              ...state.responses,
              content: state.responses.content.map(response =>
                response.user.id == action.payload.data
                  ? {
                      ...response,
                      user:
                        action.payload.type === "sub"
                          ? {
                              ...response.user,
                              totalFollowers: response.user.totalFollowers + 1,
                              isMeFollower: true
                            }
                          : {
                              ...response.user,
                              haveIBlocked: true
                            }
                    }
                  : response
              )
            }
          };
        } else {
          return {
            ...state,
            posts: {
              ...state.posts,
              content: state.posts.content.map(post =>
                post.user.id == action.payload.data
                  ? {
                      ...post,
                      user:
                        action.payload.type === "sub"
                          ? {
                              ...post.user,
                              totalFollowers: post.user.totalFollowers + 1,
                              isMeFollower: true
                            }
                          : {
                              ...post.user,
                              haveIBlocked: true
                            }
                    }
                  : post
              )
            },
            responses: {
              ...state.responses,
              content: state.responses.content.map(response =>
                response.user.id == action.payload.data
                  ? {
                      ...response,
                      user:
                        action.payload.type === "sub"
                          ? {
                              ...response.user,
                              totalFollowers: response.user.totalFollowers + 1,
                              isMeFollower: true
                            }
                          : {
                              ...response.user,
                              haveIBlocked: true
                            }
                    }
                  : response
              )
            }
          };
        }
      } else {
        return {
          posts: {
            ...state.posts,
            content: state.posts.content.map(post =>
              post.user.id == action.payload.data
                ? {
                    ...post,
                    user:
                      action.payload.type === "sub"
                        ? {
                            ...post.user,
                            totalFollowers: post.user.totalFollowers + 1,
                            isMeFollower: true
                          }
                        : {
                            ...post.user,
                            haveIBlocked: true
                          }
                  }
                : post
            )
          }
        };
      }

    case UNSUBSCRIBE_OR_UNBLOCK_POST_USER:
      if (!isEmptyObject(state.post)) {
        if (state.post.user.email === action.payload.data) {
          return {
            ...state,
            post: {
              ...state.post,
              user:
                action.payload.type === "sub"
                  ? {
                      ...state.post.user,
                      totalFollowers:
                        state.post.user.totalFollowers >= 1
                          ? state.post.user.totalFollowers - 1
                          : state.post.user.totalFollowers,
                      isMeFollower: false
                    }
                  : {
                      ...state.post.user,
                      haveIBlocked: false
                    }
            },
            posts: {
              ...state.posts,
              content: state.posts.content.map(post =>
                post.user.id == action.payload.data
                  ? {
                      ...post,
                      user:
                        action.payload.type === "sub"
                          ? {
                              ...post.user,
                              totalFollowers:
                                post.user.totalFollowers >= 1
                                  ? post.user.totalFollowers - 1
                                  : post.user.totalFollowers,
                              isMeFollower: false
                            }
                          : {
                              ...post.user,
                              haveIBlocked: false
                            }
                    }
                  : post
              )
            },
            responses: {
              ...state.responses,
              content: state.responses.content.map(response =>
                response.user.id == action.payload.data
                  ? {
                      ...response,
                      user:
                        action.payload.type === "sub"
                          ? {
                              ...response.user,
                              totalFollowers:
                                response.user.totalFollowers >= 1
                                  ? response.user.totalFollowers - 1
                                  : response.user.totalFollowers,
                              isMeFollower: false
                            }
                          : {
                              ...response.user,
                              haveIBlocked: false
                            }
                    }
                  : response
              )
            }
          };
        } else {
          return {
            ...state,
            posts: {
              ...state.posts,
              content: state.posts.content.map(post =>
                post.user.id == action.payload.data
                  ? {
                      ...post,
                      user:
                        action.payload.type === "sub"
                          ? {
                              ...post.user,
                              totalFollowers:
                                post.user.totalFollowers >= 1
                                  ? post.user.totalFollowers - 1
                                  : post.user.totalFollowers,
                              isMeFollower: false
                            }
                          : {
                              ...post.user,
                              haveIBlocked: false
                            }
                    }
                  : post
              )
            },
            responses: {
              ...state.responses,
              content: state.responses.content.map(response =>
                response.user.id == action.payload.data
                  ? {
                      ...response,
                      user:
                        action.payload.type === "sub"
                          ? {
                              ...response.user,
                              totalFollowers:
                                response.user.totalFollowers >= 1
                                  ? response.user.totalFollowers - 1
                                  : response.user.totalFollowers,
                              isMeFollower: false
                            }
                          : {
                              ...response.user,
                              haveIBlocked: false
                            }
                    }
                  : response
              )
            }
          };
        }
      } else {
        return {
          ...state,
          posts: {
            ...state.posts,
            content: state.posts.content.map(post =>
              post.user.id == action.payload.data
                ? {
                    ...post,
                    user:
                      action.payload.type === "sub"
                        ? {
                            ...post.user,
                            totalFollowers: post.user.totalFollowers - 1,
                            isMeFollower: false
                          }
                        : {
                            ...post.user,
                            haveIBlocked: false
                          }
                  }
                : post
            )
          }
        };
      }
    default:
      return state;
  }
}

function isEmptyObject(obj) {
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      return false;
    }
  }
  return true;
}
