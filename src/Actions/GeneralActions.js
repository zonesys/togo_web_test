import {CHANGE_LANGUAGE, SET_TOAST_DATA, SET_WALLET} from "./ActionsTypes";
import translate from "../i18n/translate";

export const toastMessage = (description, title = "GENERAL.ERROR_FETCHING", status = "error") => dispatch => {
    dispatch({
        type: SET_TOAST_DATA,
        toastData: {
            title,
            description,
            status
        }
    })
};

export const toastNotification = (title, description, status) => dispatch => {
    dispatch({
        type: SET_TOAST_DATA,
        toastData: {
            title,
            description,
            status
        }
    })
};

export const setWallet = (amount = "0") => dispatch => {
    dispatch({
        type: SET_WALLET,
        amount
    })
};

export const setAuth = (authenticated = "0") => dispatch => {
  dispatch({
      type: "SET_AUTH",
      authenticated: authenticated,
  });
};

export const changeLanguage = (language) => {
    localStorage.setItem("Language", language);
  return {
      type: CHANGE_LANGUAGE,
      language
  }
};
