import { EditIcon } from "@chakra-ui/icons";
import React, { useRef, useState } from "react";
import { Button, FormControl, InputGroup, Modal } from "react-bootstrap";
import translate from "../i18n/translate";

export function EditTeamDialog({teamName, onConfirm}){
    const [show, setShow] = useState(false);
    const ref = useRef();
    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShow(false);
    };
    return (
        <>
            <Button variant="secondary" onClick={(event)=>{
                event.stopPropagation();
                handleShow();
            }}>
                <EditIcon />
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{teamName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <InputGroup>
                        <InputGroup.Text>{translate("ADMIN.TEAM_NAME")}</InputGroup.Text>
                        <FormControl
                            type="text"
                            placeholder={translate("ADMIN.ENTER_TEAM_NAME")}
                            defaultValue={teamName}
                            ref={ref}
                        />
                    </InputGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => {
                        onConfirm(ref.current.value);
                        handleClose();
                    }}>
                        <EditIcon display="inline-block" verticalAlign="middle" mr="5px" /> 
                        <div style={{display: "inline-block", verticalAlign: "middle"}}>{translate("GENERAL.EDIT")}</div>
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        {translate("GENERAL.CLOSE")}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}