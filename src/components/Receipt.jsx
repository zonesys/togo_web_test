import { ArrowBackIcon } from "@chakra-ui/icons";
import {Icon} from "@chakra-ui/react"
import React, { useState, useRef } from "react";
import { Button, Dropdown, Form, FormControl, InputGroup, Modal, SplitButton } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { toastMessage } from "../Actions/GeneralActions";
import translate from "../i18n/translate";
import { TransferToMaster, TransferToMember } from "../APIs/OrdersAPIs";
import "./Receipt.css";

export default function Receipt(props) {
    const [show, setShow] = useState(false);
    const ModalBodyrRef =  useRef();
    const ref = useRef();
    const dispatch = useDispatch();
    const handleShow = () =>{
        setShow(true);
    }
    const handleClose = () => {
        setShow(false);
    }
    return (
        <>
            <span variant="primary" onClick={handleShow}>
                {props.children}
            </span>

            <Modal show={show} onHide={handleClose}>
                <Modal.Body ref={ModalBodyrRef}>
                    <h1 className="h5 text-center">{translate("ADMIN.RECEIPT_FROM")}</h1>
                    <div className="d-flex justify-content-between mt-1">
                        <div>
                            {translate("ADMIN.TRANSPORTER_NAME")}
                        </div>
                        <div>
                            <p>{translate("ADMIN.DATE")}</p>
                            <FormControl type="date" defaultValue={new Date().toISOString().substring(0, 10)} />
                        </div>
                        
                    </div>
                    <div className="mt-2">
                        <Form.Group controlId="formHorizontalEmail" className="d-flex">
                            <Form.Label column sm={2}>
                                {translate("WORKING_TIME.FROM")}
                            </Form.Label>
                            
                            <Form.Control type="text" className="w-50"/>
                        </Form.Group>
                    </div>
                    <div className="mt-1 d-flex">
                        <Form.Group controlId="formGridEmail" className="m-inline-e-2">
                            <Form.Label>{translate("ORDERS.AMOUNT")}</Form.Label>
                            <InputGroup className="mb-2">
                                
                                <FormControl type="number" placeholder="0.00" ref={ref} />
                                <InputGroup.Text className="bg-white">&#8362;</InputGroup.Text>
                            </InputGroup>
                            {/* <Form.Control type="number" placeholder="0.00" /> */}
                        </Form.Group>

                        <Form.Group controlId="formGridPassword">
                            <Form.Label>{translate("ADMIN.DESC")}</Form.Label>
                            <Form.Control as="textarea" rows={3} />
                        </Form.Group>
                    </div>
                    <div>
                        {translate("ADMIN.RECIPIENT_SIGH")}
                    </div>
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-between">
                    <Button variant="" className="text-danger" onClick={handleClose}>
                        {translate("GENERAL.CLOSE")}
                        <Icon as={ArrowBackIcon} />
                    </Button>
                    <SplitButton
                        variant="outline-light"
                        title={translate("ADMIN.SAVE")}
                        id="segmented-button-dropdown-1"
                        className="btn-grad rounded"
                        onClick={()=>{
                            if(!props.toMaster){
                                TransferToMember(props.TransporterId, ref.current.value).then((res)=>{
                                    if(res.data === "Error"){
                                        
                                    } else {
                                        dispatch(toastMessage("Credited", "Successful", "success"));
                                    }
                                    
                                    handleClose();
                                    //onSuccess();
                                });
                            }else{
                                TransferToMaster(props.TransporterId, ref.current.value).then((res)=>{
                                    console.log(res);
                                    if(res.data === "Error"){
                                        
                                    } else {
                                        dispatch(toastMessage("Debited", "Successful", "success"));
                                    }
                                    handleClose();
                                    //onSuccess();32f9f1ab3c8c30fac1bd1eff8c46235992485fbd
                                });
                            }
                        }}
                    >
                        <Dropdown.Item onClick={()=>{
                            
                            window.print();
                        }}>{translate("ORDER_DETAILS.PRINT")}</Dropdown.Item>
                    </SplitButton>
                    {/* <Button variant="primary" onClick={handleClose}>
                        Save Changes
                    </Button> */}
                </Modal.Footer>
            </Modal>
        </>
    );
}