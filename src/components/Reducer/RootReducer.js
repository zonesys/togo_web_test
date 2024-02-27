import {combineReducers} from "redux";
import generalReducer from "./generalReducer";
import profileReducer from "./profileReducer";

export default combineReducers({
    general: generalReducer,
    profile: profileReducer
});
