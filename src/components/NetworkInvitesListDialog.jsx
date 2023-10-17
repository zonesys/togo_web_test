import React, { useEffect, useRef, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { imgBaseUrl } from "../Constants/GeneralCont";
import { GetNetworkInvitations, JoinNetwork } from "../APIs/OrdersAPIs";
import { InviteRow } from "./Network";

import translate from "../i18n/translate";

function InviteForm({userId, name, phonenumber, onAccept}){
    const deliverCostRef = useRef();
    const verifyCode = useRef();
    const Note = useRef();
    return (
        <div className="d-flex flex-column flex-grow-1 h-100 justify-content-evenly">
            <InviteRow 
                label={"Name"} 
                value={name} 
                secLabel={"Load cost"}
                secValue={
                    <Form.Control
                        className="border-2 togo-border-full p-1"
                        type="text"
                        ref={deliverCostRef}
                    />
                }
            />
            <InviteRow
                label={"Phone number"} 
                value={phonenumber} 
                secLabel={"Activation Code"}
                secValue={
                    <Form.Control
                        className="border-2 togo-border-full p-1"
                        type="text"
                        ref={verifyCode}
                    />
                }
            />
            <InviteRow
                label={""} 
                value={""} 
                secLabel={"Note"}
                secValue={
                    <Form.Control
                        className="border-2 togo-border-full p-1"
                        type="text"
                        ref={Note}
                    />
                }
            />
            <div className="d-flex justify-content-end mt-1">
                <Button 
                    onClick={()=>{
                        let val1 = deliverCostRef.current.value;
                        let val2 = verifyCode.current.value;
                        if(val1.trim().length === 0 || val2.trim().length === 0){
                            return;
                        }
                        JoinNetwork(userId, val1, val2, Note.current.value).then(()=>{
                            if(onAccept){
                                onAccept();
                            }
                        });
                    }}
                    className="border rounded-22 togo-button"
                >
                    Accept
                </Button>
            </div>
        </div>
    )
}

export function NetworkInvitesListDialog({update}) {
    const [open, setOpen] = useState(false);
    const [invites, setInvites] = useState([]);
    const handleCloseInvites = () => {
        setOpen(false);
    }
    const getInvites = () => {
        GetNetworkInvitations().then((res)=>{
            setInvites(res.data.server_response);
        })
    }
    useEffect(()=>{
        if(open){
            getInvites();
        }
    }, [open]);
    return (
        <>
            <Button
                className="border me-2 rounded-22 togo-button"
                onClick={()=>{
                    setOpen(true);
                }}
            >
                {translate("TEMP.JOIN_NETWORK")}
            </Button>
            <Modal show={open} onHide={handleCloseInvites} size="lg">
                {/* <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header> */}
                <Modal.Body>
                    {invites?.length === 0 && <p>There is no network invitations</p>}
                    {invites?.map((invite) => {
                        return (
                            <div key={invite}>
                                <div className="align-items-center d-flex" style={{height: "200px"}}>
                                    <div className={"w-250px me-2"}>
                                        <img
                                            style={{maxHeight: "200px"}} 
                                            src={`${imgBaseUrl}${invite.PersonalImgPath}`} alt={invite.PhoneNumber}  
                                        />
                                    </div>
                                    <InviteForm 
                                        userId={invite.CustomerId} 
                                        name={invite.FullName} 
                                        phonenumber={invite.PhoneNumber}
                                        onAccept={()=>{
                                            getInvites();
                                            update();
                                        }}
                                    />
                                    
                                </div>
                            </div>
                        )
                    })}
                    
                </Modal.Body>
            </Modal>
        </>
        
    )
}