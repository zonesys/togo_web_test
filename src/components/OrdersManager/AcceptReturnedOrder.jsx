import React, { useState, useEffect, useRef } from 'react';
import translate from "../../i18n/translate";
import { AcceptReturnedOrder } from "../../APIs/OrdersAPIs";
import { Button, Modal, Form, Spinner } from "react-bootstrap";

export default function AcceptReturned({ orderId, onSuccess }) {

    const [show, setShow] = useState(false);
    const [response, setResponse] = useState("");
    const [responseType, setResponseType] = useState("");
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

    function responseToRetunedOrderHandler() {
        setLoadingSubmit(true);
        AcceptReturnedOrder(orderId, response).then((res) => {
            setLoadingSubmit(false);
            onSuccess();
            handleClose();
        })
    }

    return (
        <>
            <Button variant="primary" style={styles.actionButtonLg} onClick={() => { handleShow(); setResponse("1"); setResponseType("ACCEPT") }}>{translate("ORDER_DETAILS.ACCEPT_RETURNED")}</Button>

            <Button variant="danger" style={styles.actionButtonLg} onClick={() => { handleShow(); setResponse("0"); setResponseType("REJECT") }}>{translate("ORDER_DETAILS.REJECT_RETURNED")}</Button>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton style={styles.cardHeaderSm}>
                    {translate("TEMP." + responseType + "_RETURN")}
                </Modal.Header>

                <Modal.Body className='mt-4'>
                    {translate("TEMP.SURE_TO_" + responseType + "_RETURN")}
                </Modal.Body>
                <Modal.Footer>
                    <Button className="w-25 btn-grad" onClick={responseToRetunedOrderHandler}>
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
