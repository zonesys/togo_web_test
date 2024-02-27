import React, { useState, useEffect, useRef } from 'react';
import translate from "../../i18n/translate";
import { AcceptClientAssignOrder } from "../../APIs/OrdersAPIs";
import { Button, Modal, Form, Spinner } from "react-bootstrap";

export default function ResponseToAssignedOrderFromClient({ orderId, onSuccessAccept, onSuccessReject }) {

    const [show, setShow] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [response, setResponse] = useState("");
    const [responseType, setResponseType] = useState("");

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
        actionButtonLg: {
            marginRight: "5px",
            marginLeft: "5px",
            width: "200px"
        }
    }

    function responseToAssignedOrderHandler() {
        setLoadingSubmit(true);
        AcceptClientAssignOrder(orderId, response).then((res) => {
            if (response === "1") {
                onSuccessAccept();
            } else {
                onSuccessReject();
            }

            setLoadingSubmit(false);
            handleClose();
        })
    }

    return (
        <>
            <Button variant="success" style={styles.actionButton} onClick={() => { handleShow(); setResponse("1"); setResponseType("ACCEPT") }}>{translate("TEMP.ACCEPT")}</Button>
            <Button variant="danger" style={styles.actionButton} onClick={() => { handleShow(); setResponse("0"); setResponseType("REJECT") }}>{translate("TEMP.REJECT")}</Button>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton style={styles.cardHeaderSm}>
                    {translate("TEMP." + responseType + "_ORDER")}
                </Modal.Header>

                <Modal.Body className='mt-4'>
                    {translate("TEMP.SURE_TO_" + responseType + "_ORDER")}
                </Modal.Body>
                <Modal.Footer>
                    <Button className="w-25 btn-grad" onClick={responseToAssignedOrderHandler}>
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
