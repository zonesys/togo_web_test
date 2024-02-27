import React, { useState, useEffect, useRef } from 'react';
import translate from "../../i18n/translate";
import { MarkReturnedOrder } from "../../APIs/OrdersAPIs";
import { Button, Modal, Form, Spinner } from "react-bootstrap";

export default function ReturnOrder({ orderId, onSuccess }) {

    const [show, setShow] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    const commentRef = useRef();

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
    }

    function orderReturnHandler() {
        setLoadingSubmit(true);
        MarkReturnedOrder(orderId).then((res) => {
            setLoadingSubmit(false);
            onSuccess();
            handleClose();
        })
    }

    return (
        <>
            <Button
                className="border btn-grad"
                style={{
                    marginRight: "5px",
                    marginLeft: "5px",
                    width: "150px"
                }}
                onClick={handleShow}>
                {translate("TEMP.RETURN")}
            </Button>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton style={styles.cardHeaderSm}>
                    {translate("TEMP.RETURN")}
                </Modal.Header>

                <Modal.Body className='mt-4'>
                    {translate("TEMP.SURE_TO_RETURN")}
                </Modal.Body>
                <Modal.Footer>
                    {/* <Button className="w-100" variant="outline-secondary" onClick={handleClose}>
                        {translate("GENERAL.CLOSE")}
                    </Button> */}
                    <Button className="w-25 btn-grad" onClick={orderReturnHandler}>
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
