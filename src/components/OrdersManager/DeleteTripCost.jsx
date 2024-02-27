import React, { useState } from "react";
import "./CancelOrder.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { deleteTripCost } from "../../APIs/OrdersAPIs";
import translate from "../../i18n/translate";
import Spinner from "react-bootstrap/Spinner";

// import { io } from "socket.io-client";

export function DeleteTripCost(props) {
    const [show, setShow] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    const handleClose = () => {
        setShow(false);
    };
    const handleShow = () => setShow(true);

    const deleteTransferFees = (orderId) => {

        setLoadingSubmit(true);
        
        deleteTripCost(orderId).then((res) => {
            setLoadingSubmit(false);
            props.onSuccess();
        });
        
        handleClose();
    };
    return (
        <>
            <Button variant="danger" style={{ marginRight: "5px", marginLeft: "5px", width: "200px" }} onClick={handleShow} >
                <svg
                    className="bi bi-trash"
                    style={{ display: "inline-block" }}
                    width="1em"
                    height="1em"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M5.5 5.5A.5.5 0 016 6v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm2.5 0a.5.5 0 01.5.5v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm3 .5a.5.5 0 00-1 0v6a.5.5 0 001 0V6z" />
                    <path
                        fillRule="evenodd"
                        d="M14.5 3a1 1 0 01-1 1H13v9a2 2 0 01-2 2H5a2 2 0 01-2-2V4h-.5a1 1 0 01-1-1V2a1 1 0 011-1H6a1 1 0 011-1h2a1 1 0 011 1h3.5a1 1 0 011 1v1zM4.118 4L4 4.059V13a1 1 0 001 1h6a1 1 0 001-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                        clipRule="evenodd"
                    />
                </svg>
                {" "}
                {translate("ORDER_DETAILS.DEL_TRANS_FEES")}{" "}
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {translate("ORDER_DETAILS.DEL_TRANS_FEES")} - {translate("ORDER_DETAILS.ORDER")} {props.orderId}{" "}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{translate("ORDER_DETAILS.CONFIRM_DELETE_FEES")}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        style={{
                            float: "right",
                            border: "none",
                            marginRight: "10px",
                        }}
                        className="btn btn-danger btn-rounded"
                        onClick={() => deleteTransferFees(props.orderId, props.socket)}
                    >
                        {loadingSubmit && <Spinner animation="border" size="sm" />}
                        <svg
                            className="bi bi-trash"
                            width="1em"
                            height="1em"
                            style={{ display: "inline-block" }}
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M5.5 5.5A.5.5 0 016 6v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm2.5 0a.5.5 0 01.5.5v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm3 .5a.5.5 0 00-1 0v6a.5.5 0 001 0V6z" />
                            <path
                                fillRule="evenodd"
                                d="M14.5 3a1 1 0 01-1 1H13v9a2 2 0 01-2 2H5a2 2 0 01-2-2V4h-.5a1 1 0 01-1-1V2a1 1 0 011-1H6a1 1 0 011-1h2a1 1 0 011 1h3.5a1 1 0 011 1v1zM4.118 4L4 4.059V13a1 1 0 001 1h6a1 1 0 001-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                                clipRule="evenodd"
                            />
                        </svg>
                        {" "}
                        {translate("GENERAL.DELETE")}
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        {translate("GENERAL.CLOSE")}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
