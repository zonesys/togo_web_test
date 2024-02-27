import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useRouteMatch } from "react-router-dom";
import bell from "../../assets/bell.png"
import { GetCurrentOrders, GetFinishedOrders, GetTransporterList } from "../../APIs/OrdersAPIs";
import { CreateNewOrder } from "../CreateNewOrder";
import OrdersCardView from "../Orders/OrdersCardView";
import {isTransporter} from "../../Util";

export default function CurrentOrdersList() {
    let { url } = useRouteMatch();
    const location = useLocation();
    const [orders, setOrders] = useState();
    const [clientInfo, setClientInfo] = useState({});
    
    useEffect(() => {
        let fun = location.pathname.indexOf("history") != -1 ? GetFinishedOrders : GetCurrentOrders;
        if(isTransporter()){
            let parts = location.pathname.split("/");

            fun = GetTransporterList.bind(null, parts[2] || "NEW_ORDERS");
        }
        
        
        fun().then((res) => {
            if(isTransporter()){
                setOrders(res.data.orders);
                setClientInfo(res.data.transporter[0]);
            }else{
                setClientInfo(res.data.clientDetails[0]);
                setOrders(res.data.orderDetails);
            }
        });

    }, [location.pathname]);

    return (
        <div className="d-flex flex-column h-100">
            <div style={{flexBasis: "30%"}}>
                <div className="d-flex justify-content-between">
                    <div>
                        <div>Hi {clientInfo?.fullname}</div>
                        <div>{clientInfo?.PhoneNumber}</div>
                    </div>
                    <img style={{filter: "drop-shadow(2px 4px 6px black)" }} src={bell} />
                </div>
                <p className="fw-bold">
                    What can we help you with?
                </p>
                <div className="text-center">
                    <CreateNewOrder />
                </div>
                <div className="align-items-center d-flex text-center">
                    <NavLink 
                        to={`${url}/NEW_ORDERS`} 
                        className={"w-50 text-decoration-none py-2"} 
                        activeClassName="active-order"
                        isActive={(match, loca)=>{
                            return loca.pathname === "/dashboard/" || loca.pathname === "/dashboard/NEW_ORDERS";
                        }}
                    >
                        Current Orders
                    </NavLink>
                    {
                        !isTransporter() && <NavLink 
                        to={`${url}/historyorders`} 
                        className={"w-50 text-decoration-none py-2"} 
                        activeClassName="active-order"
                    >
                        Orders History
                    </NavLink>
                    }

                    {
                        isTransporter() && <>
                    <NavLink 
                        to={`${url}/MY_ORDERS`} 
                        className={"w-50 text-decoration-none py-2"} 
                        activeClassName="active-order"
                    >
                        Orders History
                    </NavLink>

                    <NavLink 
                        to={`${url}/DELIVERED`} 
                        className={"w-50 text-decoration-none py-2"} 
                        activeClassName="active-order"
                    >
                        Orders History
                    </NavLink>
                    </>
                    }
                </div>
            </div>
            <div 
                style={{
                    flexBasis: "70%",
                    overflow: "auto"
                }}
            >
                <OrdersCardView orders={orders} />
            </div>
            
            
        </div>
    );
}