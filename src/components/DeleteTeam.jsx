import { DeleteIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import translate from "../i18n/translate";

export default function DeleteTeamDialog({onConfirm, teamName}){
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShow(false);
    };
    return (
        <>
            <Button variant="danger" onClick={(event)=>{
                event.stopPropagation();
                handleShow();
            }}>
                <DeleteIcon />
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{teamName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{translate("ADMIN.CONFIRM_DELETE_TEAM", {name: teamName})}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => {
                        onConfirm();
                        handleClose();
                    }}>
                        <DeleteIcon display="inline-block" verticalAlign="middle" mr="5px" /> 
                        <div style={{display: "inline-block", verticalAlign: "middle"}}>{translate("GENERAL.DELETE")}</div>
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        {translate("GENERAL.CLOSE")}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}