import {apiUrl} from "../Constants/GeneralCont";

const axios = require("axios");
const requestHeaders = {
    "Access-Control-Allow-Origin": `*`,
    "Content-Type": `application/x-www-form-urlencoded`,
};


export function calculateTransactions(orderId) {
    let params = new FormData();
    params.append("CheckTypeFunction", "calculateTransactions");
    params.append("customerId", localStorage.getItem("userId"));
    params.append("TokenDevice", localStorage.getItem("TokenDevice"));
    params.append("orderId", orderId);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function getCustomerWithdrawRequests() {
    let params = new URLSearchParams();
    params.append("CheckTypeFunction", "getCustomerWithdrawRequests");
    params.append("customerId", localStorage.getItem("userId"));
    params.append("TokenDevice", localStorage.getItem("TokenDevice"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function requestWithdraw(amount,orderIds="") {
    let params = new URLSearchParams();
    params.append("CheckTypeFunction", "requestWithdraw");
    params.append("customerId", localStorage.getItem("userId"));
    params.append("TokenDevice", localStorage.getItem("TokenDevice"));
    params.append("amount", amount);
    params.append("orderIds", orderIds);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function getOrdersById(orderIds="") {
    let params = new URLSearchParams();
    params.append("CheckTypeFunction", "getClientOrders");
    params.append("id", localStorage.getItem("userId"));
    params.append("token", localStorage.getItem("TokenDevice"));
    params.append("orderIds", orderIds);
    params.append("filter", "BY_ID");

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

