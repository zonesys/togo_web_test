import React, { useState, useEffect, useRef } from 'react';
import translate from "../../i18n/translate";
import { MarkStuckOrder } from "../../APIs/OrdersAPIs";
import { Button, Modal, Form, Spinner } from "react-bootstrap";

export default function StuckOrder({ orderId, onSuccess }) {

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

    function orderStuckHandler() {
        setLoadingSubmit(true);
        MarkStuckOrder(orderId, commentRef.current.value).then((res) => {
            // console.log(res.data);
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
                {translate("TEMP.STUCK")}
            </Button>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton style={styles.cardHeaderSm}>
                    {translate("TEMP.DESC")}
                </Modal.Header>

                <Modal.Body className='mt-4'>

                    <Form.Control type="text" className="mt-2" placeholder="Description" ref={commentRef} />

                </Modal.Body>
                <Modal.Footer>
                    {/* <Button className="w-100" variant="outline-secondary" onClick={handleClose}>
                        {translate("GENERAL.CLOSE")}
                    </Button> */}
                    <Button className="w-25 btn-grad" onClick={orderStuckHandler}>
                        {loadingSubmit && <Spinner animation="border" size="sm" />}
                        {translate("TEMP.SUBMIT")}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
