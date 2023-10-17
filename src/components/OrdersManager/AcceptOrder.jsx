import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import { setTripCost } from "../../APIs/OrdersAPIs";
import translate from "../../i18n/translate";
import { useDispatch } from "react-redux";
import { toastNotification } from "../../Actions/GeneralActions";
import Spinner from "react-bootstrap/Spinner";

// import { io } from "socket.io-client";

export function BidOrder(props) {
    let dispatch = useDispatch();

    const [show, setShow] = useState(false);
    const [cost, setCost] = useState("");
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    const handleClose = () => {
        setShow(false);
    };

    const handleShow = () => setShow(true);

    const handleChange = (e) => {
        setCost(e.target.value);
    };

    const bidOrder = (orderId, cost, customerId, onSuccess) => {
        setLoadingSubmit(true);
        setTripCost(orderId, cost).then((res) => {
            if (
                res.data == "orderDeleted" ||
                res.data == "ChargeBalanace" ||
                res.data == "deliveryWayNotFound" ||
                res.data == "AlreadyAddedValue" ||
                res.data == "NotInsertedBid" ||
                res.data == "OrderNotFound" ||
                res.data == "OrderAlreadyAccepted" ||
                res.data == "Blocked" ||
                res.data == "TokenError"
            ) {
                dispatch(toastNotification("Error!", res.data, "error"));
            } else {
                onSuccess();
            }

            setLoadingSubmit(false);
        });
        handleClose();
    };

    return (
        <>
            <Button
                variant="primary"
                onClick={handleShow}
                style={{
                    width: "200px",
                    marginRight: "5px",
                    marginLeft: "5px"
                }}
            >
                {translate("ORDER_DETAILS.BID")}{" "}
            </Button>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{translate("ORDER_DETAILS.MAKE_A_BID")}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <InputGroup className="mb-3">
                        <InputGroup.Text>{translate("ORDER_DETAILS.BID_PRICE")}</InputGroup.Text>
                        <FormControl placeholder="0.0" value={cost} onChange={handleChange} />
                    </InputGroup>
                    <div>
                        5% {translate("ORDER_DETAILS.WILL_TAKEN_CHARGE")}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        {translate("GENERAL.CLOSE")}
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => bidOrder(props.orderId, cost, props.customerId, props.onSuccess, props.socket)}
                    >
                        {loadingSubmit && <Spinner animation="border" size="sm" />}
                        {translate("GENERAL.PROCEED")}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
