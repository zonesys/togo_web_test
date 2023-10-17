import { apiUrl, requestHeaders } from "../Constants/GeneralCont";

const axios = require("axios");

export function fetchSupersetGusetToken() {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "fetchSupersetGusetToken");

    return axios.post(apiUrl, params, { headers: requestHeaders });
}