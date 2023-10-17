import React, {useState} from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import {finalizeTrip, confirmFinalizedTrip} from "../../APIs/OrdersAPIs";
import translate from "../../i18n/translate";
import {toastMessage} from "../../Actions/GeneralActions";
import {useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";

export function FinalizeOrder({orderId}) {
    const [show, setShow] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const history = useHistory();
    const dispatch = useDispatch();

    const handleClose = () => {
        setShow(false);
    };
    const handleShow = () => setShow(true);

    const handleChange = (e) => {
        setVerificationCode(e.target.value);
    };

    const finalizeOrder = () => {
        handleShow();
        finalizeTrip(orderId);
    };
    const send = (lat, long) => {
        confirmFinalizedTrip(orderId, verificationCode, lat, long)
            .then(resp => {
                dispatch(toastMessage("ORDERS.SUCCESS_FINALIZE_ORDER", "GENERAL.SUCCESS", "success"));
                history.goBack();
            })
            .catch(err => dispatch(toastMessage("ORDERS.ERR_FINALIZE_ORDER", "GENERAL.ERROR")));
        }
    const confirmFinalizeOrder = () => {
        if (verificationCode) {
            navigator.geolocation.getCurrentPosition((pos)=>{
                send(pos.coords.latitude, pos.coords.longitude);
            }, ()=>{
                send(0, 0);
            })
        }
        handleClose();
    };

    return (
        <>
            <Button
                variant="primary"
                className="me-1"
                onClick={finalizeOrder}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-all" viewBox="0 0 16 16" style={{display: "inline-block"}}>
                    <path d="M8.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L2.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093L8.95 4.992a.252.252 0 0 1 .02-.022zm-.92 5.14.92.92a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 1 0-1.091-1.028L9.477 9.417l-.485-.486-.943 1.179z"/>
                </svg>
                {translate("ORDER_DETAILS.FINALIZE_ORDER")}{" "}
            </Button>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{translate("ORDER_DETAILS.FINALIZE_ORDER")}{orderId}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <InputGroup className="mb-3">
                        <InputGroup.Text>{translate("ORDER_DETAILS.VERIFICATION_CODE")}</InputGroup.Text>
                        <FormControl value={verificationCode} onChange={handleChange} />
                    </InputGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        {translate("GENERAL.CLOSE")}
                    </Button>
                    <Button variant="primary" onClick={confirmFinalizeOrder}>
                        {translate("GENERAL.PROCEED")}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
