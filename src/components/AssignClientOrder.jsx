import React, { useEffect, useState, useRef } from 'react';
import { Button, Dropdown, Form, Modal, Spinner } from "react-bootstrap";
import translate from "../i18n/translate";
import { GetAllClientNetworkMembers, ClientAssignOrder } from "../APIs/OrdersAPIs";
import MyNetworkDropDown from "./MyNetworkDropDown";

export default function AssignClientOrder(props) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [myNetwork, setMyNetwork] = useState([]);
    const [networkInputValue, setNetworkInputValue] = useState('');
    const [selectedMember, setSelectedMember] = useState("");
    const [beginValidation, setBeginValidation] = useState(false);
    const [deliveryCostAssignedCheck, setDeliveryCostAssignedCheckShow] = useState(false);
    const [selectedMemberCheck, setSelectedMemberCheckShow] = useState(false);
    const [loadingSubmit2, setLadingSubmit2] = useState(false);

    const assignedDeliveryCostRef = useRef();

    useEffect(() => {
        const timer = setTimeout(() => {
            if (open) {
                setLoading(true);

                GetAllClientNetworkMembers().then((res) => {

                    setLoading(false);

                    setMyNetwork(res.data.membersData.filter(member => member.FullName.toLowerCase().replaceAll("أ", 'ا').replaceAll("إ", 'ا').includes(networkInputValue.toLowerCase()) || member.PhoneNumber.includes(networkInputValue)));
                });
            }
        }, 500)

        return () => {
            return clearTimeout(timer)
        }
    }, [networkInputValue, open]);

    function showValidation() {

        if (selectedMember) {
            setSelectedMemberCheckShow(false)
        } else {
            setSelectedMemberCheckShow(true)
        }

        if (assignedDeliveryCostRef && assignedDeliveryCostRef.current.value > 0) {
            setDeliveryCostAssignedCheckShow(false)
        } else {
            setDeliveryCostAssignedCheckShow(true)
        }
    }

    function hideValidation() {
        setBeginValidation(false);
    }

    return (
        <>
            <Button style={{ width: "150px", marginRight: "5px", marginLeft: "5px" }} onClick={() => {
                setOpen(true);
            }}>Assign</Button>
            <Modal size="md" show={open} onHide={() => { setOpen(false) }} centered animation={true} backdrop="static" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>

                <Modal.Header closeButton>
                    <Modal.Title>{translate("ORDER_DETAILS.ASSIGN")}</Modal.Title>
                </Modal.Header>

                <Modal.Body className=''>

                    <MyNetworkDropDown
                        loading={loading}
                        network={myNetwork}
                        onSearch={setNetworkInputValue}
                        onSelect={setSelectedMember}
                        selectedMember={selectedMember}
                    />
                    {beginValidation && selectedMemberCheck && <span style={{ color: "red" }}>required!</span>}

                    <Form.Control type="number" className="w-25 mt-2" placeholder="Delivery Cost" ref={assignedDeliveryCostRef} />
                    {beginValidation && deliveryCostAssignedCheck && <span style={{ color: "red" }}>required!</span>}

                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-center">

                    <Button
                        variant="primary"
                        onClick={() => {
                            setBeginValidation(true);

                            setLadingSubmit2(true)

                            if (selectedMember && assignedDeliveryCostRef && assignedDeliveryCostRef.current.value > 0) {
                                hideValidation()

                                /* console.log("assignDeliveryParams");
                                console.log(props.assignDeliveryParams);
                                console.log("----------------------");
                                console.log("assignAddressClint");
                                console.log(props.assignAddressClint);
                                console.log("----------------------");
                                console.log("CustomerId");
                                console.log(selectedMember.CustomerId);
                                console.log("----------------------");
                                console.log("assignedDeliveryCostRef");
                                console.log(assignedDeliveryCostRef.current.value);
                                console.log("----------------------"); */

                                /* CreateAssignedOrder(JSON.stringify(props.assignDeliveryParams), JSON.stringify(props.assignAddressClint), selectedMember.CustomerId, assignedDeliveryCostRef.current.value).then((res) => {

                                    // console.log(res.data)

                                    props.onSuccess();
                                    props.setCloseMainDialog();
                                    setLadingSubmit2(false);
                                    props.setCloseAssignDialog(false);
                                    setOpen(false);
                                }); */

                                ClientAssignOrder(props.orderId, selectedMember.CustomerId, assignedDeliveryCostRef.current.value).then((res) => {
                                    // console.log(res.data);

                                    /* props?.socket?.emit("assignedFromClient", {
                                        userId: localStorage.getItem("userId"),
                                        receiverId: selectedMember.CustomerId,
                                        orderId: props.orderId
                                    }); */

                                    props.onSuccess();
                                    setOpen(false);
                                })

                            } else {
                                showValidation();
                            }


                        }
                        }
                    >
                        {loadingSubmit2 && <Spinner animation="border" size="sm" />}
                        {translate("ORDERS.SUBMIT")}
                    </Button>

                    <Button
                        variant="danger"
                        onClick={() => {
                            setOpen(false);
                        }
                        }
                    >
                        {translate("GENERAL.CANCEL")}
                    </Button>


                </Modal.Footer>


            </Modal>
        </>
    )
}