import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form, Table } from 'react-bootstrap';
import './CreateNewOrder.css';
import { RxDimensions } from 'react-icons/rx';
import { IoDocumentAttachOutline } from 'react-icons/io5';
import { MdChangeCircle } from 'react-icons/md';
import CustomModal, { getColor } from './CustomModal';
import ToggleSelect from './ToggleSelect';

export default function CreateOrderPage() {

    const [show, setShow] = useState(false);
    const [showPackageDimensions, setShowPackageDimensions] = useState(false);
    const [showCODInput, setShowCODInput] = useState(true);
    const [packageTypesArr, setPackageTypesArr] = useState([
        { id: 1, text: "Small Packages & Envelops", iconClass: "bi bi-envelope-fill", active: 1 },
        { id: 2, text: "Medium Packages", iconClass: "bi bi-box-seam", active: 0 },
        { id: 3, text: "Large Packages", iconClass: "bi bi bi-boxes", active: 0 },
    ]);
    const [deliveryTypesArr, setDeliveryTypesArr] = useState([
        { id: 1, text: "Cash on Delivery", iconClass: "bi bi-cash-coin", active: 1 },
        { id: 2, text: "Delivery", iconClass: "bi bi-truck", active: 0 },
    ]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const updateToggleArrHandler = (newArr, toggleID) => {
        let activeSelection = null;
        for (let i = 0; i < newArr.length; i++) {
            if (newArr[i].active === 1) {
                activeSelection = newArr[i].id;
                break;
            }
        }

        if (toggleID === "packageTypes") {
            if (activeSelection === 1) {
                setShowPackageDimensions(false);
            } else {
                setShowPackageDimensions(true);
            }

            setPackageTypesArr(newArr);
        } else if (toggleID === "deliveryTypes") {
            if (activeSelection === 1) {
                setShowCODInput(true);
            } else {
                setShowCODInput(false);
            }

            setDeliveryTypesArr(newArr);
        }

    }

    return (
        <Container>
            <Row>
                <Col>
                    <div className="upper-line"></div>
                </Col>
            </Row>
            <Row className="h-100 pt-3 wrapperContainer">
                <div className="top-shadow"></div>
                <div className="bottom-shadow"></div>
                <Col sm={5} className="border-end border-3 colContainer">
                    <Row>
                        <Row>
                            <Col>
                                <TitleTag title="What do you want to transport?" iconClass="bi bi-box-seam-fill" />
                            </Col>
                        </Row>
                        <Row className="content-container">
                            <Col sm={7}>
                                <ToggleSelect togglesArr={packageTypesArr} updateTogglesArr={(newArr) => { updateToggleArrHandler(newArr, "packageTypes") }} />
                            </Col>
                            <Col sm={5}>
                                {showPackageDimensions && <div className="editIcon">
                                    <RxDimensions onClick={handleShow} />
                                </div>}
                            </Col>
                        </Row>
                    </Row>
                    <Row>
                        <Row>
                            <Col>
                                <TitleTag title="Delivery Type" iconClass="bi bi-currency-dollar" />
                            </Col>
                        </Row>
                        <Row className="content-container">
                            <Col sm={7}>
                                <ToggleSelect togglesArr={deliveryTypesArr} updateTogglesArr={(newArr) => { updateToggleArrHandler(newArr, "deliveryTypes") }} />
                            </Col>
                            <Col sm={5}>
                                {showCODInput && <div className="CODInput">
                                    <Form.Control type="number" min={0} placeholder="COD" />
                                </div>}
                            </Col>
                        </Row>
                    </Row>
                    <Row>
                        <Row>
                            <Col>
                                <TitleTag title="Notes / Attachements" iconClass="bi bi-paperclip" />
                            </Col>
                        </Row>
                        <Row className="content-container">
                            <Col sm={9}>
                                <Form.Control as="textarea" placeholder="Notes" rows={4} />
                            </Col>
                            <Col sm={3}>
                                <div className="editIcon">
                                    <IoDocumentAttachOutline onClick={handleShow} />
                                </div>
                            </Col>
                        </Row>
                    </Row>
                </Col>
                <Col sm={7} className="colContainer">
                    <Row>
                        <Row>
                            <Col>
                                <TitleTag title="Sender" iconClass="bi bi-send" />
                            </Col>
                        </Row>
                        <Row className="content-container">
                            <Col sm={10}>
                                <Table>
                                    <tbody>
                                        <tr>
                                            <th scope="row">Sender Name:</th>
                                            <td>
                                                <Form.Control disabled type="text" placeholder="Sender Name..." />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Sender Phone:</th>
                                            <td>
                                                <Form.Control disabled type="text" placeholder="Sender Name..." />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Sender Address:</th>
                                            <td>
                                                <Form.Control disabled type="text" placeholder="Sender Name..." />
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Col>
                            <Col sm={2}>
                                <div className="editIcon">
                                    <MdChangeCircle onClick={handleShow} />
                                </div>
                            </Col>
                        </Row>
                    </Row>
                    <Row>
                        <Row>
                            <Col>
                                <TitleTag title="Receiver" iconClass="bi bi-envelope-open" />
                            </Col>
                        </Row>
                        <Row className="content-container">
                            {/* <Row>
                                <Col>
                                    <Button className="btn-grad w-100">Set New Receiver Address</Button>
                                </Col>
                                <Col>
                                    <Button className="btn-grad w-100">Or Choose From my List</Button>
                                </Col>
                            </Row> */}
                            <Row className="mt-2">
                                <Col>
                                    <Form.Control type="text" placeholder="Receiver Name..." />
                                </Col>
                                <Col>
                                    <Form.Control type="text" placeholder="Receiver Phone..." />
                                </Col>
                            </Row>
                            <Row className="mt-2">
                                <Col>
                                    <Form.Control type="text" placeholder="Address..." />
                                </Col>
                                <Col>
                                    <Form.Select style={{ height: "44px" }} aria-label="Default select example">
                                        <option>Country</option>
                                        <option value="1">One</option>
                                        <option value="2">Two</option>
                                        <option value="3">Three</option>
                                    </Form.Select>
                                </Col>
                                <Col>
                                    <Form.Control type="text" placeholder="Aditional Info..." />
                                </Col>
                            </Row>
                            <Row className="mt-2">
                                <Col>
                                    <Form.Select aria-label="Default select example">
                                        <option>Province</option>
                                        <option value="1">One</option>
                                        <option value="2">Two</option>
                                        <option value="3">Three</option>
                                    </Form.Select>
                                </Col>
                                <Col>
                                    <Form.Select aria-label="Default select example">
                                        <option>Region</option>
                                        <option value="1">One</option>
                                        <option value="2">Two</option>
                                        <option value="3">Three</option>
                                    </Form.Select>
                                </Col>
                                <Col>
                                    <Form.Select aria-label="Default select example">
                                        <option>City</option>
                                        <option value="1">One</option>
                                        <option value="2">Two</option>
                                        <option value="3">Three</option>
                                    </Form.Select>
                                </Col>
                                <Col>
                                    <Form.Select aria-label="Default select example">
                                        <option>Area</option>
                                        <option value="1">One</option>
                                        <option value="2">Two</option>
                                        <option value="3">Three</option>
                                    </Form.Select>
                                </Col>
                            </Row>
                        </Row>
                    </Row>
                    <Row>
                        <Row>
                            <Col>
                                <TitleTag title="Create Order" iconClass="bi bi-lightning-charge-fill" />
                            </Col>
                        </Row>
                        <Row className="content-container">
                            <Col className="create-button">
                                <Button className="btn-grad">Create Order</Button>
                            </Col>
                        </Row>
                    </Row>
                </Col>
            </Row>
            {
                show && <CustomModal handleClose={handleClose} themeColor={getColor("secondary")}>
                    <div className="custom-header">
                        <i className={"bi bi-box-fill me-2"} />
                        Package Properties
                    </div>
                    <div className="custom-body">
                        <p>some text 1</p>
                        <p>some text 2</p>
                        <p>some text 3</p>
                    </div>
                    <div className="custom-footer">
                        <Button className="rounded-pill action" variant="outline-success me-2" onClick={() => { console.log("done") }}>Save</Button>
                        <Button className="rounded-pill close" variant="outline-secondary">
                            <i className="bi bi-x-lg me-2"></i>Close
                        </Button>
                    </div>
                </CustomModal>
            }
        </Container>
    )
}

const TitleTag = ({ title, iconClass, themeColor }) => {


    return (
        <div className="title-tag">
            {/* <i className={iconClass}>{title}</i> */}
            <div className="icon"><div><i className={iconClass}></i></div></div>
            <div className="text">{title}</div>
        </div>
    )
}