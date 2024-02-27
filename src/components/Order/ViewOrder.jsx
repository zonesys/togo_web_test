import React, { useEffect, useState } from "react";
import { useLocation, useParams, useHistory } from "react-router-dom";
import { AcceptOfferReq, GetAllBids, GetClientOrderDetails } from "../../APIs/OrdersAPIs";
import locationImg from "../../assets/locationn.png";
import Order, { GetOrderStatus } from "./Order";

import { Button } from "react-bootstrap";
import { CancelOrder } from "../OrdersManager/CancelOrder";
import { refreshPage } from "../../Functions/CommonFunctions";

function Label({val, text}){
    return (
        <div className="w-50">
            <div className="order-prop-label">{text}</div>
            <div>{val}</div>
        </div>
    )
}

export default function ViewOrder(props) {
    const {id} = useParams();
    const history = useHistory();
    const [orderInfo, setOrderInfo] = useState({});
    const [orderMoreInfo, setOrderMoreInfo] = useState({});
    const [costDetail, setCostDetails] = useState([]);

    useEffect(() => {
        GetClientOrderDetails(id).then((res) => {
            setOrderMoreInfo(res.data.server_response[0]);
        });

        GetAllBids(id).then((res) => {
            setOrderInfo({...res.data.OrderDetail, bidsCount: res.data.BidCount});
            setCostDetails(res.data.CostDetail);
        });
    }, [id]);
    const orderStatus = GetOrderStatus(orderInfo.IsAcceptDelivery, orderInfo.Orderfinished, orderInfo.pickup_date, costDetail.length);
    return (
        <div>
            <Order order={orderInfo/* location.state.orderObj */} id={id} />
            <div className="">
                
                <div className="d-flex">
                    <Label val={orderInfo.PickupName} text={"Pickup From"}/>
                    <Label val={orderInfo.PickupMobile} text={"Pickup Mobile Number"}/>
                    
                </div>

                <div className="d-flex">
                    <Label val={orderInfo.ReceiverName} text={"Receiver Name"}/>
                    <Label val={orderInfo.ReceiverMobile} text={"Receiver Mobile Number"}/>
                </div>

            </div>

            { (orderStatus == "WAITING-FOR-BIDS" ||  orderStatus == "AVAILABEL-BIDS") && <div>
                <CancelOrder
                    orderId={id} 
                    className="mt-3 d-flex align-items-center m-auto btn-grad rounded-22" 
                    onSuccess={()=>{
                        history.goBack();
                    }} 
                />
                <h4 className="fw-bold text-center togo-border">Available offers</h4>
            </div>
            }
            
            {!costDetail.length && orderStatus == "WAITING-FOR-BIDS" && 
                <p className="text-center">No offers</p>
            }
            {!!costDetail.length && orderStatus == "AVAILABEL-BIDS" && <div>
                <h4 className="fw-bold text-center togo-border">Available offers</h4>
                {costDetail.map((bid) => {
                    return (
                        <div>
                            <div className="align-items-center d-flex justify-content-around mt-3">
                                <img 
                                    style={{width: "100px", height: "100px", objectFit: "cover"}} 
                                    src={`http://46.253.93.4/togo/MobileAPi/${bid.TransporterPersonalImg}`} 
                                />
                                <div>{bid.TransporterName}</div>
                                <div>{bid.BidCost}</div>
                            </div>
                            <Button
                                className="btn-grad rounded-22 mt-3 d-block m-auto" 
                                onClick={()=>{
                                    AcceptOfferReq(
                                        bid.IdTransporterBidRequist,
                                        id,
                                        bid.BidCost
                                    ).then((resp)=>{
                                        if(resp.data.indexOf("Success") !== -1){
                                            refreshPage();
                                        }
                                    })
                                }}>
                                    Accept Offer
                                </Button>
                        </div>
                    )
                })}
            </div>}

            { (orderStatus == "BID-ACCEPTED" || orderStatus == "OUT-FOR-DELIVERY" ) && 
            <div>
                
                <h1 className="fw-bold text-center togo-border">Transporter details</h1>

                <div className="d-flex">
                    <Label val={orderMoreInfo.FullNameCustomer} text={"Transporter name"} />
                    <Label val={orderMoreInfo.CarNumType} text={"Vehicle type"} />
                </div>
                <div className="d-flex">
                    <Label val={orderMoreInfo.CarLicenceNum} text={"Vehicle number"} />
                    <Label val={orderMoreInfo.ColorName} text={"Vehicle color"} />
                </div>
                <div className="d-flex">
                    <Label val={orderMoreInfo.TransNumber} text={"Transporter mobile"} />
                    <div className="w-50 text-start d-flex align-items-center shadow-none">
                        <img src={locationImg} style={{width: "24px", height: "24px"}} className="me-1" alt="worldicon" />
                        <div style={{width: "97%"}}>    
                            Track Transporter
                        </div>
                    </div>
                </div>
            </div>}
        </div>
    );
}