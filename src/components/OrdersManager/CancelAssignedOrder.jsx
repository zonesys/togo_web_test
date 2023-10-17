import React, { useState, useEffect, useRef } from 'react';
import translate from "../../i18n/translate";
import { cancelAssignedOrder } from "../../APIs/OrdersAPIs";
import { Button, Modal, Form, Spinner } from "react-bootstrap";

export default function CancelAssignedOrder({ orderId, onSuccess }) {

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
        actionButton: {
            marginRight: "5px",
            marginLeft: "5px",
            width: "150px"
        },
    }

    function cancelAssignedOrderHandler() {
        setLoadingSubmit(true);
        cancelAssignedOrder(orderId).then((res) => {
            // console.log(res.data);
            setLoadingSubmit(false);
            onSuccess();
            handleClose();
        })
    }

    return (
        <>
            <Button style={styles.actionButton} variant="danger" onClick={handleShow}>{translate("TEMP.CANCEL_ASSIGN")}</Button>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton style={styles.cardHeaderSm}>
                    {translate("TEMP.CANCEL_ASSIGNED_ORDER")}
                </Modal.Header>

                <Modal.Body className='mt-4'>
                    {translate("TEMP.SURE_TO_CANCEL_ORDER")}
                </Modal.Body>
                <Modal.Footer>
                    <Button className="w-25 btn-grad" onClick={cancelAssignedOrderHandler}>
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
