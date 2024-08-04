import React, { useEffect, useState } from "react";
import {
    GetAllActiveOrders,
    GetAllFinishedOrders,
    GetAllDeletedOrders,
    GetAllReturnedOrders,
    GetAllMarkedErrorOrders,
    GetAllNewOrders,
} from "../../APIs/AdminPanelApis";
import 'bootstrap-icons/font/bootstrap-icons.css';
import CustomIcon from '../../assets/icons';
import { Spinner, Modal, Button, Form, FloatingLabel } from 'react-bootstrap';
import "./OrdersPage.css";

export const getCurrentDate = () => {
    return new Date().toJSON().slice(0, 7);
}

export const get2monthsbefore = () => {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() - 1);
    const previousMonth = currentDate.toJSON().slice(0, 7);
    return previousMonth;
}

export default function AdminPanel() {

    const [newOrders, setNewOrders] = useState([]); // new orders
    const [activeOrders, setActiveOrders] = useState([]); // in-process orders
    // const [finishedOrders, setFinishedOrders] = useState([]); // finished orders
    const [deletedOrders, setDeletedOrders] = useState([]); // deleted orders
    const [exceptionOrders, setExceptionOrders] = useState([]); // returned/stuck orders
    const [errorOrders, setErrorOrders] = useState([]); // exception error marked orders

    const [newOrdersNum, setNewOrdersNum] = useState(0);
    const [activeOrdersNum, setActiveOrdersNum] = useState(0);
    // const [finishedOrdersNum, setFinishedOrdersNum] = useState(0);
    const [deletedOrdersNum, setDeletedOrdersNum] = useState(0);
    const [exceptionOrdersNum, setExceptionOrdersNum] = useState(0);
    const [errorOrdersNum, setErrorOrdersNum] = useState(0);

    // to display loading spinner
    const [newOrdersLoading, setNewOrdersLoading] = useState(false);
    const [activeOrdersLoading, setActiveOrdersLoading] = useState(false);
    // const [finishedOrdersLoading, setFinishedOrdersLoading] = useState(false);
    const [exceptionOrdersLoading, setExceptionOrdersLoading] = useState(false);
    const [errorOrdersLoading, setErrorOrdersLoading] = useState(false);
    const [deletedOrdersLoading, setDeletedOrdersLoading] = useState(false);

    const [showDateFilterModal, setShowDateFilterModal] = useState(false);
    const [filterModalTitle, setFilterModalTitle] = useState("");

    const [newOrdersFromToDate, setNewOrdersFromToDate] = useState(get2monthsbefore() + " -- " + getCurrentDate());
    const [activeOrdersFromToDate, setActiveOrdersFromToDate] = useState(get2monthsbefore() + " -- " + getCurrentDate());
    // const [finishedOrdersFromToDate, setFinishedOrdersFromToDate] = useState(get2monthsbefore() + " -- " + getCurrentDate());
    const [deletedOrdersFromToDate, setDeletedOrdersFromToDate] = useState(get2monthsbefore() + " -- " + getCurrentDate());
    const [exceptionOrdersFromToDate, setExceptionOrdersFromToDate] = useState(get2monthsbefore() + " -- " + getCurrentDate());
    const [errorOrdersFromToDate, setErrorOrdersFromToDate] = useState(get2monthsbefore() + " -- " + getCurrentDate());

    const [newOrdersSearchStr, setNewOrdersSearchStr] = useState("no_str");
    const [activeOrdersSearchStr, setActiveOrdersSearchStr] = useState("no_str");
    // const [finishedOrdersSearchStr, setFinishedOrdersSearchStr] = useState("no_str");
    const [deletedOrdersSearchStr, setDeletedOrdersSearchStr] = useState("no_str");
    const [exceptionOrdersSearchStr, setExceptionOrdersSearchStr] = useState("no_str");
    const [errorOrdersSearchStr, setErrorOrdersSearchStr] = useState("no_str");

    const [newOrdersErr, setNewOrdersErr] = useState(false);
    const [activeOrdersErr, setActiveOrdersErr] = useState(false);
    // const [finishedOrdersErr, setFinishedOrdersErr] = useState(false);
    const [deletedOrdersErr, setDeletedOrdersErr] = useState(false);
    const [exceptionOrdersErr, setExceptionOrdersErr] = useState(false);
    const [errorOrdersErr, setErrorOrdersErr] = useState(false);

    const [fromMonthNotselected, setFromMonthNotselected] = useState(false);
    const [toMonthNotselected, setToMonthNotselected] = useState(false);

    const [validated, setValidated] = useState(false);

    const [selectedOrdersIDs, setSelectedOrdersIDs] = useState([]);
    const [selectedColumnTitle, setSelectedColumnTitle] = useState("");

    useEffect(() => {
        setNewOrdersLoading(true);
        // get all new orders
        GetAllNewOrders(newOrdersSearchStr, newOrdersFromToDate).then((res) => {

            setNewOrders(res.data.orders_list);

            setNewOrdersNum(res.data.orders_list.length);

            setNewOrdersLoading(false);

            const temp_orders = res.data.orders_list;
            for (let i = 0; i < temp_orders.length; i++) {
                if (temp_orders.foreign_order_error == 1) {
                    setNewOrdersErr(true);
                    break;
                }
            }
        });
    }, [newOrdersFromToDate])

    useEffect(() => {
        // console.log(activeOrdersFromToDate);
        setActiveOrdersLoading(true);
        // get all in-process orders
        /* ((( activeOrdersFromToDateis pauesd -> all active orders will be got ))) */
        GetAllActiveOrders(activeOrdersSearchStr, activeOrdersFromToDate).then((res) => {
            // console.log(res.data.orders_list)
            setActiveOrders(res.data.orders_list);

            setActiveOrdersNum(res.data.orders_list.length);

            setActiveOrdersLoading(false);

            const temp_orders = res.data.orders_list;
            for (let i = 0; i < temp_orders.length; i++) {
                if (temp_orders[i].foreign_order_error == 1) {
                    setActiveOrdersErr(true);
                    break;
                }
            }
        });
    }, [activeOrdersFromToDate])

    // useEffect(() => {
    //     setFinishedOrdersLoading(true);
    //     // get all finished orders
    //     GetAllFinishedOrders(finishedOrdersSearchStr, finishedOrdersFromToDate).then((res) => {
    //         // console.log(res.data.orders_list)
    //         setFinishedOrders(res.data.orders_list)

    //         setFinishedOrdersNum(res.data.orders_list.length);

    //         setFinishedOrdersLoading(false);

    //         const temp_orders = res.data.orders_list;
    //         for (let i = 0; i < temp_orders.length; i++) {
    //             if (temp_orders[i].foreign_order_error == 1) {
    //                 setFinishedOrdersErr(true);
    //                 break;
    //             }
    //         }
    //     })
    // }, [finishedOrdersFromToDate])

    useEffect(() => {
        // console.log(deletedOrdersFromToDate);
        setDeletedOrdersLoading(true);
        // get all deleted orders
        GetAllDeletedOrders(deletedOrdersSearchStr, deletedOrdersFromToDate).then((res) => {
            setDeletedOrders(res.data.orders_list)

            setDeletedOrdersNum(res.data.orders_list.length);

            setDeletedOrdersLoading(false);

            const temp_orders = res.data.orders_list;
            for (let i = 0; i < temp_orders.length; i++) {
                if (temp_orders[i].foreign_order_error == 1) {
                    setDeletedOrdersErr(true);
                    break;
                }
            }
        })
    }, [deletedOrdersFromToDate])

    useEffect(() => {
        setExceptionOrdersLoading(true);
        // get all stuck/returned orders
        GetAllReturnedOrders(exceptionOrdersSearchStr, exceptionOrdersFromToDate).then((res) => {
            setExceptionOrders(res.data.orders_list);

            setExceptionOrdersNum(res.data.orders_list.length);

            setExceptionOrdersLoading(false);

            const temp_orders = res.data.orders_list;
            for (let i = 0; i < temp_orders.length; i++) {
                if (temp_orders[i].foreign_order_error == 1) {
                    setExceptionOrdersErr(true);
                    break;
                }
            }
        });
    }, [exceptionOrdersFromToDate])

    useEffect(() => {
        setErrorOrdersLoading(true);
        // get all stuck/returned orders
        GetAllMarkedErrorOrders(errorOrdersSearchStr, errorOrdersFromToDate).then((res) => {
            setErrorOrders(res.data.orders_list);

            setErrorOrdersNum(res.data.orders_list.length);

            setErrorOrdersLoading(false);

            const temp_orders = res.data.orders_list;
            for (let i = 0; i < temp_orders.length; i++) {
                if (temp_orders[i].foreign_order_error == 1) {
                    setErrorOrdersErr(true);
                    break;
                }
            }
        });
    }, [errorOrdersFromToDate])

    const filterHandler = (title) => {
        setFilterModalTitle(title);
        setShowDateFilterModal(true);
    }

    const handleSelectOrder = (orderID, columnTitle, isActive) => {
        console.log(orderID, columnTitle, isActive);
        /* if (columnTitle != selectedColumnTitle) {
            setSelectedOrdersIDs([]);
            setSelectedColumnTitle(columnTitle);
        }

        setSelectedOrdersIDs(prevIds => [...prevIds, orderID]); */
    }

    return (
        <>
            <div className='orders-grid'>
                <OrdersColumn index="first" title="New Orders" orders={newOrders} ordersCount={newOrdersNum} loading={newOrdersLoading} searchAndFilter={() => filterHandler("New Orders")} handleSelect={(id, title, isActive) => handleSelectOrder(id, title, isActive)} isErrs={newOrdersErr} />
                <OrdersColumn title="Active Orders" orders={activeOrders} ordersCount={activeOrdersNum} loading={activeOrdersLoading} searchAndFilter={() => filterHandler("Active Orders")} handleSelect={(id, title, isActive) => handleSelectOrder(id, title, isActive)} isErrs={activeOrdersErr} />
                {/*<OrdersColumn title="Finished Orders" orders={finishedOrders} ordersCount={finishedOrdersNum} loading={finishedOrdersLoading} searchAndFilter={() => filterHandler("Finished Orders")} handleSelect={(id, title, isActive) => handleSelectOrder(id, title, isActive)} isErrs={finishedOrdersErr} />*/}
                <OrdersColumn title="Deleted Orders" orders={deletedOrders} ordersCount={deletedOrdersNum} loading={deletedOrdersLoading} searchAndFilter={() => filterHandler("Deleted Orders")} handleSelect={(id, title, isActive) => handleSelectOrder(id, title, isActive)} isErrs={deletedOrdersErr} />
                <OrdersColumn index="last" title="Exception Orders" orders={errorOrders} ordersCount={errorOrdersNum} loading={errorOrdersLoading} searchAndFilter={() => filterHandler("Exceptions")} handleSelect={(id, title, isActive) => handleSelectOrder(id, title, isActive)} isErrs={errorOrdersErr} />
            </div>

            <Modal size={"lg"} className="filter-modal" show={showDateFilterModal} animation={false} onHide={() => setShowDateFilterModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{"Filter/Search "}{filterModalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form id="filterForm" validated={validated} noValidate onSubmit={(event) => {
                        event.preventDefault();
                        event.stopPropagation();

                        const formData = new FormData(event.target), formDataObj = Object.fromEntries(formData.entries());

                        const form = event.currentTarget;
                        if (form.checkValidity() === true) {

                            let fromDay = formDataObj.fromDay;
                            let fromMonth = formDataObj.fromMonth;
                            let fromYear = formDataObj.fromYear;

                            let toDay = formDataObj.toDay;
                            let toMonth = formDataObj.toMonth;
                            let toYear = formDataObj.toYear;

                            if (parseInt(fromDay) < 10) {
                                fromDay = "0" + fromDay;
                            }

                            if (parseInt(fromMonth) < 10) {
                                fromMonth = "0" + fromMonth;
                            }

                            if (parseInt(toDay) < 10) {
                                toDay = "0" + toDay;
                            }

                            if (parseInt(toMonth) < 10) {
                                toMonth = "0" + toMonth;
                            }

                            let fromDate = "";
                            let toDate = "";

                            /* if (fromDay == "00") {
                                fromDate = fromYear + "-" + fromMonth;
                            } else {
                                fromDate = fromYear + "-" + fromMonth + "-" + fromDay;
                            }

                            if (toDay == "00") {
                                toDate = toYear + "-" + toMonth;
                            } else {
                                toDate = toYear + "-" + toMonth + "-" + toDay;
                            } */

                            fromDate = fromYear + "-" + fromMonth;
                            toDate = toYear + "-" + toMonth;

                            const fromToDate = fromDate + " -- " + toDate;

                            if (filterModalTitle == "New Orders") {
                                setNewOrdersFromToDate(fromToDate);
                            } else if (filterModalTitle == "Active Orders") {
                                setActiveOrdersFromToDate(fromToDate);
                            } else if (filterModalTitle == "Finished Orders") {
                                // setFinishedOrdersFromToDate(fromToDate);
                            } else if (filterModalTitle == "Deleted Orders") {
                                setDeletedOrdersFromToDate(fromToDate);
                            } else if (filterModalTitle == "Exceptions") {
                                setExceptionOrdersFromToDate(fromToDate);
                            }

                            // console.log(fromToDate);

                            setShowDateFilterModal(false)
                        }

                        setValidated(true);
                    }}>
                        <div className="filter-body">
                            <div className="dates-row">
                                <div className="date">
                                    <div className="date-title">From Date</div>
                                    <div className="date-body">
                                        <div className="year">
                                            <Form.Group>
                                                <FloatingLabel className="mb-3" controlId="placeName" label={"Year"}>
                                                    <Form.Control type="number" placeholder="..." name="fromYear" required defaultValue={new Date().getFullYear().toString()} />
                                                    <Form.Control.Feedback type="invalid">
                                                        feild error
                                                    </Form.Control.Feedback>
                                                </FloatingLabel>
                                            </Form.Group>
                                        </div>

                                        <div className="month">
                                            <Form.Label>Month</Form.Label>
                                            <Form.Select style={{ cursor: "pointer" }} name="fromMonth" required defaultValue={(new Date().getMonth()).toString()} onChange={(e) => {
                                                if (e.target.value == 0) {
                                                    setFromMonthNotselected(true);
                                                    document.querySelector('[name="fromDay"]').value = "0";
                                                } else {
                                                    setFromMonthNotselected(false)
                                                }
                                            }}>
                                                {/* <option value={0}>All</option> */}
                                                <option value={1}>JAN</option>
                                                <option value={2}>FEB</option>
                                                <option value={3}>MAR</option>
                                                <option value={4}>APR</option>
                                                <option value={5}>MAY</option>
                                                <option value={6}>JUN</option>
                                                <option value={7}>JUl</option>
                                                <option value={8}>AUG</option>
                                                <option value={9}>SEP</option>
                                                <option value={10}>OCT</option>
                                                <option value={11}>NOV</option>
                                                <option value={12}>DEC</option>
                                            </Form.Select>
                                        </div>

                                        <div className="day">
                                            <Form.Label>Day</Form.Label>
                                            <Form.Select style={{ cursor: "pointer" }} name="fromDay" required disabled={/* fromMonthNotselected */true}>
                                                <option value={0}>All</option>
                                                <option value={1}>1</option>
                                                <option value={2}>2</option>
                                                <option value={3}>3</option>
                                                <option value={4}>4</option>
                                                <option value={5}>5</option>
                                                <option value={6}>6</option>
                                                <option value={7}>7</option>
                                                <option value={8}>8</option>
                                                <option value={9}>9</option>
                                                <option value={10}>10</option>
                                                <option value={11}>11</option>
                                                <option value={12}>12</option>
                                                <option value={13}>13</option>
                                                <option value={14}>14</option>
                                                <option value={15}>15</option>
                                                <option value={16}>16</option>
                                                <option value={17}>17</option>
                                                <option value={18}>18</option>
                                                <option value={19}>19</option>
                                                <option value={20}>20</option>
                                                <option value={21}>21</option>
                                                <option value={22}>22</option>
                                                <option value={23}>23</option>
                                                <option value={24}>24</option>
                                                <option value={25}>25</option>
                                                <option value={26}>26</option>
                                                <option value={27}>27</option>
                                                <option value={28}>28</option>
                                                <option value={29}>29</option>
                                                <option value={30}>30</option>
                                                <option value={31}>31</option>
                                            </Form.Select>
                                        </div>
                                    </div>
                                </div>
                                <div className="date">
                                    <div className="date-title">To Date</div>
                                    <div className="date-body">
                                        <div className="year">
                                            <Form.Group>
                                                <FloatingLabel className="mb-3" controlId="placeName" label={"Year"}>
                                                    <Form.Control type="number" placeholder="..." name="toYear" required defaultValue={new Date().getFullYear().toString()} />
                                                    <Form.Control.Feedback type="invalid">
                                                        feild error
                                                    </Form.Control.Feedback>
                                                </FloatingLabel>
                                            </Form.Group>
                                        </div>

                                        <div className="month">
                                            <Form.Label>Month</Form.Label>
                                            <Form.Select style={{ cursor: "pointer" }} name="toMonth" required defaultValue={(new Date().getMonth() + 1).toString()} onChange={(e) => {
                                                if (e.target.value == 0) {
                                                    setToMonthNotselected(true);
                                                    document.querySelector('[name="toDay"]').value = "0";
                                                } else {
                                                    setToMonthNotselected(false)
                                                }
                                            }}>
                                                {/* <option value={0}>All</option> */}
                                                <option value={1}>JAN</option>
                                                <option value={2}>FEB</option>
                                                <option value={3}>MAR</option>
                                                <option value={4}>APR</option>
                                                <option value={5}>MAY</option>
                                                <option value={6}>JUN</option>
                                                <option value={7}>JUl</option>
                                                <option value={8}>AUG</option>
                                                <option value={9}>SEP</option>
                                                <option value={10}>OCT</option>
                                                <option value={11}>NOV</option>
                                                <option value={12}>DEC</option>
                                            </Form.Select>
                                        </div>

                                        <div className="day">
                                            <Form.Label>Day</Form.Label>
                                            <Form.Select style={{ cursor: "pointer" }} name="toDay" required disabled={/* toMonthNotselected */true}>
                                                <option value={0}>All</option>
                                                <option value={1}>1</option>
                                                <option value={2}>2</option>
                                                <option value={3}>3</option>
                                                <option value={4}>4</option>
                                                <option value={5}>5</option>
                                                <option value={6}>6</option>
                                                <option value={7}>7</option>
                                                <option value={8}>8</option>
                                                <option value={9}>9</option>
                                                <option value={10}>10</option>
                                                <option value={11}>11</option>
                                                <option value={12}>12</option>
                                                <option value={13}>13</option>
                                                <option value={14}>14</option>
                                                <option value={15}>15</option>
                                                <option value={16}>16</option>
                                                <option value={17}>17</option>
                                                <option value={18}>18</option>
                                                <option value={19}>19</option>
                                                <option value={20}>20</option>
                                                <option value={21}>21</option>
                                                <option value={22}>22</option>
                                                <option value={23}>23</option>
                                                <option value={24}>24</option>
                                                <option value={25}>25</option>
                                                <option value={26}>26</option>
                                                <option value={27}>27</option>
                                                <option value={28}>28</option>
                                                <option value={29}>29</option>
                                                <option value={30}>30</option>
                                                <option value={31}>31</option>
                                            </Form.Select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* <div className="search-field-row">
                                <Form.Group>
                                    <FloatingLabel className="mb-3" controlId="placeName" label={"Seach - Order ID, Merchant name, ..."}>
                                        <Form.Control type="text" placeholder="..." name="searcStr" />
                                        <Form.Control.Feedback type="invalid">
                                            feild error
                                        </Form.Control.Feedback>
                                    </FloatingLabel>
                                </Form.Group>
                            </div> */}
                        </div>

                        <div className="filter-footer">
                            <Button type="submit" variant="outline-success">
                                Apply
                            </Button>
                            <Button variant="outline-secondary" onClick={() => setShowDateFilterModal(false)}>
                                Close
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}

const OrdersColumn = ({ index, title, orders, ordersCount, loading, searchAndFilter, handleSelect, isErrs }) => {

    const [ordersState, setOrdersState] = useState([]);
    const [searchedOrders, setSearchedOrders] = useState([]);

    useEffect(() => {
        setOrdersState(orders);
        setSearchedOrders(orders);
    }, [orders])

    const filterHandler = (val) => {

        if (!!val) {

            // console.log(ordersState)
            // let tempOrders = ordersState.filter(order => (order.id.includes(val) || (order.foreignOrderId && order.foreignOrderId === val) || (order.foreignOrderBarcode && order.foreignOrderBarcode === val) || (order.fromCity && order.fromCity.toLowerCase().includes(val.toLowerCase())) || (order.toCity && order.toCity.toLowerCase().includes(val.toLowerCase())) || (order.receiverName && order.receiverName.toLowerCase().includes(val.toLowerCase())) || (order.clientBusinessName && order.clientBusinessName.toLowerCase().includes(val.toLowerCase())) || (order.transporterAccountName && order.transporterAccountName.toLowerCase().includes(val.toLowerCase())) || (order.DateLoad && order.DateLoad.includes(val)) || (order.foreign_order_error && order.foreign_order_error == 1 && val.includes('!'))));
            let tempOrders = ordersState.filter(order => Object.values(order).join(" ").toLowerCase().includes(val.toLowerCase()));

            setSearchedOrders(tempOrders)
        } else {
            setSearchedOrders(orders);
        }
    }

    return (
        <div className="orders-column">
            <div className='header' style={{ marginLeft: index !== "first" ? "-8px" : "", marginRight: index !== "last" ? "-8px" : "" }}>
                <div>
                    {isErrs && <i className="bi bi-exclamation-circle-fill me-1" style={{ color: "red" }}></i>}
                    {title}
                    <span className="orders-count">{ordersCount}</span>
                </div>
                <div className="date-filter" onClick={searchAndFilter}>
                    <i className="bi bi-funnel-fill"></i>
                </div>
                <Form.Control style={{ height: "25px", width: "35%" }} type="text" placeholder="Search..." onChange={(e) => filterHandler(e.target.value)} />
            </div>
            <div className="column">
                <div>
                    {
                        loading ? <div className="d-flex justify-content-center"><Spinner animation="border" size="lg" /></div> :
                            searchedOrders?.length == 0 ? <div className="d-flex justify-content-center">No {title}</div> :
                                searchedOrders?.map((order, index) => {
                                    return <div key={index}>
                                        <OrderCard order={order} handleSelect={(id, isActive) => handleSelect(id, title, isActive)} />
                                    </div>
                                })
                    }
                </div>
            </div>
        </div>
    )
}

const OrderCard = ({ order, handleSelect }) => {

    const [isActive, setIsActive] = useState(false);
    const [isIdHover, setIsIdHover] = useState(false);

    const getColorStatus = (status) => {
        switch (status) {
            case "Wating for Bids": return "#6cc6f0"
            case "Bid Accepted": return "#4697b7"
            case "Out for Delivery": return "#e98945"
            case "Delivered": return "#8dcb8e"
            case "Deleted": return "#565656"
            case "Returned": return "#e54149"
            case "Stuck": return "#e54149"
        }

        return "#848484";
    }

    const handleIdMouseEnter = () => {
        setIsIdHover(true);
    };

    const handleIdMouseLeave = () => {
        setIsIdHover(false);
    };

    return (
        <div className='order-card'>

            <div className={'order-card-body' + (isActive ? '-active' : order.foreign_order_error == 1 && "-exception")}>
                <div className="left-vertical-ine"></div>
                {order.foreign_order_error == 1 && <>
                    <div className="exception-row">
                        <i className="bi bi-exclamation-circle-fill"></i>
                        <div className="text">{order.errMsg}</div>
                    </div>

                    <hr />
                </>}
                <div className='first-row'>
                    <div className='first-row-first-col'>
                        <div className='order-id' >
                            <>
                                <OrderCheckBox orderId={order.id} active={isActive} setIsChecked={(isChecked) => { setIsActive(isChecked) }} handleSelect={(isActive) => handleSelect(order.id, isActive)} />
                                <div
                                    className='id ms-2'
                                    onMouseEnter={handleIdMouseEnter}
                                    onMouseLeave={handleIdMouseLeave}
                                    onClick={() => {
                                        window.open("/adminapp/orderDetails/" + order.id, '_blank');
                                    }}
                                >
                                    {order.id}
                                    {isIdHover && <CustomIcon iconName="eye_icon" color="lightgray" size="20" />}
                                </div>
                            </>
                        </div>
                        <div className='cod'>
                            <div className='text'>COD</div>{order.CostLoad}
                        </div>
                    </div>
                    <div className='first-row-second-col'>
                        <div className='status' style={{ backgroundColor: getColorStatus(order.order_status) }}>{order.order_status}</div>
                        <div className='date-created'>
                            <CustomIcon iconName="date_created" color="#848484" size="17" />
                            <div className='text'>{order.DateLoad}</div>
                        </div>
                        {!!order.dateFinished ? <div className='date-finished'>
                            <CustomIcon iconName="date_finished" color="#848484" size="17" />
                            <div className='text'>{order.dateFinished}</div>
                        </div> : <div style={{ width: "100%", height: "20px" }}></div>}
                    </div>
                </div>

                {!!order.foreignOrderId && <>
                    <hr />

                    {/* foreignOrderId, foreignOrderBarcode */}

                    <div className="first-and-a-half-row-full">
                        <div>
                            <span>Foreign ID: </span>
                            {order.foreignOrderId}
                        </div>
                        <div>
                            <span>Foreign Barcode: </span>
                            {order.foreignOrderBarcode}
                        </div>
                    </div>
                </>}

                <hr />

                <div className='second-row-full'>
                    <CustomIcon iconName="merchant_2" color="#848484" size="30" />
                    <div className='text'>{order.clientBusinessName}</div>
                </div>

                <div className='third-row-full'>
                    {!!order.transporterAccountName ? <>
                        <CustomIcon iconName="transporter_2" color="#848484" size="30" />
                        <div className='text'>{order.transporterAccountName}</div>
                    </> : <div style={{ width: "100%", height: "27px" }}></div>}
                </div>

                <hr />

                <div className='fourth-row-full'>
                    <CustomIcon iconName="sender" color="#848484" size="30" />
                    <div className='text'>
                        <div className='address-name'>{order.receiverName}</div>
                        <div className='address-city'>{order.toCity}</div>
                    </div>
                </div>

                <div className='status-triangle'>
                    <CustomIcon iconName="status_triangle" color={getColorStatus(order.order_status)} size="25" />
                </div>
            </div>
        </div >
    )
}

const OrderCheckBox = ({ orderId, active, setIsChecked, handleSelect }) => {

    const [isActive, setIsActive] = useState(active);
    const [isHover, setIsHover] = useState(false);

    const handleMouseEnter = () => {
        setIsHover(true);
    };
    const handleMouseLeave = () => {
        setIsHover(false);
    };

    const handleclick = () => {
        setIsChecked(!isActive);
        handleSelect(!isActive)
        setIsActive(!isActive);
    };

    const styles = {
        mainDiv: {
            width: "30px",
            height: "30px",
            display: "flex",
            alignItem: "center",
            justifyContent: "center",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "background-color, transform 0.1s ease",
            backgroundColor: isHover || isActive ? "#1C7A68" : "#24A693",
            transform: isHover && "scale(1.1)"
        }
    }

    return (
        <div
            style={styles.mainDiv}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleclick}
        >
            <CustomIcon iconName={isActive ? "order_check_active" : isHover ? "order_check_hover" : "order_check_inactive"} color="white" size="20" />
        </div>
    )
}