import React, { useRef, useState } from "react";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Tabs, Tab, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import { useHistory } from "react-router";
import UploadAndEditImage from '../UploadImage/UploadAndEditImage';
import { toastNotification } from "../../Actions/GeneralActions";
import { useDispatch } from "react-redux";
import { sendVerificationCode, registerClientByPhoneNumber, registerTransporterByPhoneNumber, sendVerificationCodeForNewUser } from "../../APIs/LoginAPIs";

export default function CreateAccount() {
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

    const [profileImage, setProfileImage] = useState("null");
    const [imageToUpload, setImageToUpload] = useState("");
    const [loadingSend, setLoadingSend] = useState(false);
    const [loadingRegister, setLloadingRegister] = useState(false);
    const [show, setShow] = useState(false);
    const [shadowErrorForCode, setShowErrorForCode] = useState(false);
    const [startValidationForCode, setStartValidationForCode] = useState(false);
    const [typeUser, setTypeUser] = useState(1);

    const numberRef = useRef();
    const codeRef = useRef();
    const firstNameRef = useRef();
    const lastNameRef = useRef();
    const businessNameRef = useRef();
    const businessLocationRef = useRef();
    const idNumberRef = useRef();
    const emailRef = useRef();
    const businessTypeRef = useRef();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    function sendCode() {
        if (isValidNumber(numberRef.current.value)) {
            if (profileImage == "null") {
                dispatch(toastNotification("Error", "Please upload an image!", "error"));
            } else {
                setLoadingSend(true);

                sendVerificationCodeForNewUser(numberRef.current.value).then((res) => {

                    // console.log(res.data);

                    if (res.data === "message error!" || res.data === "User with this phone number already exists!") {
                        dispatch(toastNotification("Error", res.data, "error"));
                        setLoadingSend(false);
                    } else {
                        // console.log(res.data);
                        setLoadingSend(false);
                        handleShow();
                    }
                })
            }

        } else {
            dispatch(toastNotification("Error", "Non valid mobile number!", "error"));
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

    function register() {

        setStartValidationForCode(true);
        let code = codeRef.current.value;
        if (code.length !== 4) {
            setShowErrorForCode(true);

        } else {
            setShowErrorForCode(false);
            setLloadingRegister(true);

            if (typeUser == 1) {

                let firstName = firstNameRef.current.value;
                let lastName = lastNameRef.current.value;
                let phoneNumber = numberRef.current.value;
                let businessName = businessNameRef.current.value;
                let businessLocation = businessLocationRef.current.value;
                let businessType = businessTypeRef.current.value;
                let email = emailRef.current.value;
                let idNumber = idNumberRef.current.value;

                // firstName, lastName, phoneNumber, email, idNumber, businessName, businessLocation, businessType
                const tempInfoArr = [firstName, lastName, phoneNumber, email, idNumber, businessName, businessLocation, businessType];

                let tempImageName = "";
                let imageCode = imageToUpload;
                let imageName = profileImage.split("/")[profileImage.split("/").length - 1];

                let tempExtension = "";
                tempExtension = (imageCode.split(";", 2)[0]).split("/")[1];
                tempImageName = imageName + "." + tempExtension;

                /* console.log("---------------------------------");
                console.log("tempInfoArr:");
                console.log(tempInfoArr);
                console.log("---------------------------------");
                console.log("tempImageName:");
                console.log(tempImageName);
                console.log("---------------------------------");
                console.log("imageCode:");
                console.log(imageCode); */

                registerClientByPhoneNumber(tempInfoArr, tempImageName, imageCode, code).then((res) => {
                    // console.log(res.data);
                    let response = res.data + "";

                    if (response.includes("error")) {
                        dispatch(toastNotification("Error", response, "error"));
                        setLloadingRegister(false);
                    } else {
                        dispatch(toastNotification("Account Created", "Account created successfully", "success"));

                        setLloadingRegister(false);
                        history.push("/account/loginByPhoneNumber");
                    }
                })
            } else {
                let firstName = firstNameRef.current.value;
                let lastName = lastNameRef.current.value;
                let phoneNumber = numberRef.current.value;
                let businessName = businessNameRef.current.value;
                let email = emailRef.current.value;
                let idNumber = idNumberRef.current.value;

                const tempInfoArr = [firstName, lastName, phoneNumber, email, idNumber, businessName];

                let tempImageName = "";
                let imageCode = imageToUpload;
                let imageName = profileImage.split("/")[profileImage.split("/").length - 1];

                let tempExtension = "";
                tempExtension = (imageCode.split(";", 2)[0]).split("/")[1];
                tempImageName = imageName + "." + tempExtension;

                registerTransporterByPhoneNumber(tempInfoArr, tempImageName, imageCode, code).then((res) => {
                    console.log(res.data);
                    let response = res.data + "";

                    if (response.includes("error")) {
                        dispatch(toastNotification("Error", response, "error"));
                        setLloadingRegister(false);
                    } else {
                        dispatch(toastNotification("Account Created", "Account created successfully", "success"));

                        setLloadingRegister(false);
                        history.push("/account/loginByPhoneNumber");
                    }
                })
            }

        }
    }

    return (
        <>
            <div className="container-fluid mt-5 pb-5">
                <div className="row d-flex justify-content-center">
                    <div className="col-6">
                        <Card className='shadow h-100 rounded-22'>
                            <Card.Header style={styles.cardHeaderLg} className="">
                                Create Account
                                <span style={{ float: "right", cursor: "pointer" }} onClick={() => { history.push("/account/signin") }}>
                                    <i className="bi bi-qr-code-scan"></i>
                                </span>
                            </Card.Header>

                            <Card.Body className="mt-5">

                                <ToggleButtonGroup className="w-100 mb-5" type="radio" name="userType" defaultValue={1} onChange={(e) => { setTypeUser(e) }}>
                                    <ToggleButton variant="outline-primary" id="tbg-radio-1" value={1}>
                                        Client
                                    </ToggleButton>
                                    <ToggleButton variant="outline-primary" id="tbg-radio-2" value={2}>
                                        Transporter
                                    </ToggleButton>
                                </ToggleButtonGroup>

                                <Form onSubmit={(event) => {
                                    event.preventDefault();
                                    sendCode();
                                }}>
                                    <div className="w-100 d-flex justify-content-center mb-5">
                                        <div
                                            className="rounded-circle d-flex light-turquoise-bg wh-45px logo-container"
                                            style={{ width: "200px", height: "200px" }}
                                        >

                                            <img
                                                className="logo"
                                                src={!profileImage.includes("null") ? (profileImage.split("/")[profileImage.split("/").length - 1].includes(".") ? profileImage + "?t=" + Math.random() : profileImage) : "https://monstar-lab.com/global/wp-content/uploads/sites/11/2019/04/male-placeholder-image.jpeg"}

                                                alt="user-profile-pic"
                                            />
                                            <UploadAndEditImage currentImage={profileImage.split("/")[profileImage.split("/").length - 1].includes(".") ? profileImage + "?t=" + Math.random() : profileImage} setImageToUpload={setImageToUpload} setImage={setProfileImage} imageBorderRadius={250} imageHeight={250} imageWidth={250} />
                                        </div>
                                    </div>

                                    <span className="h4" style={{ color: "#34af9c" }}>Personal Information</span><hr className="mb-3" />

                                    <div className="mb-3 d-flex justify-content-between">
                                        <Form.Group style={{ width: "48%" }} controlId="formBasicFirstName">
                                            <Form.Label>First Name</Form.Label>
                                            <Form.Control required type="text" placeholder="First Name..." ref={firstNameRef} />
                                        </Form.Group>

                                        <Form.Group style={{ width: "48%" }} controlId="formBasicLastName">
                                            <Form.Label>Last Name</Form.Label>
                                            <Form.Control required type="text" placeholder="Last Name..." ref={lastNameRef} />
                                        </Form.Group>
                                    </div>

                                    <div className="d-flex justify-content-between">
                                        <Form.Group style={{ width: "48%" }} className="mb-3" controlId="formBasicEmail">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control required type="email" placeholder="Email..." ref={emailRef} />
                                        </Form.Group>

                                        <Form.Group style={{ width: "48%" }} controlId="formBasicPhone">
                                            <Form.Label>Phone Number</Form.Label>
                                            <Form.Control required type="tel" placeholder="05..." ref={numberRef} />
                                        </Form.Group>
                                    </div>

                                    <Form.Group className="mb-3" style={{ width: "48%" }} controlId="formBasicId">
                                        <Form.Label>ID Number</Form.Label>
                                        <Form.Control required type="number" placeholder="ID Number..." ref={idNumberRef} />
                                    </Form.Group>

                                    <span className="h4" style={{ color: "#34af9c" }}>Business Information</span><hr className="mb-3" />

                                    <div className="mb-3 d-flex justify-content-between">
                                        <Form.Group style={{ width: "48%" }} controlId="formBasicBusinessName">
                                            <Form.Label>Business Name</Form.Label>
                                            <Form.Control required type="text" placeholder="Business Name..." ref={businessNameRef} />
                                        </Form.Group>

                                        {typeUser == 1 && <Form.Group style={{ width: "48%" }} controlId="formBasicBusinessLocation">
                                            <Form.Label>Business Location</Form.Label>
                                            <Form.Control required type="text" placeholder="Business Location..." ref={businessLocationRef} />
                                        </Form.Group>}
                                    </div>

                                    {typeUser == 1 && <div className="mb-3 d-flex justify-content-between">
                                        <Form.Group style={{ width: "48%" }} controlId="formBasicBusinessName">
                                            <Form.Label>Business Type</Form.Label>
                                            <Form.Select required aria-label="businessType" ref={businessTypeRef}>
                                                <option value="1">شركة</option>
                                                <option value="2">مؤسسة</option>
                                            </Form.Select>
                                        </Form.Group>

                                        {/* <Form.Group style={{ width: "48%" }} controlId="formBasicBusinessName">
                                            <Form.Label>City</Form.Label>
                                            <Form.Select required aria-label="city">
                                                <option value="1">شركة</option>
                                                <option value="2">مؤسسة</option>
                                            </Form.Select>
                                        </Form.Group> */}
                                    </div>}

                                    <hr className="mb-3" />

                                    <Button /* disabled */ type="submit" className="btn-grad">
                                        {loadingSend && <Spinner animation="border" size="sm" />}
                                        Send
                                    </Button>
                                    <span className="register" onClick={() => { history.push("/account/loginByPhoneNumber") }}>
                                        Already have an account?
                                    </span>
                                </Form>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header>
                    Confirm Registration
                </Modal.Header>

                <Modal.Body>
                    <Form onSubmit={(event) => {
                        event.preventDefault();
                        register();
                    }}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Enter the code</Form.Label>
                            <Form.Control type="number" placeholder="####" ref={codeRef} />
                            {shadowErrorForCode && startValidationForCode && <Form.Text className="text-danger">
                                Enter four-digit Code!
                            </Form.Text>}
                        </Form.Group>

                        <Button type="submit" className="btn-grad">
                            {loadingRegister && <Spinner animation="border" size="sm" />}
                            Register
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}