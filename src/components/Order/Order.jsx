import React from "react";
import "./Order.css";

import translate from "../../i18n/translate";
import { deliverFormatter, PackageTypes } from "../Orders/OrdersTabularView";
import { PackageTypesIcons } from "../CreateNewOrder";
import {isTransporter} from "../../Util";

export function GetOrderStatus(isAccepted, isFinished, pickupDate, bidsCount){
    if(isAccepted == 1 && !pickupDate){
        return "BID-ACCEPTED";
    }
    if(pickupDate && !isFinished){
        return "OUT-FOR-DELIVERY";
    }
    if((bidsCount == 0 && !isAccepted) || ( isTransporter() && bidsCount > 0 ) ) {
        return "WAITING-FOR-BIDS";
    }
    if(bidsCount > 0 && !isAccepted) {
        return "AVAILABEL-BIDS";
    }
}

function Order(props){

    // const {
    //     order: {
    //         idOrder,
    //         DeliveryWays,
    //         FromAddress,
    //         ToAddress,
    //         DateOrder,
    //         TimeOrder,
    //         PackageType,
    //         OrderStatus
    //     },
    // } = props;
    const {
        //order: { 
        DateLoad,
        IsDeleted,
        TypeLoad,
        bidsCount,
        deliveryWay,
        fromAddress,
        fromCity,
        fromCityName,
        id,
        isAcceptDelivery,
        IsAcceptDelivery,
        orderfinished,
        Orderfinished,
        pickup_date,
        toAddress,
        toCity,
        toCityName,
        OtherDetails,
        OtherDetailsDes
        //},
    } = props.order || {};
    let st = GetOrderStatus(isAcceptDelivery || IsAcceptDelivery, orderfinished || Orderfinished, pickup_date, bidsCount);
    return (
        <div onClick={props.onClick}>
            <div className="d-flex">
                <div style={{flexBasis: "100%"}} className="order-prop-label">
                    {React.createElement(PackageTypesIcons[TypeLoad || 1], 
                        {style: {width: "20px", height: "20px"}, className: "me-1"})}
                    {translate("ORDERS." + PackageTypes[TypeLoad || 1])}
                </div>

                <div style={{flexBasis: "100%"}}>
                    <div>
                        <div className="order-prop-label">Order ID</div>
                        <div>#{id || props.id}</div>
                    </div>
                    <div>
                        <div className="order-prop-label">Delivery method</div>
                        <div>{deliverFormatter({DeliveryWays: deliveryWay})}</div>
                    </div>
                    <div>
                        <div className="order-prop-label">From Address</div>
                        <div>{fromAddress || OtherDetails || ""}</div>
                    </div>
                    <div>
                        <div className="order-prop-label">From City</div>
                        <div>{fromCityName || ""}</div>
                    </div>
                </div>
                <div style={{flexBasis: "100%"}}>
                
                    {
                         st === "BID-ACCEPTED" && <div className={`fw-bold custom-lbl bid-accepted`}>
                            <div>Bid Accepted</div>
                        </div>
                    }
                    {
                        st === "OUT-FOR-DELIVERY" && <div className={`fw-bold custom-lbl out-for-delivery`}>
                            <div>Out for Delivery</div>
                        </div>
                    }
                    {
                        st === "WAITING-FOR-BIDS" && 
                        <div className={`fw-bold custom-lbl waiting-for-bid`}>
                            <div>Waiting for bids</div>
                        </div>
                    }
                    {
                        st === "AVAILABEL-BIDS" &&
                        <div className={`fw-bold custom-lbl bid-available`}>
                            <div>Available bids</div>
                        </div>
                    }
                    <div>
                        <div className="order-prop-label">Order Time</div>
                        <div>{DateLoad || ""}</div>
                    </div>
                    <div>
                        <div className="order-prop-label">To Address</div>
                        <div>{toAddress || OtherDetailsDes || ""}</div>
                    </div>
                    <div>
                        <div className="order-prop-label">To City</div>
                        <div>{toCityName || ""}</div>
                    </div>
                </div>
            </div>
            <hr className="my-4"/>
        </div>
        
    )
}

export default Order;
