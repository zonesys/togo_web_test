import React, { useEffect, useRef, useState } from 'react';
import translate from "../i18n/translate";
import { getCustomerWithdrawRequests, requestWithdraw } from '../APIs/financialsAPIs';
import Loader from "./Loader/Loader";
import { Box } from "@chakra-ui/layout";
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';
import { Button, Badge, Modal, Form, FloatingLabel, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { toastNotification } from "../Actions/GeneralActions";
import { useIntl } from "react-intl";
import { GiReceiveMoney } from 'react-icons/gi';

/* display cancel button if the request is wating */
function cancelFormatter(value) {
    return <>
        {value == 1 && <Button variant="danger" style={{ fontSize: "0.7rem" }}>
            {translate("WITHDRAW_REQUEST.CANCEL_REQUEST")}
        </Button>}
    </>
}

/* format each request status */
function statusFormatter(value) {
    return <>
        <Badge bg={value == "WAITING" ? "warning" : value == "FINISHED" ? "success" : "danger"}>
            {translate("WITHDRAW_REQUEST." + value)}
        </Badge>
    </>
}

/* format each request amount */
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

export default function FinancialManagement() {

    let dispatch = useDispatch();
    const intl = useIntl();
    const [loadinRequest, setLoadinRequest] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [requests, setRequests] = useState([]);
    const [isEmpty, setIsEmpty] = useState(false);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const handleCloseRequestModal = () => setShowRequestModal(false);
    const handleShowRequestModal = () => setShowRequestModal(true);
    const [validated, setValidated] = useState(false);

    /* get all related withdrawal requests to be displayed in the table */
    useEffect(() => {
        let isMounted = true;
        getCustomerWithdrawRequests().then((res) => {

            if (!!!res.data.server_response) {
                if (res.data.includes('error'))
                    dispatch(toastNotification("Error", res.data, "error"));
            } else {
                const tempArr = [];
                const resArr = res.data.server_response;

                for (let i = 0; i < resArr.length; i++) {
                    tempArr.push({
                        "id": resArr[i].id,
                        "date": resArr[i].requestTime.split(" ")[0],
                        "time": resArr[i].requestTime.split(" ")[1],
                        "amount": resArr[i].amount,
                        "status": resArr[i].isCanceled == 1 ? "CANCELED" : resArr[i].isRejected == 1 ? "REJECTED" : resArr[i].isApproved == 1 ? "FINISHED" : "WAITING",
                        "isActive": (resArr[i].isCanceled == 1 || resArr[i].isRejected == 1 || resArr[i].isApproved == 1) ? 0 : 1
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
            }

        })
        return () => { isMounted = false };
    }, [refresh]);

    /* table columns */
    const columns = [
        {
            dataField: 'date',
            text: intl.formatMessage({ id: "WITHDRAW_REQUEST.REQUEST_DATE" })
        },
        {
            dataField: 'time',
            text: intl.formatMessage({ id: "WITHDRAW_REQUEST.REQUEST_TIME" }),
            formatter: timeFormatter
        },
        {
            dataField: 'amount',
            text: intl.formatMessage({ id: "WITHDRAW_REQUEST.WITHDRAWAL_AMOUNT" }),
            formatter: amountFormatter
        },
        {
            dataField: 'status',
            text: intl.formatMessage({ id: "WITHDRAW_REQUEST.STATUS" }),
            formatter: statusFormatter
        }/* ,
        {
            dataField: 'isActive',
            text: "",
            formatter: cancelFormatter
        } */
    ];

    /* clear the borders for table headers */
    for (let i = 0; i < columns.length; i++) {
        columns[i].headerStyle = { border: 'none' }
    }

    return (
        <div className="pe-4 ps-4 pt-2">
            <Button className='btn-grad mt-2 mb-3 d-flex justify-content-center' onClick={handleShowRequestModal}>
                {translate("WITHDRAW_REQUEST.REQUEST_WITHDRAWAL")}
                <GiReceiveMoney className={"ms-2 mt-1"} />
            </Button>

            {/* to enter withdrawal amount */}
            <Modal
                className='togo-custom-modal-lg'
                centered
                show={showRequestModal}
                onHide={handleCloseRequestModal}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{translate("WITHDRAW_REQUEST.REQUEST_WITHDRAW")}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form id="amountForm" validated={validated} noValidate onSubmit={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        const formData = new FormData(event.target), formDataObj = Object.fromEntries(formData.entries());

                        const form = event.currentTarget;
                        if (form.checkValidity() === true) {
                            setLoadinRequest(true);
                            requestWithdraw(formDataObj.amount).then((res) => {

                                if (res.data.includes('error')) {
                                    dispatch(toastNotification("Error", res.data, "error"));
                                } else {
                                    setLoadinRequest(false);
                                    handleCloseRequestModal();
                                    setRefresh(!refresh);
                                }

                            })
                        }

                        setValidated(true);

                    }}>
                        <FloatingLabel controlId="floatingAmount" label={intl.formatMessage({ id: "WITHDRAW_REQUEST.AMOUNT" })}>
                            <Form.Control required type="number" placeholder="..." name="amount" />
                        </FloatingLabel>

                        <hr className='my-3' />

                        <div className='d-flex justify-content-between'>
                            <Button style={{ width: "45%" }} variant="outline-secondary" onClick={handleCloseRequestModal}>
                                {translate("WITHDRAW_REQUEST.CANCEL")}
                            </Button>
                            <Button type='submit' style={{ width: "45%" }} disabled={loadinRequest ? true : false} className='btn-grad'>
                                {translate("WITHDRAW_REQUEST.SEND_REQUEST")}
                                {loadinRequest && <Spinner animation="border" size="sm" />}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* if there are not requests the 'no requests' message will be displayed, otherwise requests table will be shown */}
            {
                requests.length > 0 ?
                    <BootstrapTable
                        keyField='id'
                        data={requests}
                        columns={columns}
                        pagination={paginationFactory()}
                        rowClasses={"custom-row-class"}
                        columnClasses={"custom-column-class"}
                        filter={filterFactory()}
                    /> : !isEmpty ? <Box height="400px"><Loader /></Box> :
                        <div className="w-100 d-flex justify-content-center mt-5">{translate("WITHDRAW_REQUEST.NO_REQUESTS")}</div>
            }
        </div>
    )
};
