import { getUserCreditialParams, PAGE_SIZE } from "./AuthenticationAPIs";
import { isTransporter } from "../Util";
import { apiUrl, requestHeaders } from "../Constants/GeneralCont";

const axios = require("axios");

/* edited (transporterFunctionfilter added to filter transporter fetched orders) */

export function getFunctions(functionType, pageNumber, transporterFunctionfilter, searchStr) {

    // console.log(transporterFunctionfilter); // temp test

    let params;

    if (isTransporter()) {
        params = new URLSearchParams();
        params.append("CheckTypeFunction", functionType);
        params.append("filter", transporterFunctionfilter);
        params.append("TokenDevice", localStorage.getItem("TokenDevice"));
        params.append("transporterId", localStorage.getItem("userId"));
        params.append("langId", (localStorage.getItem("Language") || "en") === "en" ? "1" : "2");
        params.append("PageSize", PAGE_SIZE);
        params.append("PageNumber", pageNumber);

        if (searchStr.length > 0)
            params.append("searchStr", searchStr);
    } else {
        params = getUserCreditialParams();
        params.append("CheckTypeFunction", functionType);
        params.append("PageSize", PAGE_SIZE);
        params.append("PageNumber", pageNumber);

        if (searchStr.length > 0)
            params.append("searchStr", searchStr);
    }

    console.log("--------------------------------")
    console.log("functionType: " + functionType)
    console.log("PAGE_SIZE: " + PAGE_SIZE)
    console.log("pageNumber: " + pageNumber)
    console.log("searchStr: " + searchStr)

    return axios.post(apiUrl, params, {
            headers: requestHeaders,
        });
}

export function getClientDeliveredTotalAmounts() {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getClientDeliveredTotalAmounts");
    params.append("ClientId", localStorage.getItem("userId"));
    params.append("TokenDevice", localStorage.getItem("TokenDevice"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function getClientActiveTotalAmounts() {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getClientActiveTotalAmounts");
    params.append("ClientId", localStorage.getItem("userId"));
    params.append("TokenDevice", localStorage.getItem("TokenDevice"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function getBidAcceptedPrintInfo(specificOrder=""){
    console.log("order param : "+specificOrder);
var params = new URLSearchParams();
params.append("CheckTypeFunction","getBidAcceptedPrintInfo")
params.append("customerId",localStorage.getItem("userId"));
if(specificOrder!=="")
params.append("orderId",specificOrder);

return axios.post(apiUrl,params,{headers: requestHeaders});

}
export function getClientNewTotalAmounts() {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getClientNewTotalAmounts");
    params.append("ClientId", localStorage.getItem("userId"));
    params.append("TokenDevice", localStorage.getItem("TokenDevice"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function getTransporterDeliveredTotalAmounts() {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getTransporterDeliveredTotalAmounts");
    params.append("TransporterId", localStorage.getItem("userId"));
    params.append("TokenDevice", localStorage.getItem("TokenDevice"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function getTransporterActiveTotalAmounts() {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getTransporterActiveTotalAmounts");
    params.append("TransporterId", localStorage.getItem("userId"));
    params.append("TokenDevice", localStorage.getItem("TokenDevice"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function getTransporterNewTotalAmounts() {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getTransporterNewTotalAmounts");
    params.append("TransporterId", localStorage.getItem("userId"));
    params.append("TokenDevice", localStorage.getItem("TokenDevice"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function checkForForeignId(orderId) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "checkForForeignId");
    params.append("OrderId", orderId);
    params.append("customerId", localStorage.getItem("userId"));
    params.append("TokenDevice", localStorage.getItem("TokenDevice"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function getOrderDetails(orderId) {
    let params = getUserCreditialParams();
    params.append("CheckTypeFunction", "TransporterShowDetailsOrder");
    params.append("OrderId", orderId);

    /* for (let p of params) {
        console.log(JSON.stringify(p));
    } */

    // console.log(params.entries());

    /* for (const [key, value] of params.entries()) {
        console.log(key + " - " + value);
    } */

    return axios
        .post(apiUrl, params, {
            headers: requestHeaders,
        })
        .then((response) => {
            return response.data.server_response?.[0] || response.data;
        })
        .catch((error) => {
            console.log(error);
            return error.message;
        });
    // return response.data.server_response[0];
}

export function CancelOrderReq(OrderId) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "ClientDeleteOrder");
    params.append("OrderId", OrderId);
    params.append("ClientId", localStorage.getItem("userId"));
    params.append("TokenDevice", localStorage.getItem("TokenDevice"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function AcceptOfferReq(TransporterId, OrderId, OldPrice) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "AcceptClientBidEngie");
    params.append("OrderId", OrderId);
    params.append("TransporterId", TransporterId);
    params.append("OldPrice", OldPrice);
    params.append("ClientId", localStorage.getItem("userId"));
    params.append("TokenDevice", localStorage.getItem("TokenDevice"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function deleteOrder(orderId) {
    let params = getUserCreditialParams();
    params.append("CheckTypeFunction", "TransporterDeleteOrder");
    params.append("OrderId", orderId);

    axios
        .post(apiUrl, params, {
            headers: requestHeaders,
        })
        .then((response) => {
            // component.goBack();
        })
        .catch((error) => {
        });
}

export function checkTripCost(orderId, isTransporter, DeliveryCost, fromId, toId) {
    let params = getUserCreditialParams();
    if (isTransporter) {
        params.append("CheckTypeFunction", "CheckPriceTrip");
    } else {
        params.append("CheckTypeFunction", "ClientShowBidRequistsAndNetwork");
        params.append("DeliveryCost", DeliveryCost);
        params.append("fromId", fromId);
        params.append("toId", toId);
    }
    params.append("OrderId", orderId);

    //const apiUrl = "/ToGo/MobileAPi/public/FunctionApis.php";
    return axios
        .post(apiUrl, params, {
            headers: requestHeaders,
        })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
        });
}

export function setTripCost(orderId, tripCost) {
    let params = getUserCreditialParams();
    params.append("CheckTypeFunction", "TransporterSetCostOrder");
    params.append("OrderId", orderId);
    params.append("CostDelivery", tripCost);

    return axios
        .post(apiUrl, params, {
            headers: requestHeaders,
        })/* 
        .then((response) => {
            refreshPage();
        })
        .catch((error) => {
        }) */;
}

export function editTripCost(orderId, newTripCost) {
    let params = getUserCreditialParams();
    params.append("CheckTypeFunction", "TransporterEditPriceTrip");
    params.append("OrderId", orderId);
    params.append("TypeAction", "EditCost");
    params.append("NewCost", newTripCost);

    //const apiUrl = "/ToGo/MobileAPi/public/FunctionApis.php";
    return axios
        .post(apiUrl, params, {
            headers: requestHeaders,
        })/* 
        .then((response) => {
            refreshPage();
        })
        .catch((error) => {
        }) */;
}

export function deleteTripCost(orderId) {
    let params = getUserCreditialParams();
    params.append("CheckTypeFunction", "TransporterEditPriceTrip");
    params.append("OrderId", orderId);
    params.append("TypeAction", "DeleteCost");
    params.append("NewCost", "");

    return axios
        .post(apiUrl, params, {
            headers: requestHeaders,
        })/* 
        .then((response) => {
            refreshPage();
        })
        .catch((error) => {
        }) */;
}

export function finalizeTrip(orderId) {
    let params = getUserCreditialParams();
    params.append("CheckTypeFunction", "TransporterFinshTrip");
    params.append("OrderId", orderId);

    return axios
        .post(apiUrl, params, {
            headers: requestHeaders,
        })
        .then((response) => {
        })
        .catch((error) => {
        });
}

export function confirmFinalizedTrip(orderId, verificationCode, lat, long) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "TransporterConfirmFinshTrip");
    params.append("OrderId", orderId);
    params.append("CodeVerify", verificationCode);
    params.append("TransporterId", localStorage.getItem("userId"));
    params.append("TokenDevice", localStorage.getItem("TokenDevice"));
    params.append("ReciverLatitude", lat);
    params.append("ReciverLongitude", long);
    params.append("isTeamMember", localStorage.getItem("IsTeamMember"));


    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function CreateTeam(teamname) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "createNewTeam");
    params.append("teamName", teamname);

    params.append("transporterId", localStorage.getItem("userId"));
    params.append("token", localStorage.getItem("TokenDevice"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function DeleteTeam(teamId) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "deleteTeam");

    params.append("transporterMasterId", localStorage.getItem("userId"));
    params.append("teamId", teamId);
    params.append("token", localStorage.getItem("TokenDevice"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function UpdateTeam(teamname, teamId) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "updateTeamName");
    params.append("teamNewName", teamname);
    params.append("teamId", teamId);
    params.append("transporterMasterId", localStorage.getItem("userId"));
    params.append("token", localStorage.getItem("TokenDevice"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function AddTeamMember(teamId, mobileNumber) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "addTeamMember");
    params.append("mobileNumber", mobileNumber);
    params.append("transporterMasterId", localStorage.getItem("userId"));
    params.append("teamId", teamId);
    params.append("token", localStorage.getItem("TokenDevice"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function DeleteMember(memberId) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "deleteTeamMember");

    params.append("transporterMasterId", localStorage.getItem("userId"));
    params.append("memberId", memberId);
    params.append("token", localStorage.getItem("TokenDevice"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function GetTeam(teamId) {
    let params = new URLSearchParams();
    params.append("CheckTypeFunction", "getTeamMembers");
    params.append("transporterMasterId", localStorage.getItem("userId"));
    params.append("TeamId", teamId);
    params.append("token", localStorage.getItem("TokenDevice"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function GetTransporterTeam() {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getTransporterMasterTeams");
    params.append("transporterMasterId", localStorage.getItem("userId"));
    params.append("token", localStorage.getItem("TokenDevice"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function TransferToMember(teamMemberId, transferAmount) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "TransferFromMasterToMember");
    params.append("transporterMasterId", localStorage.getItem("userId"));
    params.append("token", localStorage.getItem("TokenDevice"));

    params.append("teamMemberId", teamMemberId);
    params.append("transferAmount", transferAmount);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function TransferToMaster(teamMemberId, transferAmount) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "TransferFromMemberToMaster");
    params.append("transporterMasterId", localStorage.getItem("userId"));
    params.append("token", localStorage.getItem("TokenDevice"));

    params.append("teamMemberId", teamMemberId);
    params.append("transferAmount", transferAmount);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function GetAllMembers() {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getAllTeamsMembers");
    params.append("transporterMasterId", localStorage.getItem("userId"));
    params.append("token", localStorage.getItem("TokenDevice"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function AssignOrderToMember(memberId, orderId) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "assignOrderToMember");
    params.append("masterId", localStorage.getItem("userId"));
    params.append("memberId", memberId);
    params.append("orderId", orderId);
    params.append("token", localStorage.getItem("TokenDevice"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}


export function GetTransactions(memberId) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "TeamMemberTransaction");
    params.append("TransporterMasterId", localStorage.getItem("userId"));
    params.append("TeamMemberId", memberId);
    params.append("TokenDevice", localStorage.getItem("TokenDevice"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function GetDefinedAddresses(address) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getAddresses");
    params.append("creatorId", localStorage.getItem("userId"));
    params.append("searchText", address);
    params.append("TokenDevice", localStorage.getItem("TokenDevice"));
    params.append("langId", (localStorage.getItem("Language") || "en") === "en" ? "1" : "2");

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function getPrivateAddresses(address) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getPrivateAddresses");
    params.append("creatorId", localStorage.getItem("userId"));
    params.append("searchText", address);
    params.append("TokenDevice", localStorage.getItem("TokenDevice"));
    params.append("langId", (localStorage.getItem("Language") || "en") === "en" ? "1" : "2");

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function GetCityRegion() {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "GetCityRegion");
    params.append("Idlanguage", (localStorage.getItem("Language") || "en") === "en" ? "1" : "2");
    params.append("CustomerId", localStorage.getItem("userId"));
    params.append("TokenDevice", localStorage.getItem("TokenDevice"));
    params.append("IdRegion", 1);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function CreateAddressReq(formData) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "createNewAddress");
    params.append("name", formData.placename);

    params.append("phoneNumber", formData.phone);
    params.append("details", formData.address);
    params.append("additionalInfo", formData.addressinfo);
    /* params.append("country", formData.country);
    params.append("zipCode", formData.zipcode); */
    params.append("country", "Palestine");
    params.append("zipCode", "00000");

    params.append("areaId", formData.area);
    params.append("cityId", formData.city);
    params.append("governorateId", formData.governorate);
    params.append("provinceId", formData.province);

    params.append("isShared", formData.isShared === "on");

    params.append("creatorId", localStorage.getItem("userId"));
    params.append("customerId", localStorage.getItem("userId"));
    params.append("deviceToken", localStorage.getItem("TokenDevice"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function CreateNewOrderReq(DeliveryParams, CreatedBy, AddressClint, isNewAddress) {

    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "OrderBidEnginParams");
    params.append("DeliveryParams", DeliveryParams);
    params.append("AddressClint", AddressClint);
    params.append("isNewAddress", isNewAddress);
    params.append("CustomerId", localStorage.getItem("userId"));
    params.append("TokenDevice", localStorage.getItem("TokenDevice"));
    params.append("CreatedBy", CreatedBy);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function food_createFoodOrder(deliveryParams, addresses) {

    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "food_createFoodOrder");
    params.append("deliveryParams", deliveryParams);
    params.append("addresses", addresses);
    params.append("clientCustomerId", localStorage.getItem("userId"));
    params.append("token", localStorage.getItem("TokenDevice"));
    return axios.post(apiUrl, params, { headers: requestHeaders });
}

/* edited (GetCustomerTransactions added) */

export function GetCustomerTransactions() {

    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "CustomerTransactions");

    params.append("CustomerId", localStorage.getItem("userId"));

    params.append("TokenDevice", localStorage.getItem("TokenDevice"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function GetTransporterLocation(OrderId) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "ClientTrackTransporterLocation");

    params.append("OrderId", OrderId);

    params.append("ClientId", localStorage.getItem("userId"));

    params.append("TokenDevice", localStorage.getItem("TokenDevice"));
    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function GetFinishedOrders() {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "clientFinishedOrders");

    params.append("clientId", localStorage.getItem("userId"));
    params.append("langId", (localStorage.getItem("Language") || "en") === "en" ? "1" : "2");
    params.append("TokenDevice", localStorage.getItem("TokenDevice"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

function getLangId() {
    return (localStorage.getItem("Language") || "en") === "en" ? "1" : "2";
}

export function GetCurrentOrders() {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "clientCurrentOrders");

    params.append("clientId", localStorage.getItem("userId"));
    params.append("langId", getLangId());
    params.append("TokenDevice", localStorage.getItem("TokenDevice"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}


export function GetClientOrderDetails(orderid) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "ClientShowDetailsOrderCurrent");
    params.append("OrderId", orderid);
    params.append("ClientId", localStorage.getItem("userId"));
    params.append("LangId", (localStorage.getItem("Language") || "en") === "en" ? "1" : "2");
    params.append("TokenDevice", localStorage.getItem("TokenDevice"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function GetAllBids(orderid) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "ClientShowBidRequists");
    params.append("OrderId", orderid);
    params.append("ClientId", localStorage.getItem("userId"));
    params.append("TokenDevice", localStorage.getItem("TokenDevice"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function RateTransporter(orderid, value) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "ClientRateTrip");
    params.append("OrderId", orderid);
    params.append("ClientId", localStorage.getItem("userId"));
    params.append("TokenDevice", localStorage.getItem("TokenDevice"));
    params.append("RateValue", value); // integer value between 1 - 5
    return axios.post(apiUrl, params, { headers: requestHeaders });
}


export function GetTransporterList(filter) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "transporterOrders");
    params.append("filter", filter); //"NEW_ORDERS" || "MY_ORDERS"|| "DELIVERED"
    params.append("transporterId", localStorage.getItem("userId"));
    params.append("TokenDevice", localStorage.getItem("TokenDevice"));
    params.append("langId", getLangId());
    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function GetAllNetworkMembers() {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getAllNetworkMembers");

    params.append("transporterId", localStorage.getItem("userId"));
    params.append("deviceToken", localStorage.getItem("TokenDevice"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function getAllTransportersToAdd() {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getAllTransportersToAdd");

    params.append("customerId", localStorage.getItem("userId"));
    params.append("TokenDevice", localStorage.getItem("TokenDevice"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

/* edited (add getTransporterOtherNetwork) */
export function getTransporterOtherNetwork() {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getTransporterOtherNetwork");

    params.append("transporterId", localStorage.getItem("userId"));
    params.append("deviceToken", localStorage.getItem("TokenDevice"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

/* edited (add getTransporterDirectClients) */
export function getTransporterDirectClients() {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getTransporterDirectClients");

    params.append("transporterId", localStorage.getItem("userId"));
    params.append("deviceToken", localStorage.getItem("TokenDevice"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}


/* edited (add GetAllClientNetworkMembers for client) */

export function GetAllClientNetworkMembers(/* fromId, toId */) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getClientNetwork");

    params.append("clientId", localStorage.getItem("userId"));
    params.append("token", localStorage.getItem("TokenDevice"));
    /* params.append("fromId", fromId);
    params.append("toId", toId); */

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

/* edited (add getTransporterClients for transporter) */

export function GetTransporterClients() {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getTransporterClientNetwork");

    params.append("transporterId", localStorage.getItem("userId"));
    params.append("token", localStorage.getItem("TokenDevice"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function AddMemberToNetwork(mobileNumber) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "addNetworkMember");
    params.append("mobileNumber", mobileNumber);
    params.append("transporterId", localStorage.getItem("userId"));
    params.append("deviceToken", localStorage.getItem("TokenDevice"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

/* edited (add AddTransporterToNetwork for client) */

export function AddTransporterToNetwork(mobileNumber) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "addTransporterToClientNetwork");
    params.append("mobileNumber", mobileNumber);
    params.append("clientId", localStorage.getItem("userId"));
    params.append("token", localStorage.getItem("TokenDevice"));

    /* for (let p of params) {
        console.log(p);
    } */

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function GetNetworkInvitations() {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getAllNetworkInvitation");
    params.append("transporterId", localStorage.getItem("userId"));
    params.append("deviceToken", localStorage.getItem("TokenDevice"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function JoinNetwork(userId, deliveryCost, verifyCode, note) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "activateNetwork");
    params.append("deliveryCost", deliveryCost);
    params.append("verifyCode", verifyCode);
    params.append("Note", note);
    params.append("networkOwnerId", userId);
    params.append("transporterId", localStorage.getItem("userId"));
    params.append("deviceToken", localStorage.getItem("TokenDevice"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function AssginOrderToMemberOnNetwork(orderId, userId) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "assignOrderToNetworkMember");
    params.append("orderId", orderId);

    params.append("networkMemberId", userId);
    params.append("transporterId", localStorage.getItem("userId"));
    params.append("deviceToken", localStorage.getItem("TokenDevice"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

/* edited (get transactions) */

export function getFinancialTransactions(customerId) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getFinancialTransactions");
    params.append("customerId", customerId);
    params.append("TokenDevice", localStorage.getItem("TokenDevice"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

/* edited (get invoices) */

export function invoicesTest(customerId) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "invoicesTest");
    params.append("customerId", customerId);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

/* edited (get transactions by order) */

export function transactionsByOrder(customerId, orderId) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "transactionsByOrder");
    params.append("customerId", customerId);
    params.append("orderId", orderId);
    params.append("TokenDevice", localStorage.getItem("TokenDevice"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

/* edited (get transporter info by transporter id) */

export function getTransporterInfo(transporterId) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getTransporterInfo");
    params.append("transporterId", transporterId);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}


/* edited (getTimeLine added) */

export function getTimeLine(orderId) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getTimeLine");
    params.append("orderId", orderId);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

/* edited (responseToAssignedOrder added) */

export function responseToAssignedOrder(OrderId, Response) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "responseToAssignedOrder");
    params.append("OrderId", OrderId);
    params.append("Response", Response);
    params.append("TransporterId", localStorage.getItem("userId"));
    params.append("TokenDevice", localStorage.getItem("TokenDevice"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

/* edited (to test the timeline) */
/* export function acceptOffer(orderId, transporterId, bidPrice) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "acceptOffer");
    params.append("orderId", orderId);
    params.append("transporterId", transporterId);
    params.append("bidPrice", bidPrice);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function pickupPackage(orderId, transporterId) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "pickupPackage");
    params.append("transporterId", transporterId);
    params.append("orderId", orderId);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function acceptAssignedOrder(orderId, transporterId) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "acceptAssignedOrder");
    params.append("transporterId", transporterId);
    params.append("orderId", orderId);

    return axios.post(apiUrl, params, { headers: requestHeaders });
} */

/* edited (recordAction added to record actions) */
export function recordAction(party_one_id, party_two_id, order_id, description, action_id) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "recordAction");
    params.append("party_one_id", party_one_id);
    params.append("party_one_name", party_one_name);
    params.append("party_two_id", party_two_id);
    params.append("party_two_name", party_two_name);
    params.append("order_id", order_id);
    params.append("description", description);
    params.append("action_id", action_id);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

/* edited (get order actions) */
export function getOrderActions(order_id) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getOrderActions");
    params.append("order_id", order_id);
    params.append("customerId", localStorage.getItem("userId"));
    params.append("tokenDevice", localStorage.getItem("TokenDevice"));

    return axios.post(apiUrl, params, { headers: requestHeaders });

}

/* edited (cacel assigned order) */
export function cancelAssignedOrder(orderId) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "cancelAssignedOrder");
    params.append("orderId", orderId);
    params.append("transporterId", localStorage.getItem("userId"));
    params.append("tokenDevice", localStorage.getItem("TokenDevice"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

/* edited (add CreateAssignedOrder) */
export function CreateAssignedOrder(DeliveryParams, AddressClint, TransporterId, DeliveryCost) {

    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "CreateAssignedOrder");
    params.append("DeliveryParams", DeliveryParams);

    params.append("AddressClint", AddressClint);

    params.append("CustomerId", localStorage.getItem("userId"));

    params.append("TransporterId", TransporterId);

    params.append("DeliveryCost", DeliveryCost);

    params.append("TokenDevice", localStorage.getItem("TokenDevice"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function createAlbarqOrder(DeliveryParams, AddressClint, TransporterId, DeliveryCost) {

    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "createAlbarqOrder");
    params.append("DeliveryParams", DeliveryParams);

    params.append("AddressClint", AddressClint);

    params.append("CustomerId", localStorage.getItem("userId"));

    params.append("TransporterId", TransporterId);

    params.append("DeliveryCost", DeliveryCost);

    params.append("TokenDevice", localStorage.getItem("TokenDevice"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

/* edited (add ClientAssignOrder) */
export function ClientAssignOrder(orderId, TransporterId, DeliveryCost) {

    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "ClientAssignOrder");

    params.append("CustomerId", localStorage.getItem("userId"));

    params.append("TransporterId", TransporterId);

    params.append("DeliveryCost", DeliveryCost);

    params.append("OrderId", orderId);

    params.append("TokenDevice", localStorage.getItem("TokenDevice"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

/* edited (add AcceptClientAssignOrder) */
export function AcceptClientAssignOrder(orderId, isAccepted) {

    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "AcceptClientAssignOrder");

    params.append("TransporterId", localStorage.getItem("userId"));

    params.append("OrderId", orderId);

    params.append("IsAccept", isAccepted);

    params.append("TokenDevice", localStorage.getItem("TokenDevice"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

/* edited (add MarkReturnedOrder) */
export function MarkReturnedOrder(orderId) {

    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "MarkReturnedOrder");

    params.append("TransporterId", localStorage.getItem("userId"));

    params.append("OrderId", orderId);

    params.append("TokenDevice", localStorage.getItem("TokenDevice"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

/* edited (add AcceptReturnedOrder) */
export function AcceptReturnedOrder(orderId, isAccepted) {

    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "AcceptReturnedOrder");

    params.append("TransporterId", localStorage.getItem("userId")); // it should be "ClientId" not "TransporterId" !!!! 

    params.append("OrderId", orderId);

    params.append("IsAccepted", isAccepted);

    params.append("TokenDevice", localStorage.getItem("TokenDevice"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

/* edited (add MarkStuckOrder) */
export function MarkStuckOrder(orderId, comment) {

    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "MarkStuckOrder");

    params.append("TransporterId", localStorage.getItem("userId"));

    params.append("OrderId", orderId);

    params.append("StuckComment", comment);

    params.append("TokenDevice", localStorage.getItem("TokenDevice"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

/* edited (test FCM for web) */
export function testNot(token) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "testNot");
    params.append("token", token);
    return axios.post(apiUrl, params, { headers: requestHeaders });
}

/* edited (update web notification token for FCM) */
export function updateWebNotificationToken(newWebToken) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "updateWebNotificationToken");
    params.append("userId", localStorage.getItem("userId"));
    params.append("tokenDevice", localStorage.getItem("TokenDevice"));
    params.append("newWebToken", newWebToken);
    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function GetCitiesArea(type, superId) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "GetCitiesArea");
    params.append("clientId", localStorage.getItem("userId"));
    params.append("tokenDevice", localStorage.getItem("TokenDevice"));
    params.append("type", type);
    params.append("superId", superId);
    params.append("langId", (localStorage.getItem("Language") || "en") === "en" ? 1 : 2);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

/* export function tempConvertTransCity(type, superId) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "tempConvertTransCity");

    return axios.post(apiUrl, params, { headers: requestHeaders });
} */

/* export function tempAppAlbarqRoadPrice() {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "tempAppAlbarqRoadPrice");

    return axios.post(apiUrl, params, { headers: requestHeaders });
} */

/* export function testBarq() {
    var params = new URLSearchParams();
    params.append("country_id", 1);
    params.append("region_id", 1);
    params.append("city_id", 3);

    return axios.get('https://www.albarq.ps/api/platform/geo/area', params, {
        headers: {
            "Access-Control-Allow-Origin": `*`,
            "Content-Type": `application/x-www-form-urlencoded`,
            'Api-Company-Id': `945`,
            'Api-Secret-Key': `m5xtcoh62TjCVkLpbqA6DSHt5VyWt7msN0BSFr0B7GKvTGcpXiJdPRh2oTbvCmcKVx2AZUHAkItjvI4rCcDoLRtHfl5LXkHd9Rjj`
        }
    });
} */

export function testBarq() {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "testBarq");

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function getClientDefaultAddress() {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getClientDefaultAddress");
    params.append("clientId", localStorage.getItem("userId"));
    params.append("tokenDevice", localStorage.getItem("TokenDevice"));
    params.append("langId", (localStorage.getItem("Language") || "en") === "en" ? 1 : 2);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function getClientTempAddress(addressId) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getClientTempAddress");
    params.append("clientId", localStorage.getItem("userId"));
    params.append("tokenDevice", localStorage.getItem("TokenDevice"));
    params.append("langId", (localStorage.getItem("Language") || "en") === "en" ? 1 : 2);
    params.append("addressId", addressId);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function setClientDefaultAddress(addressId) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "setClientDefaultAddress");
    params.append("clientId", localStorage.getItem("userId"));
    params.append("tokenDevice", localStorage.getItem("TokenDevice"));
    params.append("addressId", addressId);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function updateClientAutoOffer(networkMemberId, status) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "updateClientAutoOffer");
    params.append("transporterId", localStorage.getItem("userId"));
    params.append("tokenDevice", localStorage.getItem("TokenDevice"));
    params.append("status", status);
    params.append("networkMemberId", networkMemberId);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function acceptClientInvitation(networkMemberId) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "acceptClientInvitation");
    params.append("transporterId", localStorage.getItem("userId"));
    params.append("tokenDevice", localStorage.getItem("TokenDevice"));
    params.append("networkMemberId", networkMemberId);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function updateTransporterAutoAccept(networkMemberId, status) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "updateTransporterAutoAccept");
    params.append("transporterId", localStorage.getItem("userId"));
    params.append("tokenDevice", localStorage.getItem("TokenDevice"));
    params.append("status", status);
    params.append("networkMemberId", networkMemberId);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function getTotalOrdersNum() {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getTotalOrdersNum");
    params.append("id", localStorage.getItem("userId"));
    params.append("token", localStorage.getItem("TokenDevice"));
    params.append("userType", localStorage.getItem("UserType"));

    // console.log(localStorage.getItem("UserType"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function testFunction() {
    var params = new URLSearchParams();

    params.append("CheckTypeFunction", "testFunction");

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function testLogestechsArea(str) {
    var params = new URLSearchParams();

    params.append("CheckTypeFunction", "testLogestechsArea");
    params.append("str", str);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function recordRechargeBalance() {
    var params = new URLSearchParams();

    params.append("CheckTypeFunction", "recordRechargeBalance");
    params.append("amount", 50);
    params.append("mobile", "0592325932");

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function ClientFinishOrder(orderId) {
    var params = new URLSearchParams();

    params.append("CheckTypeFunction", "ClientFinishOrder");
    params.append("ClientId", localStorage.getItem("userId"));
    params.append("TokenDevice", localStorage.getItem("TokenDevice"));
    params.append("OrderId", orderId);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function getLogisticsVillagesTest(str) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getLogisticsVillagesTest");
    params.append("str", str);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function getAllCitiesTest(lang) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getAllCitiesTest");
    params.append("lang", lang);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function tempUpdateNewTransporterPrices() {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "tempUpdateNewTransporterPrices");

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function getLogestechsAreas(searchStr) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getLogestechsAreas");
    params.append("searchStr", searchStr);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function sendCustomNotification(filter, orderId) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "sendCustomNotification");
    params.append("customerId", localStorage.getItem("userId"));
    params.append("token", localStorage.getItem("TokenDevice"));
    params.append("filter", filter);
    params.append("orderId", orderId);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function getAllAreas() {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getAllAreas");

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function addToLogesAreas(togoAreaId, togoAreaName, logesVillageName) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "addToLogesAreas");
    params.append("togoAreaId", togoAreaId);
    params.append("togoAreaName", togoAreaName);
    params.append("logesVillageName", logesVillageName);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function updateTogoAreaName(areaId, newArName, newEnName) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "updateTogoAreaName");
    params.append("areaId", areaId);
    params.append("newArName", newArName);
    params.append("newEnName", newEnName);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function tempMarkArea(id, areaName, cityName) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "tempMarkArea");
    params.append("id", id);
    params.append("areaName", areaName);
    params.append("cityName", cityName);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function updateOrderReviewedStatus(status, orderId) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "updateOrderReviewedStatus");
    params.append("status", status);
    params.append("orderId", orderId);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function updateReviewedOrders(orderIds, isToReview) {

    // console.log(orderIds);

    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "updateReviewedOrders");
    params.append("orderIds", orderIds);
    params.append("isToReview", isToReview);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function getOrdersToExport(userTpye, filterStr, startDate, endDate) {

    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getOrdersToExport");
    params.append("userTpye", userTpye);
    params.append("filterStr", filterStr);
    params.append("id", localStorage.getItem("userId"));
    params.append("token", localStorage.getItem("TokenDevice"));
    params.append("langId", (localStorage.getItem("Language") || "en") === "en" ? "1" : "2");
    params.append("startDate", startDate);
    params.append("endDate", endDate);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function getTransporterTransactionsToExport() {

    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getTransporterTransactionsToExport");
    params.append("id", localStorage.getItem("userId"));
    params.append("token", localStorage.getItem("TokenDevice"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function customerEditCOD(orderId, newCod, newCurrency) {

    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "customerEditCOD");
    params.append("id", localStorage.getItem("userId"));
    params.append("token", localStorage.getItem("TokenDevice"));
    params.append("orderId", orderId);
    params.append("newCod", newCod);
    params.append("newCurrency", newCurrency);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function customerEditOrderNotes(orderId, notes) {

    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "customerEditOrderNotes");
    params.append("id", localStorage.getItem("userId"));
    params.append("token", localStorage.getItem("TokenDevice"));
    params.append("orderId", orderId);
    params.append("notes", notes);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function getOrderInfoForReturnedOrder(orderId) {

    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getOrderInfoForReturnedOrder");
    params.append("id", localStorage.getItem("userId"));
    params.append("token", localStorage.getItem("TokenDevice"));
    params.append("orderId", orderId);
    params.append("langId", (localStorage.getItem("Language") || "en") === "en" ? "1" : "2");

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function food_getCustomers() {

    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "food_getCustomers");
    params.append("customerId", localStorage.getItem("userId"));
    params.append("token", localStorage.getItem("TokenDevice"));
    params.append("langId", (localStorage.getItem("Language") || "en") === "en" ? "1" : "2");

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function food_getClientAreas() {

    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "food_getClientAreas");
    params.append("clientCustomerId", localStorage.getItem("userId"));
    params.append("token", localStorage.getItem("TokenDevice"));
    params.append("langId", (localStorage.getItem("Language") || "en") === "en" ? "1" : "2");

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function getExclusiveCustomers() {

    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getExclusiveCustomers");
    params.append("transporterId", localStorage.getItem("userId"));
    params.append("token", localStorage.getItem("TokenDevice"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function addExclusiveCustomer(name, email, phone) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "addExclusiveCustomer");
    params.append("transporterId", localStorage.getItem("userId"));
    params.append("token", localStorage.getItem("TokenDevice"));
    params.append("name", name);
    params.append("email", email);
    params.append("phone", phone);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function getLogestechsAreaByName(searchStr) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getLogestechsAreaByName");
    params.append("customerId", localStorage.getItem("userId"));
    params.append("searchStr", searchStr);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function food_addCustomer(customerPhoneNumber, clientName, description, areaId) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "food_addCustomer");
    params.append("clientCustomerId", localStorage.getItem("userId"));
    params.append("token", localStorage.getItem("TokenDevice"));
    params.append("langId", (localStorage.getItem("Language") || "en") === "en" ? "1" : "2");
    params.append("customerPhoneNumber", customerPhoneNumber);
    params.append("areaId", areaId);
    params.append("clientName", clientName);
    params.append("description", description);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function createOrder_v2(deliveryParams, addressesParams, returnedParams) {

    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "createOrder_v2");
    params.append("deliveryParams", deliveryParams);
    params.append("returnedParams", returnedParams);
    params.append("addresses", addressesParams);
    params.append("customerId", localStorage.getItem("userId"));
    params.append("token", localStorage.getItem("TokenDevice"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function exportOrders(userType, dateColumn, startDate,  endDate, orderStatuses) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "exportOrders");
    params.append("id", localStorage.getItem("userId"));
    params.append("token", localStorage.getItem("TokenDevice"));
    params.append("langId", (localStorage.getItem("Language") || "en") === "en" ? "1" : "2");
    params.append("userType", userType);
    params.append("dateColumn", dateColumn);
    params.append("startDate", startDate);
    params.append("endDate", endDate);
    params.append("orderStatuses", orderStatuses);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}