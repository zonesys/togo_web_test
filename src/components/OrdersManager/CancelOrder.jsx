import React, { useState } from "react";
import "./CancelOrder.css";
import Modal from "react-bootstrap/Modal";
import { CancelOrderReq } from "../../APIs/OrdersAPIs";
import translate from "../../i18n/translate";
import { Button } from "react-bootstrap";
import { DeleteIcon } from '@chakra-ui/icons'
import { isTransporter } from "../../Util";
import Spinner from "react-bootstrap/Spinner";

export function CancelOrder(props) {
    const [show, setShow] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    const handleClose = () => {
        setShow(false);
    };
    const handleShow = () => setShow(true);
    const cancelAnOrder = (orderId) => {
        setLoadingSubmit(true);
        if (!isTransporter()) {
            CancelOrderReq(orderId).then(() => {
                setLoadingSubmit(false);
                
                props.onSuccess && props.onSuccess();
                
                const res = props.socket?.emit("newOrderCanceled", {
                    userId: localStorage.getItem("userId"),
                    orderId: orderId
                });
            });
        }
        handleClose();
    };
    return (
        <>
            <Button style={{ marginRight: "5px", marginLeft: "5px", width: "150px" }} variant={"danger"} onClick={handleShow}>
                <DeleteIcon /> {translate("ORDER_DETAILS.CANCEL_ORDER")}
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{translate("ORDER_DETAILS.CANCEL_ORDER")} {props.orderId} </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{translate("ORDER_DETAILS.CONFIRM_CANCEL")}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant={"danger"}
                        onClick={() => cancelAnOrder(props.orderId)}
                    >
                        {loadingSubmit && <Spinner animation="border" size="sm" />}
                        <DeleteIcon /> {translate("GENERAL.CONFIRM")}
                    </Button>
                    <Button bg="#0000008f" color="white" onClick={handleClose}>
                        {translate("GENERAL.CLOSE")}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
