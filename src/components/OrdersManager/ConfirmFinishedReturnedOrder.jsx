import React, { useState, useEffect, useRef } from 'react';
import translate from "../../i18n/translate";
import { ClientFinishOrder } from "../../APIs/OrdersAPIs";
import { Button, Modal, Form, Spinner } from "react-bootstrap";

export default function ConfirmFinishedReturnedOrder({ orderId, onSuccess }) {

    const [show, setShow] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    const handleClose = () => {
        setShow(false);
    };

    const handleShow = () => { setShow(true) }

    const styles = {
        cardHeaderSm: {
            position: 'absolute',
            left: '20px',
            right: "20px",
            top: '-20px',
            background: "linear-gradient(90deg, #26a69a, #69d4a5)",
            color: 'white',
            borderRadius: '10px',
            fontWeight: 'bold',
            fontSize: "1rem",
            height: "40px"
        },
        actionButtonLg: {
            marginRight: "5px",
            marginLeft: "5px",
            width: "200px"
        }
    }

    function finishRetunedOrderHandler() {
        setLoadingSubmit(true);
        ClientFinishOrder(orderId).then((res) => {
            setLoadingSubmit(false);
            onSuccess();
            handleClose();
        })
    }

    return (
        <>
            <Button variant="success" style={styles.actionButtonLg} onClick={() => { handleShow(); }}>{translate("ORDER_DETAILS.CONFIRM_FINISH_RETRNED")}</Button>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton style={styles.cardHeaderSm}>
                    {translate("ORDER_DETAILS.CONFIRM_FINISH_RETRNED")}
                </Modal.Header>

                <Modal.Body className='mt-4'>
                    {translate("TEMP.SURE_TO_FINISH_RETURNED")}
                </Modal.Body>
                <Modal.Footer>
                    <Button className="w-25 btn-grad" onClick={finishRetunedOrderHandler}>
                        {loadingSubmit && <Spinner animation="border" size="sm" />}
                        {translate("TEMP.YES")}
                    </Button>
                    <Button className="w-25 btn-grad" onClick={() => { setShow(false) }}>
                        {translate("TEMP.NO")}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
