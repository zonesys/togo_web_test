import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Badge from "react-bootstrap/Badge";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import { editTripCost } from "../../APIs/OrdersAPIs";
import translate from "../../i18n/translate";
import Spinner from "react-bootstrap/Spinner";

export function EditTripCost(props) {
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

    const editCost = (orderId, cost) => {
        setLoadingSubmit(true);
        if (cost !== "" && cost !== null) {
            editTripCost(orderId, cost).then((res) => {
                setLoadingSubmit(false);
                props.onSuccess();
            });
        }
        handleClose();
    };

    return (
        <>
            <Button
                variant="primary"
                onClick={handleShow}
                style={{
                    marginRight: "5px",
                    marginLeft: "5px",
                    width: "200px"
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16" style={{ display: "inline-block" }}>
                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                    <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                </svg>
                {translate("ORDER_DETAILS.EDIT_TRANS_FEES")}{" "}
                {/* <Badge pill bg="light" text="primary">{props.tripCost} NIS</Badge> */}
            </Button>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{translate("ORDER_DETAILS.EDIT_TRANS_FEES")}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <InputGroup className="mb-3">

                        <InputGroup.Text>{translate("ORDER_DETAILS.BID_PRICE")}</InputGroup.Text>
                        <FormControl
                            placeholder={props.tripCost}
                            value={cost}
                            onChange={handleChange}
                        />
                    </InputGroup>
                </Modal.Body>
                {/* <Modal.Body>15% will be taken as a charge</Modal.Body> */}
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        {translate("GENERAL.CLOSE")}
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => editCost(props.orderId, cost)}
                    >
                        {loadingSubmit && <Spinner animation="border" size="sm" />}
                        {translate("GENERAL.PROCEED")}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
