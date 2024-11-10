import translate from "../i18n/translate";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Modal, Row, FloatingLabel, Spinner } from "react-bootstrap";
import {
    CreateAddressReq,
    GetCityRegion,
    GetCitiesArea,
    getLogestechsAreaByName
} from "../APIs/OrdersAPIs";
import { useDispatch } from "react-redux";
import { toastNotification } from "../Actions/GeneralActions";

export default function CreateAddress({ onSuccess, children }) {

    const styles = {
        cardHeaderLg: {
            position: 'absolute',
            left: '20px',
            right: '20px',
            top: '-20px',
            background: "linear-gradient(90deg, #26a69a, #69d4a5)",
            color: 'white',
            borderRadius: '10px',
            fontWeight: 'bold',
            fontSize: "1.5rem"
        },
        cardHeaderSm: {
            position: 'absolute',
            left: '20px',
            top: '-20px',
            background: "linear-gradient(90deg, #26a69a, #69d4a5)",
            color: 'white',
            borderRadius: '10px',
            fontWeight: 'bold',
            fontSize: "1.2rem"
        },
    }

    let dispatch = useDispatch();

    const [show, setShow] = useState(false);
    // const [cities, setCities] = useState([]);

    /* useEffect(() => {
        //if(show === true) {
        GetCityRegion().then((res) => {
            // edited (insert an empty elemnt to the beginning of the array to unselect the first element and make the city required)
            let tempArr = res.data.server_response;
            tempArr?.unshift({ IdCity: '0', Name: 'Choose City', LatRegion: '0', LongRegion: '0' });
            setCities(tempArr);
        });
        //}
    }, []); */

    const [logestechsAreas, setLogestechsAreas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [validated, setValidated] = useState(false);

    const [loadingAreas, setLoadingAreas] = useState(false)

    /* edited (handleClose handler added) */
    const handleClose = () => {
        setShow(false);
    }

    // ---------------------------------- City :

    const [provinces, setProvinces] = useState([]);
    const [governorates, setGovernorates] = useState([]);
    const [cities, setCities] = useState([]);
    const [areas, setAreas] = useState([]);

    /* useEffect(() => {
        // provinces, governorates, cities, areas
        GetCitiesArea("provinces", -1).then((res) => {
            // console.log(res.data.server_response);
            setProvinces(res.data.server_response);
        })
    }, []) */

    const getProvences = () => {
        GetCitiesArea("provinces", -1).then((res) => {
            // console.log(res.data.server_response);
            setProvinces(res.data.server_response);
        })
    }

    const updateSubLevel = (type, superId) => {
        GetCitiesArea(type, superId, 1).then((res) => {
            // console.log(res.data.server_response)

            if (type === "governorates") {
                setGovernorates([]);
                setCities([]);
                setAreas([]);
                setGovernorates(res.data.server_response);
            } else if (type === "cities") {
                setCities([]);
                setAreas([]);
                setCities(res.data.server_response);
            } else {
                setAreas([]);
                setAreas(res.data.server_response);
            }
        })
    }

    const handleSearchArea = (str) => {

        if (!!!str) {
            setLogestechsAreas([])
        } else {
            setLoadingAreas(true)
            getLogestechsAreaByName(str).then((res) => {

                console.log(res.data)

                setLogestechsAreas(res.data)
                setLoadingAreas(false)
            })
        }
    }

    return (
        <div data-test="modal-container">
            <span
                data-test="open-modal-button"
                onClick={() => {
                    setShow(true);
                }}
            >
                {children}
            </span>

            <Modal
                data-test="modal"
                show={show}
                onHide={() => { setShow(false); }}
                centered
                animation={true}
                backdrop="static"
                size="lg"
                style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
                <Modal.Header closeButton style={styles.cardHeaderLg}>
                    <Modal.Title data-test="modal-title">{translate("ORDERS.ADD_ADDRESS")}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="mt-5">
                    <Form
                        id="addressForm"
                        validated={validated}
                        noValidate
                        onSubmit={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            const formData = new FormData(event.target);
                            const formDataObj = Object.fromEntries(formData.entries());

                            const form = event.currentTarget;
                            if (form.checkValidity() === true) {
                                setLoading(true);
                                CreateAddressReq(formDataObj).then((res) => {
                                    console.log("create address response : ",res.data);
                                    handleClose();
                                    onSuccess();
                                });
                            }
                            setValidated(true);
                        }}
                    >
                        <FloatingLabel className="mb-3" controlId="formBasicEmail" label={translate("ORDERS.ADDRESS_NAME")}>
                            <Form.Control
                                data-test="placename-input"
                                className="rounded-22 input-inner-shadow"
                                type="text"
                                placeholder="..."
                                name="placename"
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please add place namew-100
                            </Form.Control.Feedback>
                        </FloatingLabel>

                        <FloatingLabel className="mb-3" controlId="userTel" label={translate("ORDERS.ADDRESS_PHONE")}>
                            <Form.Control
                                data-test="phone-input"
                                className="rounded-22 input-inner-shadow"
                                type="tel"
                                placeholder="..."
                                name="phone"
                                pattern="^05[0-9]{8}?$"
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter a valid phone number example 0568000000
                            </Form.Control.Feedback>
                        </FloatingLabel>

                        {false && localStorage.getItem("userId") == 41 && (
                            <div style={{ position: "relative" }}>
                                <Form.Control
                                    data-test="area-search-input"
                                    onChange={(e) => { handleSearchArea(e.target.value); }}
                                    style={{
                                        backgroundColor: "gray",
                                        color: "white",
                                        marginTop: "10px",
                                        marginBottom: "10px",
                                        cursor: "pointer"
                                    }}
                                    autoComplete="off"
                                />
                                {(logestechsAreas.length > 0 || loadingAreas) && (
                                    <div
                                        data-test="area-search-results"
                                        style={{
                                            position: "absolute",
                                            top: "38px",
                                            left: "2px",
                                            right: "2px",
                                            maxHeight: "500px",
                                            overflowY: "scroll",
                                            zIndex: "3",
                                            backgroundColor: "white",
                                            border: "1px solid lightgray",
                                            borderRadius: "0 0 10px 10px"
                                        }}
                                    >
                                        {loadingAreas ? (
                                            <Spinner size="lg" className="" animation="border" variant="dark" />
                                        ) : (
                                            logestechsAreas?.map((area, index) => (
                                                <div key={index} data-test={`area-result-${index}`}>
                                                    {area.name + ", " + area.regionName}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* localStorage.getItem("userId") != 41 && */ (
                            <Container fluid>
                                <Row>
                                    <Col lg={3} className="mb-4">
                                        <Form.Label>{translate("TEMP.PROVINCE")}:</Form.Label>
                                        <Form.Select
                                            data-test="province-select"
                                            style={{ cursor: "pointer" }}
                                            className="shadow"
                                            name="province"
                                            required
                                            aria-label="Default select example"
                                            onClick={() => {
                                                getProvences();
                                            }}
                                            onChange={(e) => {
                                                updateSubLevel("governorates", e.target.value);
                                            }}
                                        >
                                            <option value={""} style={{ color: "lightgray" }}>
                                                Select Province
                                            </option>
                                            {provinces.map((item, index) => (
                                                <option key={index} value={item.id}>
                                                    {item.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Col>
                                    <Col lg={3} className="mb-4">
                                        <Form.Label>{translate("TEMP.GOVERNORATE")}:</Form.Label>
                                        <Form.Select
                                            data-test="governorate-select"
                                            style={{ cursor: "pointer" }}
                                            className="shadow"
                                            name="governorate"
                                            required
                                            aria-label="Default select example"
                                            onChange={(e) => {
                                                updateSubLevel("cities", e.target.value);
                                            }}
                                        >
                                            <option value={""} style={{ color: "lightgray" }}>
                                                Select Governorate
                                            </option>
                                            {governorates.map((item, index) => (
                                                <option key={index} value={item.id}>
                                                    {item.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Col>
                                    <Col lg={3} className="mb-4">
                                        <Form.Label>{translate("TEMP.CITY")}:</Form.Label>
                                        <Form.Select
                                            data-test="city-select"
                                            style={{ cursor: "pointer" }}
                                            className="shadow"
                                            name="city"
                                            required
                                            aria-label="Default select example"
                                            onChange={(e) => {
                                                updateSubLevel("areas", e.target.value);
                                            }}
                                        >
                                            <option value={""} style={{ color: "lightgray" }}>
                                                Select City
                                            </option>
                                            {cities.map((item, index) => (
                                                <option key={index} value={item.id}>
                                                    {item.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Col>
                                    <Col lg={3} className="mb-4">
                                        <Form.Label>{translate("TEMP.AREA")}:</Form.Label>
                                        <Form.Select
                                            data-test="area-select"
                                            style={{ cursor: "pointer" }}
                                            className="shadow"
                                            name="area"
                                            required
                                            aria-label="Default select example"
                                        >
                                            <option value={""} style={{ color: "lightgray" }}>
                                                Select Area
                                            </option>
                                            {areas.map((item, index) => (
                                                <option key={index} value={item.id}>
                                                    {item.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Col>
                                </Row>
                            </Container>
                        )}

                        <FloatingLabel className="mb-3" controlId="userAddress" label={translate("ORDERS.ADDRESS")}>
                            <Form.Control
                                data-test="address-input"
                                className="rounded-22 input-inner-shadow"
                                type="text"
                                placeholder="..."
                                name="address"
                                required
                            />
                        </FloatingLabel>

                        <FloatingLabel className="mb-3" controlId="addressInfo" label={translate("ORDERS.ADDRESS_INFO")}>
                            <Form.Control
                                data-test="address-info-input"
                                className="rounded-22 input-inner-shadow"
                                type="text"
                                placeholder="..."
                                name="addressinfo"
                            />
                        </FloatingLabel>

                        <Form.Check
                            type="switch"
                            id="custom-switch"
                            label={translate("ORDERS.ADDRESS_SHARED")}
                            name="isShared"
                            data-test="address-shared-switch"
                        />

                        <hr className="mt-3 mb-4" />

                        <div style={{ float: "right" }}>
                            <Button variant="outline-primary" type="submit" data-test="submit-button">
                                {loading && <Spinner size="sm" className="me-1" animation="border" variant="light" />}
                                {translate("GENERAL.PROCEED")}
                            </Button>

                            {"  "}
                            <Button variant="danger" onClick={handleClose} data-test="cancel-button">
                                {translate("GENERAL.CANCEL")}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );

}