import {getUserCreditialParams} from "../UserManager/UserManager";
import {apiUrl} from "../../Constants/GeneralCont";

const axios = require("axios");

export function getInvoices(callback) {
    let params = getUserCreditialParams();
    params.append("CheckTypeFunction", "getTransporterInvoices");

    return axios.post(apiUrl, params).then(({data: {server_response}}) => {
        callback && callback(server_response);
    }).catch(err => {
        console.log(err);
    })
}
