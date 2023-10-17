import {
    ACCOUNT_DETAILS_CLEAN_UP,
    SET_BUSINESS_LOCATIONS,
    SET_PERSONAL_INFO,
    SET_VEHICLE_INFO,
    SET_WORKING_TIME
} from "../../Actions/ActionsTypes";

const initialState = {
    personalInfo: {},
    vehicleInfo: {},
    businessLocations: [],
    workingTime: {}
};

const profileReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_PERSONAL_INFO:
            return {...state, personalInfo: action.personalInfo};
        case SET_VEHICLE_INFO:
            return {...state, vehicleInfo: action.vehicleInfo};
        case SET_BUSINESS_LOCATIONS:
            return {...state, businessLocations: action.businessLocations};
        case SET_WORKING_TIME:
            return {...state, workingTime: action.workingTime};
        case ACCOUNT_DETAILS_CLEAN_UP:
            return {...state, personalInfo: {}, vehicleInfo : {}, businessLocations :[], workingTime: {}};
        default:
            return state;
    }
};

export default profileReducer;
