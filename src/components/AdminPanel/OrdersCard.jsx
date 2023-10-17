import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import { PackageTypesIcons } from "../CreateNewOrder";
import { FixedSizeList } from 'react-window';
import { GetAllFinishedOrders, getErrMsg, AdminRemoveAddErrorMark } from "../../APIs/AdminPanelApis";
import { useHistory } from "react-router";
import { Badge, Form, Spinner, Modal, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { toastNotification } from "../../Actions/GeneralActions";
import { useDispatch } from "react-redux";

export default function OrdersCard(props) {

    let dispatch = useDispatch();

    /* if (props.title == "Returned/Stuck Orders")
        console.log(props.list); */

    const history = useHistory();

    // window height and width variables to set records container width and height
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth / 2.2);
    const [orders, setOrders] = useState(props.list);
    const [foreignErrorFound, setForeignErrorFound] = useState(false);
    const [foreignErrorCount, setForeignErrorCount] = useState(0);

    const [loading, setLoading] = useState(false);

    const [errMsg, setErrMsg] = useState("");

    const [showErrMsg, setShowErrMsg] = useState(false);

    // update window width and height when change window dimensions (zoom in and out, move to a bigger screen)
    /* useEffect(() => {
        function handleResize() {
            setWindowHeight(window.innerHeight)
            setWindowWidth(window.innerWidth / 2.2)
        }

        window.addEventListener('resize', handleResize)
    }) */

    useEffect(() => {
        setLoading(props.loading);
        setOrders(props.list)

        let errorCount = 0;

        for (let i = 0; i < props.list.length; i++) {
            // console.log(props.list[i].foreign_order_error);
            if (props.list[i].foreign_order_error == 1) {
                setForeignErrorFound(true);
                errorCount++;
            }
        }

        setForeignErrorCount(errorCount);

    }, [props.list])

    // filter records (search by order id)
    const filterHandler = (val) => {
        let tempOrders = props.list.filter(order => (order.id.includes(val) || (order.fromCity && order.fromCity.toLowerCase().includes(val.toLowerCase())) || (order.toCity && order.toCity.toLowerCase().includes(val.toLowerCase())) || (order.receiverName && order.receiverName.toLowerCase().includes(val.toLowerCase())) || (order.clientBusinessName && order.clientBusinessName.toLowerCase().includes(val.toLowerCase())) || (order.transporterAccountName && order.transporterAccountName.toLowerCase().includes(val.toLowerCase())) || (order.DateLoad && order.DateLoad.includes(val)) || (order.foreign_order_error == 1 && val == "!!")));

        setOrders(tempOrders)
    }

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            {errMsg}
        </Tooltip>
    );

    /* const renderTooltip = (orderId) => {
        // getErrorMsg(orderId);
      
        return (
          <Tooltip id="button-tooltip">
            {errMsg}
          </Tooltip>
        );
      }; */

    const getErrorMsg = (orderId) => {
        getErrMsg(orderId).then(res => {
            setErrMsg(res.data);
        })
    }

    const updateOrderErrStatusHandler = (orderId, newStatus) => {
        // Create a copy of the orders list
        const updatedOrders = [...orders];

        // Find the index of the order with the matching ID
        const orderIndex = updatedOrders.findIndex(order => order.id === orderId);

        // If an order with the matching ID is found, update its status
        if (orderIndex !== -1) {
            updatedOrders[orderIndex].foreign_order_error = newStatus;
            setOrders(updatedOrders); // Update the state variable with the updated orders list
        }
    }

    /* FixedSizeList at each row */
    const RowComponent = ({ order, num, style }) => {

        /* const getErrorMsg = (orderId) => {
            getErrMsg(orderId).then(res => {
                setErrMsg(res.data);
            })
        }

        useEffect(() => {
            getErrorMsg(order.id)
        }, []) */

        return (<div style={style} className={"list-group-item-custom"}>
            <div className="list-inner-item">
                {/* <div className="d-flex justify-content-between w-100">
                    <div className="d-flex justify-content-between">
                        {order.TypeLoad && React.createElement(PackageTypesIcons[order.TypeLoad],
                            { style: { width: "30px", height: "30px", margin: "auto" } })
                        }
                        <span className="h4 mt-2">ID {order.id}</span>
                    </div>

                    <div className="d-flex justify-content-between">
                        {order.clientBusinessName}
                    </div>
                </div>

                <div className="d-flex justify-content-between w-100">

                </div>

                <div className="d-flex justify-content-between w-100">

                </div> */}
                <div className="container-fluid">
                    <div className="row">
                        <div className="col d-flex justify-content-start">
                            {order.foreign_order_error == 1 ? <>
                                <span style={{ color: "red", fontSize: "2rem"/* , cursor: "pointer" */ }} /* onMouseEnter={() => { getErrorMsg(order.id); setShowErrMsg(true) }} onMouseLeave={() => { setShowErrMsg(false) }} */ onClick={() => {
                                    let status = (order.foreign_order_error == 1 ? 0 : 1);
                                    updateOrderErrStatusHandler(order.id, status);
                                    // console.log(status);
                                    AdminRemoveAddErrorMark(order.id, status).then(res => {
                                        // console.log(res.data)
                                        // setRefresh(!refresh);
                                        // setLoadingMark(false);
                                        dispatch(toastNotification("updated!", res, "success"));
                                    })
                                }}><i className="bi bi-exclamation-circle-fill"></i></span>
                            </>
                                : order.TypeLoad && React.createElement(PackageTypesIcons[order.TypeLoad],
                                    { style: { width: "30px", height: "30px" } })
                            }
                            <span className="h4 ms-2 order-id mt-2">Order {order.id}</span>
                            <i className="bi bi-eye-fill h1 ms-2" style={{ cursor: "pointer" }} onClick={() => {
                                // history.push("/adminapp/orderDetails/" + order.id)
                                window.open("/adminapp/orderDetails/" + order.id, '_blank');
                            }}></i>
                        </div>

                        <div className="col">
                            {order.IsReturnAccepted == 1 && order.IsReturnedOrder == 1 && order.order_status === "Delivered" ? <div className={"me-2 p-1 d-flex justify-content-center rounded-22 orangy-lbl"} >
                                Order returned to Sender
                            </div> : order.IsReturnAccepted == 0 && order.IsReturnedOrder == 1 ? <div className={"me-2 p-1 d-flex justify-content-center rounded-22 orangy-lbl"} >
                                Requested to Return Order
                            </div> : order.IsReturnAccepted == 1 && order.IsReturnedOrder == 1 ? <div className={"me-2 p-1 d-flex justify-content-center rounded-22 orangy-lbl"} >
                                Order is beign Returned
                            </div> : <>
                                {order.bidsCount != "0" && props.title.indexOf("New") != -1 &&
                                    <div
                                        className="me-2 p-1 rounded-22 purply-lbl d-flex justify-content-center">
                                        {order.bidsCount} Bids
                                    </div>
                                }

                                {order.bidsCount == "0" && props.title.indexOf("New") != -1 &&
                                    <div className={"me-2 p-1 d-flex justify-content-center rounded-22 " + (order.order_status === "Bid Accepted" ? "purply" : order.order_status === "Out for Delivery" ? "verdigris" : order.order_status === "Delivered" ? "purply" : order.order_status === "Waiting for Bids" ? "purply" : "orangy") + "-lbl"} >
                                        {order.order_status}
                                    </div>
                                }

                                {props.title.indexOf("New") == -1 &&
                                    <div className={"me-2 p-1 d-flex justify-content-center rounded-22 " + (order.order_status === "Bid Accepted" ? "purply" : order.order_status === "Out for Delivery" ? "verdigris" : order.order_status === "Delivered" ? "purply" : "orangy") + "-lbl"} >
                                        {order.order_status}
                                    </div>
                                }
                            </>
                            }
                        </div>
                    </div>

                    {order.foreign_order_error == 1 && <div className="row">
                        <div className="col" style={{ color: "red", marginTop: "-10px", marginBottom: "10px" }}>
                            {order.errMsg}
                        </div>
                    </div>}

                    <div className="row">
                        <div className="col">
                            <span className="h6">{order.DateLoad.split(" ")[0] + " "}<span style={{ color: "#20b2aa", border: "1px solid #20b2aa", borderRadius: "5px", padding: "2px" }}>{order.DateLoad.split(" ")[1]}</span></span>
                        </div>

                        {/* <div className="col d-flex justify-content-between">
                            <span className="h6">{order.fromCity}</span>
                            <i className="bi bi-arrow-right"></i>
                            <span className="h6">{order.toCity}</span>
                        </div> */}

                        {order.CostLoad && <div className="col">
                            COD: {order.CostLoad} NIS
                        </div>}
                    </div>

                    <br />

                    {false && <>
                        <div className="row">
                            <div className="col d-flex justify-content-start" style={{ fontSize: "1.4rem" }}>
                                <i className="bi bi-send me-1"></i>
                                <span>{order.clientBusinessName}</span><br />
                            </div>
                        </div>

                        {order.transporterAccountName && <div className="row">
                            <div className="col d-flex justify-content-start" style={{ fontSize: "1.4rem" }}>
                                <i className="bi bi-truck me-1"></i>
                                <span>{order.transporterAccountName}</span>
                            </div>
                        </div>}

                        <hr />

                        <div className="row">
                            <div className="col-5 d-flex justify-content-start" style={{ fontSize: "1.3rem", borderRight: "1px solid lightgray" }}>
                                <i className="bi bi-envelope me-1"></i>
                                <span>{order.receiverName}</span><br />
                            </div>
                            <div className="col-7 d-flex justify-content-start" style={{ fontSize: "1.3rem" }}>

                            </div>
                        </div>
                    </>}

                    <div className="row" style={{ fontSize: "1.4rem" }}>
                        <div className="col-6" style={{ borderLeft: "2px solid lightgray" }}>
                            <div className="row">
                                <div className="col d-flex justify-content-start">
                                    <i className="bi bi-send me-1"></i>
                                    <span>{order.clientBusinessName}</span><br />
                                </div>
                            </div>
                            {/* <div className="row">
                                <span style={{ color: "#20b2aa" }}>{order.fromCity}</span>
                                <span style={{ color: "#20b2aa" }}>{order.fromArea}</span>
                            </div> */}
                            {order.transporterAccountName && <div className="row"><div className="col d-flex justify-content-start">
                                <i className="bi bi-truck me-1"></i>
                                <span>{order.transporterAccountName}</span>
                            </div></div>}
                        </div>

                        {/* {order.transporterAccountName && <div className="col d-flex justify-content-start">
                            <i className="bi bi-truck me-1"></i>
                            <span className="h6">{order.transporterAccountName}</span>
                        </div>} */}

                        {/* <div className="col-1 d-flex justify-content-center">
                            <i className="bi bi-arrow-right"></i>
                        </div> */}

                        <div className="col-6" style={{ borderLeft: "2px solid lightgray" }}>
                            <div className="row">
                                <div className="col d-flex justify-content-start">
                                    <i className="bi bi-envelope me-1"></i>
                                    <span>{order.receiverName}</span><br />
                                </div>
                            </div>
                            <div className="row">
                                <span style={{ color: "#20b2aa" }}>{order.toCity}</span>
                                <span style={{ color: "#20b2aa" }}>{order.toArea}</span>
                            </div>
                        </div>
                    </div>

                    <br />

                    <div className="row" style={{ fontSize: "1.4rem" }}>
                        {/* {order.transporterAccountName && <div className="col d-flex justify-content-start">
                            <i className="bi bi-truck me-1"></i>
                            <span>{order.transporterAccountName}</span>
                        </div>} */}

                        {order.dateFinished && <div className="col d-flex justify-content-start">
                            <i className="bi bi-check-all me-1"></i>
                            <span className="h6">{order.dateFinished.split(" ")[0] + " "}<span style={{ color: "#ff4444", border: "1px solid #ff4444", borderRadius: "5px", padding: "2px" }}>{order.dateFinished.split(" ")[1]}</span></span>
                        </div>}
                    </div>
                </div>
            </div>
        </div>)
    };

    /* FixedSizeList row */
    const Row = ({ index, style }) => {
        return <RowComponent order={orders[index]} num={index} style={style} />
    };

    /* FixedSizeList, used to render only the visible rows to the DOM to enhance the performance */
    const ListComponent = () => {
        return orders?.length > 0 && <FixedSizeList
            height={windowHeight}
            width={windowWidth}
            itemSize={300}
            itemCount={orders.length}
            className="list-container"
        >
            {Row}
        </FixedSizeList>
    };

    return (
        <div className="d-flex flex-column bg-white p-3 shadow" style={{ position: "relative", height: props.exception ? "49%" : props.title == "Matched Orders" ? "92.1%" : "100%", borderRadius:/*  props.exception ? "0 0 20px 20px" : */ "20px 20px 20px 20px", marginBottom: props.title == "Returned/Stuck Orders" ? "4%" : "" }}>
            <p style={{ position: "absolute", left: "20px" }} className="text-black">{props.title} ({orders.length}) {foreignErrorFound && <span style={{ color: "red", fontSize: "2rem" }}><i className="bi bi-exclamation-circle-fill">{foreignErrorCount}</i></span>}</p>
            {props.title != "Matched Orders" && <Form.Control style={{ position: "absolute", right: "15px", top: "15px", height: "25px", width: "35%" }} type="text" placeholder="Search..." onChange={(e) => filterHandler(e.target.value)} />}
            {loading ?
                orders?.length != 0 ?
                    <ListComponent /> : <>
                        <div className="mt-5 d-flex justify-content-center h4">
                            No {props.title} Found!
                        </div>
                        <div className="mt-5 d-flex justify-content-center h4">
                            <i className="bi bi-list" style={{ fontSize: "10rem", color: "lightgray" }}></i>
                        </div>
                    </>
                : <div className="mt-5 d-flex justify-content-center h4">
                    <Spinner animation="border" size="lg" />
                </div>}
        </div>
    )
}