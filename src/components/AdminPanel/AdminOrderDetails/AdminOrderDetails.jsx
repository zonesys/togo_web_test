import React, { useEffect, useState, useRef } from "react";
import Map from "../../Address/Map";
import { Accordion, Card, Button, Badge, Dropdown, Modal, Spinner, Col, Row, Container, Table, Form, FloatingLabel } from "react-bootstrap";
import { MdOutlineFastfood } from 'react-icons/md';
import { BiPackage } from 'react-icons/bi'
import { FiPackage } from 'react-icons/fi';
import { FcPackage } from 'react-icons/fc';
import { GiEnvelope } from 'react-icons/gi';
import Loader from "../../Loader/Loader";
import "./AdminOrderDetails.css";
import {
    getOrderDetailsForAdmin,
    getOrderActionsForAdmin,
    /*transactionsByOrderForAdmin, */
    getTimeLineForAdmin,
    deleteOrderBeforePickupForAdmin,
    forceReturnOrder,
    deleteNewOrderForAdmin,
    forceFinishOrder,
    forcePickup,
    AdminCheckTripCost,
    AdminAcceptOfferReq,
    AdminAcceptOfferReqFIX,
    AdminRemoveAddErrorMark,
    undoCancledActiveOrder,
    alterActiveOrderCOD
} from "../../../APIs/AdminPanelApis";
import translate from "../../../i18n/translate";
import { Alert, AlertDescription, AlertIcon, AlertTitle } from "@chakra-ui/alert";
import { Box } from "@chakra-ui/layout";
import { deliverFormatter, packageFormatter } from "../../Orders/OrdersTabularView";
import { useLocation, useParams, useHistory } from "react-router";
import { refreshPage } from "../../../Functions/CommonFunctions";
import Timeline from "../../TimeLine/TimeLine";
import { motion } from "framer-motion";
import OrderActions from './AdminOrderActions';
import { useDispatch } from "react-redux";
import { toastNotification } from "../../../Actions/GeneralActions";
import { imgBaseUrl } from "../../../Constants/GeneralCont";
import Rating from '@material-ui/lab/Rating';

import { useImmer } from "use-immer";

/* format time from 24hr system to 12hr (am/pm) system */
function timeFormat(time) {
    // Check correct time format and split into components
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) { // If time format correct
        time = time.slice(1);  // Remove full string match value
        time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
        time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(''); // return adjusted time or original string
}

const AdminOrderDetails = () => {

    let dispatch = useDispatch();

    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingMark, setLoadingMark] = useState(false);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const { id: orderId } = useParams();
    const location = useLocation();
    const history = useHistory();
    const [orderDetails, setOrderDetails] = useState({});
    const [orderActions, setOrderActions] = useState([]);
    const [timelineArr, setTimelineArr] = useState([]);
    const [previousPage, setPreviousPage] = useState(null);
    const [tripCost, setTripCost] = useState(null);
    const [costSet, setCostSet] = useState(null);
    const [receiverAddress, setReceiverAddress] = useState({});
    const [startTracking, setStartTracking] = useState(false); // tracking !!!
    const [transactions, setTransactions] = useState([]);

    const [showCancelActiveModal, setShowCancelActiveModal] = useState(false);
    const [showReturnActiveModal, setShowReturnActiveModal] = useState(false);
    const [showFinishModal, setShowFinishModal] = useState(false);
    const [showPickupModal, setShowPickupModal] = useState(false);
    const [showUndoCanceledModal, setShowUndoCanceledModal] = useState(false);
    const [showChangeCODModal, setShowChangeCODModal] = useState(false);

    /* selected available offer variables (to display transporter info to accept offer) */
    const [bidReqTransImg, setBidReqTransImg] = useState();
    const [bidReqTransPrice, setBidReqTransPrice] = useState();
    const [bidReqTransId, setBidReqTransId] = useState();
    const [bidReqTransRate, setBidReqTransRate] = useState();
    const [bidReqTransName, setBidReqTransName] = useState();

    const [loadingAcceptOffer, setLoadingAcceptOffer] = useState(false);

    const handleCloseCancelActiveModal = () => setShowCancelActiveModal(false);
    const handleShowCancelActiveModal = () => setShowCancelActiveModal(true);

    const handleCloseReturnActiveModal = () => setShowReturnActiveModal(false);
    const handleShowReturnActiveModal = () => setShowReturnActiveModal(true);

    const handleCloseFinishModal = () => setShowFinishModal(false);
    const handleShowFinishModal = () => setShowFinishModal(true);

    const handleClosePickupModal = () => setShowPickupModal(false);
    const handleShowPickupModal = () => setShowPickupModal(true);

    const handleCloseUndoCanceledModal = () => setShowUndoCanceledModal(false);
    const handleShowUndoCanceledModal = () => setShowUndoCanceledModal(true);

    const handleShowChangeCODdModal = () => setShowChangeCODModal(true);
    const handleCloseChangeCODdModal = () => setShowChangeCODModal(false);

    const newCODAmountRef = useRef();

    const handleCancleActiveOrder = (orderId) => {
        setLoading(true);
        deleteOrderBeforePickupForAdmin(orderId).then((res) => {

            if (res.data === "TokenError" || res.data === "OrderNotFound2" || res.data === "OrderNotFound1" || res.data === "OrderStatusNotUpdated" || res.data === "deliveryWayNotFound" || res.data === "orderAlreadyPickedUp!") {
                dispatch(toastNotification("Error", res.data, "error"));
            } else {
                // dispatch(toastNotification("Canceled", "Order Canceled", "success"));
                setLoading(false);
                setRefresh(!refresh);
                handleCloseCancelActiveModal();
            }
        })

        /* setRefresh(!refresh);
        handleCloseCancelActiveModal(); */
    }

    const handleReturnActiveOrder = (orderId) => {
        setLoading(true);
        forceReturnOrder(orderId).then((res) => {

            if (res.data === "TokenError" || res.data === "OrderNotFound2" || res.data === "OrderNotFound1" || res.data === "OrderStatusNotUpdated" || res.data === "deliveryWayNotFound" || res.data === "orderAlreadyPickedUp!") {
                dispatch(toastNotification("Error", res.data, "error"));
            } else {
                // dispatch(toastNotification("Canceled", "Order Canceled", "success"));
                setLoading(false);
                setRefresh(!refresh);
                handleCloseCancelActiveModal();
            }
        })

        /* setRefresh(!refresh);
        handleCloseCancelActiveModal(); */
    }

    const handleFinishOrder = (orderId) => { // nonofofo
        setLoading(true);
        forceFinishOrder(orderId).then((res) => {
            if (res.data.includes("error")) {
                dispatch(toastNotification("Error", res.data, "error"));
            } else {
                setLoading(false);
                setRefresh(!refresh);
                handleCloseFinishModal();
                // dispatch(toastNotification("Finished", "Order Finished", "success"));
            }
        })

        // setRefresh(!refresh);
        // handleCloseFinishModal();
    }

    const handlePickupOrder = (orderId) => {
        setLoading(true);
        forcePickup(orderId).then((res) => {
            if (res.data.includes("error")) {
                dispatch(toastNotification("Error", res.data, "error"));
            } else {
                setLoading(false);
                setRefresh(!refresh);
                handleClosePickupModal();
                // dispatch(toastNotification("Finished", "Order Finished", "success"));
            }
        })

        /* setRefresh(!refresh);
        handleClosePickupModal(); */
    }

    const handleUndoCanceledOrder = (orderId) => {
        setLoading(true);
        undoCancledActiveOrder(orderId).then((res) => {
            // console.log(res.data);
            if (res.data.includes("error")) {
                dispatch(toastNotification("Error", res.data, "error"));
            } else {
                setLoading(false);
                dispatch(toastNotification("Uncanceled", "Order Uncanceled", "success"));
                setRefresh(!refresh);
                handleCloseUndoCanceledModal();
                // dispatch(toastNotification("Finished", "Order Finished", "success"));
            }
        })

        /* setRefresh(!refresh);
        handleClosePickupModal(); */
    }

    const [showCancelNewModal, setShowCancelNewModal] = useState(false);

    const handleCloseCancelNewModal = () => setShowCancelNewModal(false);
    const handleShowCancelNewModal = () => setShowCancelNewModal(true);

    const handleCancleNewOrder = (orderId) => {
        setLoading(true);
        deleteNewOrderForAdmin(orderId).then((res) => {
            if (res.data === "TokenError" || res.data === "OrderNotFound2" || res.data === "OrderNotFound1" || res.data === "OrderStatusNotUpdated" || res.data === "deliveryWayNotFound" || res.data === "orderAlreadyAccepted!") {
                dispatch(toastNotification("Error", res.data, "error"));
            } else {
                setLoading(false);
                dispatch(toastNotification("Canceled", "Order Canceled", "success"));
                setRefresh(!refresh);
                handleCloseCancelNewModal();
            }
        })

        /* setRefresh(!refresh);
        handleCloseCancelNewModal(); */
    }

    const handleChangeCOD = (orderId) => {

        if (/* newCODAmountRef.current.value */ true) {
            // console.log("yes");
            setLoading(true);
            // const newCOD = newCODAmountRef.current.value;
            const newCOD = 0;

            alterActiveOrderCOD(orderId, newCOD).then((res) => {
                if (res.data === "TokenError" || res.data.includes("error")) {
                    dispatch(toastNotification("Error", res.data, "error"));
                } else if (res.data.includes("success")) {
                    setLoading(false);
                    // console.log(res.data)
                    dispatch(toastNotification("Changed", "COD Changed", "success"));
                    setRefresh(!refresh);
                    handleCloseChangeCODdModal(true);
                } else {
                    dispatch(toastNotification("Error", "unknown error", "error"));
                }
            })
        } else {
            // console.log("no");
        }

        /* deleteNewOrderForAdmin(orderId).then((res) => {
            if (res.data === "TokenError" || res.data === "OrderNotFound2" || res.data === "OrderNotFound1" || res.data === "OrderStatusNotUpdated" || res.data === "deliveryWayNotFound" || res.data === "orderAlreadyAccepted!") {
                dispatch(toastNotification("Error", res.data, "error"));
            } else {
                setLoading(false);
                dispatch(toastNotification("Canceled", "Order Canceled", "success"));
                setRefresh(!refresh);
                handleCloseCancelNewModal();
            }
        }) */

        /* setRefresh(!refresh);
        handleCloseCancelNewModal(); */
    }

    const styles = {
        cardHeaderLg: {
            position: 'absolute',
            left: '20px',
            right: '20px',
            top: '-20px',
            background: "linear-gradient(90deg, #26a69a, #69d4a5)",
            color: 'white',
            borderRadius: '10px',
            fontWeight: 'bold',
            fontSize: "1rem"
        },
        cardHeaderSm: {
            position: 'absolute',
            left: '20px',
            top: '-20px',
            background: "linear-gradient(90deg, #26a69a, #69d4a5)",
            color: 'white',
            borderRadius: '10px',
            fontWeight: 'bold',
            fontSize: "1rem"
        },
        orderNumber: {
            color: 'white',
            fontStyle: 'italic',
            marginLeft: '10px',
            marginRight: '10px'
        },
        orderStatus: {
            float: localStorage.getItem("Language") === "en" ? 'right' : 'left',
        },
        actionButton: {
            marginRight: "5px",
            marginLeft: "5px",
            width: "200px"
        }
    }

    /* get financial transactions related to this order */
    useEffect(() => {
        let isMounted = true;
        /* transactionsByOrderForAdmin(localStorage.getItem("userId"), orderId).then(res => {
            if (isMounted) {
                let tempArr = res.data.server_response.data.result.response;

                setTransactions(tempArr);
            }
        }) */
        return () => { isMounted = false };
    }, [refresh]);

    /* get order details */
    useEffect(() => {
        getOrderDetailsForAdmin(orderId).then((orderDetailsRes) => {

            console.log(orderDetailsRes); // temp test

            setOrderDetails(orderDetailsRes);

            setReceiverAddress({
                otherDetails: !!orderDetailsRes.receiverForeignViilageName ? (orderDetailsRes.receiverForeignViilageName + ", " + orderDetailsRes.receiverForeignRegionName + " - (" + orderDetailsRes.OtherDetailsDes + ")") : (orderDetailsRes.IdAreaDes == null ? orderDetailsRes.OtherDetailsDes + "  -  " + orderDetailsRes.IdCityDes : orderDetailsRes.IdCityDes + ", " + orderDetailsRes.IdAreaDes + "  -  " + orderDetailsRes.OtherDetailsDes),
                phoneCustomer: orderDetailsRes.ReceiverAddressNum,
                long: orderDetailsRes.LongReciver,
                lat: orderDetailsRes.LatReciver
            });

            // ---------------------

            AdminCheckTripCost(orderDetailsRes.CustomerId, orderId, orderDetailsRes.CostLoad, orderDetailsRes.cityFromId, orderDetailsRes.cityToId).then((tripCostRes) => {

                // console.log(tripCostRes); // temp test

                if (tripCostRes.data && tripCostRes.data !== "CostNotSend") {
                    setTripCost(tripCostRes.data.CostDetail);
                    setCostSet(true);
                } else {
                    setCostSet(false);
                }
            });
        });

        setPreviousPage(location.state?.currentPage);
    }, [refresh]);

    useEffect(() => {
        /* get all actions related to this order */
        getOrderActionsForAdmin(orderId).then((res) => {
            setOrderActions(res.data.records_list);
        })
    }, [refresh])

    /* transportation timeline (to show all the transporters that worked with this order) */
    useEffect(() => {
        getTimeLineForAdmin(orderId).then((res) => {
            // console.log(res.data.timeline);
            setTimelineArr(res.data.timeline)
        });
    }, [refresh]);

    /* order-details feilds */
    if (typeof orderDetails === "object" && JSON.stringify(orderDetails) !== '{}') {
        let {
            OrderStatus, /* edited (OrderStatus added) */
            DateLoad, /* edited (DateLoad added) */
            DeliveryPrice, /* edited (DeliveryPrice added) */
            CostLoad, /* edited (CostLoad added) */
            newCod,
            OriginalDeliveryId, /* edited (OriginalDeliveryId added) */
            DeliveryId, /* edited (DeliveryId added) */
            AssignToName, /* edited (AssignToName added) */
            AssignToNumber, /* edited (AssignToNumber added) */
            transporterImgURL, /* edited (transporterImgURL added) */
            pickupDate, /* edited (pickupDate added) */
            customerImgURL, /* edited (customerImgURL added) */
            FullNameCustomer, /* edited (FullNameCustomer added) */
            LastNameCustomer, /* edited (LastNameCustomer added) */
            orderFinished, /* edited (orderFinished added) */
            IdCityDes, /* edited (IdCityDes added) */
            IdCitySource, /* edited (IdCitySource added) */
            IdAreaSource, /* edited (IdAreaSource added) */
            transporterAssignStatus, /* edited (transporterAssignStatus added) */
            AssignerId, /* edited (AssignerId added) */
            AssigneeId, /* edited (AssigneeId added) */
            currentTransporterId, /* edited (currentTransporterId added) */
            order_status, /* edited (order_status added) */
            ClientAssignAccepted, /* edited (ClientAssignAccepted added) */
            AssignedByClient, /* edited (AssignedByClient added) */
            IsReturnedOrder, /* edited (IsReturnedOrder added) */
            IsStuckOrder, /* edited (IsStuckOrder added) */
            clientAssigneeId, /* edited (clientAssigneeId added) */
            StuckOrderComment, /* edited (StuckOrderComment added) */
            CustomerId, /* edited (CustomerId added) */
            deliveryWay,
            IsReturnAccepted,
            currency,
            from_currency_value,
            HeightLoad,
            DetailsLoad,
            LengthLoad,
            WeightLoad,
            WidthLoad,
            OtherDetails,
            TypeLoad,
            PhoneCustomer,
            LongSender, LatSender,
            AssignStatus, AssignedMemberName,
            isAcceptDelivery,
            SenderName,
            ReceiverName,
            foreign_order_error,
            senderForeignViilageName,
            senderForeignRegionName
        } = orderDetails;

        let senderAddress = {
            name: SenderName,
            otherDetails: !!senderForeignViilageName ? (senderForeignViilageName + ", " + senderForeignRegionName + " - (" + OtherDetails + ")") : (IdAreaSource == null ? OtherDetails + "  -  " + IdCitySource : IdCitySource + ", " + IdAreaSource + "  -  " + OtherDetails),
            phoneCustomer: PhoneCustomer,
            long: LongSender,
            lat: LatSender
        };

        /* transportation timeline data: */
        let tempTransportationParties = [];

        // if there are transporters worked with this order
        if (timelineArr.length !== 0) {

            tempTransportationParties = [
                { // sender
                    type: 1,
                    current: false,
                    address: senderAddress,
                    customerName: FullNameCustomer + " " + LastNameCustomer,
                    name: SenderName,
                    id: CustomerId,
                    imageURL: customerImgURL
                },
                { // receiver
                    type: 3,
                    current: false,
                    address: receiverAddress,
                    name: ReceiverName
                }
            ]

            // add the transporters to the timeline
            for (let i = 0; i < timelineArr.length; i++) {

                tempTransportationParties.splice(i + 1, 0, {
                    type: 2,
                    address: null,
                    name: timelineArr[i].fullName,
                    id: timelineArr[i].transporter_id,
                    phone: timelineArr[i].PhoneNumber,
                    price: timelineArr[i].transporter_bidprice,
                    current: timelineArr[i].isCurrent === "1" ? true : false,
                    imageURL: timelineArr[i].PersonalImgPath,
                    pickupDate: timelineArr[i].transporter_pickupdate,
                    assignDate: timelineArr[i].assign_date
                })
            }

        } else { // if there are no transporters yet

            tempTransportationParties = [
                { // sender
                    type: 1,
                    current: false,
                    address: senderAddress,
                    customerName: FullNameCustomer + " " + LastNameCustomer,
                    name: SenderName,
                    imageURL: customerImgURL
                },
                { // receiver
                    type: 3,
                    current: false,
                    address: receiverAddress,
                    name: ReceiverName
                }
            ]
        }

        // console.log(tempTransportationParties)

        return (

            <React.Fragment>
                
                <div className="container-fluid">

                </div>

                {orderDetails && <Container fluid mt={5} className='p-5 pe-5 pb-5'>

                    <div style={{ position: "absolute", left: 0, right: 0, backgroundColor: "#ededed", height: "140px", zIndex: "-1" }}></div>

                    <Row className="">
                        {/* Order main info (order number, delivery type, order time, and load details) */}
                        <Col className="mt-5" xl="4">
                            <Card className="shadow rounded-22 p-2 togo-custom-card-lg">
                                <Card.Header>
                                    <span style={styles.orderNumberTitle}>{translate("TEMP.ORDER")}</span>
                                    <span style={styles.orderNumber}>{orderId}</span>
                                    <span style={styles.orderStatus}>
                                        {/*  {
                                            <Badge bg="light" style={{ color: "#35b09d" }}>{order_status}</Badge>
                                        } */}

                                        {
                                            IsStuckOrder == "1" ? <Badge bg="light" style={{ color: "red" }}>{translate("ORDER_DETAILS.ORDER_STUCK")}</Badge> :
                                                IsReturnedOrder == "1" && /* IsReturnAccepted == "0" */ false ? <Badge bg="light" style={{ color: "#ff4444" }}>{translate("ORDER_DETAILS.REQUEST_RETURN")}</Badge> :
                                                    IsReturnedOrder == "1" && /* IsReturnAccepted == "1" */ true && /* order_status == "Delivered" */ true ? <Badge bg="light" style={{ color: "#FFC107" }}>Order Returned</Badge> :
                                                        IsReturnedOrder == "1" && /* IsReturnAccepted == "1" */ false ? <Badge bg="light" style={{ color: "#ff4444" }}>{translate("ORDER_DETAILS.ORDER_RETURNING")}</Badge> :
                                                            order_status == "Deleted" ? <Badge bg="light" style={{ color: "#ff4444" }}>{order_status}</Badge> :
                                                                <Badge bg="light" style={{ color: "#35b09d" }}>{order_status}</Badge>
                                        }
                                    </span>
                                </Card.Header>
                                <Card.Body>
                                    <div>
                                        <Table style={{ fontSize: "1.2rem", marginTop: "30px" }}>
                                            <tbody>
                                                <tr>
                                                    <th scope="row">
                                                        <span>{translate("ORDER_DETAILS.DELIVERY_TYPE")}</span>
                                                    </th>
                                                    <td style={{ textAlign: "right" }}>
                                                        <span style={{ color: "#35b09d" }}>
                                                            {deliverFormatter({ DeliveryWays: deliveryWay })}
                                                            {CostLoad && <Badge bg="secondary ms-1">{CostLoad} NIS</Badge>}
                                                            {CostLoad && currency == 2 && <Badge bg="secondary ms-1">{from_currency_value} JOD</Badge>} {/* nono */}
                                                        </span>
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <th scope="row">
                                                        <span>{translate("ORDERS.ORDER_TIME")}</span>
                                                    </th>
                                                    <td style={{ textAlign: "right" }}>
                                                        <span style={{ color: "#35b09d" }}>{DateLoad.split(" ")[0]} <Badge bg="secondary">{/*DateLoad.split(" ")[1]*/ timeFormat(DateLoad.split(" ")[1])}</Badge></span>
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <th scope="row">
                                                        <span>{translate("ORDER_DETAILS.LOAD_DETAILS")}</span>
                                                    </th>
                                                    <td style={{ textAlign: "right" }}>
                                                        <span style={{ color: "#35b09d" }}>{DetailsLoad}</span>
                                                    </td>
                                                </tr>

                                                {IsStuckOrder == 1 && IsReturnedOrder == 0 && <tr>
                                                    <th scope="row">
                                                        <span>{translate("ORDER_DETAILS.STUCK_COMMENT")}</span>
                                                    </th>
                                                    <td style={{ textAlign: "right" }}>
                                                        <span style={{ color: "#35b09d" }}>{StuckOrderComment}</span>
                                                    </td>
                                                </tr>}
                                            </tbody>
                                        </Table>

                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Actions Buttons */}
                        <Col className="mt-5" xl="8">
                            <Row style={{
                                marginTop: "40px"
                            }}>
                                <Col>
                                    {
                                        <Button disabled={loadingMark ? true : false} variant={foreign_order_error == 1 ? "danger" : "outline-danger"} className="rounded-pill"><i className="bi bi-exclamation-circle-fill" onClick={() => {
                                            let status = (foreign_order_error == 1 ? 0 : 1);
                                            setLoadingMark(true);
                                            AdminRemoveAddErrorMark(orderId, status).then(res => {
                                                // console.log(res.data)
                                                setRefresh(!refresh);
                                                setLoadingMark(false);
                                            })
                                        }}>{foreign_order_error == 1 ? "Unmark" : "Mark"}{loadingMark && <Spinner animation="border" size="sm" />}</i></Button>
                                    }
                                </Col>
                                <Col>
                                    <Box display="flex" justifyContent="end">
                                        {/* Print order pill */}
                                        {/* order_status !== 'Waiting for Bids' */}
                                        {true && <Button
                                            variant="outline-primary"
                                            onClick={() => {
                                                history.push("/adminapp/printOrder/" + orderId + "?print=true")
                                            }}
                                            style={styles.actionButton}
                                        >
                                            {translate("ORDER_DETAILS.PRINT")}
                                            <svg style={{ display: "inline-block", marginLeft: "5px", marginRight: "5px" }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-printer" viewBox="0 0 16 16">
                                                <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z" />
                                                <path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2H5zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4V3zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2H5zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1z" />
                                            </svg>
                                        </Button>}
                                        {/* order_status !== "Waiting for Bids" && order_status !== "Order Assigned" && order_status !== "Deleted" && order_status !== "Out for Delivery" */}
                                        {/* order_status === "Bid Accepted" */}
                                        {order_status !== "Deleted" && order_status !== "Delivered" && order_status !== "Waiting for Bids" && <Button style={styles.actionButton} variant="danger" onClick={handleShowCancelActiveModal}>
                                            Cancel Active Order
                                        </Button>}

                                        {order_status !== "Deleted" && order_status !== "Delivered" && order_status !== "Waiting for Bids" && <Button style={styles.actionButton} variant="danger" onClick={handleShowReturnActiveModal}>
                                            Return Active Order
                                        </Button>}

                                        {order_status !== "Deleted" && order_status !== "Delivered" && order_status !== "Waiting for Bids" && <Button style={styles.actionButton} variant="danger" onClick={handleShowFinishModal}>
                                            Force Finishd Order
                                        </Button>}

                                        {order_status !== "Deleted" && order_status !== "Delivered" && order_status !== "Waiting for Bids" && order_status !== "Out for Delivery" && <Button style={styles.actionButton} variant="danger" onClick={handleShowPickupModal}>
                                            Force Pickup Order
                                        </Button>}

                                        {/* undo canceled order action */}
                                        {order_status === "Deleted" && DeliveryId != null && <Button style={styles.actionButton} variant="danger" onClick={handleShowUndoCanceledModal}>
                                            Uncancel Order
                                        </Button>}

                                        {/* change COD amount for active order */}
                                        {!!newCod && (order_status === "Bid Accepted" || order_status === "Out for Delivery") && DeliveryId != null && (CostLoad != newCod) && <Button style={styles.actionButton} variant="danger" onClick={handleShowChangeCODdModal}>
                                            Apply COD change <br /> ({CostLoad + " -> " + newCod})
                                        </Button>}

                                        {/* alter cod action */}

                                        <Modal show={showCancelActiveModal} onHide={handleCloseCancelActiveModal}>
                                            <Modal.Header closeButton /* style={styles.cardHeaderSm} */>
                                                <Modal.Title>Cancel Order {orderId}</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body /* className="mt-5" */>Are you sure you wnat to cancel (active) order {orderId} before pickup?</Modal.Body>
                                            <Modal.Footer>
                                                <Button variant="secondary" disabled={loading ? true : false} onClick={handleCloseCancelActiveModal}>
                                                    No
                                                </Button>
                                                <Button variant="danger" disabled={loading ? true : false} onClick={() => { handleCancleActiveOrder(orderId) }}>
                                                    {loading && <Spinner animation="border" size="lg" />} Yes, Cancel Order {orderId}
                                                </Button>
                                            </Modal.Footer>
                                        </Modal>

                                        <Modal show={showReturnActiveModal} onHide={handleCloseReturnActiveModal}>
                                            <Modal.Header closeButton /* style={styles.cardHeaderSm} */>
                                                <Modal.Title>Return Order {orderId}</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body /* className="mt-5" */>Are you sure you wnat to return order {orderId} ?</Modal.Body>
                                            <Modal.Footer>
                                                <Button variant="secondary" disabled={loading ? true : false} onClick={handleCloseReturnActiveModal}>
                                                    No
                                                </Button>
                                                <Button variant="danger" disabled={loading ? true : false} onClick={() => { handleReturnActiveOrder(orderId) }}>
                                                    {loading && <Spinner animation="border" size="lg" />} Yes, Return Order {orderId}
                                                </Button>
                                            </Modal.Footer>
                                        </Modal>

                                        <Modal show={showFinishModal} onHide={handleCloseFinishModal}>
                                            <Modal.Header closeButton /* style={styles.cardHeaderSm} */>
                                                <Modal.Title>Finish Order {orderId}</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body /* className="mt-5" */>Are you sure you wnat to finish order {orderId}?</Modal.Body>
                                            <Modal.Footer>
                                                <Button variant="secondary" disabled={loading ? true : false} onClick={handleCloseFinishModal}>
                                                    No
                                                </Button>
                                                <Button variant="danger" disabled={loading ? true : false} onClick={() => { handleFinishOrder(orderId) }}>
                                                    {loading && <Spinner animation="border" size="sm" />} Yes, Finish Order {orderId}
                                                </Button>
                                            </Modal.Footer>
                                        </Modal>

                                        <Modal show={showPickupModal} onHide={handleClosePickupModal}>
                                            <Modal.Header closeButton /* style={styles.cardHeaderSm} */>
                                                <Modal.Title>Pickup Order {orderId}</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body /* className="mt-5" */>Are you sure you wnat to mark order {orderId} as picked up?</Modal.Body>
                                            <Modal.Footer>
                                                <Button variant="secondary" disabled={loading ? true : false} onClick={handleClosePickupModal}>
                                                    No
                                                </Button>
                                                <Button variant="danger" disabled={loading ? true : false} onClick={() => { handlePickupOrder(orderId) }}>
                                                    {loading && <Spinner animation="border" size="sm" />} Yes, Pickup Order {orderId}
                                                </Button>
                                            </Modal.Footer>
                                        </Modal>

                                        <Modal show={showUndoCanceledModal} onHide={handleCloseUndoCanceledModal}>
                                            <Modal.Header closeButton /* style={styles.cardHeaderSm} */>
                                                <Modal.Title>Uncancel Order {orderId}</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body /* className="mt-5" */>Are you sure you wnat to uncancel order {orderId}?</Modal.Body>
                                            <Modal.Footer>
                                                <Button variant="secondary" disabled={loading ? true : false} onClick={handleCloseUndoCanceledModal}>
                                                    No
                                                </Button>
                                                <Button variant="danger" disabled={loading ? true : false} onClick={() => { handleUndoCanceledOrder(orderId) }}>
                                                    {loading && <Spinner animation="border" size="sm" />} Yes, Uncancel Order {orderId}
                                                </Button>
                                            </Modal.Footer>
                                        </Modal>

                                        {order_status === "Waiting for Bids" && <Button style={styles.actionButton} variant="danger" onClick={handleShowCancelNewModal}>
                                            Cancel New Order
                                        </Button>}
                                        <Modal show={showCancelNewModal} onHide={handleCloseCancelNewModal}>
                                            <Modal.Header closeButton /* style={styles.cardHeaderSm} */>
                                                <Modal.Title>Cancel Order {orderId}</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body /* className="mt-5" */>Are you sure you wnat to cancel (new) order {orderId}?</Modal.Body>
                                            <Modal.Footer>
                                                <Button variant="secondary" disabled={loading ? true : false} onClick={handleCloseCancelNewModal}>
                                                    No
                                                </Button>
                                                <Button variant="danger" disabled={loading ? true : false} onClick={() => { handleCancleNewOrder(orderId) }}>
                                                    {loading && <Spinner animation="border" size="sm" />} Yes, Cancel Order {orderId}
                                                </Button>
                                            </Modal.Footer>
                                        </Modal>

                                        <Modal show={showChangeCODModal} onHide={handleCloseChangeCODdModal}>
                                            <Modal.Header closeButton /* style={styles.cardHeaderSm} */>
                                                <Modal.Title>Change order COD</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body /* className="mt-5" */>
                                                {/* Enter new COD amount */}
                                                {/* <Form.Group>
                                                    <FloatingLabel className="mb-3" controlId="placeName" label={"Enter new COD amount"}>
                                                        <Form.Control  type="number" placeholder="..." name="placeName" required ref={newCODAmountRef} />
                                                        <Form.Control.Feedback type="invalid">
                                                            {translate("CREATE_NEW_ORDER.PLEASE_ADD_PLACE_NAME")}
                                                        </Form.Control.Feedback>
                                                    </FloatingLabel>
                                                </Form.Group> */}
                                                Change order {orderId} COD from ({CostLoad} NIS) to ({newCod} NIS)?
                                            </Modal.Body>
                                            <Modal.Footer>
                                                <Button variant="secondary" disabled={loading ? true : false} onClick={handleCloseChangeCODdModal}>
                                                    Cancel
                                                </Button>
                                                <Button variant="success" disabled={loading ? true : false} onClick={() => { handleChangeCOD(orderId) }}>
                                                    {loading && <Spinner animation="border" size="sm" />} Confirm
                                                </Button>
                                            </Modal.Footer>
                                        </Modal>
                                    </Box>
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    {/* Transportation Timeline */}
                    <Row className="mt-5">
                        <Col>
                            <Timeline transportationParties={tempTransportationParties} showTransactions={true} orderId={orderId} />
                        </Col>
                    </Row>

                    <Row className="mt-5">
                        {/* Load Details */}
                        <Col xl="3">
                            <Card className='shadow h-100 rounded-22 togo-custom-card-sm'>
                                <Card.Header>
                                    {translate("TEMP.LOAD_INFO")}
                                </Card.Header>
                                <Card.Body>
                                    <div className="w-100 d-flex justify-content-center mt-2" style={{ fontSize: "1.5rem" }}>
                                        <Badge bg="warning" className="rounded-22">
                                            {
                                                TypeLoad === "1" ? <MdOutlineFastfood style={{ height: '50px', width: '50px' }} /> :
                                                    TypeLoad === "2" ? <FcPackage style={{ height: '50px', width: '50px' }} /> :
                                                        TypeLoad === "3" ? <BiPackage style={{ height: '50px', width: '50px' }} /> :
                                                            <FiPackage style={{ height: '50px', width: '50px' }} />
                                            }
                                        </Badge>
                                    </div>
                                    <div className="w-100 d-flex justify-content-center" style={{ fontSize: "1.5rem" }}>
                                        {packageFormatter({ PackageType: TypeLoad })}
                                    </div>
                                    <Table className="mt-3">
                                        <tbody>
                                            <tr>
                                                <th scope='row'>{translate("ORDER_DETAILS.LOAD_HEIGHT")}</th>
                                                <td>{HeightLoad ? HeightLoad : "--"}</td>
                                            </tr>
                                            <tr>
                                                <th scope='row'>{translate("ORDER_DETAILS.LOAD_WIDTH")}</th>
                                                <td>{WidthLoad ? WidthLoad : "--"}</td>
                                            </tr>
                                            <tr>
                                                <th scope='row'>{translate("ORDER_DETAILS.LOAD_LENGTH")}</th>
                                                <td>{LengthLoad ? LengthLoad : "--"}</td>
                                            </tr>
                                            <tr>
                                                <th scope='row'>{translate("ORDER_DETAILS.LOAD_WEIGHT")}</th>
                                                <td>{WeightLoad ? WeightLoad : "--"}</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Map card above (if there are no available offers) / Available Offers card (if there are available offers) */}
                        {/* if there are available offers then their card will apear and the map card will go below. if not, the map will be above */}
                        <Col xl="5">
                            <Card className='shadow h-100 rounded-22'>
                                <Card.Header style={styles.cardHeaderSm}>
                                    {(order_status === "Waiting for Bids" || order_status === "Order Assigned") && DeliveryId == null ? "Available Offers" : "Location"}
                                </Card.Header>

                                {(order_status === "Waiting for Bids" || order_status === "Order Assigned") && DeliveryId == null ? <Card.Body className='mt-4' style={{ height: '345.8px', overflowY: 'scroll' }}>
                                    <Table>
                                        <thead>
                                            <tr>
                                                <th style={{ width: "20%" }}></th>
                                                <th style={{ fontSize: "1rem" }}>Network</th>
                                                <th style={{ fontSize: "1rem" }}>Name/Mobile</th>
                                                <th style={{ fontSize: "1rem" }}>Price</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        {order_status === "Waiting for Bids" && tripCost && tripCost.length !== 0 ? <tbody>
                                            {tripCost.map((costs, index) => {
                                                return <tr key={index}>
                                                    <td><img style={{
                                                        width: "50%",
                                                        height: "50%",
                                                        objectFit: "cover"
                                                    }}
                                                        className="rounded-circle align-self-center" src={`${imgBaseUrl}${costs.TransporterPersonalImg}`} alt="transImg" />
                                                    </td>
                                                    <td>{costs.isNetwork === "1" && <i className="bi bi-check-circle-fill h5" style={{ color: "green" }}></i>}</td>
                                                    <td>
                                                        <span>{costs.TransporterName}</span><br />
                                                        <span>{costs.mobile}</span>
                                                    </td>
                                                    <td>{costs.BidCost}</td>
                                                    <td>
                                                        <Button
                                                            disabled={costs.isEnoughBalance == "1" ? false : true}
                                                            variant={costs.isEnoughBalance == "1" ? "primary" : "warning"}
                                                            style={{ fontSize: "0.7rem", width: "100px" }}
                                                            onClick={() => { if (costs.isEnoughBalance == "1") { handleShow(); setBidReqTransName(costs.TransporterName); setBidReqTransRate(costs.TotalRate); setBidReqTransId(costs.IdTransporterBidRequist); setBidReqTransPrice(costs.BidCost); setBidReqTransImg(costs.TransporterPersonalImg) } }}
                                                        >
                                                            {costs.isEnoughBalance == "1" ? "Accept Offer" : "Not Available"}
                                                        </Button>
                                                        <Modal show={show} onHide={handleClose} centered>
                                                            <Modal.Header closeButton>
                                                                <Modal.Title>Accept Offer</Modal.Title>
                                                            </Modal.Header>

                                                            <Modal.Body>
                                                                <div className="" style={{ fontSize: "1.5rem" }}>
                                                                    <div className="w-100 d-flex justify-content-center">
                                                                        <div style={{
                                                                            background: "linear-gradient(90deg, #26a69a, #69d4a5)",

                                                                            width: "80px",
                                                                            height: "80px",
                                                                        }}
                                                                            className="d-flex justify-content-center rounded-circle align-self-center">
                                                                            <img
                                                                                style={{
                                                                                    width: "80%",
                                                                                    height: "80%",
                                                                                    objectFit: "cover"
                                                                                }}
                                                                                className="rounded-circle align-self-center bg-white"
                                                                                src={`${imgBaseUrl}${bidReqTransImg}`}
                                                                                alt={"img"}

                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="d-flex justify-content-between">
                                                                        <div>Transporter:</div>
                                                                        <div>{bidReqTransName}</div>
                                                                    </div>
                                                                    <div className="d-flex justify-content-between">
                                                                        <div>Bid Price:</div>
                                                                        <div>{bidReqTransPrice}</div>
                                                                    </div>
                                                                    <div className="w-100 d-flex justify-content-center">
                                                                        <Rating name="size-large" size="large" defaultValue={bidReqTransRate} precision={0.1} readOnly />
                                                                    </div>
                                                                </div>
                                                            </Modal.Body>
                                                            <Modal.Footer>
                                                                <Button variant="secondary" onClick={handleClose}>
                                                                    Cancel
                                                                </Button>
                                                                <Button
                                                                    disabled={loadingAcceptOffer ? true : false}
                                                                    variant="primary"
                                                                    onClick={() => {
                                                                        // console.log(CustomerId, bidReqTransId, orderId, bidReqTransPrice);
                                                                        setLoadingAcceptOffer(true);
                                                                        AdminAcceptOfferReq(CustomerId, bidReqTransId, orderId, bidReqTransPrice).then((resp) => {
                                                                            // console.log(resp.data);
                                                                            if (
                                                                                resp.data == "ClientChargeBalanace" ||
                                                                                resp.data == "TransporterNeedCharge" ||
                                                                                resp.data == "ChargeBalanace" ||
                                                                                resp.data == "deliveryWayNotFound" ||
                                                                                resp.data == "OrderNotFound" ||
                                                                                resp.data == "OrderAlreadyTaken" ||
                                                                                resp.data == "TransporterNeedCharge" ||
                                                                                resp.data == "OrderNotAccept" ||
                                                                                resp.data == "BidChanged" ||
                                                                                resp.data == "Blocked" ||
                                                                                resp.data == "TokenError"
                                                                            ) {
                                                                                dispatch(toastNotification("Error!", resp.data, "error"));
                                                                            } else if (resp.data.indexOf("Success") !== -1) {
                                                                                setRefresh(!refresh);
                                                                            }
                                                                            setLoadingAcceptOffer(false);
                                                                        })
                                                                    }}
                                                                >
                                                                    {loadingAcceptOffer && <Spinner animation="border" size="sm" />}
                                                                    Accept
                                                                </Button>
                                                            </Modal.Footer>
                                                        </Modal>

                                                        {/* -------------------------- */}

                                                        {/* <Button
                                                            disabled={costs.isEnoughBalance == "1" ? false : true}
                                                            variant={costs.isEnoughBalance == "1" ? "danger" : "warning"}
                                                            style={{ fontSize: "0.7rem", width: "100px" }}
                                                            onClick={() => { if (costs.isEnoughBalance == "1") { handleShow(); setBidReqTransName(costs.TransporterName); setBidReqTransRate(costs.TotalRate); setBidReqTransId(costs.IdTransporterBidRequist); setBidReqTransPrice(costs.BidCost); setBidReqTransImg(costs.TransporterPersonalImg) } }}
                                                        >
                                                            {costs.isEnoughBalance == "1" ? "DO NOT CLICK!!!" : "Not Available"}
                                                        </Button> */}
                                                        {/*  <Modal show={show} onHide={handleClose} centered>
                                                            <Modal.Header closeButton>
                                                                <Modal.Title>Accept Offer</Modal.Title>
                                                            </Modal.Header>

                                                            <Modal.Body>
                                                                <div className="" style={{ fontSize: "1.5rem" }}>
                                                                    <div className="w-100 d-flex justify-content-center">
                                                                        <div style={{
                                                                            background: "linear-gradient(90deg, #26a69a, #69d4a5)",

                                                                            width: "80px",
                                                                            height: "80px",
                                                                        }}
                                                                            className="d-flex justify-content-center rounded-circle align-self-center">
                                                                            <img
                                                                                style={{
                                                                                    width: "80%",
                                                                                    height: "80%",
                                                                                    objectFit: "cover"
                                                                                }}
                                                                                className="rounded-circle align-self-center bg-white"
                                                                                src={`${imgBaseUrl}${bidReqTransImg}`}
                                                                                alt={"img"}

                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="d-flex justify-content-between">
                                                                        <div>Transporter:</div>
                                                                        <div>{bidReqTransName}</div>
                                                                    </div>
                                                                    <div className="d-flex justify-content-between">
                                                                        <div>Bid Price:</div>
                                                                        <div>{bidReqTransPrice}</div>
                                                                    </div>
                                                                    <div className="w-100 d-flex justify-content-center">
                                                                        <Rating name="size-large" size="large" defaultValue={bidReqTransRate} precision={0.1} readOnly />
                                                                    </div>
                                                                </div>
                                                            </Modal.Body>
                                                            <Modal.Footer>
                                                                <Button variant="secondary" onClick={handleClose}>
                                                                    Cancel
                                                                </Button>
                                                                <Button
                                                                    disabled={loadingAcceptOffer ? true : false}
                                                                    variant="primary"
                                                                    onClick={() => {
                                                                        // console.log(CustomerId, bidReqTransId, orderId, bidReqTransPrice);
                                                                        setLoadingAcceptOffer(true);
                                                                        AdminAcceptOfferReqFIX(CustomerId, bidReqTransId, orderId, bidReqTransPrice).then((resp) => {
                                                                            // console.log(resp.data);
                                                                            if (
                                                                                resp.data == "ClientChargeBalanace" ||
                                                                                resp.data == "TransporterNeedCharge" ||
                                                                                resp.data == "ChargeBalanace" ||
                                                                                resp.data == "deliveryWayNotFound" ||
                                                                                resp.data == "OrderNotFound" ||
                                                                                resp.data == "OrderAlreadyTaken" ||
                                                                                resp.data == "TransporterNeedCharge" ||
                                                                                resp.data == "OrderNotAccept" ||
                                                                                resp.data == "BidChanged" ||
                                                                                resp.data == "Blocked" ||
                                                                                resp.data == "TokenError"
                                                                            ) {
                                                                                dispatch(toastNotification("Error!", resp.data, "error"));
                                                                            } else if (resp.data.indexOf("Success") !== -1) {
                                                                                setRefresh(!refresh);
                                                                            }
                                                                            setLoadingAcceptOffer(false);
                                                                        })
                                                                    }}
                                                                >
                                                                    {loadingAcceptOffer && <Spinner animation="border" size="sm" />}
                                                                    Accept
                                                                </Button>
                                                            </Modal.Footer>
                                                        </Modal> */}
                                                    </td>
                                                </tr>
                                            })}
                                        </tbody> : <tbody>
                                            <tr>
                                                <td colSpan={4}>No offers yet</td>
                                            </tr>
                                        </tbody>}
                                    </Table>
                                </Card.Body> : <Card.Body className='mt-4'><Map className="" address1={senderAddress} address2={receiverAddress} /> </Card.Body>} {/* display Map card above if there are available offers */}
                            </Card>
                        </Col>

                        {/* Map */}
                        {/* <Col xl="5">
                            <Card className='shadow h-100 rounded-22 togo-custom-card-sm'>
                                <Card.Header>
                                    {translate("TEMP.LOCATION")}
                                </Card.Header>

                                <Card.Body><Map className="" address1={senderAddress} address2={receiverAddress} /> </Card.Body>
                            </Card>
                        </Col> */}

                        {/* Order's Actions Log */}
                        <Col xl="4">
                            <Card className='shadow h-100 rounded-22 togo-custom-card-sm'>
                                <Card.Header>
                                    {translate("TEMP.ORDER_ACTIONS")}
                                </Card.Header>
                                <Card.Body style={{ height: '345.8px', overflowY: 'scroll' }}>

                                    <OrderActions actions={orderActions} />

                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    {/* Order's Financial Transactions */}
                    {
                        /* transactions.length > 0 && <Row className="mt-5">
                            <Card className='shadow rounded-22'>
                                <Card.Header style={styles.cardHeaderSm}>
                                    {translate("TEMP.ORDER_TRANSACTIONS")}
                                </Card.Header>
                                <Card.Body className="mt-3">
                                    <Table>
                                        <thead>
                                            <tr>
                                                <th scope="col">{translate("TRANSACTIONS.NAME")}</th>
                                                <th scope="col">{translate("TRANSACTIONS.DATE")}</th>
                                                <th scope="col">{translate("TRANSACTIONS.TIME")}</th>
                                                <th scope="col">{translate("TRANSACTIONS.JOURNAL_NAME")}</th>
                                                <th scope="col">{translate("TRANSACTIONS.IN")}</th>
                                                <th scope="col">{translate("TRANSACTIONS.OUT")}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            { // popo
                                                transactions?.map((item, index) => {
                                                    return <tr
                                                        key={index}
                                                    >
                                                        <td>
                                                            {item.move_name}
                                                        </td>
                                                        <td>
                                                            {item.create_date.split(" ")[0]}
                                                        </td>
                                                        <td>
                                                            {timeFormat(item.create_date.split(" ")[1])}
                                                        </td>
                                                        <td>
                                                            {item.journal_id_name}
                                                        </td>
                                                        <td>
                                                            <span style={{ fontWeight: item.credit > 0 ? "bold" : "", color: item.credit === 0 ? "lightgray" : "" }}>{item.credit !== 0 ? item.credit + " NIS" : 0}</span>
                                                        </td>
                                                        <td>
                                                            <span style={{ fontWeight: item.debit > 0 ? "bold" : "", color: item.debit === 0 ? "lightgray" : "" }}>{item.debit !== 0 ? item.debit + " NIS" : 0}</span>
                                                        </td>

                                                    </tr>
                                                })
                                            }
                                        </tbody>
                                    </Table>
                                </Card.Body>
                            </Card>
                        </Row> */
                    }
                </Container >}
            </React.Fragment >
        );
    } else if (typeof orderDetails === "string") {
        return (
            <Alert status="error" w="80%" m="10px auto">
                <AlertIcon />
                <AlertTitle mr={2}>{orderId}</AlertTitle>
                <AlertDescription>{orderDetails}</AlertDescription>
            </Alert>
        );
    } else {
        return <Box height="400px"><Loader /></Box>
    }
}

export default AdminOrderDetails;
