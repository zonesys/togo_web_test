import React, { useCallback, useEffect, useState, useRef } from "react";
import Nav from "react-bootstrap/Nav";
import {
    getFunctions,
    getClientDeliveredTotalAmounts,
    getClientActiveTotalAmounts,
    getClientNewTotalAmounts,
    getTransporterNewTotalAmounts,
    getTransporterActiveTotalAmounts,
    getTransporterDeliveredTotalAmounts,
    getOrdersToExport,
    getTransporterTransactionsToExport
} from "../../APIs/OrdersAPIs";
import { OrdersTabularView } from "./OrdersTabularView";
import { Box } from "@chakra-ui/react";
import { isTeamMember, isTransporter, isFoodClient } from "../../Util";
import Loader from "../Loader/Loader";
import { toastMessage } from "../../Actions/GeneralActions";
import { useDispatch } from "react-redux";
import translate from "../../i18n/translate";
import { useHistory } from "react-router-dom";
import PaginateComp from "../Pagination/Pagination";
import newproduct from "../../assets/images/new-product.png";
import processingOrder from "../../assets/images/processing-time.png";
// import receipt from "../../assets/images/receipt.png";
import processedOrder from "../../assets/images/order-processed.png";
import reviewedOrder from "../../assets/images/order-reviewed.png";
import { CreateNewOrder } from "../CreateNewOrder";
import "./Main.css";
import "./MainOrdersPage.css";
import CreateAddress from "../CreateAddress";
import { Form, FloatingLabel, Spinner, Button, Modal } from 'react-bootstrap';
import { PAGE_SIZE } from "../../APIs/AuthenticationAPIs";
import Transactions from "../FinancialTransactions/FinancialTransactions";
import CreateNewOrderCo from "../CreateNewOrderComponent/CreateNewOrderCo";
import CreateOrder_v2 from "../CreateOrder_v2/CreateOrder_v2";
import CreateNewFoodOrderCo from "../CreateNewOrderComponent/CreateNewFoodOrderCo";
import AssignToDialog from "../AssignToDialog";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'
import MainOrdersNavs from './MainOrdersNavs';

import new_product from "../../assets/orders/new-product.png";
import new_product_grad from "../../assets/orders/new-product_grad.png";
import processing_time from "../../assets/orders/processing-time.png";
import processing_time_grad from "../../assets/orders/processing-time_grad.png";
import order_processed from "../../assets/orders/order-processed.png";
import order_processed_grad from "../../assets/orders/order-processed_grad.png";
import order_reviewed from "../../assets/orders/order-reviewed.png";
import order_reviewed_grad from "../../assets/orders/order-reviewed_grad.png";
import receipt from "../../assets/orders/receipt.png";
import receipt_grad from "../../assets/orders/receipt_grad.png";
import new_order from "../../assets/orders/new-order.png";
import new_order_grad from "../../assets/orders/new-order_grad.png";

import * as FileSaver from 'file-saver';
import XLSX from 'sheetjs-style';
import CustomIcon from "../../assets/icons";

const styles = {
    navImg: {
        width: "30px",
        height: "30px",
        display: "inline-block",

        verticalAlign: "middle",
    },
    navLal: {
        display: "inline-block",
        margin: "0 5px",
        verticalAlign: "middle",
        color: "var(--bs-dark)"
    }
};

const getCurrentPage = (history) => {
    const pathname = history.location.pathname;
    return pathname.substr(pathname.lastIndexOf('/') + 1, pathname.length);
}

const Main = ({ socket, token }) => {

    let history = useHistory();

    const [currentPage, setCurrentPage] = useState(getCurrentPage(history) ?? ("all-orders"));
    const [totalNumOfRecs, setTotalNumberOfRecs] = useState(0);
        const [activePage, setActivePage] = useState(0);
    // const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const dispatch = useDispatch();

    const cleanUp = () => {
        setOrders([]);
        // setTransactions([]);
    };

    const [assignedIds, setAssignedIds] = useState([]);
    const [ordersSelected, setOrdersSelected] = useState(false);

    const [totalCODNew, setTotalCODNew] = useState(0);
    const [totalCOD, setTotalCOD] = useState(0);
    const [totalComission, setTotalComission] = useState(0);
    const [totalDeliveryCost, setTotalDeliveryCost] = useState(0);
    const [totalCODActive, setTotalCODActive] = useState(0);
    const [totalDeliveryCostActive, setTotalDeliveryCostActive] = useState(0);

    const [totalCODNewTrans, setTotalCODNewTrans] = useState(0);
    const [totalCODTrans, setTotalCODTrans] = useState(0);
    const [totalComissionTrans, setTotalComissionTrans] = useState(0);
    const [totalDeliveryCostTrans, setTotalDeliveryCostTrans] = useState(0);
    const [totalCODActiveTrans, setTotalCODActiveTrans] = useState(0);
    const [totalDeliveryCostActiveTrans, setTotalDeliveryCostActiveTrans] = useState(0);

    const [searchStr, setSearchStr] = useState("");

    const [ordersNavsArr, setOrdersNavArr] = useState([
        { text: "NEW_ORDERS", src: newproduct, eventKey: "all-orders" },
        { text: "IN_PROCESS_ORDER", src: processingOrder, eventKey: "current-orders" },
        { text: "COMPLETED_OR_CANCELED_ORDER", src: processedOrder, eventKey: "previous-orders" },
        { text: "REVIEWED_ORDER", src: reviewedOrder, eventKey: "reviewed-orders" },
        { text: "FINANCIAL_TRANSACTIONS", src: receipt, eventKey: "transactions" },
        { text: "NEW_ORDERS", src: "", eventKey: "create-order" },
    ]);

    const [ordersNavs, setOrdersNavs] = useState([
        { title: "NEW_ORDERS", hoverImageSrc: new_product, mainImageSrc: new_product_grad, backgroundImageSrc: "", isActive: currentPage == "all-orders" ? true : false, linkEventKey: "all-orders" },
        { title: "IN_PROCESS_ORDER", hoverImageSrc: processing_time, mainImageSrc: processing_time_grad, backgroundImageSrc: "", isActive: currentPage == "current-orders" ? true : false, linkEventKey: "current-orders" },
        { title: "COMPLETED_OR_CANCELED_ORDER", hoverImageSrc: order_processed, mainImageSrc: order_processed_grad, backgroundImageSrc: "", isActive: currentPage == "previous-orders" ? true : false, linkEventKey: "previous-orders" },
        { title: "REVIEWED_ORDER", hoverImageSrc: order_reviewed, mainImageSrc: order_reviewed_grad, backgroundImageSrc: "", isActive: currentPage == "reviewed-orders" ? true : false, linkEventKey: "reviewed-orders" },
        { title: "FINANCIAL_TRANSACTIONS", hoverImageSrc: receipt, mainImageSrc: receipt_grad, backgroundImageSrc: "", isActive: currentPage == "transactions" ? true : false, linkEventKey: "transactions" },
        { title: "CREATE_NEW_ORDER", hoverImageSrc: new_order, mainImageSrc: new_order_grad, backgroundImageSrc: "", isActive: currentPage == "create-order" ? true : false, linkEventKey: "create-order" },
    ]);

    useEffect(() => {
        // console.log("batata")
        let currentPage = getCurrentPage(history);
        if (!currentPage || currentPage === '/main') {
            currentPage = "all-orders";
            let currentPagePath = `/account/main/${currentPage}`;
            history.push(currentPagePath);
        }

        setCurrentPage(currentPage);

        let historyUnListen = history.listen(location => {
            const pathname = location.pathname;
            let currentPageTmp = pathname.substr(pathname.lastIndexOf('/') + 1, pathname.length);
            if (!currentPageTmp) {
                currentPageTmp = "all-orders";
                let currentPagePath = `account/main/${currentPageTmp}`;
                history.push(currentPagePath);
            }
            setCurrentPage(currentPageTmp);
        });

        return () => {
            historyUnListen();
            cleanUp();
        }
    }, [history]);

    const fetchData = useCallback((functionType, stateKey) => {
        setLoading(true);

        // transporter orders filter variable initialized
        let transporterFunctionfilter = "none";

        /* 
        set transporter orders function by filter:
            - NEW_ORDERS -> to get all new orders
            - MY_ORDERS -> to get all in process orders
            - DELIVERED -> to get all finished orders
        */

        /* if (functionType === "TransporterGetOrder" || functionType === "ShowClientOrder") {
            transporterFunctionfilter = "NEW_ORDERS";
        } else if (functionType === "TransporterOrderCurrent" || functionType === "ClientShowBidRequistsAccepted") {
            transporterFunctionfilter = "MY_ORDERS";
        } else if (functionType === "TransporterHistoryOrder" || functionType === "ClientHistoryOrder") {
            transporterFunctionfilter = "DELIVERED";
        } else if (functionType === "TransporterReviewedOrder" || functionType === "ClientReviewedOrder") {
            transporterFunctionfilter = "REVIEWED";
        } else {
            transporterFunctionfilter = "none";
        } */

        if (functionType === "TransporterGetOrder" || functionType === "TransporterOrderCurrent" || functionType === "TransporterHistoryOrder" || functionType === "TransporterReviewedOrder") {

            switch (functionType) {
                case 'TransporterGetOrder':
                    transporterFunctionfilter = "NEW_ORDERS";
                    break;
                case 'TransporterOrderCurrent':
                    transporterFunctionfilter = "MY_ORDERS";
                    break;
                case 'TransporterHistoryOrder':
                    transporterFunctionfilter = "DELIVERED";
                    break;
                case 'TransporterReviewedOrder':
                    transporterFunctionfilter = "REVIEWED";
                    break;
                default:
                    transporterFunctionfilter = "none";
                    break;
            }

            // transporter orders function type
            functionType = "getTransporterRelatedOrdersByPage";
        }

        console.log(functionType + " - " + activePage + " - " + transporterFunctionfilter + " - " + searchStr)

        getFunctions(functionType, activePage, transporterFunctionfilter, searchStr)
            .then(resp => {
                console.log(resp.data) // temp test
                if (resp === 'NotActiveNow') {
                    dispatch(toastMessage(translate("GENERAL.COULD_NOT_FETCH"), translate("GENERAL.ERROR")));
                } else {
                    const { data: { server_response, total_orders } } = resp;
                    switch (stateKey) {
                        case 'orders':
                            setTotalNumberOfRecs(total_orders);
                            setOrders(server_response);
                            break;
                        /*case 'transactions':  edited (add transactions case) 
                            console.log("Transactions: ");
                            console.log(server_response);
                            setTransactions(server_response);*/
                        default:
                            setTotalNumberOfRecs(0);
                            break;
                    }
                }
            })
            .catch((err) => {
                dispatch(toastMessage(err));
            }).finally(() => {
                setLoading(false);

                setSearching(false);
            });

    }, [dispatch, activePage, searchStr, refresh]);

    useEffect(() => {
        if (!isTransporter()) {
            // get total cod, total comission, and total delivery price for delivered orders
            getClientDeliveredTotalAmounts().then((res) => {
                // console.log(res.data);
                setTotalCOD(res.data.sum_cods);
                setTotalComission(res.data.sum_commission);
                setTotalDeliveryCost(res.data.sum_deliveryCosts);
            })

            // get total cod and total delivery price for active orders
            getClientActiveTotalAmounts().then((res) => {
                // console.log(res.data);
                setTotalCODActive(res.data.sum_cods);
                setTotalDeliveryCostActive(res.data.sum_deliveryCosts);
            })

            // get total cod for new orders
            getClientNewTotalAmounts().then((res) => {
                // console.log(res.data);
                setTotalCODNew(res.data.sum_cods);
            })
        } else {
            // get total cod, total comission, and total delivery price for delivered orders
            getTransporterDeliveredTotalAmounts().then((res) => {
                // console.log(res.data);
                setTotalCODTrans(res.data.sum_cods);
                setTotalComissionTrans(res.data.sum_commission);
                setTotalDeliveryCostTrans(res.data.sum_deliveryCosts);
            })

            // get total cod and total delivery price for active orders
            getTransporterActiveTotalAmounts().then((res) => {
                // console.log(res.data);
                setTotalCODActiveTrans(res.data.sum_cods);
                setTotalDeliveryCostActiveTrans(res.data.sum_deliveryCosts);
            })

            // get total cod for new orders
            getTransporterNewTotalAmounts().then((res) => {
                // console.log(res.data);
                setTotalCODNewTrans(res.data.sum_cods);
            })
        }

    }, [refresh])

    useEffect(() => {
        let stateKey, functionType = null;
        cleanUp();

        /* in the following switch statement there are three cases: all-orders, current-orders, and previous-orders
            * all-orders -> all related new orders
            * current-orders -> all related in-process orders
            * previous-orders -> all related finished/deleted orders
           --------------------------------------------
           for transporter there are three functions types: TransporterGetOrder, TransporterOrderCurrent, and TransporterHistoryOrder
           all of them will refer to one function type -> getTransporterRelatedOrdersByPage . (function type -> api function name)
           --------------------------------------------
           as for the client, there are also three functions types: ShowClientOrder, ClientShowBidRequistsAccepted, and ClientHistoryOrder
           each will call a function type with the same name. (function type -> api function name)
        */

        switch (currentPage) {
            case "all-orders":
                stateKey = "orders";
                functionType = isTransporter() ? "TransporterGetOrder" : "ShowClientOrder";
                break;
            case "current-orders":
                stateKey = "orders";
                functionType = isTransporter() ? "TransporterOrderCurrent" : "ClientShowBidRequistsAccepted";
                break;
            case "previous-orders":
                stateKey = "orders";
                functionType = isTransporter() ? "TransporterHistoryOrder" : "ClientHistoryOrder";
                break;
            case "reviewed-orders":
                stateKey = "orders";
                functionType = isTransporter() ? "TransporterReviewedOrder" : "ClientReviewedOrder";
                break;
            /* case "transactions":
                stateKey = "transactions";
                functionType = isTransporter() ? "TeamMemberTransaction" : null;
                break; */
            default:
                break;
        }
        if (functionType) {
            fetchData(functionType, stateKey);
        }
    }, [currentPage, fetchData, refresh]);

    /* --------------------- search --------------------- */

    const [searching, setSearching] = useState(false);

    const searchRef = useRef();

    const searchOrdersHandler = () => {

        if (!!!searchRef.current.value) {
            setSearchStr("");
        } else {
            setSearchStr(searchRef.current.value);
        }

        setSearching(true);

    }

    const updateNavsArrHandler = (index, linkEvent) => {
        const tempArr = ordersNavs;
        tempArr.forEach((item) => { item.isActive = false });
        tempArr[index].isActive = true;
        setOrdersNavs(tempArr);

        // history.push(`/account/main/${linkEvent}`);
    }



    return (
        <div style={{ position: "relative" }}>


            <div className="d-flex justify-content-between py-2 px-3">
                <Button
                    variant="outline-primary"
                    style={{ marginBlock: "2%", width: "20%" }}
                    onClick={() => {
                        history.push("/printAll")
                    }}>
                    {translate("PRINT_ALL.PRINT_ALL")}
                    <CustomIcon iconName={"print"}></CustomIcon>
                </Button>
                {localStorage.getItem("userId") != 97 && <>
                    {!isTransporter() ? (currentPage == "previous-orders" ? <div className="d-flex jsutify-content-between">
                        <div className="p-2 me-1" style={{ border: "2px solid #69d4a5", borderRadius: "5px", color: "#26a69a" }}>
                            Delivered Orders Total COD: <span style={{ color: "red" }}>{totalCOD}</span> NIS
                        </div>

                        {localStorage.getItem("userId") == 302 && <div className="p-2 me-1" style={{ border: "2px solid #69d4a5", borderRadius: "5px", color: "#26a69a" }}>
                            Delivered Orders Total Comission: <span style={{ color: "red" }}>{totalComission}</span> NIS
                        </div>}

                        <div className="p-2" style={{ border: "2px solid #69d4a5", borderRadius: "5px", color: "#26a69a" }}>
                            Delivered Orders Total Delivey Cost: <span style={{ color: "red" }}>{totalDeliveryCost}</span> NIS
                        </div>
                    </div> : currentPage == "current-orders" ?
                        <div>

                            <div className="d-flex jsutify-content-between">
                                <div className="p-2 me-1" style={{ border: "2px solid #69d4a5", borderRadius: "5px", color: "#26a69a" }}>
                                    Active Orders Total COD: <span style={{ color: "red" }}>{totalCODActive}</span> NIS
                                </div>

                                <div className="p-2" style={{ border: "2px solid #69d4a5", borderRadius: "5px", color: "#26a69a" }}>
                                    Active Orders Total Delivey Cost: <span style={{ color: "red" }}>{totalDeliveryCostActive}</span> NIS
                                </div>
                            </div>
                        </div>
                        : currentPage == "all-orders" ? <div className="d-flex jsutify-content-between">
                            <div className="p-2" style={{ border: "2px solid #69d4a5", borderRadius: "5px", color: "#26a69a" }}>
                                New Orders Total COD: <span style={{ color: "red" }}>{totalCODNew}</span> NIS
                            </div>
                        </div> : <div style={{ height: "41px" }}></div>) :
                        (currentPage == "previous-orders" || currentPage == "reviewed-orders" ? <div className="d-flex jsutify-content-between">
                            <div className="p-2 me-1" style={{ border: "2px solid #69d4a5", borderRadius: "5px", color: "#26a69a" }}>
                                Delivered Orders Total COD: <span style={{ color: "red" }}>{totalCODTrans}</span> NIS
                            </div>

                            {/* <div className="p-2 me-1" style={{ border: "2px solid #69d4a5", borderRadius: "5px", color: "#26a69a" }}>
                                Delivered Orders Total Comission (including VAT): <span style={{ color: "red" }}>{totalComissionTrans}</span> NIS
                            </div>*/}

                            <div className="p-2" style={{ border: "2px solid #69d4a5", borderRadius: "5px", color: "#26a69a" }}>
                                Delivered Orders Total Delivey Cost: <span style={{ color: "red" }}>{totalDeliveryCostTrans}</span> NIS
                            </div>
                        </div> : currentPage == "current-orders" ? <div className="d-flex jsutify-content-between">
                            <div className="p-2 me-1" style={{ border: "2px solid #69d4a5", borderRadius: "5px", color: "#26a69a" }}>
                                Active Orders Total COD: <span style={{ color: "red" }}>{totalCODActiveTrans}</span> NIS
                            </div>

                            <div className="p-2" style={{ border: "2px solid #69d4a5", borderRadius: "5px", color: "#26a69a" }}>
                                Active Orders Total Delivey Cost: <span style={{ color: "red" }}>{totalDeliveryCostActiveTrans}</span> NIS
                            </div>
                        </div> : currentPage == "all-orders" && false ? <div className="d-flex jsutify-content-between">
                            <div className="p-2" style={{ border: "2px solid #69d4a5", borderRadius: "5px", color: "#26a69a" }}>
                                New Orders Total COD: <span style={{ color: "red" }}>{totalCODNewTrans}</span> NIS
                            </div>
                        </div> : <div style={{ height: "41px" }}></div>)
                    }
                </>
                }

                {/* <CreateNewOrder onSuccess={() => {
                    setRefresh(!refresh);
                }} /> */}
            </div>

            {/* assign to my network button (dialog), it will apear only if there are selected orders to be assigned (in in-process orders) */}
            {currentPage === "current-orders" && isTransporter() && ordersSelected && <Box style={{ position: "absolute", left: "10px", top: "10px" }}>

                <AssignToDialog ordersIds={assignedIds} onSuccess={() => {
                    setRefresh(!refresh);
                }} />

            </Box>}

            <div className="main-orders-navs">
                {/* navs to be styled */}
                {/* localStorage.getItem("userId") == 255 */true ?
                    <>
                        {/* <MainOrdersNavs navsArr={ordersNavs} updateNavsArr={(newArr) => { setOrdersNavs([...newArr]) }} /> */}
                        <Nav
                            className="upperNavContainer d-flex"
                            variant="tabs"
                            defaultActiveKey={currentPage}
                            activeKey={currentPage}
                            onSelect={(eventKey) => { history.push(`/account/main/${eventKey}`); setActivePage(0); setSearchStr(""); (currentPage != "transactions" || currentPage != "create-order") && (document.getElementById("searchText").value = "") }}
                        >
                            {ordersNavs.map((item, index) => {
                                return ((item.linkEventKey == "create-order" && isTransporter()) ? <></> :
                                    <Nav.Item key={index} className="upperNavItemContainer flex-grow-1">
                                        <Nav.Link eventKey={item.linkEventKey} className="upperNavItem" onClick={() => { updateNavsArrHandler(index, item.linkEventKey) }}>
                                            <div className="mainImage">
                                                <img src={item.isActive ? item.hoverImageSrc : item.mainImageSrc} alt="" />
                                            </div>
                                            <div className="title">
                                                {translate("ORDERS." + item.title)}
                                            </div>
                                        </Nav.Link>
                                    </Nav.Item>
                                )
                            })}
                        </Nav>
                    </>
                    :
                    <Nav
                        justify
                        variant="tabs"
                        defaultActiveKey={currentPage}
                        activeKey={currentPage}
                        onSelect={(eventKey) => { history.push(`/account/main/${eventKey}`); setActivePage(0); setSearchStr(""); currentPage != "transactions" && (document.getElementById("searchText").value = "") }}
                    >
                        {ordersNavsArr.map((nav, index) => {
                            return (
                                <Nav.Item key={index}>
                                    <Nav.Link eventKey={nav.eventKey}>
                                        <img src={nav.src} alt="new" style={styles.navImg} />
                                        <div style={styles.navLal}>{translate("ORDERS." + nav.text)}</div>
                                    </Nav.Link>
                                </Nav.Item>
                            )
                        })}
                    </Nav>
                }
            </div>
            
            {/* search box/*/}
            {true && <div style={{ width: "50%", margin: "20px auto", display: (currentPage == "transactions" || currentPage == "create-order") && "none" }}>
                <FloatingLabel label="Search...">
                    <Form.Control id="searchText" type="text" placeholder="..." className="rounded-22 mb-4 mt-1" ref={searchRef} onKeyPress={(e) => { if (e.charCode === 13) { searchOrdersHandler() } }} />
                    <Button className="btn-grad-circle" style={{ position: "absolute", right: "20px", top: "10px" }}>{searching ? <Spinner animation="border" size="sm" /> : <i className="bi bi-search" onClick={() => { searchOrdersHandler() }}></i>}</Button>
                </FloatingLabel>
            </div>}

            {/* table display */}
            <Box height="400px">
                {loading ? <Loader /> : (
                    <>
                        {!!orders && currentPage.indexOf("orders") !== -1 &&
                            <div style={{ position: "relative" }}>
                                <OrdersTabularView
                                    socket={socket}
                                    orders={orders}
                                    currentPage={currentPage}
                                    assignOrders={(ordersIds) => { setAssignedIds(ordersIds); ordersIds.length > 0 ? setOrdersSelected(true) : setOrdersSelected(false) }}
                                    update={() => {
                                        setSearchStr("");
                                        setRefresh(!refresh);
                                        searchRef.current.value = "";
                                        searchRef.current.focus();
                                    }}
                                />
                                <PaginateComp
                                    totalNumOfRecs={totalNumOfRecs}
                                    pageSize={PAGE_SIZE}
                                    activePage={activePage}
                                    setActive={setActivePage}
                                />

                                {orders.length > 0 && <ExportExcel currentPage={currentPage} ordersNum={orders.length} />}
                            </div>
                        }

                        {currentPage === "transactions" && <>
                            <Transactions />
                            <ExportExcel currentPage={currentPage} ordersNum={1000} />
                        </>}

                        {currentPage === "create-order" && (isFoodClient() ? <CreateNewFoodOrderCo /> : <CreateOrder_v2 />)}
                    </>
                )}
            </Box>
        </div>
    );
};

const ExportExcel = ({ /* excelData, */ /* fileName */ currentPage, ordersNum }) => {

    const [excelData, setExcelData] = useState([]);
    const [openExportDialog, setOpenExportDialog] = useState(false);

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const [loading, setLoading] = useState(false);

    const fileType = 'application/vnd.openxmlformats-officedocment.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    let filterStr = "none";

    const exportToExcel = async () => {

        setLoading(true);

        // get orders to export:
        // if transporter or not (isTransporter() or !isTransporter())
        // switch between currentPage (all-orders, current-orders, previous-orders, reviewed-orders, transactions)

        // let filterStr = "none";
        let userTpye = "";

        switch (currentPage) {
            case 'all-orders':
                filterStr = "new";
                break;
            case 'current-orders':
                filterStr = "active";
                break;
            case 'previous-orders':
                filterStr = "finished";
                break;
            case 'reviewed-orders':
                filterStr = "reviewed";
                break;
            case 'transactions':
                filterStr = "transactions";
                break;
            default:
                filterStr = "none";
                break;
        }

        if (isTransporter()) {
            userTpye = "transporter";
        } else {
            userTpye = "client";
        }

        if (filterStr != "none" && userTpye != "") {
            if (filterStr == "transactions") {
                // console.log(userTpye + " - " + filterStr);
                getTransporterTransactionsToExport().then((res) => {
                    console.log(res.data);

                    setExcelData(res.data.response.data.result.response);

                    setOpenExportDialog(true);

                    setLoading(false);
                });
            } else {
                // console.log(userTpye + " - " + filterStr);
                getOrdersToExport(userTpye, filterStr).then((res) => {
                    // console.log(res.data);

                    setExcelData(res.data.response);

                    setOpenExportDialog(true);

                    setLoading(false);
                });
            }

        }
    }

    return (
        <>
            <Button disabled={loading ? true : false} style={{
                position: "absolute", bottom: ordersNum == 1000 ? "-140px" : ordersNum >= 10 ? "10px" : "-30px", right: "30px"
            }} variant="outline-success" onClick={exportToExcel}><i className=" me-1 bi bi-file-earmark-spreadsheet"></i> Export to Excel {loading && <Spinner size="sm" className="me-1" animation="border" variant="success" />}</Button>

            <Modal
                show={openExportDialog}
                onHide={() => { setOpenExportDialog(false) }}
                centered
                animation={true}
                backdrop="static"
                size="sm"

                style={{ backgroundColor: "rgba(0,0,0,0.5)", }}
            >
                <Modal.Header closeButton style={styles.cardHeaderLg}>
                    <Modal.Title>Export to Excel</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/*  <Form>
                        <div className="d-flex justify-content-between">
                            <Form.Group controlId="formStartDate">
                                <Form.Label>Start Date</Form.Label>
                                <DatePicker
                                    selected={startDate}
                                    onChange={date => setStartDate(date)}
                                    dateFormat="dd/MM/yyyy"
                                />
                            </Form.Group>

                            <Form.Group controlId="formEndDate">
                                <Form.Label>End Date</Form.Label>
                                <DatePicker
                                    selected={endDate}
                                    onChange={date => setEndDate(date)}
                                    dateFormat="dd/MM/yyyy"
                                />
                            </Form.Group>
                        </div>
                    </Form> */}
                    <Button className="w-100" onClick={() => {
                        const ws = XLSX.utils.json_to_sheet(excelData);
                        // ws['!defaultRowHeight'] = 50;  // set the default row height to 20
                        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
                        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
                        const data = new Blob([excelBuffer], { type: fileType });
                        FileSaver.saveAs(data, currentPage + fileExtension);

                        setOpenExportDialog(false);
                    }}>Export</Button>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default Main;
