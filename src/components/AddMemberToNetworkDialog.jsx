import React, { useRef, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { AddMemberToNetwork } from "../APIs/OrdersAPIs";

import translate from "../i18n/translate";

export default function AddMemberToNetworkDialog() {
    const [show, setShow] = useState(false);
    
    const phonenumRef = useRef();
    const handleClose = () => {
        setShow(false);
    }

    return (
        <>
            <Button className="border me-5 rounded-22 togo-button" onClick={()=>{
                setShow(true);
            }}>
                {translate("TEMP.ADD_MEMBER")}
            </Button>

            <Modal show={show} onHide={handleClose} contentClassName="togo-button">
                
                <Modal.Body>
                    <p>Please Enter Mobile Number for Transporter you want to invite</p>
                    <Form.Control
                        className="shadow-none bg-transparent border-0 border-2 border-bottom form-control rounded-0 text-white"
                        type="text"
                        ref={phonenumRef}
                    />
                </Modal.Body>

                <Modal.Footer className="justify-content-center border-0 pt-0">
                    <Button variant="secondary" className="border rounded-22 togo-button" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" className="border rounded-22 togo-button" 
                        onClick={()=>{
                            AddMemberToNetwork(phonenumRef.current.value).then(()=>{
                                handleClose();
                            })
                        }}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}