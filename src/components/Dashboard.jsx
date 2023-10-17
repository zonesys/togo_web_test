import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import Footer from "./Footer";
import CurrentOrdersList from "./Order/CurrentOrdersList";
import UserSettings from "./UserSettings";
import WalletView from "./WalletView";

export function ViewTitle(){
    return (
        <div className="h1 p-3 text-center togo-button">
            {/* <img src={}/> */}
            <span className="align-middle d-inline-block display-6 fw-bold">TOGO</span> 
            <span className="align-middle d-inline-block fs-6 fw-normal ps-1">Client</span>
        </div>
    );
}

export default function Dashboard(){
    let { path } = useRouteMatch();
    return (
        <div className="d-flex flex-column justify-content-end w-100" style={{height: "100vh"}}>
            <div className="" style={{flex: 1, overflow: "auto"}}>
                <Switch>
                    <Route path={`${path}/wallet`} component={WalletView} />
                    <Route path={`${path}/settings`} component={UserSettings} />
                    <Route path={`${path}`} component={CurrentOrdersList} />
                </Switch>
            </div>
            <Footer />
        </div>
    )
}