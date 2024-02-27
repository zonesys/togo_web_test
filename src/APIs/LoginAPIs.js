import Axios from "axios";
import { apiUrl, requestHeaders } from "../Constants/GeneralCont";


export function LoginUser(phoneNumber) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "Login");
    params.append("PhoneNumber", phoneNumber);

    params.append("TypeCustomer", localStorage.getItem("UserType"));

    return Axios.post(apiUrl, params, { headers: requestHeaders });
}

export function ActivateUser(phoneNumber, code, token) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "VerifiedAcount");
    params.append("PhoneNumber", phoneNumber);
    params.append("Code", code);

    params.append("TokenNotifiy", "");
    params.append("TokenDevice", token);
    params.append("RegionId", localStorage.getItem("RegId"));
    params.append("LangId", localStorage.getItem("LanguageId"));

    return Axios.post(apiUrl, params, { headers: requestHeaders });

}

export function ResendCode() {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "RecendCode");
    params.append("PhoneNumber", localStorage.getItem("PhoneNumber"));

    return Axios.post(apiUrl, params, { headers: requestHeaders });

}

export function GetLangs() {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "GetLanguages");

    return Axios.post(apiUrl, params, { headers: requestHeaders });

}

export function GetCountryCode() {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "GetRegionsAndIntroductions");

    params.append("IdLanguages", localStorage.getItem("LanguageId"));

    return Axios.post(apiUrl, params, { headers: requestHeaders });

}

export function SetPersonalInfo(FirstName, LastName, IdClient, Email) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "SetPersonalInfo");

    params.append("FirstName", FirstName);
    params.append("LastName", LastName);
    params.append("IdClient", IdClient);
    params.append("Email", Email);
    params.append("CustomerId", localStorage.getItem("userId"));
    params.append("TokenDevice", localStorage.getItem("TokenDevice"));

    return Axios.post(apiUrl, params, { headers: requestHeaders });

}

export function SetBusinessInfo(BusinessName, BusinessType, BusinessPlace, ImgCode) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "SetBusinessInfo");

    params.append("BusinessName", BusinessName);
    params.append("BusinessPlace", BusinessPlace);
    params.append("BusinessType", BusinessType);
    params.append("ImgName", "image" + Date.now() + ".jpg");
    params.append("ImgCode", ImgCode);

    params.append("CustomerId", localStorage.getItem("userId"));
    params.append("TokenDevice", localStorage.getItem("TokenDevice"));

    return Axios.post(apiUrl, params, { headers: requestHeaders });
}

export function GetTypeBusiness(BusinessName, BusinessType, BusinessPlace) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "GetTypeBusiness");

    params.append("Idlanguage", localStorage.getItem("LanguageId"));

    params.append("CustomerId", localStorage.getItem("userId"));
    params.append("TokenDevice", localStorage.getItem("TokenDevice"));

    return Axios.post(apiUrl, params, { headers: requestHeaders });
}

export function GetLicenceAndIdentity() {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "GetIdPlaceLicence");

    params.append("Idlanguage", localStorage.getItem("LanguageId"));

    params.append("CustomerId", localStorage.getItem("userId"));
    params.append("TokenDevice", localStorage.getItem("TokenDevice"));

    return Axios.post(apiUrl, params, { headers: requestHeaders });
}

export function SetTransporterPersonalInfo(info, IDPlace, LicenceType, personalImgCode, licenceImgCode) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "SetTransporterInfo");

    params.append("TokenDevice", localStorage.getItem("TokenDevice"));
    params.append("CustomerId", localStorage.getItem("userId"));

    params.append("FirstName", info.FirstName.value);
    params.append("LastName", info.LastName.value);

    params.append("BirthDay", (new Date()).toLocaleDateString());
    params.append("IDPlace", IDPlace);
    params.append("IDNumber", info.IDNumber.value);
    params.append("LicenceNumber", info.LicenceNumber.value);
    params.append("LicenceType", LicenceType);
    params.append("Email", info.Email.value);

    params.append("LicenceImgName", "image" + Date.now() + ".jpg");
    params.append("PersonalImgName", "image" + (Date.now() + 1) + ".jpg");

    params.append("AccountName", info.AccountName.value);

    params.append("PersonalImgCode", personalImgCode);

    params.append("LicenceImgCode", licenceImgCode);


    return Axios.post(apiUrl, params, { headers: requestHeaders });
}

export function GetVehicleImgs() {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "GetColorPhotoCar");

    params.append("Idlanguage", localStorage.getItem("LanguageId"));

    params.append("CustomerId", localStorage.getItem("userId"));
    params.append("TokenDevice", localStorage.getItem("TokenDevice"));

    return Axios.post(apiUrl, params, { headers: requestHeaders });
}

export function SetVehicleInfo(info, carColorId, vehicleId, RegistrationImgCode, CarImgCode) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "SetCarInfo");

    params.append("CustomerId", localStorage.getItem("userId"));
    params.append("TokenDevice", localStorage.getItem("TokenDevice"));

    params.append("RegistrationNumber", info.RegNumber.value);
    params.append("RegistrationFinshDay", info.RegDate.value);
    params.append("LicenceCarNumber", info.VehicleNumber.value);
    params.append("CarColorId", carColorId);
    params.append("CarImgName", "image" + Date.now() + ".jpg");
    params.append("RegistrationImgName", "image" + (Date.now() + 1) + ".jpg");

    // (This contain id of car type that you select from cars type icons)
    params.append("CarImgId", vehicleId);
    // (This is a Integer List that contain delivery type ids that checked by transporter)
    params.append("deliveryTypes", [
        info.foodPkg.checked ? info.foodPkg.value : undefined,
        info.smPkg.checked ? info.smPkg.value : undefined,
        info.mdPkg.checked ? info.mdPkg.value : undefined,
        info.lgPkg.checked ? info.lgPkg.value : undefined,
    ]);

    params.append("CarImgCode", CarImgCode);
    params.append("RegistrationImgCode", RegistrationImgCode);


    params.forEach(function (value, key) {
        console.log(value, key);
    });

    return Axios.post(apiUrl, params, { headers: requestHeaders });
}


export function SetWorkingHours(selectedCities, request) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "SetWorkTranspoterParameter");
    // (Json array contains selected cities)
    params.append("CityWork", JSON.stringify(selectedCities));
    // (Json array contains selected work time and days)
    params.append("TimeWork", JSON.stringify(request));

    params.append("CustomerId", localStorage.getItem("userId"));
    params.append("TokenDevice", localStorage.getItem("TokenDevice"));

    return Axios.post(apiUrl, params, { headers: requestHeaders });
}

export function sendVerificationCode(phoneNumber) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "sendVerificationCode");
    params.append("phoneNumber", phoneNumber);

    return Axios.post(apiUrl, params, { headers: requestHeaders });
}

export function sendVerificationCodeForNewUser(phoneNumber) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "sendVerificationCodeForNewUser");
    params.append("phoneNumber", phoneNumber);

    return Axios.post(apiUrl, params, { headers: requestHeaders });
}

export function loginWithNumber(customerId, code) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "loginWithNumber");
    params.append("customerId", customerId);
    params.append("code", code);

    return Axios.post(apiUrl, params, { headers: requestHeaders });
}

export function registerClientByPhoneNumber(infoArr, imageName, imageCode, verifiCode) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "registerClientByPhoneNumber");
    params.append("infoArr", infoArr);
    params.append("imageName", imageName);
    params.append("imageCode", imageCode);
    params.append("verifiCode", verifiCode);

    return Axios.post(apiUrl, params, { headers: requestHeaders });
}

export function registerTransporterByPhoneNumber(infoArr, imageName, imageCode, verifiCode) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "registerTransporterByPhoneNumber");
    params.append("infoArr", infoArr);
    params.append("imageName", imageName);
    params.append("imageCode", imageCode);
    params.append("verifiCode", verifiCode);

    return Axios.post(apiUrl, params, { headers: requestHeaders });
}

// temp add city
/* export function tempAddCity(id, name) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "tempAddCity");
    params.append("id", id);
    params.append("name", name);

    return Axios.post(apiUrl, params, { headers: requestHeaders });
} */

// temp get cities
/* export function tempGetCities(type, superId, langId) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "tempGetCities");
    params.append("type", type);
    params.append("superId", superId);
    params.append("langId", langId);

    return Axios.post(apiUrl, params, { headers: requestHeaders });
}
 */

export function tempAddAlbarqRoadPrice() {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "tempAddAlbarqRoadPrice");
    return Axios.post(apiUrl, params, { headers: requestHeaders });
}

export function tempGetAlbarqPrices() {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "tempGetAlbarqPrices");

    return Axios.post(apiUrl, params, { headers: requestHeaders });
}

export function tempUpdateAlbarqPrices(id, newPrice) {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "tempUpdateAlbarqPrices");
    params.append("id", id);
    params.append("newPrice", newPrice);

    return Axios.post(apiUrl, params, { headers: requestHeaders });
}

export function isUserLogedIn() {
    var params = new URLSearchParams();
    params.append("CheckTypeFunction", "isUserLogedIn");
    params.append("useId", localStorage.getItem("userId"));
    params.append("TokenDevice", localStorage.getItem("TokenDevice"));

    return Axios.post(apiUrl, params, { headers: requestHeaders });
}