import React from "react";
import { Redirect, Route } from "react-router-dom";

export const PrivateRoute = ({ component: Component, ...rest }) => {
    let TokenDevice = localStorage.getItem('TokenDevice');
    let signInPath = "/account/signin";
    let signInPath2 = "/account/loginByPhoneNumber";
    let registerPath = "/account/createAccount";
    let mainPath = "/account/main/";

    return (<Route {...rest} render={(props) => {
        const { location: { pathname } } = props;
        return !!TokenDevice ?
            (
                pathname === signInPath || pathname === signInPath2 ||  pathname === registerPath || pathname == "/account/test"  ?
                    <Redirect to={mainPath} /> :
                    <Component {...props} />
            ) :
            (
                pathname === signInPath || pathname === signInPath2 ||  pathname === registerPath || pathname == "/account/test"  ?
                    <Component {...props} /> :
                    <Redirect to={signInPath} />
            );
    }} />
    );
};
