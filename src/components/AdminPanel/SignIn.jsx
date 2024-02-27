import React, { useEffect, useState, useRef } from "react";
import { Button, Form, FormControl, InputGroup, Spinner, Modal } from "react-bootstrap";
import { ReactComponent as CarIcon } from "../../assets/car.svg";
import { ReactComponent as SteeringIcon } from "../../assets/steering.svg";
import { ReactComponent as WheelIcon } from "../../assets/wheel.svg";
import logo from "../../assets/logo.png";
import { animate, motion, useAnimation, useMotionValue } from 'framer-motion';
import { ReactComponent as EyeIcon } from "../../assets/eye.svg";
import {
    tempRegisterAdmin,
    adminCheckToLoginLogin,
    adminLogin,
    updateAdminWebNotificationToken,
    sendAdminLoginVerificationCode
} from "../../APIs/AdminPanelApis"; // tempRegisterAdmin to manually register an admin
import { getUserToken } from "../../firebase";
import { useHistory } from "react-router";
import { useDispatch } from "react-redux";
import { toastNotification } from "../../Actions/GeneralActions";

export default function SignIn() {
    let dispatch = useDispatch();
    
    const history = useHistory();

    const x = useMotionValue(0)
    const [type, setType] = useState("password");
    useEffect(() => {
        const controls = animate(x, window.innerWidth - 220, {
            type: "spring",
            stiffness: 10,
            repeat: Infinity,
            repeatType: "reverse",
            delay: "2",
            onComplete: v => {


            }
        });

        return controls.stop;
    }, []);
    const controls = useAnimation()

    useEffect(() => {
        controls.start(i => ({
            right: [100, 400, 100],
            top: [0, window.innerHeight - 250, 0],
            rotate: 360,
            scale: 0.5,
            transition: { /* delay: i * 0.3, */ /* repeat: Infinity, */ duration: 4, repeatDelay: 2 },
        }));

    }, []);

    const controls2 = useAnimation()

    useEffect(() => {
        controls2.start(i => ({
            scale: 0.5,
            rotate: 45,
        }));

    }, []);

    // const xx = useMotionValue(10);

    // const y = (xx, (value) => {
    //     console.log(value);
    //     return value * 2;
    // });

    const [loginInfo, setLoginInfo] = useState({});
    const [showCodeModal, setShowCodeModal] = useState(false);
    const [loadingCode, setLoadingCode] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [showErrMsg, setShowErrMsg] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    const codeRef = useRef();

    const showValidationMessage = (msg) => {
        setShowErrMsg(true);
        setErrMsg(msg);
    }

    const handleShowCodeModal = () => {
        setShowCodeModal(true);
    }

    const handleHideCodeModal = () => {
        setShowCodeModal(false);
    }

    const sendCode = (adminId) => {
        sendAdminLoginVerificationCode(adminId).then(res => {
            // console.log(res.data)

            handleShowCodeModal();
        })
    }

    const handleLogin = () => {
        // console.log(codeRef.current.value)
        if (codeRef.current.value) {
            setLoadingCode(true);
            adminLogin(loginInfo.id, loginInfo.Token, codeRef.current.value).then(res => {

                // check res.data
                if (res.data == " - logged in successfully - ") {
                    localStorage.setItem("AdminFirstName", loginInfo.FirstName);
                    localStorage.setItem("AdminLastName", loginInfo.LastName);
                    localStorage.setItem("AdminEmail", loginInfo.Email);
                    localStorage.setItem("AdminMobileNumber", loginInfo.MobileNumber);
                    localStorage.setItem("AdminToken", loginInfo.Token);
                    localStorage.setItem("Adminid", loginInfo.id);
    
                    // request notification permission and get FCM token
                    requestPermission();
    
                    // setShowErrMsg(false);
    
                    history.push("/adminapp/adminpanel/");
    
                    setLoadingCode(false)
                } else {
                    dispatch(toastNotification("Error!", res.data, "error"));
                    setLoadingCode(false)
                }
            })
        }
    }

    // request browser notification permission to use firebase push notification system (FCM)
    function requestPermission() {
        console.log('Requesting permission...');
        Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
                console.log('Notification permission granted.');

                // when permission is granted get FCM notification token from firebase
                tokenFunc();
            } else {
                console.log('Notification permission denied.');
            }
        })
    }

    let data;

    // get FCM registration token
    async function tokenFunc() {
        data = await getUserToken();
        if (data) {
            console.log("Token is", data);

            // update web notification token to the new FCM token for this user
            updateAdminWebNotificationToken(data).then((res) => {
                console.log(res.data);
            })
        }
        return data;
    }

    return (
        <div className="align-items-center d-flex togo-bg justify-content-center w-100" style={{ height: "93.9%" }}>
            <div className="sign-in bg-white rounded-22 shadow p-4">
                <img src={logo} alt="logo" />
                <Form onSubmit={(event) => {
                    event.preventDefault();
                    const formData = new FormData(event.target);
                    const userInput = Object.fromEntries(formData.entries());

                    if (userInput.username && userInput.password) {

                        setLoadingSubmit(true)

                        adminCheckToLoginLogin(userInput.username, userInput.password).then((res) => {

                            if (typeof res.data === "object" && JSON.stringify(res.data) !== '{}') {

                                /* localStorage.setItem("AdminFirstName", res.data.FirstName);
                                localStorage.setItem("AdminLastName", res.data.LastName);
                                localStorage.setItem("AdminEmail", res.data.Email);
                                localStorage.setItem("AdminMobileNumber", res.data.MobileNumber);
                                localStorage.setItem("AdminToken", res.data.Token);
                                localStorage.setItem("Adminid", res.data.id);

                                // request notification permission and get FCM token
                                requestPermission();

                                setShowErrMsg(false);

                                history.push("/adminapp/adminpanel/"); */

                                /////////////////////////////////////// login with verifiaction code:

                                // 1- set login info
                                setLoginInfo(res.data);
                                // 2- send code and open dialog to enter the code
                                sendCode(res.data.id);

                            } else {
                                showValidationMessage(res.data);
                            }

                            setLoadingSubmit(false);
                        })

                    }
                }}>
                    <div className="login-lbl">
                        <p>Login</p>
                        <hr />
                    </div>

                    <Form.Group controlId="togoUsername" className="">

                        <InputGroup className="mb-3">
                            <FormControl
                                type="text"
                                className=""
                                placeholder="Username"
                                name="username"
                                required
                            />
                        </InputGroup>
                    </Form.Group>

                    <Form.Group controlId="togoPassword" className="position-relative">

                        <InputGroup className="mb-2">
                            <FormControl
                                type={type}
                                className=""
                                placeholder="Password"
                                name="password"
                                required
                            />

                        </InputGroup>
                        <EyeIcon className="eye-icon" onClick={() => {
                            setType(type === "password" ? "text" : "password");
                        }} />
                    </Form.Group>
                    <Button
                        variant=""
                        type="submit"
                        className="d-block togo-button"
                        disabled={loadingSubmit}
                    >
                        {loadingSubmit && <Spinner animation="border" size="sm" />}
                        Sign In
                    </Button>
                    {showErrMsg && <span className="d-block" style={{ color: "red", textAlign: "center" }}>{errMsg}</span>}
                    {/* <Button onClick={() => { tempRegisterAdmin().then((res) => { console.log(res.data) }) }}> register </Button> */}
                </Form>
            </div>

            <Modal show={showCodeModal} onHide={handleHideCodeModal}>
                <Modal.Header closeButton /* style={styles.cardHeaderSm} */>
                    <Modal.Title>Verification Code</Modal.Title>
                </Modal.Header>
                <Modal.Body>Enter verification code sent to your number</Modal.Body>
                <Form.Group controlId="togoUsername" className="">

                    <InputGroup className="mb-3 px-3">
                        <FormControl
                            type="number"
                            placeholder="####"
                            ref={codeRef}
                        />
                    </InputGroup>
                </Form.Group>
                <Modal.Footer>
                    <Button variant="secondary" disabled={loadingCode ? true : false} onClick={handleHideCodeModal}>
                        Cancel
                    </Button>
                    <Button variant="danger" disabled={loadingCode ? true : false} onClick={() => { handleLogin() }}>
                        {loadingCode && <Spinner animation="border" size="lg" />}Login
                    </Button>
                </Modal.Footer>
            </Modal>

            <motion.div
                style={{
                    position: "absolute",
                    animationName: "example",
                    animationDuration: "3s",
                    animationFillMode: "forwards"
                }}
                transition={{ duration: 2 }}
                //animate="example"
                animate={{
                    //left: [50, 30, 50],
                    //top: [50, 80, 100],
                    scale: 0.5,
                    rotate: 45,
                }}
            //initial="a"
            // variants={{
            //     a: {left: "10%", top: "50%", rotate: 0, scale: 1},
            //     b: {left: "-10%", top: "40%", rotate: 20, scale: 0.7},
            //     c: {left: "10%", top: "20%", rotate: 45, scale: 0.5},
            // }}
            >
                <CarIcon className="svg-bg" />
            </motion.div>
            <motion.div
                animate={controls}
                style={{
                    position: "absolute"
                }}
                initial={{
                    scale: 0.5
                }}
            >
                <SteeringIcon className="svg-bg svg-steering" />
            </motion.div>
            <motion.div
                style={{ left: x, position: "absolute", bottom: 40 }}
                animate={{
                    rotate: 360
                }}
                transition={{ duration: 2, repeat: Infinity }}
                initial={{ rotate: 0 }}
            >
                <WheelIcon className="svg-bg svg-wheel" />
            </motion.div>
        </div>
    )
}