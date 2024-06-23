import React, { useRef, useState } from "react";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import { sendVerificationCode, loginWithNumber } from "../../APIs/LoginAPIs";
import { updateWebNotificationToken } from "../../APIs/ProfileAPIs";
import { useDispatch } from "react-redux";
import { toastNotification } from "../../Actions/GeneralActions";
import { useHistory } from "react-router";
import { getUserToken } from "../../firebase";
import { refreshPage } from "../../Functions/CommonFunctions";
import "./styles.css";

import { isSupported } from "firebase/messaging";

export default function LoginByPhoneNumber() {
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
    const history = useHistory();

    const [show, setShow] = useState(false);
    const [shadowErrorForMobile, setShowErrorForMobile] = useState(false);
    const [shadowErrorForCode, setShowErrorForCode] = useState(false);
    const [startValidationForMobile, setStartValidationForMobile] = useState(false);
    const [startValidationForCode, setStartValidationForCode] = useState(false);
    const [loadingSend, setLoadingSend] = useState(false);
    const [loadingLogin, setLloadingLogin] = useState(false);
    const [customerId, setCustomerId] = useState("");

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const numberRef = useRef();
    const codeRef = useRef();

    function sendCode() {
        setStartValidationForMobile(true);
        if (isValidNumber(numberRef.current.value)) {
            setShowErrorForMobile(false);
            setLoadingSend(true);

            sendVerificationCode(numberRef.current.value).then((res) => {

                // console.log(res.data);

                if (res.data === "MobileNotFound") {
                    dispatch(toastNotification("Error", "Mobile not found!", "error"));
                    setLoadingSend(false);
                } else if (res.data === "NotUpdated") {
                    dispatch(toastNotification("Error", "Something went wrong!", "error"));
                    setLoadingSend(false);
                } else if (res.data.includes("not togo user")) {
                    dispatch(toastNotification("Error", res.data, "error"));
                    setLoadingSend(false);
                } else {
                    // console.log(res.data.split("-")[1]);
                    setCustomerId(res.data.split("-")[1]);
                    setLoadingSend(false);
                    handleShow();
                }
            })

        } else {
            setShowErrorForMobile(true);
        }
    }

    function isValidNumber(inputtxt) {
        let phoneno = /^\d{10}$/;
        if (inputtxt.match(phoneno)) {
            return true;
        }
        else {
            return false;
        }
    }

    async function requestPermission() {
        console.log('Requesting permission...');
        const hasFirebaseMessagingSupport = await isSupported();
        if (hasFirebaseMessagingSupport) {
            Notification.requestPermission().then((permission) => {
                if (permission === 'granted') {
                    // console.log('Notification permission granted.');
                    
                    tokenFunc();
                } else {
                    // console.log('Notification permission denied.');
                }
            })
        }
    }

    let data;

    async function tokenFunc() {
        data = await getUserToken();
        if (data) {
            console.log("Token is", data);

            updateWebNotificationToken(data).then((res) => {
                // console.log(res.data);
            })
        }
        return data;
    }

    async function handleLogin() {
        setStartValidationForCode(true);
        if (codeRef.current.value.length !== 4) {
            setShowErrorForCode(true);

        } else {
            setShowErrorForCode(false);
            setLloadingLogin(true);

            // console.log("----> " + customerId);

            loginWithNumber(customerId, codeRef.current.value).then(async (res) => {
                // console.log(res.data);
                if (res.data === "Wrong Code!") {
                    dispatch(toastNotification("Error", res.data, "error"));
                    setLloadingLogin(false);
                } else if (res.data === "customer not found!") {
                    dispatch(toastNotification("Error", res.data, "error"));
                    setLloadingLogin(false);
                } else if (res.data === "Not Client Account!") {
                    dispatch(toastNotification("Error", res.data, "error"));
                    handleClose();
                    setLloadingLogin(false);
                } else if (res.data === "Token Update Error!") {
                    dispatch(toastNotification("Error", res.data, "error"));
                    handleClose();
                    setLloadingLogin(false);
                } else if (res.data === "Error Fetching Info!") {
                    dispatch(toastNotification("Error", res.data, "error"));
                    handleClose();
                    setLloadingLogin(false);
                } else {

                    // console.log("login data: " + res.data);

                    localStorage.setItem("fullName", res.data.fullName);
                    localStorage.setItem("userId", res.data.userId);
                    localStorage.setItem("TokenDevice", res.data.tokenDevice);
                    localStorage.setItem("UserType", res.data.userType);
                    localStorage.setItem("transId", res.data.transId);
                    
                    if (res.data.isFoodClient == "1") {
                        localStorage.setItem("IsFoodClient", "true");
                    } else {
                        localStorage.setItem("IsFoodClient", "false");
                    }
                    

                    // console.log("before permissions check");
                    // request notification permission and get FCM token
                    await requestPermission();

                    setLloadingLogin(false);

                    // history.push("/account/main/");
                    refreshPage();
                }
            })
        }
    }

    return (
        <>
            <div className="container-fluid mt-5">
                <div className="row d-flex justify-content-center">
                    <div className="col-6">
                        <Card className='shadow h-100 rounded-22'>
                            <Card.Header style={styles.cardHeaderLg} className="">
                                Sign in By Phone Number
                                <span style={{ float: "right", cursor: "pointer" }} onClick={() => { history.push("/account/signin") }}>
                                    <i className="bi bi-qr-code-scan"></i>
                                </span>
                            </Card.Header>

                            <Card.Body className="mt-5">
                                <Form onSubmit={(event) => {
                                    event.preventDefault();
                                    sendCode();
                                }}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Please enter your phone number (start with 0)</Form.Label>
                                        <Form.Control type="number" placeholder="Phone number..." ref={numberRef} data-test="mobile-number-input" />
                                        {shadowErrorForMobile && startValidationForMobile && <Form.Text className="text-danger" data-test="invalid-number-error-message">
                                            Please enter a valid phone number!
                                        </Form.Text>}
                                    </Form.Group>

                                    <Button type="submit" className="btn-grad" data-test="send-number-btn">
                                        {loadingSend && <Spinner animation="border" size="sm" />}
                                        Send
                                    </Button>
                                    <span className="register" onClick={() => { history.push("/account/createAccount") }}>
                                        Create Account
                                    </span>
                                </Form>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header>
                    Sign In
                </Modal.Header>

                <Modal.Body>
                    <Form onSubmit={(event) => {
                        event.preventDefault();
                        handleLogin();
                    }}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Enter the code</Form.Label>
                            <Form.Control type="number" placeholder="####" ref={codeRef} data-test="OTP-code-input" />
                            {shadowErrorForCode && startValidationForCode && <Form.Text className="text-danger" data-test="invalid-code-message">
                                Enter four-digit Code!
                            </Form.Text>}
                        </Form.Group>

                        <Button type="submit" className="btn-grad" data-test="submit-login">
                            {loadingLogin && <Spinner animation="border" size="sm" />}
                            Login
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}