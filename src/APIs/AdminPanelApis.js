import { apiUrl, requestHeaders } from "../Constants/GeneralCont";
import axios from "axios";

export function getAllOrders(searchStr) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getAllOrders");
    params.append("id", localStorage.getItem("Adminid"));
    params.append("token", localStorage.getItem("AdminToken"));
    params.append("searchStr", searchStr);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function GetAllNewOrders(searchStr, filterDate) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "GetAllNewOrders");
    params.append("id", localStorage.getItem("Adminid"));
    params.append("token", localStorage.getItem("AdminToken"));
    params.append("searchStr", searchStr);
    params.append("filterDate", filterDate);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function admin_GetAllNewFoodOrders(searchStr, filterDate) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "admin_GetAllNewFoodOrders");
    params.append("id", localStorage.getItem("Adminid"));
    params.append("token", localStorage.getItem("AdminToken"));
    params.append("searchStr", searchStr);
    params.append("filterDate", filterDate);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function GetAllActiveOrders(searchStr, filterDate) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "GetAllActiveOrders");
    params.append("id", localStorage.getItem("Adminid"));
    params.append("token", localStorage.getItem("AdminToken"));
    params.append("searchStr", searchStr);
    params.append("filterDate", filterDate);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function admin_GetAllActiveFoodOrders(searchStr, filterDate) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "admin_GetAllActiveFoodOrders");
    params.append("id", localStorage.getItem("Adminid"));
    params.append("token", localStorage.getItem("AdminToken"));
    params.append("searchStr", searchStr);
    params.append("filterDate", filterDate);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function GetAllMarkedOrders() {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "GetAllMarkedOrders");
    params.append("id", localStorage.getItem("Adminid"));
    params.append("token", localStorage.getItem("AdminToken"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function GetAllFinishedOrders(searchStr, filterDate) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "GetAllFinishedOrders");
    params.append("id", localStorage.getItem("Adminid"));
    params.append("token", localStorage.getItem("AdminToken"));
    params.append("searchStr", searchStr);
    params.append("filterDate", filterDate);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function admin_GetAllFinishedFoodOrders(searchStr, filterDate) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "admin_GetAllFinishedFoodOrders");
    params.append("id", localStorage.getItem("Adminid"));
    params.append("token", localStorage.getItem("AdminToken"));
    params.append("searchStr", searchStr);
    params.append("filterDate", filterDate);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function GetAllDeletedOrders(searchStr, filterDate) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "GetAllDeletedOrders");
    params.append("id", localStorage.getItem("Adminid"));
    params.append("token", localStorage.getItem("AdminToken"));
    params.append("searchStr", searchStr);
    params.append("filterDate", filterDate);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function admin_GetAllDeletedFoodOrders(searchStr, filterDate) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "admin_GetAllDeletedFoodOrders");
    params.append("id", localStorage.getItem("Adminid"));
    params.append("token", localStorage.getItem("AdminToken"));
    params.append("searchStr", searchStr);
    params.append("filterDate", filterDate);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function GetAllReturnedOrders(searchStr, filterDate) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "GetAllReturnedOrders");
    params.append("id", localStorage.getItem("Adminid"));
    params.append("token", localStorage.getItem("AdminToken"));
    params.append("searchStr", searchStr);
    params.append("filterDate", filterDate);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function GetAllMarkedErrorOrders(searchStr, filterDate) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "GetAllExceptionOrders");
    params.append("id", localStorage.getItem("Adminid"));
    params.append("token", localStorage.getItem("AdminToken"));
    params.append("searchStr", searchStr);
    params.append("filterDate", filterDate);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function GetAllTransporters() {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "GetAllTransporters");
    params.append("id", localStorage.getItem("Adminid"));
    params.append("token", localStorage.getItem("AdminToken"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function GetAllClients() {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "GetAllClients");
    params.append("id", localStorage.getItem("Adminid"));
    params.append("token", localStorage.getItem("AdminToken"));

    return axios.post(apiUrl, params);
}

export function getCustomerInfoForWayBill(orderId) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getCustomerInfoForWayBill");
    params.append("orderId", orderId);
    params.append("id", localStorage.getItem("Adminid"));
    params.append("token", localStorage.getItem("AdminToken"));

    return axios.post(apiUrl, params);
}

/* edited (test transactions) */

/*export function transactionTest(customerId){
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "transactionTest");
    params.append("partner_id", customerId);

    return axios.post(apiUrl, params, {headers: requestHeaders});
}*/


/* edited (get Transporter personal info) */
export function GetTransporterPersonalInfo(customerId) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getTransporterPersonalInfo");
    params.append("customerId", customerId);
    params.append("id", localStorage.getItem("Adminid"));
    params.append("token", localStorage.getItem("AdminToken"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}


/* edited (edit Transporter personal info) */


/* edited (get Client personal info) */
export function GetClientPersonalInfo(customerId) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getClientPersonalInfo");
    params.append("customerId", customerId);
    params.append("id", localStorage.getItem("Adminid"));
    params.append("token", localStorage.getItem("AdminToken"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

/* edited (get Client Business info) */
export function GetClientBusinessInfo(customerId) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getClientBusinessInfo");
    params.append("customerId", customerId);
    params.append("id", localStorage.getItem("Adminid"));
    params.append("token", localStorage.getItem("AdminToken"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function getClientTotalOrdersNum(customerId) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getClientTotalOrdersNum");
    params.append("customerId", customerId);
    params.append("id", localStorage.getItem("Adminid"));
    params.append("token", localStorage.getItem("AdminToken"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function getTransporterTotalOrdersNum(customerId) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getTransporterTotalOrdersNum");
    params.append("customerId", customerId);
    params.append("id", localStorage.getItem("Adminid"));
    params.append("token", localStorage.getItem("AdminToken"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

/* edited (edit Client personal info) */

/* edited (get Transporter working time) */
export function GetTransporterWorkingTimes(transporterId) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getTransporterWorkingTimes");
    params.append("transporterId", transporterId);
    params.append("id", localStorage.getItem("Adminid"));
    params.append("token", localStorage.getItem("AdminToken"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

/* edited (get Transporter Business Locations time) */
export function GetTransporterBusinessLocation(transporterId) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getTransporterBusinessLocation");
    params.append("transporterId", transporterId);
    params.append("id", localStorage.getItem("Adminid"));
    params.append("token", localStorage.getItem("AdminToken"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

/* edited (get all actions records) */
export function getRecordsActions() {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getRecordsActions");
    params.append("id", localStorage.getItem("Adminid"));
    params.append("token", localStorage.getItem("AdminToken"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function getLastRecord() {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getLastRecord");
    params.append("id", localStorage.getItem("Adminid"));
    params.append("token", localStorage.getItem("AdminToken"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

/* edited (get escrow total balance) */
export function getTotalBalance(/* accountId */) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getTotalBalance");
    params.append("id", localStorage.getItem("Adminid"));
    params.append("token", localStorage.getItem("AdminToken"));
    // params.append("accountId", "accountId");

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

// total today COD
export function getTotalTodayCOD() {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getTotalTodayCOD");
    params.append("id", localStorage.getItem("Adminid"));
    params.append("token", localStorage.getItem("AdminToken"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

// total today active count
export function getTotalTodayActiveCount() {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getTotalTodayActiveCount");
    params.append("id", localStorage.getItem("Adminid"));
    params.append("token", localStorage.getItem("AdminToken"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

/* edited (get last order id) */
export function getLastOrderId(/* accountId */) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getLastOrderId");
    params.append("id", localStorage.getItem("Adminid"));
    params.append("token", localStorage.getItem("AdminToken"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

/* edited (get transporter vehicle information) */
export function GetTransporterVehiclesInfo(transporterId) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "GetTransporterVehiclesInfo");
    params.append("transporter_id", transporterId);
    params.append("id", localStorage.getItem("Adminid"));
    params.append("token", localStorage.getItem("AdminToken"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function tempRegisterAdmin() {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "tempRegisterAdmin");

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function adminCheckToLoginLogin(username, password) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "adminCheckToLoginLogin");
    params.append("username", username);
    params.append("password", password);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

/* edited (update web notification token for FCM) */
export function updateAdminWebNotificationToken(newWebToken) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "updateAdminWebNotificationToken");
    params.append("Adminid", localStorage.getItem("Adminid"));
    params.append("AdminToken", localStorage.getItem("AdminToken"));
    params.append("newWebToken", newWebToken);
    return axios.post(apiUrl, params);
}

// --------------------------------------------------------

export function getOrderDetailsForAdmin(orderId) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getOrderDetailsForAdmin");
    params.append("OrderId", orderId);
    params.append("Adminid", localStorage.getItem("Adminid"));
    params.append("AdminToken", localStorage.getItem("AdminToken"));
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

/* edited (get order actions) */
export function getOrderActionsForAdmin(order_id) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getOrderActionsForAdmin");
    params.append("order_id", order_id);
    params.append("Adminid", localStorage.getItem("Adminid"));
    params.append("AdminToken", localStorage.getItem("AdminToken"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

/* edited (get transactions by order) */
export function transactionsByOrderForAdmin(orderId) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "transactionsByOrderForAdmin");
    params.append("id", localStorage.getItem("Adminid"));
    params.append("token", localStorage.getItem("AdminToken"));
    params.append("orderId", orderId);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

/* edited (getTimeLineForAdmin added) */
export function getTimeLineForAdmin(orderId) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getTimeLineForAdmin");
    params.append("orderId", orderId);
    params.append("Adminid", localStorage.getItem("Adminid"));
    params.append("AdminToken", localStorage.getItem("AdminToken"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

/* edited (getAllBalanceChargeActions added) */
export function getAllBalanceChargeActions(orderId) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getAllBalanceChargeActions");
    params.append("id", localStorage.getItem("Adminid"));
    params.append("token", localStorage.getItem("AdminToken"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

/* edited (getAllVerifyCodes added) */
export function getAllVerifyCodes(orderId) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getAllVerifyCodes");
    params.append("id", localStorage.getItem("Adminid"));
    params.append("token", localStorage.getItem("AdminToken"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

/* edited (GetAllClientsNum added) */
export function GetAllClientsNum() {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "GetAllClientsNum");
    params.append("id", localStorage.getItem("Adminid"));
    params.append("token", localStorage.getItem("AdminToken"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

/* edited (GetAllTransportersNum added) */
export function GetAllTransportersNum() {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "GetAllTransportersNum");
    params.append("id", localStorage.getItem("Adminid"));
    params.append("token", localStorage.getItem("AdminToken"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

/* edited (GetAllCities added) */
export function GetAllCities(type) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "GetAllCities");
    params.append("id", localStorage.getItem("Adminid"));
    params.append("token", localStorage.getItem("AdminToken"));
    params.append("type", type);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function getLocationUsers(cityId, type) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getLocationUsers");
    params.append("id", localStorage.getItem("Adminid"));
    params.append("token", localStorage.getItem("AdminToken"));
    params.append("cityId", cityId);
    params.append("type", type);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function updateTransporterPersonalInfo(
    personalInfoArr,
    personalImageCode,
    tempPersonalImageName,
    isPersonalImageUpdated,
    isPersonalNewImage,
    licenceImageCode,
    licenceImageName,
    isLicenceImageUpdated,
    isNewLicenceImage
) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "updateTransporterPersonalInfo");
    params.append("id", localStorage.getItem("Adminid"));
    params.append("token", localStorage.getItem("AdminToken"));
    params.append("info", personalInfoArr);

    params.append("personalImageCode", personalImageCode);
    params.append("tempPersonalImageName", tempPersonalImageName);
    params.append("isPersonalImageUpdated", isPersonalImageUpdated);
    params.append("isPersonalNewImage", isPersonalNewImage);

    params.append("licenceImageCode", licenceImageCode);
    params.append("licenceImageName", licenceImageName);
    params.append("isLicenceImageUpdated", isLicenceImageUpdated);
    params.append("isNewLicenceImage", isNewLicenceImage);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function updateClientPersonalInfo(
    personalInfoArr,
    personalImageCode,
    tempPersonalImageName,
    isPersonalImageUpdated,
    isPersonalNewImage
) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "updateClientPersonalInfo");
    params.append("id", localStorage.getItem("Adminid"));
    params.append("token", localStorage.getItem("AdminToken"));
    params.append("info", personalInfoArr);

    params.append("personalImageCode", personalImageCode);
    params.append("tempPersonalImageName", tempPersonalImageName);
    params.append("isPersonalImageUpdated", isPersonalImageUpdated);
    params.append("isPersonalNewImage", isPersonalNewImage);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function updateClientBusinessInfo(businessInfo) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "updateClientBusinessInfo");
    params.append("id", localStorage.getItem("Adminid"));
    params.append("token", localStorage.getItem("AdminToken"));
    params.append("info", businessInfo);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function updateTransporterBusinessLocations(cityId, checked, transporterId) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "updateTransporterBusinessLocations");
    params.append("id", localStorage.getItem("Adminid"));
    params.append("token", localStorage.getItem("AdminToken"));
    params.append("cityId", cityId);
    params.append("checked", checked);
    params.append("transporterId", transporterId);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function blockUser(customerId, status) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "blockUser");
    params.append("id", localStorage.getItem("Adminid"));
    params.append("token", localStorage.getItem("AdminToken"));
    params.append("customerId", customerId);
    params.append("status", status);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function getTransporterCitiesPricesForAdmin(transId) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getTransporterCitiesPricesForAdmin");
    params.append("adminId", localStorage.getItem("Adminid"));
    params.append("adminToken", localStorage.getItem("AdminToken"));
    params.append("langId", 1);
    params.append("transId", transId);

    return axios.post(apiUrl, params);
}

export function updateTransporterCitiesPricesForAdmin(transId, fromId, toId, newPrice) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "updateTransporterCitiesPricesForAdmin");
    params.append("adminId", localStorage.getItem("Adminid"));
    params.append("adminToken", localStorage.getItem("AdminToken"));
    params.append("transId", transId);
    params.append("fromId", fromId);
    params.append("toId", toId);
    params.append("newPrice", newPrice);

    return axios.post(apiUrl, params);
}

export function deleteOrderBeforePickupForAdmin(orderId) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "deleteOrderBeforePickupForAdmin");
    params.append("adminId", localStorage.getItem("Adminid"));
    params.append("adminToken", localStorage.getItem("AdminToken"));
    params.append("orderId", orderId);

    return axios.post(apiUrl, params);
}

export function forceReturnOrder(orderId) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "forceReturnOrder");
    params.append("adminId", localStorage.getItem("Adminid"));
    params.append("adminToken", localStorage.getItem("AdminToken"));
    params.append("orderId", orderId);

    return axios.post(apiUrl, params);
}

export function deleteNewOrderForAdmin(orderId) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "deleteNewOrderForAdmin");
    params.append("adminId", localStorage.getItem("Adminid"));
    params.append("adminToken", localStorage.getItem("AdminToken"));
    params.append("orderId", orderId);

    return axios.post(apiUrl, params);
}

export function isAdminLogedIn() {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "isAdminLogedIn");
    params.append("adminId", localStorage.getItem("Adminid"));
    params.append("AdminToken", localStorage.getItem("AdminToken"));

    return axios.post(apiUrl, params);
}

export function testApi() {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "testApi");

    params.append("AdminToken", localStorage.getItem("AdminToken"));

    return axios.post(apiUrl, params);
}

export function checkForForeignId(orderId) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "checkForForeignIdForAdmin");
    params.append("OrderId", orderId);
    params.append("adminId", localStorage.getItem("Adminid"));
    params.append("AdminToken", localStorage.getItem("AdminToken"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

/* export function testOddoInvoice() {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "testOddoInvoice");

    return axios.post(apiUrl, params, { headers: requestHeaders });
} */

export function getCustomersWithdrawRequestsForAdmin() {
    let params = new URLSearchParams();
    params.append("CheckTypeFunction", "getCustomersWithdrawRequestsForAdmin");
    params.append("adminId", localStorage.getItem("Adminid"));
    params.append("adminToken", localStorage.getItem("AdminToken"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function completeWithdrawRequest(withdrawalId, ref) {
    let params = new URLSearchParams();
    params.append("CheckTypeFunction", "completeWithdrawRequest");
    params.append("adminId", localStorage.getItem("Adminid"));
    params.append("adminToken", localStorage.getItem("AdminToken"));
    params.append("withdrawalId", withdrawalId);
    params.append("ref", ref);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function rejectWithdrawRequest(withdrawalId) {
    let params = new URLSearchParams();
    params.append("CheckTypeFunction", "rejectWithdrawRequest");
    params.append("adminId", localStorage.getItem("Adminid"));
    params.append("adminToken", localStorage.getItem("AdminToken"));
    params.append("withdrawalId", withdrawalId);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function forcePickup(OrderId) {
    let params = new URLSearchParams();
    params.append("CheckTypeFunction", "forcePickup");
    params.append("adminId", localStorage.getItem("Adminid"));
    params.append("TokenDevice", localStorage.getItem("AdminToken"));
    params.append("OrderId", OrderId);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function forceFinishOrder(OrderId) {
    let params = new URLSearchParams();
    params.append("CheckTypeFunction", "forceFinishOrder");
    params.append("adminId", localStorage.getItem("Adminid"));
    params.append("TokenDevice", localStorage.getItem("AdminToken"));
    params.append("OrderId", OrderId);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function tempAddFunction() {
    let params = new URLSearchParams();
    params.append("CheckTypeFunction", "tempAddFunction");

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function tempUpdateNewTransporterPrices(transId) {
    let params = new URLSearchParams();
    params.append("CheckTypeFunction", "tempUpdateNewTransporterPrices");
    params.append("transId", transId)

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function transactionsByOrder(customerId, orderId) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "transactionsByOrderForAdmin");
    params.append("customerId", customerId);
    params.append("orderId", orderId);
    params.append("adminId", localStorage.getItem("Adminid"));
    params.append("TokenDevice", localStorage.getItem("AdminToken"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function nonoTest(isClient) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "nonoTest");
    params.append("isClient", isClient);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function getClientNetworkForAdmin(clientId) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getClientNetworkForAdmin");
    params.append("clientId", clientId);
    params.append("adminId", localStorage.getItem("Adminid"));
    params.append("TokenDevice", localStorage.getItem("AdminToken"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function getClientPriceList(clientId) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getClientPriceList");
    params.append("clientId", clientId);
    params.append("adminId", localStorage.getItem("Adminid"));
    params.append("TokenDevice", localStorage.getItem("AdminToken"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function updateClientDeliveryCostList(clientId, cost, areas) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "updateClientDeliveryCostList");
    params.append("clientId", clientId);
    params.append("cost", cost);
    params.append("areas", areas);
    params.append("adminId", localStorage.getItem("Adminid"));
    params.append("TokenDevice", localStorage.getItem("AdminToken"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function updateClientAutoOfferForAdmin(status, networkMemberId) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "updateClientAutoOfferForAdmin");
    params.append("status", status);
    params.append("networkMemberId", networkMemberId);
    params.append("id", localStorage.getItem("Adminid"));
    params.append("token", localStorage.getItem("AdminToken"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function getAllTransportersToAddForAdmin(clientId) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getAllTransportersToAddForAdmin");
    params.append("clientId", clientId);
    params.append("id", localStorage.getItem("Adminid"));
    params.append("token", localStorage.getItem("AdminToken"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function AddTransporterToClientNetworkFoAdmin(mobileNumber, clientId) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "AddTransporterToClientNetworkFoAdmin");
    params.append("mobileNumber", mobileNumber);
    params.append("clientId", clientId);
    params.append("id", localStorage.getItem("Adminid"));
    params.append("token", localStorage.getItem("AdminToken"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function AdminCheckTripCost(ClientId, orderId, DeliveryCost, fromId, toId) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "AdminCheckTripCost");
    params.append("ClientId", ClientId);
    params.append("OrderId", orderId);
    params.append("DeliveryCost", DeliveryCost);
    params.append("fromId", fromId);
    params.append("toId", toId);
    params.append("adminId", localStorage.getItem("Adminid"));
    params.append("adminToken", localStorage.getItem("AdminToken"));

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function AdminAcceptOfferReq(ClientId, TransporterId, OrderId, OldPrice) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "AdminAcceptOfferReq");
    params.append("adminId", localStorage.getItem("Adminid"));
    params.append("adminToken", localStorage.getItem("AdminToken"));
    params.append("OrderId", OrderId);
    params.append("TransporterId", TransporterId);
    params.append("OldPrice", OldPrice);
    params.append("ClientId", ClientId);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function AdminAcceptOfferReqFIX(ClientId, TransporterId, OrderId, OldPrice) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "AdminAcceptOfferReqFIX");
    params.append("adminId", localStorage.getItem("Adminid"));
    params.append("adminToken", localStorage.getItem("AdminToken"));
    params.append("OrderId", OrderId);
    params.append("TransporterId", TransporterId);
    params.append("OldPrice", OldPrice);
    params.append("ClientId", ClientId);

    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function AdminRemoveAddErrorMark(orderId, status) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "AdminRemoveAddErrorMark");
    params.append("id", localStorage.getItem("Adminid"));
    params.append("token", localStorage.getItem("AdminToken"));
    params.append("orderId", orderId);
    params.append("status", status);
    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function undoCancledActiveOrder(orderId) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "undoCancledActiveOrder");
    params.append("id", localStorage.getItem("Adminid"));
    params.append("token", localStorage.getItem("AdminToken"));
    params.append("orderId", orderId);
    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function alterActiveOrderCOD(orderId, newCOD) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "alterActiveOrderCOD");
    params.append("id", localStorage.getItem("Adminid"));
    params.append("token", localStorage.getItem("AdminToken"));
    params.append("newCOD", newCOD);
    params.append("orderId", orderId);
    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function getTotalTempBalance() {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getTotalTempBalance");
    params.append("id", localStorage.getItem("Adminid"));
    params.append("token", localStorage.getItem("AdminToken"));
    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function getUserTotalTempBalance(userId) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getUserTotalTempBalance");
    params.append("id", localStorage.getItem("Adminid"));
    params.append("token", localStorage.getItem("AdminToken"));
    params.append("userId", userId);
    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function getErrMsg(orderId) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getErrMsg");
    params.append("id", localStorage.getItem("Adminid"));
    params.append("token", localStorage.getItem("AdminToken"));
    params.append("orderId", orderId);
    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function lendMoney(userId, amount, code) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "lendMoney");
    params.append("adminId", localStorage.getItem("Adminid"));
    params.append("token", localStorage.getItem("AdminToken"));
    params.append("userId", userId);
    params.append("amount", amount);
    params.append("code", code);
    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function collectMoney(userId, amount, code) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "collectMoney");
    params.append("adminId", localStorage.getItem("Adminid"));
    params.append("token", localStorage.getItem("AdminToken"));
    params.append("userId", userId);
    params.append("amount", amount);
    params.append("code", code);
    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function getTempTransactions(userId) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getTempTransactions");
    params.append("adminId", localStorage.getItem("Adminid"));
    params.append("token", localStorage.getItem("AdminToken"));
    params.append("userId", userId);
    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function sendLoanVerifyCodeForAdmin(fullName, amount, actionType) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "sendLoanVerifyCodeForAdmin");
    params.append("adminId", localStorage.getItem("Adminid"));
    params.append("token", localStorage.getItem("AdminToken"));
    params.append("fullName", fullName);
    params.append("amount", amount);
    params.append("actionType", actionType);
    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function getOrdersCount() {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getOrdersCount");
    params.append("id", localStorage.getItem("Adminid"));
    params.append("token", localStorage.getItem("AdminToken"));
    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function sendAdminLoginVerificationCode(adminId) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "sendAdminLoginVerificationCode");
    params.append("adminId", adminId);
    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function adminLogin($id, $token, $code) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "adminLogin");
    params.append("id", $id);
    params.append("token", $token);
    params.append("code", $code);
    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function updateActiveOrderSellPrice($orderId, $transporterId, $merchantId, $oldAmount, $newAmount) {

    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "updateActiveOrderSellPrice");
    params.append("adminId", localStorage.getItem("Adminid"));
    params.append("adminToken", localStorage.getItem("AdminToken"));
    params.append("orderId", $orderId);
    params.append("transporterId", $transporterId);
    params.append("merchantId", $merchantId);
    params.append("oldAmount", $oldAmount);
    params.append("newAmount", $newAmount);
    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function getTransportersStat() {

    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getTransportersStat");
    params.append("adminId", localStorage.getItem("Adminid"));
    params.append("adminToken", localStorage.getItem("AdminToken"));
    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function getCODCollectedLastWeek() {

    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getCODCollectedLastWeek");
    params.append("adminId", localStorage.getItem("Adminid"));
    params.append("adminToken", localStorage.getItem("AdminToken"));
    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function getLoans() {

    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "getLoans");
    params.append("adminId", localStorage.getItem("Adminid"));
    params.append("adminToken", localStorage.getItem("AdminToken"));
    return axios.post(apiUrl, params, { headers: requestHeaders });
}

export function getOliveryStatus(oliveryOrderId) {
    console.log({oliveryOrderId})
    var formData = new FormData();
    formData.append("CheckTypeFunction", "getOliveryStatus");
    formData.append("username", "0568866124");
    formData.append("password", "123123123");
    formData.append("orderId", oliveryOrderId);
    return axios.post(apiUrl, formData, { headers: requestHeaders });
}