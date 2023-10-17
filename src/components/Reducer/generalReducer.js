import {CHANGE_LANGUAGE, LOGOUT, SET_TOAST_DATA, SET_WALLET} from "../../Actions/ActionsTypes";
import {LOCALES_TYPES} from "../../i18n/locales";

const initialState = {
    authenticated: !!localStorage.getItem('TokenDevice'),
    toastData: null,
    language: (()=>{ 
        if(localStorage.getItem("Language")){
            return localStorage.getItem("Language");
        }
        localStorage.setItem("Language", LOCALES_TYPES.ENGLISH)
        return LOCALES_TYPES.ENGLISH
    })()
};

const generalReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_AUTH":
            return {...state, authenticated: action.authenticated};
        case SET_TOAST_DATA:
            return {...state, toastData: action.toastData};
        case SET_WALLET:
            return {...state, wallet: action.amount};
        case LOGOUT:
            return {...state, authenticated: false};
        case CHANGE_LANGUAGE:
            return {...state, language: action.language};
        case "else":
            return {...state, user: action.payload.user};
        default:
            return state;
    }
};

export default generalReducer;
