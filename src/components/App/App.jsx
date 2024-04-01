import React, { useEffect, useLayoutEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { useSelector } from "react-redux";
import { I18nProvider } from '../../i18n';
import { LOCALES_TYPES } from "../../i18n/locales";
import Account from "../../Container/Account/Account";
import Home from "../../Container/Home/Home";
import PrivacyPolicy from "../../Container/PrivacyPolicy";
import ContactUs from "../ContactUs";
import Toast from "../Toast";
import AdminAccount from "../../Container/AdminAccount/AdminAccount";
import { useDispatch } from "react-redux";
import { toastNotification } from "../../Actions/GeneralActions";
import { onMessageListener } from "../../firebase";
// import * as Sticker from '../../Sticker.jsx'
import PrintAll from "../../Container/testPrint/printAll";
const App = () => {

    let dispatch = useDispatch();

    const language = useSelector(state => state.general.language);

    /* ----------------------( FCM )---------------------- */

    // notReload used in order to update the DOM at every notification
    const [notReload, setNotReload] = useState(false);

    // using Firebase Cloud Messaging (FCM) push notification
    // onMessageListener => listening to new messages from the cloud

    // listen only if the user is logged in
    if (localStorage.getItem("Adminid") != undefined || localStorage.getItem("userId") != undefined)
        onMessageListener().then((payload) => {
            setNotReload(!notReload);
            console.log("test");
            console.log(payload.notification.title);

            // show a popup notification
            dispatch(toastNotification(payload.notification.title, payload.notification.body, "info"));
        }).catch((err) => console.log("failed: ", err));

    /* -------------------------------------------- */

    useLayoutEffect(() => {
        document.dir = language === LOCALES_TYPES.ENGLISH ? "ltr" : "rtl";
        document.documentElement.lang = language;
        if (language === LOCALES_TYPES.ENGLISH) {
            document.getElementById("bootStyle").href = "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css";
        } else {
            document.getElementById("bootStyle").href = "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.rtl.min.css"
        }

    }, [language])

    return (
        <>
            <I18nProvider locale={language}>
                <Router>
                    <Switch>
                        {/* client/ transporter (user) account path */}
                        <Route path="/account" component={() => <Account notReload={notReload} path="/account" />} />

                        {/* admin account path */}
                        <Route path="/adminapp" component={() => <AdminAccount notReload={notReload} path="/adminapp" />} />
                        <Route path="/" component={Home} exact />
                        <Route path="/privacy-policy" component={PrivacyPolicy} exact />
                        <Route path="/contact-us" component={ContactUs} exact />
                 {/*        <Route path="/testPrint" component={() => {
                            return (
                                <div>
                                    <WayBill3
                                        transporterImgSrc={"https://dev.togo.ps/togo/MobileAPi/img/PersonalImg/image1660121614124.jpg?t=0.6941913539420765"}
                                        clientImgSrc={"https://dev.togo.ps/togo/MobileAPi/img/BusinessLogo/image1634560141266.jpg?t=0.869448993020816"}
                                        clientName=" شركة الارض الفلسطينية"
                                        clientPhone="+972599876543"
                                        foreignBarcode="57238592421358485845"
                                        senderAddress="Near super market abu mohammad street-234"
                                        senderCity="Ramallah"
                                        receiverAddress="Near Rafidia Hostpital"
                                        receiverCity="Nablus"
                                        receiverPhone="+972599233432"
                                        cod="30323"
                                        date="03/02/2022"
                                        orderId="1198642"
                                        note="التوصيل عند الساعة ١٠ صباحا "
                                    />
                                </div>
                            )
                        }} /> */}
                        <Route path="/printAll" component={() => {
                            return (
                                <PrintAll/>

                            )
                        }} />

                    </Switch>
                </Router>
                <Toast />
            </I18nProvider>
        </>
    );
};

export default App;
