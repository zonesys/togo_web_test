import { Button, ListGroup, Modal } from "react-bootstrap";
import translate from "../i18n/translate";
import React, { useEffect, useState } from "react";
import { AssignOrderToMember, GetAllMembers } from "../APIs/OrdersAPIs";
import { Box } from "@chakra-ui/layout";

export default function AssignToTransporter({orderId, onSuccess}) {
    const [show, setShow] = useState(false);
    const [members, setMembers] = useState([]);
    const [active, setActive] = useState({});
    const handleClose = () => {
        setShow(false);
    };
    
    const handleShow = () => setShow(true);

    useEffect(()=>{
        GetAllMembers().then((res)=>{
            setMembers(res.data.server_response);
        });
    }, []);

    return (
        <div>
            <Button 
                className="font-weight-bold"
                variant="success" 
                onClick={()=>{
                    handleShow();
                }}>
                {translate("ORDER_DETAILS.ASSIGN")}
            </Button>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{translate("ORDER_DETAILS.ASSIGN")}</Modal.Title>
                </Modal.Header>
                <Box p="10px">
                    
                    <ListGroup className="mb-1">
                        {members.length === 0 && <ListGroup.Item className={"p-1 rounded-0"} variant="info">
                            {translate("ORDER_DETAILS.ADD_TRANSPORTER")}
                        </ListGroup.Item>}
                        {members.length && <ListGroup.Item className={"p-1 rounded-0"} variant="info">
                            {translate("ORDER_DETAILS.CHOOSE_TRANSPORTER")}
                        </ListGroup.Item>}
                    </ListGroup>

                    <ListGroup onClick={(event)=>{
                        console.log(event.target.id);
                        setActive(members[event.target.id.split("_")[0]])
                    }}>
                        {members.map((member, idx)=>{
                            return (
                            <ListGroup.Item 
                                className={"p-1"}
                                id={`${idx}_${member.FullName}`} 
                                key={`${idx}_${member.FullName}`} 
                                action 
                                active={active.FullName === member.FullName}>
                                    {member.FullName}
                            </ListGroup.Item>
                            )
                        })}
                    </ListGroup>
                </Box>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        {translate("GENERAL.CLOSE")}
                    </Button>
                    <Button variant="primary" onClick={()=>{
                        AssignOrderToMember(active.TransporterId, orderId).then(()=>{
                            handleClose();
                            onSuccess();
                        })
                    }} disabled={!active.FullName}>
                        {translate("GENERAL.PROCEED")}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}