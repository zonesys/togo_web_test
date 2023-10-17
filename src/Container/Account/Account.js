import React, { useEffect } from 'react';
import { Box } from "@chakra-ui/react";
import Header from "../../components/Header/Header";
import { PrivateRoute } from "../../components/PrivateRoute/PrivateRoute";
import Main from "../../components/Orders/Main";
import OrderDetails from "../../components/OrderDetails/OrderDetails";
import AccountDetails from "../AccountDetails/AccountDetails";
import CitiesPrices from "../AccountDetails/CitiesPrices";
import WalletContainer from "../WalletContainer/WalletContainer";
import QRCodeGenerator from "../../components/QRCodeGenerator/QRCodeGenerator";
import WayBill from "../../components/WayBill";
import Network from "../../components/CustomNetwork";
import TestComponent from "../../components/TestComponent";
import LoginByPhoneNumber from "../../components/loginByPhoneNumber/LoginByPhoneNumber";
import CreateAccount from "../../components/loginByPhoneNumber/CreateAccount";
import CreateNewOrder from "../../components/CreateNewOrderComponent/CreateNewOrderCo";
import CreateNewFoodOrderCo from "../../components/CreateNewOrderComponent/CreateNewFoodOrderCo";
import { isUserLogedIn } from "../../APIs/LoginAPIs";
import { useDispatch } from "react-redux";
import { LOGOUT } from "../../Actions/ActionsTypes";
import { useHistory } from "react-router";
import AdminBoard from "../../components/AdminBoard";
import AssignToNetworkMemberCo from '../../components/OrdersManager/AssignToNetworkMemberCo';
import FinancialManagement from '../../components/FinancialManagement';
import ManageCustomers from '../../components/ManageCustomers/ManageCustomers';

export default function Account({ path  }) {

    let dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        if (localStorage.getItem("userId") != undefined)
            isUserLogedIn().then((res) => {
                if (res.data === "Blocked" || res.data === "TokenError") {
                    handleLogout();
                }
            })
    }, [])

    const handleLogout = () => {
        dispatch({
            type: LOGOUT
        });

        localStorage.removeItem("userId");
        localStorage.removeItem("fullName");
        localStorage.removeItem("TokenDevice");
        localStorage.removeItem("UserType");

        history.push("/");
    };

    return (
        <>
            <Header />
            <Box className="root-container">
                <PrivateRoute exact path={`${path}/main/*`} component={Main} />
                <PrivateRoute path={`${path}/signin`} component={QRCodeGenerator} />
                <PrivateRoute path={`${path}/loginByPhoneNumber`} component={LoginByPhoneNumber} />
                <PrivateRoute path={`${path}/createAccount`} component={CreateAccount} />
                <PrivateRoute path={`${path}/order/:id`} component={OrderDetails} />
                <PrivateRoute path={`${path}/account-details`} component={AccountDetails} />
                <PrivateRoute path={`${path}/cities-prices`} component={CitiesPrices} />
                <PrivateRoute path={`${path}/wallet`} component={WalletContainer} />
                <PrivateRoute path={`${path}/bill-for-order/:id`} component={WayBill} />
                <PrivateRoute path={`${path}/my-network`} component={Network} />
                <PrivateRoute path={`${path}/print/:id`} component={WayBill} />
                <PrivateRoute path={`${path}/create-order/:id`} component={CreateNewOrder} />
                <PrivateRoute path={`${path}/create-food-order/:id`} component={CreateNewFoodOrderCo} />
                <PrivateRoute path={`${path}/test`} component={TestComponent} />
                <PrivateRoute path={`${path}/team-admin`} component={AdminBoard} />
                <PrivateRoute path={`${path}/assign-to-network`} component={AssignToNetworkMemberCo} />
                <PrivateRoute path={`${path}/financial-management`} component={FinancialManagement} />
                <PrivateRoute path={`${path}/manage-clients`} component={ManageCustomers} />
            </Box>
        </>
    );
};
