import React, { useEffect, useRef, useState } from 'react';
import translate from "../../i18n/translate";
import { getCustomersWithdrawRequestsForAdmin, completeWithdrawRequest, rejectWithdrawRequest } from '../../APIs/AdminPanelApis';
import { Link } from "react-router-dom";
import Loader from "../Loader/Loader";
import { Box } from "@chakra-ui/layout";
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import { Button, Badge, Modal, Form, FloatingLabel, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { toastNotification } from "../../Actions/GeneralActions";

export default function WithdrawRequests() {

    let dispatch = useDispatch();
    const [refresh, setRefresh] = useState(false);
    const [loadingDone, setLoadingDone] = useState(false);
    const [loadingReject, setLoadingReject] = useState(false);
    const [rowId, setRowId] = useState("");
    const [requests, setRequests] = useState([]);
    const [isEmpty, setIsEmpty] = useState(false); // isEmpty used for showing the loader when there are no data yet
    const [showDoneModal, setShowDoneModal] = useState(false);
    const handleCloseDoneModal = () => setShowDoneModal(false);
    const handleShowDoneModal = () => setShowDoneModal(true);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const handleCloseRejectModal = () => setShowRejectModal(false);
    const handleShowRejectModal = () => setShowRejectModal(true);
    const [doneValidated, setDoneValidated] = useState(false);
    const [rejectValidated, setRejectValidated] = useState(false);

    useEffect(() => {

        let isMounted = true;
        getCustomersWithdrawRequestsForAdmin().then(res => {

            const tempArr = [];
            const resArr = res.data.server_response;

            for (let i = 0; i < resArr.length; i++) {
                tempArr.push({
                    "id": resArr[i].id,
                    "ref": resArr[i].ref,
                    "date": resArr[i].requestTime.split(" ")[0],
                    "time": resArr[i].requestTime.split(" ")[1],
                    "customerName": resArr[i].customerName,
                    "amount": resArr[i].amount,
                    "status": resArr[i].isCanceled == 1 ? "Canceled" : resArr[i].isRejected == 1 ? "Rejected" : resArr[i].isApproved == 1 ? "Finished" : "Waiting",
                    "isActive_id": (resArr[i].isCanceled == 1 || resArr[i].isRejected == 1 || resArr[i].isApproved == 1) ? "0" + "-" + resArr[i].id : "1" + "-" + resArr[i].id
                });
            }

            if (isMounted) {
                setRequests(tempArr);


                if (tempArr.length > 0) {
                    setIsEmpty(false)
                } else {
                    setIsEmpty(true)
                }
            }
        })
        return () => { isMounted = false };
    }, [refresh]);

    /* table columns */
    const columns = [
        {
            dataField: 'date',
            text: "Request Date"
        },
        {
            dataField: 'time',
            text: "Request Time",
            formatter: timeFormatter
        },
        {
            dataField: 'customerName',
            text: "Customer Name"
        },
        {
            dataField: 'amount',
            text: "Withdrawal Amount",
            formatter: amountFormatter
        },
        {
            dataField: 'status',
            text: "Status",
            formatter: statusFormatter
        },
        {
            dataField: 'ref',
            text: "Reference",
            formatter: refFormatter
        },
        {
            dataField: 'isActive_id',
            text: "",
            formatter: doneFormatter
        }
    ];

    function doneFormatter(value) {
        return <>
            {value.split("-")[0] == "1" && <>
                <Button variant="primary" style={{ fontSize: "0.7rem", width: "40%", marginLeft: "5px", marginRight: "5px" }} onClick={() => {
                    setRowId(value.split("-")[1]);
                    handleShowDoneModal();
                }}>
                    Excecute
                </Button>

                <Button variant="danger" style={{ fontSize: "0.7rem", width: "40%", marginLeft: "5px", marginRight: "5px" }} onClick={() => {
                    setRowId(value.split("-")[1]);
                    handleShowRejectModal();
                }}>
                    Reject
                </Button>
            </>}
        </>
    }

    function refFormatter(value) {
        return <>
            {value != null ? <>{value}</> : <>{"-"}</>}
        </>
    }

    /* format each request status */
    function statusFormatter(value) {
        return <>
            <Badge bg={value == "Waiting" ? "warning" : value == "Finished" ? "success" : "danger"}>
                {value}
            </Badge>
        </>
    }

    function amountFormatter(value) {
        return <><span style={{ color: "#26a69a" }}>{value}</span> {" NIS"}</>;
    }

    /* time formatter, to convert from 24 hrs system to 12 hrs system */
    function timeFormatter(value) {
        const tempStr = value.split(":");
        let time = value;
        if (tempStr[0].length === 1)
            time = "0".concat(value);

        // Check correct time format and split into components
        time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

        if (time.length > 1) { // If time format correct
            time = time.slice(1);  // Remove full string match value
            time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
            time[0] = +time[0] % 12 || 12; // Adjust hours
        }
        return time.join(''); // return adjusted time or original string
    }

    /* clear the borders for table headers */
    for (let i = 0; i < columns.length; i++) {
        columns[i].headerStyle = { border: 'none' }
    }
    if (requests.length > 0) {
        return (
            <div className="pe-4 ps-4 pt-2">
                <div className='my-2 w-100 d-flex justify-content-center h3'>Withdraw Requests</div>
                <BootstrapTable
                    keyField='id'
                    data={requests}
                    columns={columns}
                    pagination={paginationFactory()}
                    rowClasses={"custom-row-class"}
                    columnClasses={"custom-column-class"}
                    filter={filterFactory()}
                />

                <Modal
                    className='togo-custom-modal-lg'
                    centered
                    show={showDoneModal}
                    onHide={handleCloseDoneModal}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header>
                        <Modal.Title>Approve Withdrawal Rquest</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form id="amountForm" validated={doneValidated} noValidate onSubmit={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            const formData = new FormData(event.target), formDataObj = Object.fromEntries(formData.entries());

                            const form = event.currentTarget;
                            if (form.checkValidity() === true) {
                                setLoadingDone(true);

                                completeWithdrawRequest(rowId, formDataObj.ref).then((res) => {

                                    if (res.data.includes('error')) {
                                        dispatch(toastNotification("Error", res.data, "error"));
                                    } else {
                                        handleCloseDoneModal();

                                        setRefresh(!refresh);

                                        setLoadingDone(false);
                                    }

                                })

                            }

                            setDoneValidated(true);

                        }}>
                            Please enter reference number:
                            <FloatingLabel controlId="floatingAmount" label="Reference number..." className="mt-1">
                                <Form.Control required type="text" placeholder="..." name="ref" />
                            </FloatingLabel>

                            <hr className='my-3' />

                            <div className='d-flex justify-content-between'>
                                <Button style={{ width: "45%" }} variant="outline-secondary" onClick={handleCloseDoneModal}>
                                    Cancel
                                </Button>
                                <Button type='submit' style={{ width: "45%" }} disabled={loadingDone ? true : false} className='btn-grad'>
                                    Done
                                    {loadingDone && <Spinner animation="border" size="sm" />}
                                </Button>
                            </div>
                        </Form>
                    </Modal.Body>
                </Modal>

                <Modal
                    className='togo-custom-modal-lg'
                    centered
                    show={showRejectModal}
                    onHide={handleCloseDoneModal}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header>
                        <Modal.Title>Reject Request</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form id="rejectForm" validated={rejectValidated} noValidate onSubmit={(event) => {
                            event.preventDefault();
                            event.stopPropagation();

                            const form = event.currentTarget;
                            if (form.checkValidity() === true) {
                                setLoadingReject(true);

                                rejectWithdrawRequest(rowId).then((res) => {

                                    if (res.data.includes('error')) {
                                        dispatch(toastNotification("Error", res.data, "error"));
                                    } else {
                                        handleCloseRejectModal();

                                        setRefresh(!refresh);
    
                                        setLoadingReject(false);
                                    }
                                   
                                })

                            }

                            setRejectValidated(true);

                        }}>
                            Are you sure you want to reject this request?

                            <hr className='my-3' />

                            <div className='d-flex justify-content-between'>
                                <Button style={{ width: "45%" }} variant="outline-secondary" onClick={handleCloseRejectModal}>
                                    No
                                </Button>
                                <Button type='submit' style={{ width: "45%" }} disabled={loadingReject ? true : false} className='btn-grad'>
                                    Yes
                                    {loadingReject && <Spinner animation="border" size="sm" />}
                                </Button>
                            </div>
                        </Form>
                    </Modal.Body>
                </Modal>
            </div>
        );
    } else if (!isEmpty) {
        return <Box height="400px"><Loader /></Box>
    }

    return <div className="w-100 d-flex justify-content-center mt-5">There are no withdraw Requests</div>

};
