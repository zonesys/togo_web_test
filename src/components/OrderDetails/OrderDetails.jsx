import React, { useEffect, useRef, useState } from "react";
import Map from "../Address/Map";
import { Accordion, Card, Button, Badge, Dropdown, Form, Modal, Spinner, Col, Row, Container, Table, ModalHeader } from "react-bootstrap";
import { MdOutlineFastfood } from 'react-icons/md';
import { BiPackage } from 'react-icons/bi'
import { FiPackage } from 'react-icons/fi';
import { FcPackage } from 'react-icons/fc';
import { GiEnvelope } from 'react-icons/gi';
import { FinalizeOrder } from "../OrdersManager/FinalizeOrder";
import { CancelOrder } from "../OrdersManager/CancelOrder";
import { BidOrder } from "../OrdersManager/AcceptOrder";
import { DeleteTripCost } from "../OrdersManager/DeleteTripCost";
import { EditTripCost } from "../OrdersManager/EditTripCost";
import Loader from "../Loader/Loader";
import "./OrderDetails.css";
import {
    getOrderDetails,
    checkTripCost,
    AcceptOfferReq,
    GetTransporterLocation,
    getOrderActions,
    transactionsByOrder,
    getTransporterInfo,
    getTimeLine,
    recordAction,
    ClientAssignOrder,
    customerEditCOD,
    customerEditOrderNotes
} from "../../APIs/OrdersAPIs";
import translate from "../../i18n/translate";
import { Alert, AlertDescription, AlertIcon, AlertTitle } from "@chakra-ui/alert";
import { Box } from "@chakra-ui/layout";
import { deliverFormatter, packageFormatter } from "../Orders/OrdersTabularView";
import { isTeamMember, isTransporter, isTransporterMaster } from "../../Util";
import AssignToTransporter from "../AssigneToTransporter";
import { useLocation, useParams, useHistory } from "react-router";
import AssignToMemberOnNetworkDialog from "../AssginToMemberOnNetworkDialog";
import { refreshPage } from "../../Functions/CommonFunctions";
import Timeline from "../TimeLine/TimeLine";
import Rating from '@material-ui/lab/Rating';
import { motion } from "framer-motion";
import AssignClientOrder from '../AssignClientOrder';
import StuckOrder from '../OrdersManager/StuckOrder';
import ReturnOrder from '../OrdersManager/ReturnOrder';
import AcceptReturned from '../OrdersManager/AcceptReturnedOrder';
import ConfirmFinishedReturnedOrder from '../OrdersManager/ConfirmFinishedReturnedOrder';
import ResponseToAssignedOrderFromTransporter from '../OrdersManager/responseToAssignedOrderFromTransporter';
import ResponseToAssignedOrderFromClient from '../OrdersManager/ResponseToAssignedOrderFromClient';
import CancelAssignedOrder from '../OrdersManager/CancelAssignedOrder';
// import AssignToNetworkMemberCo from '../OrdersManager/AssignToNetworkMemberCo';
import OrderActions from './OrderActions';
import { useDispatch } from "react-redux";
import { toastNotification } from "../../Actions/GeneralActions";
import { imgBaseUrl } from "../../Constants/GeneralCont";
import { FiEdit3 } from 'react-icons/fi';

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

const OrderDetails = () => {

    const [testShow, setTestShow] = useState(false);

    const testHandleShow = () => { setTestShow(true) };
    const testHandleHide = () => { setTestShow(false) };

    let dispatch = useDispatch();

    const [refresh, setRefresh] = useState(false);
    const [loadingAcceptOffer, setLoadingAcceptOffer] = useState(false);
    const [loadingCreateReturned, setLoadingCreateReturned] = useState(false);
    const [loadingEditCod, setLoadingEditCod] = useState(false);
    const [loadingEditNotes, setLoadingEditNotes] = useState(false);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [showCreateReturnedModal, setShowCreateReturnedModal] = useState(false);
    const handleCloseCreateReturnedModal = () => setShowCreateReturnedModal(false);
    const handleShowCreateReturnedModal = () => setShowCreateReturnedModal(true);

    const [showEditCodModal, setShowEditCodModal] = useState(false);
    const handleCloseEditCodModal = () => setShowEditCodModal(false);
    const handleShowEditCodModal = () => setShowEditCodModal(true);

    const [showEditNotesModal, setShowEditNotesModal] = useState(false);
    const handleCloseEditNotesModal = () => setShowEditNotesModal(false);
    const handleShowEditNotesModal = () => setShowEditNotesModal(true);

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

    /* selected available offer variables (to display transporter info to accept offer) */
    const [bidReqTransImg, setBidReqTransImg] = useState();
    const [bidReqTransPrice, setBidReqTransPrice] = useState();
    const [bidReqTransId, setBidReqTransId] = useState();
    const [bidReqTransRate, setBidReqTransRate] = useState();

    const [bidReqTransName, setBidReqTransName] = useState();

    const [showCodError, setShowCodError] = useState(false);
    const [showNotesError, setShowNotesError] = useState(false);
    const newNotesRef = useRef();
    const newCodRef = useRef();
    const newCurrencyRef = useRef();

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
            width: "150px"
        },
        actionButtonLg: {
            marginRight: "5px",
            marginLeft: "5px",
            width: "200px"
        }
    }

    /* get financial transactions related to this order */
    useEffect(() => {
        let isMounted = true;
        transactionsByOrder(localStorage.getItem("userId"), orderId).then(res => {
            if (isMounted) {
                let tempArr = res.data.server_response.data.result.response;
                tempArr = tempArr.filter(data => ((data.journal_id_name == "Customer Invoices" && data.debit != 0) || data.journal_id_name != "Customer Invoices"));

                setTransactions(tempArr);
            }
        })
        return () => { isMounted = false };
    }, [refresh]);

    /* track transporter !!!! */ // to be done
    useEffect(() => {
        let live = false;
        if (startTracking === false) {
            return;
        }
        const intervalId = setInterval(() => {
            if (!live) {
                live = true;
                GetTransporterLocation(orderId).then((resp) => {
                    live = false;
                    let { TransporterLatLocation, TransporterLongLoc } = resp.data.server_response[0];
                    if (TransporterLatLocation === null || TransporterLongLoc === null) {
                        TransporterLatLocation = 0;
                        TransporterLongLoc = 0;
                    }
                    setReceiverAddress({
                        ...receiverAddress,
                        long: TransporterLongLoc,
                        lat: TransporterLatLocation
                    });
                });
            }
        }, 4000);
        return () => clearInterval(intervalId);
    }, [startTracking])

    /* check if the current transporter has already bid on this order and get available offers */
    /* useEffect(() => {
        checkTripCost(orderId, isTransporter(), ).then((tripCostRes) => {

            // console.log(tripCostRes); // temp test

            if (tripCostRes && tripCostRes !== "CostNotSend") {
                setTripCost(isTransporter() ? tripCostRes.server_response[0] : tripCostRes.CostDetail);
                setCostSet(true);
            } else {
                setCostSet(false);
            }
        });
    }, [refresh]) */

    /* get order details */
    useEffect(() => {
        getOrderDetails(orderId).then((orderDetailsRes) => {

            // console.log(orderDetailsRes); // temp test

            setOrderDetails(orderDetailsRes);

            setReceiverAddress({
                otherDetails: orderDetailsRes.IdAreaDes == null ? orderDetailsRes.OtherDetailsDes + "  -  " + orderDetailsRes.IdCityDes : orderDetailsRes.IdCityDes + ", " + orderDetailsRes.IdAreaDes + "  -  " + orderDetailsRes.OtherDetailsDes,
                phoneCustomer: orderDetailsRes.ReceiverAddressNum,
                long: orderDetailsRes.LongReciver,
                lat: orderDetailsRes.LatReciver
            });

            // ---------------------

            checkTripCost(orderId, isTransporter(), orderDetailsRes.CostLoad, orderDetailsRes.cityFromId, orderDetailsRes.cityToId).then((tripCostRes) => {

                // console.log({tripCostRes}); // temp test

                if (tripCostRes && tripCostRes !== "CostNotSend") {
                    setTripCost(isTransporter() ? tripCostRes.server_response[0] : tripCostRes.CostDetail);
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
        getOrderActions(orderId).then((res) => {
            setOrderActions(res.data.records_list);
        })
    }, [refresh])

    /* transportation timeline (to show all the transporters that worked with this order) */
    useEffect(() => {
        getTimeLine(orderId).then((res) => {
            // console.log(res.data.timeline)
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
            IsReturnAccepted, /* edited (IsReturnAccepted added) */
            isReturnedFinished, /* edited (isReturnedFinished added) */
            IsStuckOrder, /* edited (IsStuckOrder added) */
            clientAssigneeId, /* edited (clientAssigneeId added) */
            StuckOrderComment, /* edited (StuckOrderComment added) */
            CustomerId, /* edited (CustomerId added) */
            deliveryWay,
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
            ReceiverName
        } = orderDetails;

        let senderAddress = {
            name: SenderName,
            otherDetails: IdAreaSource == null ? OtherDetails + "  -  " + IdCitySource : IdCitySource + ", " + IdAreaSource + "  -  " + OtherDetails,
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

        return (

            <React.Fragment>
                {orderDetails && <Container fluid className='ps-5 pe-5 pb-5'>

                    <div style={{ position: "absolute", left: 0, right: 0, backgroundColor: "#ededed", height: "140px", zIndex: "-1" }}></div>

                    <Row className="">
                        {/* Order main info (order number, delivery type, order time, and load details) */}
                        <Col className="mt-5" xl="4">
                            <Card className="shadow rounded-22 p-2">
                                <Card.Header style={styles.cardHeaderLg}>
                                    <span style={styles.orderNumberTitle}>{translate("TEMP.ORDER")}</span>
                                    <span style={styles.orderNumber}>{orderId}</span>
                                    <span style={styles.orderStatus}>
                                        {
                                            IsStuckOrder == "1" ? <Badge bg="light" style={{ color: "red" }}>{translate("ORDER_DETAILS.ORDER_STUCK")}</Badge> :
                                                IsReturnedOrder == "1" && IsReturnAccepted == "0" ? <Badge bg="light" style={{ color: "#ff4444" }}>{translate("ORDER_DETAILS.REQUEST_RETURN")}</Badge> :
                                                    IsReturnedOrder == "1" && IsReturnAccepted == "1" && order_status == "Delivered" ? <Badge bg="light" style={{ color: "#ff4444" }}>{translate("ORDER_DETAILS.ORDER_RETURNED")}</Badge> :
                                                        IsReturnedOrder == "1" && IsReturnAccepted == "1" ? <Badge bg="light" style={{ color: "#ff4444" }}>{translate("ORDER_DETAILS.ORDER_RETURNING")}</Badge> :
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
                                                            {CostLoad && <Badge bg="secondary ms-1">{CostLoad} ILS</Badge>} {/* nono */}
                                                            {CostLoad && currency == 2 && <Badge bg="secondary ms-1">{from_currency_value} JOD</Badge>} {/* nono */}
                                                        </span>
                                                        {order_status === 'Waiting for Bids' && <span style={{ float: "right", marginTop: "5px", marginLeft: "10px", cursor: "pointer" }}>
                                                            <FiEdit3 onClick={() => {
                                                                handleShowEditCodModal()
                                                            }} />
                                                        </span>}
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
                                                        {order_status === 'Waiting for Bids' && <span style={{ float: "right", marginTop: "5px", marginLeft: "10px", cursor: "pointer" }}>
                                                            <FiEdit3 onClick={() => {
                                                                handleShowEditNotesModal()
                                                            }} />
                                                        </span>}
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
                                        <Modal show={showEditCodModal} onHide={handleCloseEditCodModal} centered>
                                            <Modal.Header closeButton>
                                                <Modal.Title>{translate("ORDERS.EDIT_COD")}</Modal.Title>
                                            </Modal.Header>

                                            <Modal.Body>

                                                <div className="d-flex justify-content-center">
                                                    <Form.Control type="number" placeholder="COD" ref={newCodRef} />

                                                    <Form.Select
                                                        style={{ cursor: "pointer", marginLeft: "10px", width: "100px" }}
                                                        aria-label="Default select example"
                                                        ref={newCurrencyRef}
                                                        defaultValue={currency == 1 ? 1 : 2}
                                                    >
                                                        <option value={1}>ILS</option>
                                                        <option value={2}>JOD</option>
                                                    </Form.Select>
                                                </div>

                                                {showCodError && <span style={{ color: "red" }}>Field Required *</span>}

                                            </Modal.Body>
                                            <Modal.Footer>
                                                <Button variant="secondary" onClick={handleCloseEditCodModal}>
                                                    {translate("GENERAL.CANCEL")}
                                                </Button>
                                                <Button
                                                    disabled={loadingEditCod ? true : false}
                                                    variant="primary"
                                                    onClick={() => {
                                                        setLoadingEditCod(true);

                                                        if (newCodRef.current.value && newCurrencyRef.current.value) {

                                                            const newCod = newCodRef.current.value;
                                                            const newCurrency = newCurrencyRef.current.value;

                                                            // console.log(newCod, newCurrency)

                                                            customerEditCOD(orderId, newCod, newCurrency).then((res) => {
                                                                // console.log(res.data)

                                                                if (res.data.includes('error')) {
                                                                    dispatch(toastNotification("Error!", res.data, "error"));
                                                                } else {
                                                                    dispatch(toastNotification("Edited!", res.data, "success"));
                                                                    setRefresh(!refresh);
                                                                    setLoadingEditCod(false);
                                                                    handleCloseEditCodModal();
                                                                }
                                                            })

                                                            setShowCodError(false)
                                                        } else {
                                                            // alert("Please enter COD");
                                                            setLoadingEditCod(false);
                                                            setShowCodError(true)
                                                        }
                                                    }}
                                                >
                                                    {loadingEditCod && <Spinner animation="border" size="sm" />}
                                                    {translate("ORDERS.SAVE")}
                                                </Button>
                                            </Modal.Footer>
                                        </Modal>

                                        <Modal show={showEditNotesModal} onHide={handleCloseEditNotesModal} centered>
                                            <Modal.Header closeButton>
                                                <Modal.Title>{translate("ORDERS.EDIT_NOTES")}</Modal.Title>
                                            </Modal.Header>

                                            <Modal.Body>

                                                <Form.Control type="text" placeholder={DetailsLoad} ref={newNotesRef} />

                                                {showNotesError && <span style={{ color: "red" }}>Field Required *</span>}

                                            </Modal.Body>
                                            <Modal.Footer>
                                                <Button variant="secondary" onClick={handleCloseEditNotesModal}>
                                                    {translate("GENERAL.CANCEL")}
                                                </Button>
                                                <Button
                                                    disabled={loadingEditNotes ? true : false}
                                                    variant="primary"
                                                    onClick={() => {
                                                        setLoadingEditNotes(true);

                                                        if (newNotesRef.current.value) {

                                                            const notes = newNotesRef.current.value;

                                                            // console.log(newCod, newCurrency)

                                                            customerEditOrderNotes(orderId, notes).then((res) => {
                                                                // console.log(res.data)

                                                                if (res.data.includes('error')) {
                                                                    dispatch(toastNotification("Error!", res.data, "error"));
                                                                } else {
                                                                    dispatch(toastNotification("Edited!", res.data, "success"));
                                                                    setRefresh(!refresh);
                                                                    setLoadingEditNotes(false);
                                                                    handleCloseEditNotesModal();
                                                                }
                                                            })

                                                            setShowCodError(false)
                                                        } else {
                                                            // alert("Please enter COD");
                                                            setLoadingEditNotes(false);
                                                            setShowNotesError(true)
                                                        }
                                                    }}
                                                >
                                                    {loadingEditNotes && <Spinner animation="border" size="sm" />}
                                                    {translate("ORDERS.SAVE")}
                                                </Button>
                                            </Modal.Footer>
                                        </Modal>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Actions Buttons (each will be displayed according to a specific condition or status) */}
                        <Col className="mt-5" xl="8">
                            <Row style={{
                                marginTop: "40px"
                            }}>
                                {IsReturnAccepted == 1 && <Col>
                                    <div style={{ marginTop: "0" }}>
                                        <Button variant="outline-danger" disabled>{translate("ORDER_DETAILS.ORDER_MARKED_RETURNED")}</Button>
                                    </div>
                                </Col>}

                                {/* Display assign status for transporters (when order is assigned to another transporter and when the other transporter response to the asigned order) */}
                                {/* {isTransporter() && order_status !== "Delivered" && <Col>
                                    {
                                        AssignerId === localStorage.getItem("userId") && transporterAssignStatus == 1 ? <div style={{ marginTop: "0" }}>
                                            <Button variant="outline-danger" disabled>{translate("TEMP.ASSIGNED_AND_WAITING")}</Button>
                                        </div> :
                                            (AssigneeId === localStorage.getItem("userId") && transporterAssignStatus == 1) || (clientAssigneeId === localStorage.getItem("userId") && AssignedByClient == 1 && ClientAssignAccepted == 0) ? <div style={{ marginTop: "0" }}>
                                                <Button variant="outline-danger" disabled>{translate("TEMP.ASSIGNED_TO_ME")}</Button>
                                            </div> :
                                                AssignerId === localStorage.getItem("userId") && transporterAssignStatus == 2 ? <div style={{ marginTop: "0" }}><Button variant="outline-danger" disabled>{translate("TEMP.ASSIGNED_AND_ACCEPTED")}</Button></div> :
                                                    AssignerId === localStorage.getItem("userId") && transporterAssignStatus == 3 ? <div style={{ marginTop: "0" }}><Button variant="outline-danger" disabled>{translate("TEMP.ASSIGNED_AND_REJECTED")}</Button></div> : <></>
                                    }
                                </Col>} */}

                                {/* Display assign status for Client (when order is assigned to a transporter and order is marked as returned) */}
                                {/* {!isTransporter() && order_status !== "Delivered" && order_status !== "Deleted" && <Col>
                                    {
                                        AssignedByClient == 1 && ClientAssignAccepted == 0 ?
                                            <div style={{ marginTop: "0" }}>
                                                <Button variant="outline-danger" disabled>{translate("TEMP.ASSIGNED_AND_WAITING")}</Button>
                                                <Button variant="danger" disabled>{translate("ORDER_DETAILS.PRICE")}  {" "}  {DeliveryPrice}</Button>
                                            </div> : IsReturnedOrder == 1 && IsReturnAccepted == null ?
                                                <div style={{ marginTop: "0" }}>
                                                    <Button variant="outline-danger" disabled>{translate("ORDER_DETAILS.ORDER_MARKED_RETURNED")}</Button>
                                                </div> : AssignedByClient == 1 && ClientAssignAccepted == 1 ?
                                                    <div style={{ marginTop: "0" }}><Button variant="outline-danger" disabled>{translate("TEMP.ASSIGNED_AND_ACCEPTED")}</Button>
                                                    </div> : AssignedByClient == 1 && ClientAssignAccepted == 0 ?
                                                        <div style={{ marginTop: "0" }}><Button variant="outline-danger" disabled>{translate("TEMP.ASSIGNED_AND_REJECTED")}</Button>
                                                        </div> : <></>
                                    }
                                </Col>} */}

                                <Col>
                                    <Box display="flex" justifyContent="end">
                                        {/* Print order pill */}
                                        {/* (order_status !== 'Waiting for Bids') */}
                                        {/* (order_status !== 'Waiting for Bids' && isTransporter()) || !isTransporter() */}
                                        {order_status !== 'Waiting for Bids' && <>
                                            <Button
                                                variant="outline-primary"
                                                onClick={() => {
                                                    history.push("/account/print/" + orderId + "?print=true")
                                                }}
                                                style={styles.actionButton}
                                            >
                                                {translate("ORDER_DETAILS.PRINT")}
                                                <svg style={{ display: "inline-block", marginLeft: "5px", marginRight: "5px" }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-printer" viewBox="0 0 16 16">
                                                    <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z" />
                                                    <path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2H5zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4V3zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2H5zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1z" />
                                                </svg>
                                            </Button>
                                        </>
                                        }

                                        {
                                            /* Transporter actions */
                                            isTransporter() && <>
                                                {localStorage.getItem("userId") == "40" && <>
                                                    {/* <AssignToNetworkMemberCo
                                                        onSuccess={() => {
                                                            setRefresh(!refresh);
                                                        }}
                                                        orderId={orderId}
                                                    /> */}
                                                    <Button className="border btn-grad" style={{ width: "150px", marginRight: "5px", marginLeft: "5px" }} onClick={() => {
                                                        history.push("/account/assign-to-network");
                                                    }}>
                                                        Assgin To
                                                    </Button>
                                                </>}
                                                {/* display edit and delete bid buttons when the order is waiting for bids and there is tripCost(bid price) */}
                                                {order_status === 'Waiting for Bids' && tripCost && <>
                                                    <DeleteTripCost customerId={CustomerId} orderId={orderId} onSuccess={() => {
                                                        setTripCost(null);
                                                        setRefresh(!refresh);
                                                    }} />
                                                    <EditTripCost orderId={orderId} tripCost={tripCost.CostDelivery} onSuccess={() => {
                                                        setRefresh(!refresh);
                                                    }} />
                                                </>
                                                }

                                                {/* display bid button when the order is waiting for bids */}
                                                {order_status === 'Waiting for Bids' &&
                                                    !costSet && isTransporter() && <div className="d-flex justify-content-end">
                                                        <BidOrder customerId={CustomerId} orderId={orderId} onSuccess={() => {
                                                            setRefresh(!refresh);
                                                        }} />
                                                    </div>
                                                }

                                                {/* display assign order, accept order, reject order, and cancel assign buttons when order is not waiting for bids and it is not delevered */}
                                                {order_status !== 'Waiting for Bids' && order_status !== "Delivered" && order_status !== "Deleted" && <>
                                                    {/* display assign order button (
                                                         if the current user is the current transporter (currentTransporterId -> the transporter for which the order is assigned)
                                                         transporterAssignStatus -> 
                                                                       "0" if the order is not assigned or assigned and rejected
                                                                       "1" if the order is assigned and waiting for acceptance
                                                                       "2" if the order is assigned and accepted
                                                    ) */}
                                                    {currentTransporterId === localStorage.getItem("userId") && transporterAssignStatus != 1 && <>
                                                        <AssignToMemberOnNetworkDialog
                                                            onSuccess={() => {
                                                                setRefresh(!refresh);
                                                            }}
                                                            orderId={orderId}
                                                        />
                                                    </>}

                                                    {/* display accept and reject assigned order from another transporter buttons when the current user (transporter) is the assignee AND the order is assigned and waiting for acceptance */}
                                                    {AssigneeId === localStorage.getItem("userId") && transporterAssignStatus == 1 &&
                                                        <ResponseToAssignedOrderFromTransporter
                                                            onSuccessAccept={() => {
                                                                setRefresh(!refresh);
                                                            }}

                                                            onSuccessReject={() => {
                                                                history.push("/account/main/all-orders");
                                                            }}
                                                            orderId={orderId}
                                                        />}
                                                    {/* display cancel assigned order button when the current user is the assigner AND the order is assigned and waiting for acceptance */}
                                                    {AssignerId === localStorage.getItem("userId") && transporterAssignStatus == 1 &&

                                                        <CancelAssignedOrder
                                                            onSuccess={() => {
                                                                setRefresh(!refresh);
                                                            }}
                                                            orderId={orderId}
                                                        />
                                                    }
                                                </>}

                                                {/* display accept and reject assigned order from a client buttons when
                                                     the order is assigned by a client (AssignedByClient == 1) AND 
                                                     the order is not accepted yet (ClientAssignAccepted == 0) AND 
                                                     the current transporter is the assignee */}
                                                {clientAssigneeId === localStorage.getItem("userId") && AssignedByClient == 1 && ClientAssignAccepted == 0 && <>
                                                    {/* <ResponseToAssignedOrderFromClient
                                                        onSuccessAccept={() => {
                                                            setRefresh(!refresh);
                                                        }}

                                                        onSuccessReject={() => {
                                                            history.push("/account/main/all-orders");
                                                        }}

                                                        orderId={orderId}
                                                    /> */}
                                                </>}

                                                {/* display stuck order and return order buttons (
                                                         if the order is not finished AND
                                                         the current user is the current transporter (currentTransporterId -> the transporter for which the order is assigned) AND
                                                         pickupDate -> null if the order is not picked up / date string if the order is picked up
                                                ) */}
                                                {pickupDate && order_status !== "Delivered" && currentTransporterId === localStorage.getItem("userId") && <>

                                                    {/* display stuck-order button if the order is not marked as stuck or returned */}
                                                    {IsStuckOrder == 0 && IsReturnedOrder == 0 && <StuckOrder onSuccess={() => { setRefresh(!refresh) }} orderId={orderId} />}

                                                    {/* display return-order button if the order is not marked as returned */}
                                                    {IsReturnedOrder == 0 && <ReturnOrder onSuccess={() => { setRefresh(!refresh) }} orderId={orderId} />}

                                                </>}
                                            </>
                                        }

                                        {
                                            /* Client actions */
                                            !isTransporter() && <>
                                                {/* display cancel order button when the order is waiting for bids OR the order is assigned and not accepted */}
                                                {(order_status === 'Waiting for Bids' || (order_status === 'Order Assigned' && ClientAssignAccepted == 0 && clientAssigneeId != null)) &&

                                                    <CancelOrder orderId={orderId} className="mx-1" onSuccess={() => {
                                                        // history.goBack();
                                                        setRefresh(!refresh);
                                                    }} />
                                                }

                                                {/* display assign order button when the order is waiting for bids and it is not assigned */}
                                                {/* {(order_status === 'Waiting for Bids' && order_status !== 'Order Assigned') &&

                                                    <AssignClientOrder onSuccess={() => { setRefresh(!refresh) }} orderId={orderId} />

                                                } */}

                                                {/* display accept/reject returned order button when order is marked as returned by the transporter */}
                                                {(IsReturnedOrder == 1 && IsReturnAccepted == null) && <>
                                                    <AcceptReturned onSuccess={() => { setRefresh(!refresh) }} orderId={orderId} />
                                                </>
                                                }

                                                {/* display confirm-finish-returned-order after the return request is accepted by the client */}
                                                {IsReturnedOrder == 1 && IsReturnAccepted == 1 && order_status !== "Delivered" && order_status !== "Deleted" && <>
                                                    <ConfirmFinishedReturnedOrder onSuccess={() => { setRefresh(!refresh) }} orderId={orderId} />
                                                </>
                                                }

                                                {/* create new returned order instance */}
                                                {localStorage.getItem("userId") == 41 && order_status == "Delivered" && <>
                                                    <Button variant="warning" onClick={handleShowCreateReturnedModal}>{translate("ORDER_DETAILS.CREATE_RETURNED")}</Button>
                                                </>
                                                }

                                                <Modal show={showCreateReturnedModal} onHide={handleCloseCreateReturnedModal} centered>
                                                    <Modal.Header closeButton>
                                                        <Modal.Title>{translate("ORDER_DETAILS.CREATE_RETURNED")}</Modal.Title>
                                                    </Modal.Header>

                                                    <Modal.Body>
                                                        {translate("ORDER_DETAILS.A_NEW_RETURNED_ORDER")}
                                                    </Modal.Body>
                                                    <Modal.Footer>
                                                        <Button variant="secondary" onClick={handleCloseCreateReturnedModal}>
                                                            {translate("GENERAL.CANCEL")}
                                                        </Button>
                                                        <Button
                                                            disabled={loadingCreateReturned ? true : false}
                                                            variant="primary"
                                                            onClick={() => {
                                                                setLoadingCreateReturned(true);

                                                                // redirect to create-order page
                                                                history.push(`/account/main/create-order?id=${orderId}`)
                                                            }}
                                                        >
                                                            {loadingCreateReturned && <Spinner animation="border" size="sm" />}
                                                            {translate("ORDER_DETAILS.CREATE_ORDER")}
                                                        </Button>
                                                    </Modal.Footer>
                                                </Modal>
                                            </>
                                        }
                                    </Box>
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    {/* Transportation Timeline */}
                    <Row className="mt-5">
                        <Col>
                            <Timeline transportationParties={tempTransportationParties} />
                        </Col>
                    </Row>

                    <Row className="mt-5">
                        {/* Load Details */}
                        <Col xl="3">
                            <Card className='shadow h-100 rounded-22'>
                                <Card.Header style={styles.cardHeaderSm}>
                                    {translate("TEMP.LOAD_INFO")}
                                </Card.Header>
                                <Card.Body className='mt-3'>
                                    <div className="w-100 d-flex justify-content-center mt-2" style={{ fontSize: "1.5rem" }}>
                                        <Badge bg="warning" className="rounded-22">
                                            {
                                                TypeLoad === "1" ? <MdOutlineFastfood style={{ height: '40px', width: '40px' }} /> :
                                                    TypeLoad === "2" ? <FcPackage style={{ height: '40px', width: '40px' }} /> :
                                                        TypeLoad === "3" ? <BiPackage style={{ height: '40px', width: '40px' }} /> :
                                                            <FiPackage style={{ height: '40px', width: '40px' }} />
                                            }
                                        </Badge>
                                    </div>
                                    <div className="w-100 d-flex justify-content-center" style={{ fontSize: "1.2rem" }}>
                                        {packageFormatter({ PackageType: TypeLoad })}
                                    </div>
                                    <Table className="mt-3">
                                        <tbody>
                                            <tr>
                                                <th scope='row' style={{ fontSize: "1rem" }}>{translate("ORDER_DETAILS.LOAD_HEIGHT")}</th>
                                                <td style={{ fontSize: "1rem" }}>{HeightLoad ? HeightLoad : "--"}</td>
                                            </tr>
                                            <tr>
                                                <th scope='row' style={{ fontSize: "1rem" }}>{translate("ORDER_DETAILS.LOAD_WIDTH")}</th>
                                                <td style={{ fontSize: "1rem" }}>{WidthLoad ? WidthLoad : "--"}</td>
                                            </tr>
                                            <tr>
                                                <th scope='row' style={{ fontSize: "1rem" }}>{translate("ORDER_DETAILS.LOAD_LENGTH")}</th>
                                                <td style={{ fontSize: "1rem" }}>{LengthLoad ? LengthLoad : "--"}</td>
                                            </tr>
                                            <tr>
                                                <th scope='row' style={{ fontSize: "1rem" }}>{translate("ORDER_DETAILS.LOAD_WEIGHT")}</th>
                                                <td style={{ fontSize: "1rem" }}>{WeightLoad ? WeightLoad : "--"}</td>
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
                                    {!isTransporter() && (order_status === "Waiting for Bids" || order_status === "Order Assigned") && DeliveryId == null ? translate("ORDERS.AVAILABLE_OFFERS") : translate("TEMP.LOCATION")}
                                </Card.Header>

                                {!isTransporter() && (order_status === "Waiting for Bids" || order_status === "Order Assigned") && DeliveryId == null ? <Card.Body className='mt-4' style={{ height: '345.8px', overflowY: 'scroll' }}>
                                    <Table>
                                        <thead>
                                            <tr>
                                                <th style={{ width: "20%" }}></th>
                                                <th style={{ fontSize: "1rem" }}>{translate("TEMP.MY_NETWORK")}</th>
                                                <th style={{ fontSize: "1rem" }}>{translate("TEMP.NAME_MOBILE")}</th>
                                                <th style={{ fontSize: "1rem" }}>{translate("TEMP.PRICE")}</th>
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
                                                            {costs.isEnoughBalance == "1" ? translate("TEMP.ACCEPT_OFFER") : translate("TEMP.NO_BALANCE")}
                                                        </Button>
                                                        <Modal show={show} onHide={handleClose} centered>
                                                            <Modal.Header closeButton>
                                                                <Modal.Title>{translate("TEMP.ACCEPT_OFFER")}</Modal.Title>
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
                                                                    {translate("GENERAL.CANCEL")}
                                                                </Button>
                                                                <Button
                                                                    disabled={loadingAcceptOffer ? true : false}
                                                                    variant="primary"
                                                                    onClick={() => {
                                                                        setLoadingAcceptOffer(true);
                                                                        AcceptOfferReq(bidReqTransId, orderId, bidReqTransPrice).then((resp) => {
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
                                                                    {translate("TEMP.ACCEPT")}
                                                                </Button>
                                                            </Modal.Footer>
                                                        </Modal>
                                                    </td>
                                                </tr>
                                            })}
                                        </tbody> : <tbody>
                                            <tr>
                                                <td colSpan={4}>{translate("ORDERS.NO_OFFERS")}</td>
                                            </tr>
                                        </tbody>}
                                    </Table>
                                </Card.Body> : <Card.Body className='mt-4'><Map className="" address1={senderAddress} address2={receiverAddress} /> </Card.Body>} {/* display Map card above if there are available offers */}
                            </Card>
                        </Col>

                        {/* Order's Actions Log */}
                        <Col xl="4">
                            <Card className='shadow h-100 rounded-22'>
                                <Card.Header style={styles.cardHeaderSm}>
                                    {translate("TEMP.ORDER_ACTIONS")}
                                </Card.Header>
                                <Card.Body className='mt-4' style={{ height: '345.8px', overflowY: 'scroll' }}>

                                    <OrderActions actions={orderActions} />

                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    {/* Display Map in another row (below) if available-offers dsiplayed */}
                    {
                        !isTransporter() && order_status === "Waiting for Bids" && <Row className="mt-5">
                            <Col>
                                <Card className='shadow rounded-22'>
                                    <Card.Header style={styles.cardHeaderSm}>
                                        {translate("TEMP.LOCATION")}
                                    </Card.Header>
                                    <Card.Body className='mt-3'>
                                        <Map className="" address1={senderAddress} address2={receiverAddress} />
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    }

                    {/* Order's Financial Transactions */}
                    {
                        transactions.length > 0 && <Row className="mt-5">
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
                        </Row>
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

export default OrderDetails;
