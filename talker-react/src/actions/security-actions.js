import setJWTToken from "../utils/security-utils";
import { SET_CURRENT_USER } from "../actions/types";
import store from "../store";

export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  setJWTToken(false);
  store.dispatch({
    type: SET_CURRENT_USER,
    payload: {}
  });
  window.location.href = "/";
};
