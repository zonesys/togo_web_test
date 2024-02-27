import { apiUrl } from "../Constants/GeneralCont";

import { getUserToken } from "../firebase";
import { updateWebNotificationToken } from "./ProfileAPIs";

const axios = require("axios");
const requestHeaders = {
    "Access-Control-Allow-Origin": `*`,
    "Content-Type": `application/x-www-form-urlencoded`,
};

export const PAGE_SIZE = 100;

export function getUserCreditialParams() {
    var requestParams = new URLSearchParams();

    requestParams.append("TransporterId", localStorage.getItem("userId"));
    requestParams.append("TokenDevice", localStorage.getItem("TokenDevice"));
    //TODO::change to language id
    requestParams.append("LangId", (localStorage.getItem("Language") || "en") === "en" ? "1" : "2");
    // requestParams.append("Idlanguage", "1"); // test
    // requestParams.append("PageSize", PAGE_SIZE);
    // requestParams.append("PageNumber", "1");
    requestParams.append("CustomerId", localStorage.getItem("userId"));
    requestParams.append("ClientId", localStorage.getItem("userId"));
    // requestParams.append(
    //     "TokenDevice",
    //     "43507034b1ad5612d9d540278cc4c6e033950727"
    // );
    return requestParams;
}

export function getAuthenticationQR() {
    let params = getUserCreditialParams();
    params.append("CheckTypeFunction", "GenerateUUID");
    return axios
        .post(apiUrl, params, {
            headers: requestHeaders,
        })
        .then((response) => {
            if (response.data === "Function Not Found") {
                return "null";
            }
            return response.data;
        })
        .catch((error) => {
            console.log(error);
        });
}

function requestPermission() {
    console.log('Requesting permission...');
    Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
            console.log('Notification permission granted.');

            tokenFunc();
        } else {
            console.log('Notification permission denied.');
        }
    })
}

let data;

async function tokenFunc() {
    data = await getUserToken();
    if (data) {
        console.log("Token is", data);

        updateWebNotificationToken(data).then((res) => {
            console.log(res.data);
        })
    }
    return data;
}

export const checkAccessAPI = (qrUUID) => {
    let params = new URLSearchParams();
    params.append("CheckTypeFunction", "getUserCredentials");
    params.append("QRId", qrUUID);
    return axios
        .post(apiUrl, params, {
            headers: requestHeaders,
        })
        .then((response) => {
            if (
                response.data === "Function Not Found" ||
                response.data.ResultArray[0].CustomerId === null
            ) {
                return false;
            }

            localStorage.setItem("fullName", response.data.ResultArray[0].FullName);
            localStorage.setItem("userId", response.data.ResultArray[0].CustomerId);
            localStorage.setItem("TokenDevice", response.data.ResultArray[0].TokenDevice);
            localStorage.setItem("UserType", response.data.ResultArray[0].UserType);
            localStorage.setItem("IsTransporterMaster", response.data.ResultArray[0].IsTransporterMaster);
            localStorage.setItem("IsTeamMember", response.data.ResultArray[0].IsTeamMember);

            if (response.data.ResultArray[0].isFoodClient == "1") {
                localStorage.setItem("IsFoodClient", "true");
            } else {
                localStorage.setItem("IsFoodClient", "false");
            }

            requestPermission();

            return true;
        })
        .catch((error) => {
            console.log(error);
        });
};
