import React from "react";
import { Redirect, Route } from "react-router-dom";

export const AdminPrivateRoute = ({ component: Component, ...rest }) => {
    let TokenDevice = localStorage.getItem('AdminToken');
    let signInPath = "/adminapp/signin";
    let mainInPath = "/adminapp/adminpanel/";
    let homePath = "/adminapp";

    return (<Route {...rest} render={(props) => {
        const { location: { pathname } } = props;
        // console.log(pathname)
        return !!TokenDevice ?
            (
                pathname === homePath ?
                    <Redirect to={mainInPath} /> :
                    pathname === signInPath ?
                        <Redirect to={mainInPath} /> :
                        <Component {...props} />
            ) :
            (
                pathname === homePath ?
                    <Redirect to={signInPath} /> :
                    pathname === signInPath ?
                        <Component {...props} /> :
                        <Redirect to={signInPath} />
            );
    }} />
    );
};
