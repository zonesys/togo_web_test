import React, { useEffect, useRef, useState } from "react";
import { Button, Form, Modal, Spinner, Table } from "react-bootstrap";
import { AddTransporterToNetwork, getAllTransportersToAdd } from "../APIs/OrdersAPIs";
import { useDispatch } from "react-redux";
import { toastNotification } from "../Actions/GeneralActions";
import { imgBaseUrl } from "../Constants/GeneralCont";

import translate from "../i18n/translate";

export default function AddTransporterToNetworkDialog({ onSuccess }) {

    let dispatch = useDispatch();

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
            fontSize: "1rem",
            height: "3rem"
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

    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);

    const [validated, setValidated] = useState(false);

    const [beginValidation, setBeginValidation] = useState(false);
    const [phoneCheck, setPhoneCheck] = useState(false);

    const phonenumRef = useRef();
    const handleClose = () => {
        setShow(false);
    }

    const [transportersToAdd, setTransportersToAdd] = useState([]);

    useEffect(() => {
        getAllTransportersToAdd().then(res => {
            console.log(res.data.server_response);
            setTransportersToAdd(res.data.server_response);
        });
    }, [])

    return (
        <>
            <Button className="border mt-3 me-5 rounded-22 btn-grad" onClick={() => {
                setShow(true);
            }}>
                {translate("TEMP.ADD_TRANSPORTER")}
                <i className={"ms-2 bi bi-plus-circle"}></i>
            </Button>

            <Modal show={show} size="lg" centered onHide={handleClose}>
                <Modal.Header style={styles.cardHeaderLg}>
                    {translate("TEMP.ADD_TRANSPORTER")}
                </Modal.Header>

                <Modal.Body className="mt-4">

                    <Table responsive hover style={{ fontSize: "1rem", marginRight: '20px', marginLeft: "20px" }}>
                        <thead>
                            <tr>
                                <th scope="col"></th>
                                <th scope="col">{translate("TEMP.NAME")}</th>
                                <th scope="col">{translate("TEMP.PHONE")}</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>

                        <tbody>
                            {transportersToAdd?.map((member, index) => {
                                return (
                                    <ClientNetweokMemberCar
                                        key={index}
                                        handleClose={handleClose}
                                        member={member}
                                        onSuccess={onSuccess}
                                    />
                                )
                            })}
                        </tbody>
                    </Table>

                    {/* <Form id="orderForm" validated={validated} noValidate onSubmit={(event) => {
                        event.preventDefault();
                        event.stopPropagation();

                        const formData = new FormData(event.target), formDataObj = Object.fromEntries(formData.entries());

                        const form = event.currentTarget;
                        if (form.checkValidity() === true) {
                            // console.log(formDataObj);

                            setLoading(true);

                            AddTransporterToNetwork(formDataObj.phone).then((res) => {

                                if (res.data == "Inserted") {

                                    dispatch(toastNotification("Invitation sent", "Invitation sent successfully!", "info"));

                                    handleClose();

                                    onSuccess();
                                } else {
                                    dispatch(toastNotification("Error", res.data, "error"));
                                }
                                
                            })

                            setLoading(false);
                        }
                        setValidated(true);
                    }}>
                        <p>{translate("TEMP.PLZ_ENTER_MOBILE")}</p>
                        <Form.Control
                            required
                            readOnly={false}
                            className="input-inner-sha"
                            placeholder="+972500000000"
                            type="tel"
                            name="phone"
                            pattern="^[+]9725[0-9]{8}?$"
                        />
                        {beginValidation && !phoneCheck && <span style={{ color: "red" }}>required!</span>}

                        <hr />

                        <div className="mt-3 d-flex justify-content-center">
                            <Button variant="outline-secondary" className="w-50" onClick={handleClose}>
                                {translate("GENERAL.CLOSE")}
                            </Button>
                            <Button disable={loading ? true : false} type="submit" variant="primary" className="grad-button ms-3 w-50">
                                {translate("TEMP.SEND_INVITATION")}
                                {loading && <Spinner animation="border" size="sm" />}
                            </Button>
                        </div>
                    </Form> */}
                </Modal.Body>
            </Modal>
        </>
    )
}

function ClientNetweokMemberCar({ member, handleClose, onSuccess }) {

    const [loading, setLoading] = useState(false);

    let dispatch = useDispatch();

    const sendInvitationHandler = (transPhone) => {
        setLoading(true);

        AddTransporterToNetwork(transPhone).then((res) => {

            if (res.data == "Inserted") {

                dispatch(toastNotification("Invitation sent", "Invitation sent successfully!", "info"));

                handleClose();

                onSuccess();
            } else {
                dispatch(toastNotification("Error", res.data, "error"));
            }

            setLoading(false);
        })
    }

    return (
        <tr>
            <td>
                <div // image
                    style={{
                        background: "linear-gradient(90deg, #26a69a, #69d4a5)",
                        width: "70px",
                        height: "70px",
                        borderRadius: "45%",
                    }}

                    className="align-self-center d-flex justify-content-center"
                >
                    <img
                        style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "cover"
                        }}
                        className="rounded-circle align-self-center"
                        src={`${imgBaseUrl}${member.PersonalImgPath}`}
                        alt={member.TransPhone}
                    />
                </div>
            </td>
            <td>{member?.AccountName}</td>
            <td>{member?.TransPhone}</td>
            <td>
                <Button disable={loading ? true : false} onClick={() => sendInvitationHandler(member?.TransPhone)} variant="primary" className="grad-button ms-3 w-50">
                    {translate("TEMP.SEND_INVITATION")}
                    {loading && <Spinner animation="border" size="sm" />}
                </Button>
            </td>

        </tr>
    )
}