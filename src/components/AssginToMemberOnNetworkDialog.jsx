import React, { useEffect, useState } from "react";
import { Button, Dropdown, Modal } from "react-bootstrap";
import { AssginOrderToMemberOnNetwork, GetAllNetworkMembers } from "../APIs/OrdersAPIs";
import { useDispatch } from "react-redux";
import { toastNotification } from "../Actions/GeneralActions";

export default function AssignToMemberOnNetworkDialog({ orderId, onSuccess }) {
    let dispatch = useDispatch();

    const [show, setShow] = useState(false);
    const [transporters, setTransporters] = useState();
    const [selectedTransporter, setSelectedTransporter] = useState();

    const handleClose = () => {
        setShow(false);
    }

    useEffect(() => {
        GetAllNetworkMembers().then((res) => {
            setTransporters(res.data.server_response);
            setSelectedTransporter(res.data.server_response[0])
        });
    }, []);

    return (
        <>
            <Button className="border btn-grad" style={{ width: "150px", marginRight: "5px", marginLeft: "5px" }} onClick={() => {
                setShow(true);
            }}>
                Assgin To
            </Button>

            <Modal show={show} onHide={handleClose} contentClassName="togo-button">

                <Modal.Body>
                    <p>Please Select a Transporter on the network</p>
                    <div className="togo-outling mb-2">
                        <Dropdown
                            className="rounded-22 bg-white"
                            onSelect={(eve) => {
                                setSelectedTransporter(transporters[eve])
                            }}
                        >
                            <Dropdown.Toggle variant="" className="w-100 text-start d-flex align-items-center shadow-none">
                                <div style={{ width: "97%" }}>
                                    {
                                        `${selectedTransporter?.FullName}, ${selectedTransporter?.PhoneNumber}, ${selectedTransporter?.Note}`
                                    }
                                </div>
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="w-100">
                                {transporters?.map((transporter, index) => {
                                    return (
                                        <Dropdown.Item eventKey={index} key={index} className="d-flex">
                                            {`${transporter.FullName}, ${transporter.PhoneNumber}, ${transporter.Note}`}
                                        </Dropdown.Item>
                                    )
                                })}

                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </Modal.Body>

                <Modal.Footer className="justify-content-center border-0 pt-0">
                    <Button variant="secondary" className="border rounded-22 togo-button" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" className="border rounded-22 togo-button"
                        onClick={() => {
                            AssginOrderToMemberOnNetwork(orderId, selectedTransporter.NetworkMemberId).then((res) => {
                                /* onSuccess?.(); */ /* edited (replaced) */
                                if (
                                    res.data == "NoBalanceMember" ||
                                    res.data == "No Token" ||
                                    res.data == "Error while assign order" ||
                                    res.data == "Blocked" ||
                                    res.data == "TokenError"
                                ) {
                                    dispatch(toastNotification("Error!", res.data, "error"));
                                } else {
                                    onSuccess();
                                }
                            });
                        }}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}