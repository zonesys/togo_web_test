import {apiUrl} from "../Constants/GeneralCont";

const axios = require("axios");
const requestHeaders = {
    "Access-Control-Allow-Origin": `*`,
    "Content-Type": `application/x-www-form-urlencoded`,
};

export function getCustomerWithdrawRequests() {
    let params = new URLSearchParams();
    params.append("CheckTypeFunction", "getCustomerWithdrawRequests");
    params.append("customerId", localStorage.getItem("userId"));
    params.append("TokenDevice", localStorage.getItem("TokenDevice"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function requestWithdraw(amount) {
    let params = new URLSearchParams();
    params.append("CheckTypeFunction", "requestWithdraw");
    params.append("customerId", localStorage.getItem("userId"));
    params.append("TokenDevice", localStorage.getItem("TokenDevice"));
    params.append("amount", amount);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}
