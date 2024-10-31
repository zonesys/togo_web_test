import React, { useEffect, useState } from 'react';
import { AdminPrivateRoute } from "../../components/AdminPrivateRoute/AdminPrivateRoute";
import AdminWayBill from "../../components/AdminPanel/AdminOrderDetails/AdminWayBill";
import AdminOrderDetails from "../../components/AdminPanel/AdminOrderDetails/AdminOrderDetails";
import AdminPanel from "../../components/AdminPanel/AdminPanel";
import FoodOrders from "../../components/AdminPanel/FoodOrders";
import CustomerInfo from "../../components/AdminPanel/CustomerInfo/CustomerInfo";
import SignIn from "../../components/AdminPanel/SignIn";
import togoLogo from "../../assets/logo.png";
import SystemActions from "../../components/AdminPanel/SystemActions/SystemActions";
import SearchOrders from "../../components/AdminPanel/SearchOrders";
import AllClients from "../../components/AdminPanel/CustomerInfo/AllClients";
import AllTransporters from "../../components/AdminPanel/CustomerInfo/AllTransporters";
import { updateAdminWebNotificationToken, isAdminLogedIn } from "../../APIs/AdminPanelApis";
import { useHistory } from "react-router";
import { Menu, Button, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { SettingsIcon } from '@chakra-ui/icons';
import { IoIosExit } from 'react-icons/io';
import WithdrawRequests from "../../components/AdminPanel/WithdrawRequests";
import SupersetComponent from "../../components/AdminPanel/SupersetComponent";
import Stat from "../../components/AdminPanel/Stat";
import TransportersStat from "../../components/AdminPanel/TransportersStat";
import Loans from "../../components/AdminPanel/Loans";
import Test2 from "../../components/AdminPanel/Test2";
import Reconcile from '../../components/AdminPanel/Reconcile';
import FinishedOrders from '../../components/AdminPanel/FinishedOrders';
import Prices from '../../components/AdminPanel/Prices/Prices.jsx'

export default function AdminAccount({ /* match: { path } */ path, notReload }) {

    const [links, setLinks] = useState([
        { "id": 1, "name": "Home", "active": "active", "route": "adminpanel/" },
        { "id": 1, "name": "Food Orders", "active": "", "route": "food-orders" },
        { "id": 2, "name": "System Actions", "active": "", "route": "system-actions" },
        { "id": 3, "name": "Transporters", "active": "", "route": "all-transporters" },
        { "id": 4, "name": "Clients", "active": "", "route": "all-clients" },
        { "id": 5, "name": "Search", "active": "", "route": "order-search" },
        { "id": 6, "name": "Withdraw Requests", "active": "", "route": "withdraw-requests" },
        { "id": 7, "name": "Superset", "active": "", "route": "superset" },
        { "id": 8, "name": "Stat.", "active": "", "route": "stat" },
        { "id": 9, "name": "Transporters Stat.", "active": "", "route": "transporters-stat" },
        { "id": 10, "name": "Loans", "active": "", "route": "loans" },
        { "id": 11, "name": "Reconcile", "active": "", "route": "reconcile" },
        { "id": 11, "name": "Finished Orders", "active": "", "route": "finished-orders" },
        { "id": 11, "name": "Prices", "active": "", "route": "prices" },
        /* { "id": 8, "name": "Test", "active": "", "route": "test_2" }, *//* test */
    ])

    useEffect(() => {

        const tempRout = window.location.href.split("adminapp/")[1];

        let tempArr = [...links]

        for (let i = 0; i < tempArr.length; i++) {
            if (tempArr[i].route == tempRout)
                tempArr[i].active = "active";
            else
                tempArr[i].active = "";
        }

        setLinks(tempArr);
    }, [])

    const handleLink = (link, index) => {

        let tempArr = [...links]

        for (let i = 0; i < tempArr.length; i++) {
            if (i == index)
                links[i].active = "active";
            else
                links[i].active = "";
        }

        setLinks(tempArr);

        history.push("/adminapp/" + link);
    }

    useEffect(() => {
        if (localStorage.getItem("Adminid") != undefined)
            isAdminLogedIn().then((res) => {
                if (res.data === "TokenError") {
                    handleLogOut();
                }
            })
    }, [])

    const styles = {
        settingsButton: {
            marginTop: "-5px",
            variant: "ghost",
            size: "lg",
            iconSpacing: 0,
            lineHeight: "0.2",
            _active: {
                background: "none",
                transform: "scale(1.3)",
                color: "black",
                opacity: "0.5"
            },
            _hover: { transform: "scale(1.3)" },
            _focus: { outline: "none" }
        }
    }

    const history = useHistory();

    let TokenDevice = localStorage.getItem('AdminToken');

    const handleLogOut = () => {
        // remove web notification token when log out to be used for this browser in the next login (for firebase push notification)
        updateAdminWebNotificationToken(null).then((res) => {
            console.log(res.data);
        })

        localStorage.removeItem("AdminFirstName");
        localStorage.removeItem("AdminLastName");
        localStorage.removeItem("AdminEmail");
        localStorage.removeItem("AdminMobileNumber");
        localStorage.removeItem("AdminToken");
        localStorage.removeItem("Adminid");

        history.push("/adminapp/signin");
    }

    /* get current time to greet user */
    let myDate = new Date();
    let hrs = myDate.getHours();

    let greet;

    if (hrs < 12)
        greet = 'Good Morning';
    else if (hrs >= 12 && hrs <= 17)
        greet = 'Good Afternoon';
    else if (hrs >= 17 && hrs <= 24)
        greet = 'Good Evening';

    return (
        <>
            {/* header */}
            <nav className="navbar navbar-light navbar-expand-lg shadow togo-header" style={{ backgroundColor: "white", zIndex: "1" }}>
                <div className="container-fluid">
                    <a className="navbar-brand d-flex justify-content-between" onClick={() => { handleLink("adminpanel/", 0) }} style={{ cursor: "pointer" }}>
                        <img src={togoLogo} style={{ width: "100px" }} alt="logo" />
                        <span className="forest-color ms-3" style={{ marginTop: "10px" }}>Admin Panel</span>
                    </a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    { localStorage.getItem("Adminid") != undefined && <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            {
                                links.map((link, index) => {
                                    return <li key={index} className="nav-item">
                                        <a className={"nav-link " + link.active} onClick={() => { handleLink(link.route, index) }}>{link.name + " "} { link.id == 5 && <i className="bi bi-search"></i> }</a>
                                    </li>
                                })
                            }
                        </ul>
                    </div>}
                    <div className="d-flex justify-content-between">
                        {!!TokenDevice && <span className="forest-color mt-1 me-3 d-flex justify-content-between" style={{ fontSize: "1.2rem" }}>
                            {greet === "Good Morning" ? <svg style={{ marginTop: "2px", marginRight: "5px", color: "yellow" }} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-brightness-high" viewBox="0 0 16 16">
                                <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z" />
                            </svg> : greet === "Good Afternoon" ? <svg style={{ marginTop: "2px", marginRight: "5px", color: "orange" }} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-brightness-alt-high" viewBox="0 0 16 16">
                                <path d="M8 3a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 3zm8 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zm-13.5.5a.5.5 0 0 0 0-1h-2a.5.5 0 0 0 0 1h2zm11.157-6.157a.5.5 0 0 1 0 .707l-1.414 1.414a.5.5 0 1 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm-9.9 2.121a.5.5 0 0 0 .707-.707L3.05 5.343a.5.5 0 1 0-.707.707l1.414 1.414zM8 7a4 4 0 0 0-4 4 .5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5 4 4 0 0 0-4-4zm0 1a3 3 0 0 1 2.959 2.5H5.04A3 3 0 0 1 8 8z" />
                            </svg> : <svg style={{ marginTop: "2px", marginRight: "5px", color: "blue" }} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-moon-stars" viewBox="0 0 16 16">
                                <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278zM4.858 1.311A7.269 7.269 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.316 7.316 0 0 0 5.205-2.162c-.337.042-.68.063-1.029.063-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286z" />
                                <path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z" />
                            </svg>}
                            {greet + " "}
                            {localStorage.getItem("AdminFirstName")}{" "}
                            {localStorage.getItem("AdminLastName")}
                        </span>}
                        {!!TokenDevice && <Menu>
                            <MenuButton {...styles.settingsButton} as={Button} rightIcon={<SettingsIcon />} />
                            <MenuList style={{ position: "relative", zIndex: "2" }} color="black">
                                <MenuItem icon={<IoIosExit className="h3" />}
                                    onClick={handleLogOut}>Logout</MenuItem>
                            </MenuList>
                        </Menu>}
                    </div>
                </div>
            </nav>

            <AdminPrivateRoute exact path={`${path}/adminpanel/*`} component={AdminPanel} /> {/* main page */}
            {<AdminPrivateRoute path={`${path}/food-orders`} component={FoodOrders} />}
            <AdminPrivateRoute exact path={`${path}`} component={AdminPanel} /> {/* root path */}
            <AdminPrivateRoute path={`${path}/signin`} component={SignIn} /> {/* sign in page */}
            <AdminPrivateRoute path={`${path}/customerInfo/:id/:type`} component={CustomerInfo} /> {/* view customer info page */}
            <AdminPrivateRoute path={`${path}/orderDetails/:id`} component={AdminOrderDetails} /> {/* view order details page */}
            <AdminPrivateRoute path={`${path}/printOrder/:id`} component={AdminWayBill} /> {/* view print order way bill page */}
            <AdminPrivateRoute path={`${path}/system-actions/`} component={SystemActions} /> {/*  */}
            <AdminPrivateRoute path={`${path}/order-search/`} component={SearchOrders} /> {/*  */}
            <AdminPrivateRoute path={`${path}/all-clients/`} component={AllClients} /> {/*  */}
            <AdminPrivateRoute path={`${path}/all-transporters/`} component={AllTransporters} /> {/*  */}
            <AdminPrivateRoute path={`${path}/withdraw-requests`} component={WithdrawRequests} />
            <AdminPrivateRoute path={`${path}/superset`} component={SupersetComponent} />
            <AdminPrivateRoute path={`${path}/test_2`} component={Test2} />
            <AdminPrivateRoute path={`${path}/stat`} component={Stat} />
            <AdminPrivateRoute path={`${path}/transporters-stat`} component={TransportersStat} />
            <AdminPrivateRoute path={`${path}/loans`} component={Loans} />
            <AdminPrivateRoute path={`${path}/reconcile`} component={Reconcile} />
            <AdminPrivateRoute path={`${path}/finished-orders`} component={FinishedOrders} />
            <AdminPrivateRoute path={`${path}/prices`} component={Prices} />
        </>
    );
};
