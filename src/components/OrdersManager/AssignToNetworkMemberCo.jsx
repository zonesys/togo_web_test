import React, { useEffect, useState } from "react";
import { Button, Dropdown, Modal, Table, Card, Container, Row, Col, Form } from "react-bootstrap";
import { AssginOrderToMemberOnNetwork, GetAllNetworkMembers } from "../../APIs/OrdersAPIs";
import { useDispatch } from "react-redux";
import { toastNotification } from "../../Actions/GeneralActions";

export default function AssignToNetworkMemberCo({ orderId, onSuccess }) {
    const styles = {
        cardHeaderLg: {
            position: 'absolute',
            left: '20px',
            right: '20px',
            top: '-25px',
            height: '50px',
            background: "linear-gradient(90deg, #26a69a, #69d4a5)",
            color: 'white',
            borderRadius: '10px',
            fontWeight: 'bold',
            fontSize: "0.7rem"
        },
        cardHeaderSm: {
            position: 'absolute',
            left: '20px',
            top: '-20px',
            background: "linear-gradient(90deg, #26a69a, #69d4a5)",
            color: 'white',
            borderRadius: '10px',
            fontWeight: 'bold',
            fontSize: "1rem"
        },
    }

    const [showPickupAddressModal, setShowPickupAddressModal] = useState(false);

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
            {/* upper background */}
            <div className="upperBackground">
            </div>

            <div className="mainContainer">
                <Container fluid>
                    <Row className="h2 d-flex justify-content-center" style={{ marginTop: "80px", marginBottom: "0px", color: "#26a69a" }}>
                        Assign to Network Member
                    </Row>

                    <Row>
                        <Col>
                            <Card className="m-5 rounded-22 shadow">
                                <Card.Body>
                                    <p className="h5 my-3">Set Assignee pickup and delivery addresses:</p>

                                    <Table>
                                        <thead>
                                            <tr>
                                                <th scope="col"></th>
                                                <th style={{ width: "50%" }} scope="col"></th>
                                                <th scope="col"></th>
                                                <th scope="col"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td><Form.Control readOnly placeholder={"pickUpAddress.name"} /></td>
                                                <td><Form.Control readOnly placeholder={"pickUpAddress.details" + ", " + "pickUpAddress.areaName"} /></td>
                                                <td><Form.Control readOnly placeholder={"pickUpAddress.phone_number"} /></td>
                                                <td>
                                                    <Button
                                                        className="btn-grad-circle"
                                                        style={{ height: "50px" }}
                                                        onClick={() => {
                                                            setShowPickupAddressModal(true);
                                                        }}
                                                    >
                                                        <i className="bi bi-arrow-repeat h3"></i>
                                                    </Button>
                                                    <Modal
                                                        show={showPickupAddressModal}
                                                        onHide={() => { setShowPickupAddressModal(false) }}
                                                        centered
                                                        animation={true}
                                                        size="xl"

                                                        style={{ backgroundColor: "rgba(0,0,0,0.5)", }}
                                                    >
                                                        <Modal.Header closeButton style={styles.cardHeaderLg}>
                                                            <Modal.Title>Set Pickup Address</Modal.Title>
                                                        </Modal.Header>
                                                        <Modal.Body className="mt-5">

                                                        </Modal.Body>
                                                    </Modal>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </Table>

                                    <Table>
                                        <thead>
                                            <tr>
                                                <th scope="col"></th>
                                                <th style={{ width: "50%" }} scope="col"></th>
                                                <th scope="col"></th>
                                                <th scope="col"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td><Form.Control readOnly placeholder={"pickUpAddress.name"} /></td>
                                                <td><Form.Control readOnly placeholder={"pickUpAddress.details" + ", " + "pickUpAddress.areaName"} /></td>
                                                <td><Form.Control readOnly placeholder={"pickUpAddress.phone_number"} /></td>
                                                <td>
                                                    <Button
                                                        className="btn-grad-circle"
                                                        style={{ height: "50px" }}
                                                        onClick={() => {
                                                            setShowPickupAddressModal(true);
                                                        }}
                                                    >
                                                        <i className="bi bi-arrow-repeat h3"></i>
                                                    </Button>
                                                    <Modal
                                                        show={showPickupAddressModal}
                                                        onHide={() => { setShowPickupAddressModal(false) }}
                                                        centered
                                                        animation={true}
                                                        size="xl"

                                                        style={{ backgroundColor: "rgba(0,0,0,0.5)", }}
                                                    >
                                                        <Modal.Header closeButton style={styles.cardHeaderLg}>
                                                            <Modal.Title>Set Pickup Address</Modal.Title>
                                                        </Modal.Header>
                                                        <Modal.Body className="mt-5">

                                                        </Modal.Body>
                                                    </Modal>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </Table>

                                    {/* <div className="d-flex justify-content-center">
                                        <Button className="mx-2 btn-grad" style={{ width: "45%" }}>Original Pickup Address <i className="bi bi-arrow-repeat"></i></Button>
                                        <Button disabled variant="outline-primary">{"->"}</Button>
                                        <Button className="mx-2 btn-grad" style={{ width: "45%" }}>Original Delivery Address <i className="bi bi-arrow-repeat"></i></Button>
                                    </div> */}

                                    <br />
                                    <hr />

                                    <Table responsive>
                                        <thead>
                                            <tr>
                                                <th scope="col"></th>
                                                <th scope="col">Account Name</th>
                                                <th scope="col">Full Name</th>
                                                <th scope="col">Mobile</th>
                                                <th scope="col">Discount Value</th>
                                                <th scope="col"></th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            <tr>
                                                <td>image</td>
                                                <td>test account name</td>
                                                <td>test full name</td>
                                                <td>0500000000</td>
                                                <td>0.15</td>
                                                <td>
                                                    <Button className="btn-grad">Assign</Button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>image</td>
                                                <td>test account name</td>
                                                <td>test full name</td>
                                                <td>0500000000</td>
                                                <td>0.15</td>
                                                <td>
                                                    <Button>Assign</Button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>image</td>
                                                <td>test account name</td>
                                                <td>test full name</td>
                                                <td>0500000000</td>
                                                <td>0.15</td>
                                                <td>
                                                    <Button>Assign</Button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </Card.Body>

                                {/* <Modal.Footer className="justify-content-center border-0 pt-0">
                    <Button variant="secondary" className="border rounded-22 togo-button" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" className="border rounded-22 togo-button"
                        onClick={() => {
                            AssginOrderToMemberOnNetwork(orderId, selectedTransporter.NetworkMemberId).then((res) => {
                                
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
                </Modal.Footer> */}
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    )
}