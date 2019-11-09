import {
  GET_GROUP,
  GET_GROUPS,
  GET_ERROR,
  GET_GROUP_USERS,
  SUBSCRIBE_TO_GROUP,
  SUBSCRIBE_TO_GROUPS,
  UNSUBSCRIBE_FROM_GROUP,
  UNSUBSCRIBE_FROM_GROUPS,
  CHANGE_BAN_STATE_IN_GROUP,
  EXCLUDE_FROM_GROUP,
  SUBSCRIBE_TO_GROUP_FROM_POST
} from "./types";
import axios from "axios";
import store from "../store";

export const createNewGroup = (group, history) => async dispatch => {
  try {
    const res = await axios.post(`/groups/new-group`, group);
    history.push(`/groups/${res.data.uri}`);
  } catch (error) {
    dispatch({
      type: GET_ERROR,
      payload: error.response.status
    });
  }
};

export const editGroup = (group, history) => async dispatch => {
  try {
    const url = "/group/edit-group";
    const formData = new FormData();
    formData.append("image", group.image);
    formData.append(
      "group",
      new Blob(
        [
          JSON.stringify({
            id: group.id,
            uri: group.uri,
            name: group.name,
            topic: group.topic,
            type: group.type,
            description: group.description
          })
        ],
        {
          type: "application/json"
        }
      )
    );
    const config = {
      headers: {
        "Content-Type": undefined
      }
    };

    await axios.put(url, formData, config);
  } catch (error) {
    dispatch({
      type: GET_ERROR,
      payload: error.response.data
    });
  }
};

export const saveBanner = (banner, groupUri, history) => async dispatch => {
  try {
    const url = "/group/update-banner";
    const formData = new FormData();
    formData.append("image", banner.image);
    formData.append(
      "group",
      new Blob(
        [
          JSON.stringify({
            uri: groupUri,
            banner: {
              instLink: banner.instLink
            }
          })
        ],
        {
          type: "application/json"
        }
      )
    );
    const config = {
      headers: {
        "Content-Type": undefined
      }
    };

    await axios.post(url, formData, config);
  } catch (error) {
    dispatch({
      type: GET_ERROR,
      payload: error.response.data
    });
  }
};

export const getGroup = uri => async dispatch => {
  try {
    const res = await axios.get(`/group/${uri}`);

    dispatch({
      type: GET_GROUP,
      payload: res.data
    });
  } catch (error) {
    dispatch({
      type: GET_ERROR,
      payload: error.response.status
    });
  }
};

export const getEditGroupInfo = (uri, history) => async dispatch => {
  try {
    const res = await axios.get(`/group/${uri}/edit`);
    if (res.data.isMeAdmin) {
      dispatch({
        type: GET_GROUP,
        payload: res.data
      });
    } else {
      history.push(`/group/${uri}`);
    }
  } catch (error) {
    dispatch({
      type: GET_ERROR,
      payload: error.response.status
    });
  }
};

export const getGroupRoles = (
  groupUri,
  userName = "",
  size = 10
) => async dispatch => {
  try {
    const res = await axios.get(
      `/group/${groupUri}/roles?search=${userName}&page=0&size=${size}`
    );

    dispatch({
      type: GET_GROUP_USERS,
      payload: res.data
    });
  } catch (error) {
    dispatch({
      type: GET_ERROR,
      payload: error.response.status
    });
  }
};

export const saveGroupRoles = (groupUri, user, roleName) => async dispatch => {
  const role = {
    role: roleName,
    user: user
  };
  try {
    await axios.post(`/group/${groupUri}/save-role`, role);
  } catch (error) {
    dispatch({
      type: GET_ERROR,
      payload: error.response.status
    });
  }
};

export const deleteGroupRole = (groupUri, usermail) => async dispatch => {
  try {
    await axios.delete(`/group/${groupUri}/user/${usermail}/delete-role`);
    dispatch({
      type: EXCLUDE_FROM_GROUP,
      payload: usermail
    });
  } catch (error) {
    dispatch({
      type: GET_ERROR,
      payload: error.response.status
    });
  }
};

export const getBannedUsers = (
  groupUri,
  userName = "",
  size = 10
) => async dispatch => {
  try {
    const res = await axios.get(
      `/group/${groupUri}/bans?search=${userName}&page=0&size=${size}`
    );

    dispatch({
      type: GET_GROUP_USERS,
      payload: res.data
    });
  } catch (error) {
    dispatch({
      type: GET_ERROR,
      payload: error.response.status
    });
  }
};

export const banUser = (groupUri, useremail) => async dispatch => {
  try {
    await axios.post(`/group/${groupUri}/user/${useremail}/ban`);
    dispatch({
      type: EXCLUDE_FROM_GROUP,
      payload: useremail
    });
  } catch (error) {
    dispatch({
      type: GET_ERROR,
      payload: error.response.status
    });
  }
};

export const unbanUser = (groupUri, usermail) => async dispatch => {
  try {
    await axios.delete(`/group/${groupUri}/user/${usermail}/unban`);
    dispatch({
      type: CHANGE_BAN_STATE_IN_GROUP,
      payload: usermail
    });
  } catch (error) {
    dispatch({
      type: GET_ERROR,
      payload: error.response.status
    });
  }
};

export const getGroups = size => async dispatch => {
  try {
    const res = await axios.get(`/groups?page=0&size=${size}`);

    dispatch({
      type: GET_GROUPS,
      payload: res.data
    });
  } catch (error) {
    dispatch({
      type: GET_ERROR,
      payload: error.response.status
    });
  }
};

export const getGroupUsers = (
  groupUri,
  size,
  search = ""
) => async dispatch => {
  try {
    const res = await axios.get(
      `/group/${groupUri}/users?search=${search}&page=0&size=${size}`
    );

    dispatch({
      type: GET_GROUP_USERS,
      payload: res.data
    });
  } catch (error) {
    dispatch({
      type: GET_ERROR,
      payload: error.response.status
    });
  }
};

export const subscribeToGroup = (uri, fromWhere) => async dispatch => {
  try {
    const res = await axios.post(`/subscribeToGroup/${uri}`);

    switch (fromWhere) {
      case "group":
        store.dispatch({
          type: SUBSCRIBE_TO_GROUP,
          payload: res.data.uri
        });
        break;
      case "groups":
        store.dispatch({
          type: SUBSCRIBE_TO_GROUPS,
          payload: res.data.uri
        });
        break;
      case "post":
        store.dispatch({
          type: SUBSCRIBE_TO_GROUP_FROM_POST,
          payload: res.data.uri
        });
        break;
      default: {
        store.dispatch({
          type: SUBSCRIBE_TO_GROUP,
          payload: res.data.uri
        });
        break;
      }
    }
  } catch (error) {
    dispatch({
      type: GET_ERROR,
      payload: error.response.status
    });
  }
};

export const unsubscribeFromGroup = (uri, fromWhere) => async dispatch => {
  try {
    const res = await axios.delete(`/unsubscribeFromGroup/${uri}`);

    if (fromWhere === "group") {
      store.dispatch({
        type: UNSUBSCRIBE_FROM_GROUP,
        payload: res.data.uri
      });
    } else {
      store.dispatch({
        type: UNSUBSCRIBE_FROM_GROUPS,
        payload: res.data.uri
      });
    }
  } catch (error) {
    dispatch({
      type: GET_ERROR,
      payload: error.response.status
    });
  }
};
