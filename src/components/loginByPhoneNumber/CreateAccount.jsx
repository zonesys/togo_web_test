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
import { sendVerificationCode, registerClientByPhoneNumber, registerTransporterByPhoneNumber, sendVerificationCodeForNewUser, LoginUser, loginWithNumber } from "../../APIs/LoginAPIs";
import { refreshPage } from "../../Functions/CommonFunctions";

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
                        loginWithNumber(res.data.customerId, code).then((res) => {
                            localStorage.setItem("fullName", res.data.fullName);
                            localStorage.setItem("userId", res.data.userId);
                            localStorage.setItem("TokenDevice", res.data.tokenDevice);
                            localStorage.setItem("UserType", res.data.userType);
                            setTimeout(() => {
                                dispatch(toastNotification("Account Created", "Account created successfully", "success"));
                
                                setLloadingRegister(false);
                                history.push("/account/loginByPhoneNumber");
                            }, 1000)
                        })
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
                        <Card className='shadow h-100 rounded-22' data-test="signup-card">
                            <Card.Header style={styles.cardHeaderLg} className="" data-test="card-header">
                                Create Account
                                <span style={{ float: "right", cursor: "pointer" }} onClick={() => { history.push("/account/signin") }} data-test="signin-link">
                                    <i className="bi bi-qr-code-scan"></i>
                                </span>
                            </Card.Header>
    
                            <Card.Body className="mt-5" data-test="card-body">
                                <ToggleButtonGroup className="w-100 mb-5" type="radio" name="userType" defaultValue={1} onChange={(e) => { setTypeUser(e) }} data-test="user-type-group">
                                    <ToggleButton variant="outline-primary" id="tbg-radio-1" value={1} data-test="user-type-client">
                                        Client
                                    </ToggleButton>
                                    <ToggleButton variant="outline-primary" id="tbg-radio-2" value={2} data-test="user-type-transporter">
                                        Transporter
                                    </ToggleButton>
                                </ToggleButtonGroup>
    
                                <Form onSubmit={(event) => {
                                    event.preventDefault();
                                    sendCode();
                                }} data-test="signup-form">
                                    <div className="w-100 d-flex justify-content-center mb-5" data-test="profile-picture-container">
                                        <div className="rounded-circle d-flex light-turquoise-bg wh-45px logo-container" style={{ width: "200px", height: "200px" }} data-test="profile-picture-wrapper">
                                            <img
                                                className="logo"
                                                src={!profileImage.includes("null") ? (profileImage.split("/")[profileImage.split("/").length - 1].includes(".") ? profileImage + "?t=" + Math.random() : profileImage) : "https://monstar-lab.com/global/wp-content/uploads/sites/11/2019/04/male-placeholder-image.jpeg"}
                                                alt="user-profile-pic"
                                                data-test="profile-picture"
                                            />
                                            <UploadAndEditImage 
                                                currentImage={profileImage.split("/")[profileImage.split("/").length - 1].includes(".") ? profileImage + "?t=" + Math.random() : profileImage} 
                                                setImageToUpload={setImageToUpload} 
                                                setImage={setProfileImage} 
                                                imageBorderRadius={250} 
                                                imageHeight={250} 
                                                imageWidth={250} 
                                                data-test="upload-edit-image"
                                            />
                                        </div>
                                    </div>
    
                                    <span className="h4" style={{ color: "#34af9c" }} data-test="personal-info-title">Personal Information</span>
                                    <hr className="mb-3" />
    
                                    <div className="mb-3 d-flex justify-content-between" data-test="name-fields">
                                        <Form.Group style={{ width: "48%" }} controlId="formBasicFirstName" data-test="first-name-group">
                                            <Form.Label>First Name</Form.Label>
                                            <Form.Control required type="text" placeholder="First Name..." ref={firstNameRef} data-test="first-name-input" />
                                        </Form.Group>
    
                                        <Form.Group style={{ width: "48%" }} controlId="formBasicLastName" data-test="last-name-group">
                                            <Form.Label>Last Name</Form.Label>
                                            <Form.Control required type="text" placeholder="Last Name..." ref={lastNameRef} data-test="last-name-input" />
                                        </Form.Group>
                                    </div>
    
                                    <div className="d-flex justify-content-between" data-test="contact-fields">
                                        <Form.Group style={{ width: "48%" }} className="mb-3" controlId="formBasicEmail" data-test="email-group">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control required type="email" placeholder="Email..." ref={emailRef} data-test="email-input" />
                                        </Form.Group>
    
                                        <Form.Group style={{ width: "48%" }} controlId="formBasicPhone" data-test="phone-number-group">
                                            <Form.Label>Phone Number</Form.Label>
                                            <Form.Control required type="tel" placeholder="05..." ref={numberRef} data-test="phone-number-input" />
                                        </Form.Group>
                                    </div>
    
                                    <Form.Group className="mb-3" style={{ width: "48%" }} controlId="formBasicId" data-test="id-number-group">
                                        <Form.Label>ID Number</Form.Label>
                                        <Form.Control required type="number" placeholder="ID Number..." ref={idNumberRef} data-test="id-number-input" />
                                    </Form.Group>
    
                                    <span className="h4" style={{ color: "#34af9c" }} data-test="business-info-title">Business Information</span>
                                    <hr className="mb-3" />
    
                                    <div className="mb-3 d-flex justify-content-between" data-test="business-info-fields">
                                        <Form.Group style={{ width: "48%" }} controlId="formBasicBusinessName" data-test="business-name-group">
                                            <Form.Label>Business Name</Form.Label>
                                            <Form.Control required type="text" placeholder="Business Name..." ref={businessNameRef} data-test="business-name-input" />
                                        </Form.Group>
    
                                        {typeUser === 1 && <Form.Group style={{ width: "48%" }} controlId="formBasicBusinessLocation" data-test="business-location-group">
                                            <Form.Label>Business Location</Form.Label>
                                            <Form.Control required type="text" placeholder="Business Location..." ref={businessLocationRef} data-test="business-location-input" />
                                        </Form.Group>}
                                    </div>
    
                                    {typeUser === 1 && <div className="mb-3 d-flex justify-content-between" data-test="business-type-field">
                                        <Form.Group style={{ width: "48%" }} controlId="formBasicBusinessType" data-test="business-type-group">
                                            <Form.Label>Business Type</Form.Label>
                                            <Form.Select required aria-label="businessType" ref={businessTypeRef} data-test="business-type-select">
                                                <option value="1">شركة</option>
                                                <option value="2">مؤسسة</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </div>}
    
                                    <hr className="mb-3" />
    
                                    <Button type="submit" className="btn-grad" data-test="submit-button">
                                        {loadingSend && <Spinner animation="border" size="sm" />}
                                        Send
                                    </Button>
                                    <span className="register" onClick={() => { history.push("/account/loginByPhoneNumber") }} data-test="already-have-account">
                                        Already have an account?
                                    </span>
                                </Form>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </div>
            <Modal show={show} onHide={handleClose} data-test="confirmation-modal">
                <Modal.Header data-test="modal-header">
                    Confirm Registration
                </Modal.Header>
    
                <Modal.Body data-test="modal-body">
                    <Form onSubmit={(event) => {
                        event.preventDefault();
                        register();
                    }} data-test="confirmation-form">
                        <Form.Group className="mb-3" controlId="formBasicEmail" data-test="confirmation-code-group">
                            <Form.Label>Enter the code</Form.Label>
                            <Form.Control type="number" placeholder="####" ref={codeRef} data-test="confirmation-code-input" />
                            {shadowErrorForCode && startValidationForCode && <Form.Text className="text-danger" data-test="confirmation-code-error">
                                Enter four-digit Code!
                            </Form.Text>}
                        </Form.Group>
    
                        <Button type="submit" className="btn-grad" data-test="confirm-registration-button">
                            {loadingRegister && <Spinner animation="border" size="sm" />}
                            Register
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}    