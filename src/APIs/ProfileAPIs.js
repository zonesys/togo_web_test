import { apiUrl } from "../Constants/GeneralCont";
import { getUserCreditialParams } from "./AuthenticationAPIs";

const axios = require("axios");

export const getBusinessTypes = async () => {
    let params = getUserCreditialParams();
    params.append("CheckTypeFunction", "ClientProfileGetTypeWork");
    return axios.post(apiUrl, params);
};

export const setClientBusiness = async ({ BusinessName, BusinessPlace, BusinessTypeId }) => {
    let params = getUserCreditialParams();
    params.append("CheckTypeFunction", "ClientProfileEditWorkInfo");
    params.append("WorkName", BusinessName);
    params.append("WorkPlace", BusinessPlace);
    params.append("WorkTypeId", BusinessTypeId);
    return axios.post(apiUrl, params);
};

export const updateTransporterBusniessLocationAPI = async (id, action) => {
    let params = getUserCreditialParams();
    params.append("CheckTypeFunction", "TransporterUpdateProfileCityinfo");
    params.append("CityId", id);
    params.append("CheckAction", action);
    return axios.post(apiUrl, params);
};

export const getWallet = async () => {

    var params = new URLSearchParams();
    params.append("TransporterId", localStorage.getItem("userId"));
    params.append("TokenDevice", localStorage.getItem("TokenDevice"));
    params.append("CheckTypeFunction", "GetBalanceTransporter");

    return axios.post(apiUrl, params);
};

/* edited (update web notification token for FCM) */
export function updateWebNotificationToken(newWebToken) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "updateWebNotificationToken");
    params.append("userId", localStorage.getItem("userId"));
    params.append("tokenDevice", localStorage.getItem("TokenDevice"));
    params.append("newWebToken", newWebToken);
    return axios.post(apiUrl, params);
}

export function getTransporterCitiesPrices() {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getTransporterCitiesPrices");
    params.append("transporterId", localStorage.getItem("userId"));
    params.append("tokenDevice", localStorage.getItem("TokenDevice"));
    params.append("langId", (localStorage.getItem("Language") || "en") === "en" ? 1 : 2);
    return axios.post(apiUrl, params);
}

export function updateTransporterCitiesPrices(from, to, newPrice) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "updateTransporterCitiesPrices");
    params.append("transporterId", localStorage.getItem("userId"));
    params.append("tokenDevice", localStorage.getItem("TokenDevice"));
    params.append("fromId", from);
    params.append("toId", to);
    params.append("newPrice", newPrice);
    return axios.post(apiUrl, params);
}

export function getAllGovernorates() {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getAllGovernorates");
    params.append("transporterId", localStorage.getItem("userId"));
    params.append("tokenDevice", localStorage.getItem("TokenDevice"));
    params.append("langId", (localStorage.getItem("Language") || "en") === "en" ? 1 : 2);
    return axios.post(apiUrl, params);
}
