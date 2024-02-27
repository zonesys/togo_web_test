
import {apiUrl} from "../Constants/GeneralCont";
import {
    ACCOUNT_DETAILS_CLEAN_UP,
    SET_BUSINESS_LOCATIONS,
    SET_PERSONAL_INFO,
    SET_VEHICLE_INFO,
    SET_WORKING_TIME
} from "./ActionsTypes";
import {convert12TimeTo24, isTransporter} from "../Util";
import {toastMessage} from "./GeneralActions";
import {updateTransporterBusniessLocationAPI} from "../APIs/ProfileAPIs";
import { getUserCreditialParams } from "../APIs/AuthenticationAPIs";

const axios = require("axios");

export const getPersonalInfo = (callback) => async dispatch => {
    let params = getUserCreditialParams();
    params.append("CheckTypeFunction", isTransporter() ? "TransporterProfileViewPersonalinfo" : "ClientProfileViewPersonalInfo");

    return axios.post(apiUrl, params).then(({data}) => {
        // console.log("****************************");
        // console.log(data); // temp test
        let resp = isTransporter() ? data.PersonalInfo[0] : data.server_response[0];
        callback && callback(resp);
        // console.log(resp);
        dispatch({
            type: SET_PERSONAL_INFO,
            personalInfo: resp
        })
    }).catch(err => {
        // console.log(err);
    })

};

export const getVehicleInfo = (callback) => async dispatch => {
    let params = getUserCreditialParams();
    params.append("CheckTypeFunction", "GetCarInfo");

    return axios.post(apiUrl, params).then(({data: {server_response}}) => {
        callback && callback(server_response);
        dispatch({
            type: SET_VEHICLE_INFO,
            vehicleInfo: server_response[0]
        })
    }).catch(err => {
        // console.log(err);
    })

};

export const getBusinessLocation = (callback, errCallBack) => async dispatch => {
    let params = getUserCreditialParams();
    params.append("CheckTypeFunction", isTransporter() ? "TransporterProfileViewCityinfo" : "ClientProfileGetDataTypeWork");

    return axios.post(apiUrl, params).then(({data}) => {

        // console.log(data) // temp test

        let resp = isTransporter() ? data.CityResponse : data.server_response[0];
        callback && callback(resp);
        dispatch({
            type: SET_BUSINESS_LOCATIONS,
            businessLocations: resp
        })
    }).catch(err => {
        errCallBack && errCallBack(err);
        dispatch(toastMessage(err));
        // console.log(err);
    })

};

export const getWorkingTime = (callback) => async dispatch => {
    let params = getUserCreditialParams();
    params.append("CheckTypeFunction", "TransporterProfileViewTimeinfo");

    return axios.post(apiUrl, params).then(({data: {TimeResponse}}) => {
        callback && callback(TimeResponse);
        dispatch({
            type: SET_WORKING_TIME,
            workingTime: TimeResponse[0]
        })
    }).catch(err => {
        // console.log(err);
    })

};

export const updateWorkingTime = (workingTime) => async dispatch => {
    let params = getUserCreditialParams();
    params.append("CheckTypeFunction", "UpdateWorkTranspoterParameter");

    let workingTimeObj = [{}];

    //add 2018-10-23 to each time
    workingTime.forEach(({id, from, to}) => {
        workingTimeObj[0][`${id}TimeStart`] = `2018-10-23 ${convert12TimeTo24(from)}`;
        workingTimeObj[0][`${id}TimeFinish`] = `2018-10-23 ${convert12TimeTo24(to)}`;
    });

    params.append("TimeWork", JSON.stringify({TransportrTime: workingTimeObj}));

    return axios.post(apiUrl, params).then(({data}) => {
        if (data === "WorkTimeUpdated") {
            dispatch(toastMessage("Working time is successfully updated", "Successfully Updated", "success"));
            dispatch(getWorkingTime())
        } else {
            dispatch(toastMessage("Error while updating working time"));
            // console.log(data);
        }
    }).catch(err => {
        // console.log(err);
    })

};

export const accountDetailsCleanUp = () => async dispatch => {
    dispatch({
        type: ACCOUNT_DETAILS_CLEAN_UP
    })
};

export const updateTransporterBusniessLocation = (id, action) => async dispatch => {
    updateTransporterBusniessLocationAPI(id, action).then(({data}) => {
        if (data === "AddeddSucessfully" || data === "UpdatedAddSucessfully" || data === "UpdatedRemoveSucessfully") {
            dispatch(getBusinessLocation());
            dispatch(toastMessage("Business Location Updated Successfully", "Updated Successfully", "success"));
        } else {
            dispatch(toastMessage("Error Update Business Location"));
        }
    }).catch(err => {
        dispatch(toastMessage(err, "Error Update Business Location"));
    })
};
