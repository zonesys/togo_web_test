import {checkAccessAPI} from "../APIs/AuthenticationAPIs";

export const checkAccess = (qrUUID) => async (dispatch) => {
    let authenticated = await checkAccessAPI(qrUUID);
    if (authenticated) {
        dispatch({
            type: "SET_AUTH",
            authenticated: authenticated,
        });
    }
    return authenticated;
};
