import React, { useEffect, useState, useRef } from 'react';
import { Button, Dropdown, Form, Modal, Spinner, Table } from "react-bootstrap";
import translate from "../i18n/translate";
import { GetAllClientNetworkMembers, CreateAssignedOrder, createAlbarqOrder, testBarq } from "../APIs/OrdersAPIs";
import MyNetworkDropDown from "./MyNetworkDropDown";
import { useDispatch } from "react-redux";
import { toastNotification } from "../Actions/GeneralActions";

export default function SubmitAndAssignDialog(props) {

    let dispatch = useDispatch();

    const [open, setOpen] = useState(true);
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

        // console.log(props.assignAddressClint.IdCity + " -> " + props.assignAddressClint.IdCityDes);

        const timer = setTimeout(() => {
            if (open) {
                setLoading(true);

                GetAllClientNetworkMembers(props.assignAddressClint.IdCity, props.assignAddressClint.IdCityDes).then((res) => {

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

        if (assignedDeliveryCostRef/*  && assignedDeliveryCostRef.current.value > 0 */) {
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
            <Modal size="md" show={open} onHide={() => { setOpen(false); props.setCloseAssignDialog(); }} centered animation={true} backdrop="static" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>

                <Modal.Header closeButton>
                    <Modal.Title>{translate("ORDERS.CHOOSE_TRANS")}</Modal.Title>
                </Modal.Header>

                <Modal.Body className=''>

                    <MyNetworkDropDown
                        typeLoad={props.assignDeliveryParams.TypeLoad}
                        loading={loading}
                        network={myNetwork}
                        onSearch={setNetworkInputValue}
                        onSelect={setSelectedMember}
                        selectedMember={selectedMember}
                    />
                    {beginValidation && selectedMemberCheck && <span style={{ color: "red" }}>required!</span>}

                    {/* <Table hover>
                        <thead>
                            <tr>
                                <th scope="col" style={{ width: "40%" }}>Name</th>
                                <th scope="col" style={{ width: "40%" }}>Phone Number</th>
                                <th scope="col" style={{ width: "20%" }}>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                myNetwork.length > 0 ? myNetwork.map((member, index) => {
                                    return <tr key={index} style={{ cursor: "pointer" }} onClick={() => { console.log(member.FullName) }}>
                                        <td>{ member.FullName }</td>
                                        <td>{ member.PhoneNumber }</td>
                                        <td>{ member.deliveryPrice + " NIS" }</td>
                                    </tr>
                                }) : <tr><td colSpan={3}>No Transporters!</td></tr>
                            }
                        </tbody>
                    </Table> */}

                    {/* <Form.Control type="number" className="w-25 mt-2" placeholder="Delivery Cost" ref={assignedDeliveryCostRef} />
                    {beginValidation && deliveryCostAssignedCheck && <span style={{ color: "red" }}>required!</span>} */}

                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-center">

                    <Button
                        variant="primary"
                        onClick={() => {
                            setBeginValidation(true);

                            if (selectedMember/*  && assignedDeliveryCostRef && assignedDeliveryCostRef.current.value > 0 */) {
                                hideValidation()

                                setLadingSubmit2(true)

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

                                CreateAssignedOrder(JSON.stringify(props.assignDeliveryParams), JSON.stringify(props.assignAddressClint), selectedMember.CustomerId, selectedMember.deliveryPrice).then((res) => {

                                    if (
                                        res.data == "NoClientBalance" ||
                                        res.data == "NoTransporterBalance" ||
                                        res.data == "ErrorInAddress" ||
                                        res.data == "NotInserted" ||
                                        res.data == "NotAccepted" ||
                                        res.data == "Blocked" ||
                                        res.data == "TokenError"
                                    ) {
                                        dispatch(toastNotification("Error!", res.data, "error"));
                                    } else {

                                        createAlbarqOrder(JSON.stringify(props.assignDeliveryParams), JSON.stringify(props.assignAddressClint), selectedMember.CustomerId, selectedMember.deliveryPrice).then((res) => {
                                            console.log(res.data);
                                        })

                                        props.onSuccess();
                                        props.setCloseMainDialog();
                                        setLadingSubmit2(false);
                                        props.setCloseAssignDialog(false);
                                        setOpen(false);
                                    }
                                });

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
                            props.setCloseAssignDialog();
                            setOpen(false);
                        }
                        }
                    >
                        {translate("GENERAL.CANCEL")}
                    </Button>

                    {/* <span style={{ position: "absolute", right: "0", bottom: "0", color: "white", cursor: "pointer" }} onClick={() => {
                        createAlbarqOrder(JSON.stringify(props.assignDeliveryParams), JSON.stringify(props.assignAddressClint), selectedMember.CustomerId, selectedMember.deliveryPrice).then((res) => {
                            console.log(res.data);
                        })
                    }}>don't click</span> */}

                </Modal.Footer>


            </Modal>
        </>
    )
}