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
import PaymentPage from "../PaymentPage/PaymentPage";
import PaymentRequest from "../PaymentPage/PaymentRedirect";
import InitializeTransaction from "../PaymentPage/PaymentRedirect";
import PaymentPage2 from "../PaymentPage/test";
import Prices from "./Prices/Prices";

const App = () => {

    let dispatch = useDispatch();

    const language = useSelector(state => state.general.language);
    //console.log("local storage lang set to:",language);
    localStorage.setItem("lang",language);
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
                        <Route path="/payment" component={PaymentPage} exact />
                        <Route path="/payment-request" component={InitializeTransaction} exact />
                        <Route path="/test" component={PaymentPage2} exact />
                        <Route path="/prices" component={Prices} exact />
                        <Route path="/printAll/:orderId?" component={() => {
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