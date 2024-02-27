import React, { useEffect, useRef, useState } from "react";
import './styles.css';
import { Container, Row, Col, Card, Table, Button, Form, Tab, Tabs, Modal, Spinner, Badge } from 'react-bootstrap';
import {
    GetClientPersonalInfo,
    GetClientBusinessInfo,
    updateClientPersonalInfo,
    updateClientBusinessInfo,
    blockUser,
    getClientTotalOrdersNum,
    getClientNetworkForAdmin,
    getClientPriceList,
    updateClientDeliveryCostList,
    updateClientAutoOfferForAdmin,
    getAllTransportersToAddForAdmin,
    AddTransporterToClientNetworkFoAdmin,
    getUserTotalTempBalance,
    lendMoney,
    collectMoney,
    getTempTransactions,
    sendLoanVerifyCodeForAdmin
} from "../../../APIs/AdminPanelApis";
import { useDispatch } from "react-redux";
import { toastNotification } from "../../../Actions/GeneralActions";
import UploadAndEditImage from '../../UploadImage/UploadAndEditImage';
import { BiBlock } from 'react-icons/bi';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { imgBaseUrl } from "../../../Constants/GeneralCont";
import { BsCheckLg } from "react-icons/bs";

export default function ClientPersonalInfoDisplay({ id }) {

    let dispatch = useDispatch();

    const [isBlocked, setIsBlocked] = useState(false);

    const [profileImage, setProfileImage] = useState("");
    const [originalProfileImage, setOriginalProfileImage] = useState("");
    const [personalImageToUpload, setPersonalImageToUpload] = useState("");

    const [updatePersonalButtonLoading, setUpdatePersonalButtonLoading] = useState(false);
    const [updateBusinessButtonLoading, setUpdateBusinessButtonLoading] = useState(false);

    const [personalInfo, setPersonalInfo] = useState();
    const [businessInfo, setBusinessInfo] = useState();
    const [viewImg, setViewImg] = useState(false);
    const [tempImgPath, setTempImgPath] = useState("");
    const [refreshPersonalInfo, setRefreshPersonalInfo] = useState(false);

    const [clinetTotalOrdersNum, setClinetTotalOrdersNum] = useState(0);

    const [networkMembers, setNetWorkMembers] = useState([]);
    const [deliveryPriceList, setDeliveryPriceList] = useState([]);

    const [tempBalance, setTempBalance] = useState(0);
    const [tempLoading, setTempLoading] = useState(false);

    const [openTempBalanceModal, setOpenTempBalanceModal] = useState(false);
    const [openVerifiModal, setOpenVerifiModal] = useState(false);
    const [loanActionType, setLoanActionType] = useState("");

    const [showTempAmountError, setShowTempAmountError] = useState(false);
    const [showVerifiCodeError, setShowVerifiCodeError] = useState(false);

    const firstNameRef = useRef();
    const lastNameRef = useRef();
    const emailRef = useRef();
    const idNumberRef = useRef();
    const commissionRef = useRef();

    const businessNameRef = useRef();
    const nusinessLocationRef = useRef();

    const tempAmountRef = useRef();
    const verifyCodeRef = useRef();

    const wwRef = useRef();
    const wjRef = useRef();
    const wdRef = useRef();
    const waRef = useRef();
    const jwRef = useRef();
    const jjRef = useRef();
    const jdRef = useRef();
    const jaRef = useRef();
    const dwRef = useRef();
    const djRef = useRef();
    const ddRef = useRef();
    const daRef = useRef();

    const [refresh, setRefresh] = useState(false);

    const [tempAccountTransactions, setTempAccountTransactions] = useState([]);

    useEffect(() => {
        getClientTotalOrdersNum(id).then((res) => {
            setClinetTotalOrdersNum(res.data.ordersNum);
        })
    }, [])

    useEffect(() => {
        GetClientBusinessInfo(id).then((res) => {
            setBusinessInfo(res.data.server_response)
        })
    }, [refresh])

    useEffect(() => {
        getClientNetworkForAdmin(id).then((res) => {
            // console.log(res.data);
            setNetWorkMembers(res.data.membersData)
        })
    }, [refresh])

    useEffect(() => {
        getClientPriceList(id).then((res) => {
            // console.log(res.data);
            setDeliveryPriceList(res.data.priceList)
        })
    }, [refresh])

    useEffect(() => {
        GetClientPersonalInfo(id).then((res) => {
            console.log(res.data)
            setIsBlocked(res.data.server_response.IsBlocked == 1 ? true : false);
            setOriginalProfileImage(res.data.server_response.img);
            setProfileImage(imgBaseUrl + res.data.server_response.img);
            setPersonalInfo(res.data.server_response);
        })
    }, [refreshPersonalInfo, refresh])

    function formatAmount(number) {
        return !!number ? parseFloat(number).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "0.00"
      }

    useEffect(() => {
        getUserTotalTempBalance(id).then((res) => {
            // console.log(res.data);
            setTempBalance(formatAmount(res.data))
        })
    }, [refresh])

    useEffect(() => {
        getTempTransactions(id).then(res => {
            setTempAccountTransactions(res.data.server_response);
            // console.log(res.data);
        })
    }, [refresh])

    const handleClose = () => {
        setViewImg(false);
    }

    function updatePersonalInfo() {

        // setUpdatePersonalButtonLoading(true);

        let firstName = "";
        let lastName = "";
        let email = "";
        let idNumber = "";
        let commission = "";

        /* console.log(!!firstNameRef.current.attributes.placeholder?.value);
        return; */

        !!!firstNameRef.current.value ? (!!firstNameRef.current.attributes.placeholder?.value ? firstName = firstNameRef.current.attributes.placeholder.value : firstName = "") : firstName = firstNameRef.current.value;
        !!!lastNameRef.current.value ? (!!lastNameRef.current.attributes.placeholder?.value ? lastName = lastNameRef.current.attributes.placeholder.value : lastName = "") : lastName = lastNameRef.current.value;
        !!!emailRef.current.value ? (!! emailRef.current.attributes.placeholder?.value ? email = emailRef.current.attributes.placeholder.value : email = "") : email = emailRef.current.value;
        !!!idNumberRef.current.value ? (!!idNumberRef.current.attributes.placeholder?.value ? idNumber = idNumberRef.current.attributes.placeholder.value : idNumber = "") : idNumber = idNumberRef.current.value;
        !!!commissionRef.current.value ? (!!commissionRef.current.attributes.placeholder?.value ? commission = commissionRef.current.attributes.placeholder.value : commission = "1") : commission = commissionRef.current.value;

        /* firstNameRef.current.value == "" ? firstName = firstNameRef.current.attributes.placeholder.value : firstName = firstNameRef.current.value;
        lastNameRef.current.value == "" ? lastName = lastNameRef.current.attributes.placeholder.value : lastName = lastNameRef.current.value;
        emailRef.current.value == "" ? email = emailRef.current.attributes.placeholder.value : email = emailRef.current.value;
        idNumberRef.current.value == "" ? idNumber = idNumberRef.current.attributes.placeholder.value : idNumber = idNumberRef.current.value;
        commissionRef.current.value == "" ? commission = commissionRef.current.attributes.placeholder.value : commission = commissionRef.current.value; */

        const tempArr = [id, firstName, lastName, email, idNumber, commission];

        /* 
            personal image update
        */

        let tempPersonalImageName = ""; // image name (including extension)
        let isNewPersonalImage = false; // true if there is no previous image for this client

        let personalImageCode = personalImageToUpload; // new-pesronal-image code to be uploaded as image file data
        let personalImageName = profileImage.split("/")[profileImage.split("/").length - 1]; // new-personal-image file name
        let originalProfilePath = originalProfileImage; // original presonal-image path (if existed)

        // check if there is an originial image path in the database
        if (originalProfilePath == "" || originalProfilePath == null) {
            isNewPersonalImage = true;
            let tempExtension = "";
            tempExtension = (personalImageCode.split(";", 2)[0]).split("/")[1];
            tempPersonalImageName = "img/PersonalImg/" + personalImageName + "." + tempExtension;
        } else {
            isNewPersonalImage = false;
            tempPersonalImageName = originalProfilePath;
        }

        let isPersonalImageUpdated = false; // true if there is a new image uploaded 
        // let TimeToRefresh = 0;

        // check if there is a new image edited/uploaded
        if (personalImageToUpload === "") {
            // TimeToRefresh = 1000;
            isPersonalImageUpdated = false;
        } else {
            // TimeToRefresh = 10000;
            isPersonalImageUpdated = true;
        }

        updateClientPersonalInfo(
            tempArr,
            personalImageCode,
            tempPersonalImageName,
            isPersonalImageUpdated,
            isNewPersonalImage
        ).then((res) => {
            setRefreshPersonalInfo(!refreshPersonalInfo);
            setUpdatePersonalButtonLoading(false);
            setPersonalImageToUpload("");

            if (res.data.includes("error") || res.data == "TokenError") {
                dispatch(toastNotification("Error!", res.data, "warning"));
            } else {
                dispatch(toastNotification("Updated!", res.data, "success"));
            }
            // }, TimeToRefresh);
        })
    }

    function updateBusinessInfo() {

        setUpdateBusinessButtonLoading(true);

        let businessName = "";
        let businessLocation = "";

        businessNameRef.current.value == "" ? businessName = businessNameRef.current.attributes.placeholder.value : businessName = businessNameRef.current.value;
        nusinessLocationRef.current.value == "" ? businessLocation = nusinessLocationRef.current.attributes.placeholder.value : businessLocation = nusinessLocationRef.current.value;

        const tempArr = [id, businessName, businessLocation];

        updateClientBusinessInfo(tempArr).then((res) => {
            setUpdateBusinessButtonLoading(false);

            if (res.data.includes("error") || res.data == "TokenError") {
                dispatch(toastNotification("Error!", res.data, "warning"));
            } else {
                dispatch(toastNotification("Updated!", res.data, "success"));
            }
        })
    }

    const fileInput = useRef();
    const selectFile = () => {
        fileInput.current.click();
    }

    function handleBlockUser() {
        blockUser(id, !isBlocked).then((res) => {

            if (res.data.includes("error") || res.data == "TokenError") {
                dispatch(toastNotification("Error!", res.data, "warning"));
            } else {
                dispatch(toastNotification("Updated!", res.data, "success"));
                setIsBlocked(!isBlocked);
            }
        })
    }

    //////////////////////////////////////////////////////

    const confirmHandler = (cl) => {
        const amount = tempAmountRef.current.value;

        if (amount <= 0) {
            setShowTempAmountError(true);
        } else {
            setShowTempAmountError(false);

            // send verification code to admin

            setTempLoading(true);

            sendLoanVerifyCodeForAdmin(businessInfo?.BusinessName, amount, cl).then(res => {
                if (res.data.includes("error") || res.data == "TokenError") {
                    dispatch(toastNotification("Error!", res.data, "warning"));
                } else {
                    dispatch(toastNotification("Updated!", res.data, "success"));

                    setOpenVerifiModal(true)
                    setLoanActionType(cl);
                }

                setTempLoading(false);
            });
        }
    }

    const confirmActionHandler = () => {
        const code = verifyCodeRef.current.value;

        if (code) {

            if (loanActionType == "collect") {
                collectHandler(code);
            } else if (loanActionType == "lend") {
                lendHandler(code);
            } else {
                alert("error loanActionType");
            }

            // setOpenVerifiModal(false)
        } else {
            setShowVerifiCodeError(true);
        }
    }

    const lendHandler = (code) => {

        const userId = id;
        const amount = tempAmountRef.current.value;

        /* if (amount <= 0) {
            setShowTempAmountError(true);
        } else {
            setShowTempAmountError(false); */

        setTempLoading(true);

        lendMoney(userId, amount, code).then(res => {
            // console.log(res.data);

            if (res.data.includes("error") || res.data == "TokenError") {
                dispatch(toastNotification("Error!", res.data, "warning"));
            } else {
                dispatch(toastNotification("Done!", res.data, "success"));
                setOpenVerifiModal(false);
                setRefresh(!refresh);
            }

            setTempLoading(false);
        })
        // }
    }

    const collectHandler = (code) => {

        const userId = id;
        const amount = tempAmountRef.current.value;

        /* if (amount <= 0) {
            setShowTempAmountError(true);
        } else {
            setShowTempAmountError(false); */

        setTempLoading(true);
        collectMoney(userId, amount, code).then(res => {
            // console.log(res.data);

            if (res.data.includes("error") || res.data == "TokenError") {
                dispatch(toastNotification("Error!", res.data, "warning"));
            } else {
                dispatch(toastNotification("Done!", res.data, "success"));
                setOpenVerifiModal(false);
                setRefresh(!refresh);
            }

            setTempLoading(false);
        })
        // }
    }

    ///////////////////////////////////////////////////////

    const updateDeliveryPriceHandler = (areas) => {

        let cost;
        switch (areas) {
            case "ww":
                if (wwRef.current.value) {
                    cost = wwRef.current.value;
                    // alert(cost);
                } else {
                    alert("Please enter the cost");
                }
                break;
            case "wj":
                if (wjRef.current.value) {
                    cost = wjRef.current.value;
                    alert(cost);
                } else {
                    alert("Please enter the cost");
                }
                break;
            case "wd":
                if (wdRef.current.value) {
                    cost = wdRef.current.value;
                    // alert(cost);
                } else {
                    alert("Please enter the cost");
                }
                break;
            case "wa":
                if (waRef.current.value) {
                    cost = waRef.current.value;
                    // alert(cost);
                } else {
                    alert("Please enter the cost");
                }
                break;
            case "jw":
                if (jwRef.current.value) {
                    cost = jwRef.current.value;
                    // alert(cost);
                } else {
                    alert("Please enter the cost");
                }
                break;
            case "jj":
                if (jjRef.current.value) {
                    cost = jjRef.current.value;
                    alert(cost);
                } else {
                    alert("Please enter the cost");
                }
                break;
            case "jd":
                if (jdRef.current.value) {
                    cost = jdRef.current.value;
                    // alert(cost);
                } else {
                    alert("Please enter the cost");
                }
                break;
            case "ja":
                if (jaRef.current.value) {
                    cost = jaRef.current.value;
                    // alert(cost);
                } else {
                    alert("Please enter the cost");
                }
                break;
            case "dw":
                if (dwRef.current.value) {
                    cost = dwRef.current.value;
                    // alert(cost);
                } else {
                    alert("Please enter the cost");
                }
                break;
            case "dj":
                if (djRef.current.value) {
                    cost = djRef.current.value;
                    // alert(cost);
                } else {
                    alert("Please enter the cost");
                }
                break;
            case "dd":
                if (ddRef.current.value) {
                    cost = ddRef.current.value;
                    // alert(cost);
                } else {
                    alert("Please enter the cost");
                }
                break;
            case "da":
                if (daRef.current.value) {
                    cost = daRef.current.value;
                    // alert(cost);
                } else {
                    alert("Please enter the cost");
                }
                break;
        }

        updateClientDeliveryCostList(id, cost, areas).then(res => {
            console.log(res.data);
            setRefresh(!refresh)
        })
    }

    return (
        <>
            <Tabs defaultActiveKey="PersonalInformation" id="uncontrolled-tab-example" className="tabPane">
                <Tab eventKey="PersonalInformation" title="Personal Information">
                    <Card className="customCardSm shadow m-5">
                        <Card.Body>

                            {personalInfo ? <Container fluid>
                                <Row>
                                    <Col lg={6}>
                                        <Table className="infoTable">
                                            <tbody>
                                                <tr>
                                                    <th>Full Name:</th>
                                                    <td className="d-flex justify-content-between">
                                                        <Form.Control
                                                            ref={firstNameRef}
                                                            type="text"
                                                            placeholder={personalInfo?.FirstName}
                                                            className="w-50"
                                                        />
                                                        <Form.Control
                                                            ref={lastNameRef}
                                                            type="text"
                                                            placeholder={personalInfo?.LastName}
                                                            className="w-50"
                                                        />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th>Email:</th>
                                                    <td>
                                                        <Form.Control
                                                            ref={emailRef}
                                                            type="email"
                                                            placeholder={personalInfo?.Email}
                                                        />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th>Phone Number:</th>
                                                    <td>
                                                        {personalInfo?.phone}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th>ID Number:</th>
                                                    <td>
                                                        <Form.Control
                                                            ref={idNumberRef}
                                                            type="number"
                                                            placeholder={personalInfo?.IDNumber}
                                                        />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th>Togo COD share:</th>
                                                    <td>
                                                        <Form.Control
                                                            ref={commissionRef}
                                                            type="number"
                                                            placeholder={personalInfo?.togo_share_value}
                                                        />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </Col>
                                    <Col lg={6}>
                                        <div className="w-100 d-flex justify-content-center">
                                            <div
                                                className="rounded-circle d-flex light-turquoise-bg wh-45px logo-img-container"
                                                style={{ width: "200px", height: "200px", position: "relative" }}
                                            >
                                                <img
                                                    className="logo-image"
                                                    src={!profileImage.includes("null") ? (profileImage.split("/")[profileImage.split("/").length - 1].includes(".") ? profileImage + "?t=" + Math.random() : profileImage) : "https://freepikpsd.com/file/2019/10/avatar-icon-png-5-Images-PNG-Transparent.png"}
                                                    alt="user-profile-pic"
                                                />
                                                <div className="logo-img-overlay" onClick={() => { setViewImg(true); setTempImgPath(imgBaseUrl + personalInfo?.img) }}>
                                                    <div className="logo-img-overlay-text"><i className="bi bi-arrows-fullscreen h1"></i></div>
                                                </div>
                                                <UploadAndEditImage currentImage={profileImage.split("/")[profileImage.split("/").length - 1].includes(".") ? profileImage + "?t=" + Math.random() : profileImage} setImageToUpload={setPersonalImageToUpload} setImage={setProfileImage} imageBorderRadius={250} imageHeight={250} imageWidth={250} />
                                            </div>
                                        </div>
                                        <div className="mt-3 ms-3 d-flex justify-content-center" style={{ fontSize: "1.5rem" }}>{businessInfo?.BusinessName}</div>

                                        <Table>
                                            <tbody>
                                                <tr>
                                                    <th scope="row">Customer ID</th>
                                                    <td>{id}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Odoo ID</th>
                                                    <td>{personalInfo?.OdooId}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Total Escrow In</th>
                                                    <td>{personalInfo?.escrowTotalIn} NIS</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Total Escrow Out</th>
                                                    <td>{personalInfo?.escrowTotalOut} NIS</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Total Balance</th>
                                                    <td>{personalInfo?.balance} NIS</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Loan Balance</th>
                                                    <td>
                                                        {tempBalance} NIS
                                                        <Button variant="secondary" className="ms-3" onClick={() => { setOpenTempBalanceModal(true); setShowTempAmountError(false) }}>Manage Loan Balance</Button>

                                                        <Modal size="lg" centered show={openTempBalanceModal} onHide={() => { setOpenTempBalanceModal(false) }}>
                                                            <Modal.Header closeButton>
                                                                <Modal.Title>Manage Loan Balance</Modal.Title>
                                                            </Modal.Header>
                                                            <Modal.Body style={{ maxHeight: "200px", overflowY: "scroll" }} className="my-3">
                                                                <Table>
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Name</th>
                                                                            <th>Date</th>
                                                                            <th>In</th>
                                                                            <th>Out</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {
                                                                            tempAccountTransactions?.map((transaction, index) => {
                                                                                return <tr key={index}>
                                                                                    <td>{transaction.name}</td>
                                                                                    <td>{transaction.create_date}</td>
                                                                                    <td>{transaction.debit}{transaction.debit != 0 && <span style={{ color: "gray" }}>↓</span>}</td>
                                                                                    <td>{transaction.credit}{transaction.credit != 0 && <span style={{ color: "gray" }}>↑</span>}</td>
                                                                                </tr>
                                                                            })
                                                                        }
                                                                    </tbody>
                                                                </Table>
                                                            </Modal.Body>
                                                            <Modal.Footer className="d-flex justify-content-center">
                                                                <Form.Control type="number" placeholder="Amount..." ref={tempAmountRef} style={{ border: showTempAmountError ? "1px solid red" : "" }} />
                                                                {showTempAmountError && <span style={{ color: "red" }}>Field error</span>}
                                                                <Button disabled={tempLoading ? true : false} className="w-25" variant="success" onClick={() => { confirmHandler("collect") }}>
                                                                    {tempLoading && <Spinner animation="border" variant="light" size="sm" />} Collect
                                                                </Button>
                                                                <Button disabled={tempLoading ? true : false} className="w-25" variant="danger" onClick={() => { confirmHandler("lend") }}>
                                                                    {tempLoading && <Spinner animation="border" variant="light" size="sm" />}Lend
                                                                </Button>
                                                                <Button disabled={tempLoading ? true : false} className="w-25" variant="secondary" onClick={() => { setOpenTempBalanceModal(false) }}>
                                                                    {tempLoading && <Spinner animation="border" variant="light" size="sm" />}Cancel
                                                                </Button>
                                                            </Modal.Footer>
                                                        </Modal>

                                                        <Modal size="sm" centered show={openVerifiModal} onHide={() => { setOpenVerifiModal(false) }}>
                                                            <Modal.Header closeButton>
                                                                <Modal.Title>Confirm {loanActionType == "collect" ? "Collect" : "Lend"}</Modal.Title>
                                                            </Modal.Header>
                                                            <Modal.Body style={{ maxHeight: "200px", overflowY: "scroll" }} className="my-3">
                                                                <Form.Control type="number" placeholder="Code..." ref={verifyCodeRef} style={{ border: showVerifiCodeError ? "1px solid red" : "" }} />
                                                                {showVerifiCodeError && <span style={{ color: "red" }}>Field error</span>}
                                                                <div className="d-flex justify-content-center mt-2">
                                                                    <Button disabled={tempLoading ? true : false} style={{ width: "40%", marginRight: "5px" }} variant={loanActionType == "collect" ? "success" : "danger"} onClick={confirmActionHandler}>
                                                                        {tempLoading && <Spinner animation="border" variant="light" size="sm" />} {loanActionType == "collect" ? "Collect" : "Lend"}
                                                                    </Button>
                                                                    <Button disabled={tempLoading ? true : false} style={{ width: "40%" }} variant="secondary" onClick={() => { setOpenVerifiModal(false) }}>
                                                                        {tempLoading && <Spinner animation="border" variant="light" size="sm" />}Cancel
                                                                    </Button>
                                                                </div>
                                                            </Modal.Body>
                                                        </Modal>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Total Orders</th>
                                                    <td>{clinetTotalOrdersNum}</td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                        <div className="mt-3 ms-3 d-flex justify-content-center h1" style={{ position: "absolute", top: 0, right: "20px" }}>
                                            <div className="custome-check" style={{ border: isBlocked ? "4px solid red" : "4px solid green" }} onClick={handleBlockUser}>
                                                {!isBlocked && <div className="custome-check-checked">
                                                    <AiOutlineCheckCircle />
                                                </div>}
                                                {isBlocked && <div className="custome-check-unchecked">
                                                    <BiBlock />
                                                </div>}
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Container> : <Spinner animation="border" variant="success" />}
                        </Card.Body>
                        <Card.Footer>
                            {personalInfo ? <Button disabled={updatePersonalButtonLoading && true} className="btn-grad update-btn" onClick={updatePersonalInfo}>
                                {updatePersonalButtonLoading && <Spinner animation="border" variant="success" />} UPDATE
                            </Button> : <Spinner animation="border" variant="success" />}
                        </Card.Footer>
                    </Card>
                </Tab>
                <Tab eventKey="businessInformation" title="Business Information">
                    <Card className="customCardSm shadow m-5">
                        <Card.Body>
                            <Container fluid>
                                <Row>
                                    <Col lg={12}>
                                        <Table className="infoTable">
                                            <tbody>
                                                <tr>
                                                    <th>Business Name:</th>
                                                    <td>
                                                        <Form.Control
                                                            ref={businessNameRef}
                                                            type="text"
                                                            placeholder={businessInfo?.BusinessName}
                                                        />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th>Business Location:</th>
                                                    <td>
                                                        <Form.Control
                                                            ref={nusinessLocationRef}
                                                            type="text"
                                                            placeholder={businessInfo?.BusinessPlace}
                                                        />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th>Business Type:</th>
                                                    <td>
                                                        {businessInfo?.BusinessType === "1" ? "شركة" : "مؤسسة"}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </Col>
                                </Row>
                            </Container>
                        </Card.Body>
                        <Card.Footer>
                            <Button disabled={updateBusinessButtonLoading && true} className="btn-grad update-btn" onClick={updateBusinessInfo}>
                                {updateBusinessButtonLoading && <Spinner animation="border" variant="success" />} UPDATE
                            </Button>
                        </Card.Footer>
                    </Card>
                </Tab>
                <Tab eventKey="network" title="Network" className="pb-5">
                    <Card className="customCardSm shadow m-5">
                        <Card.Body>
                            <Container fluid>
                                <Row>
                                    <Col className="d-flex justify-content-end">
                                        <AddTransporterToNetworkDialog clientId={id} onSuccess={() => { setRefresh(!refresh) }} />
                                    </Col>
                                </Row>
                                <hr className="my-2" />
                                <Row>
                                    <Col lg={12}>
                                        <Table responsive hover style={{ fontSize: "1rem", marginRight: '20px', marginLeft: "20px" }}>
                                            <thead>
                                                <tr>
                                                    <th scope="col" style={{ width: "5%" }}></th>
                                                    <th scope="col">Name</th>
                                                    <th scope="col" style={{ width: "10%" }}>Phone</th>
                                                    <th scope="col" style={{ width: "10%" }}>Auto offer</th>
                                                    <th scope="col" style={{ width: "40%" }}>Description</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {networkMembers?.map((member, index) => {
                                                    return (
                                                        <Network
                                                            key={index}
                                                            src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4DIB9mSrwArVWd1WGdqVwb9Sf-cHXSNuEbg&usqp=CAU"}
                                                            isActive
                                                            member={member}
                                                        />
                                                    )
                                                })}
                                            </tbody>
                                        </Table>
                                    </Col>
                                </Row>
                            </Container>
                        </Card.Body>
                    </Card>
                </Tab>
                {/* tofo */}
                <Tab eventKey="price-list" title="Delivery Price List" className="pb-5">
                    <Card className="customCardSm shadow m-5">
                        <Card.Body>
                            <Container fluid>
                                <Row>
                                    <div className="w-100 d-flex justify-content-center h2">Delivery Price List</div>
                                </Row>
                                <Row>
                                    <Col lg={12}>
                                        <Table responsive hover style={{ fontSize: "1rem", marginRight: '20px', marginLeft: "20px" }}>
                                            <tbody>
                                                <tr>
                                                    <th scope="row">West bank to West bank</th>
                                                    <td>
                                                        <div className="d-flex justify-content-end">
                                                            <Form.Control
                                                                ref={wwRef}
                                                                type="number"
                                                                placeholder={deliveryPriceList?.ww}
                                                                className="w-25 me-2"
                                                                style={{ textAlign: "center" }}
                                                            />
                                                            <Button
                                                                variant="primary"
                                                                className="w-25 d-flex justify-content-center align-items-center"
                                                                onClick={() => updateDeliveryPriceHandler("ww")}
                                                            >
                                                                <BsCheckLg />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">West bank to Jerusalem</th>
                                                    <td>
                                                        <div className="d-flex justify-content-end">
                                                            <Form.Control
                                                                ref={wjRef}
                                                                type="number"
                                                                placeholder={deliveryPriceList?.wj}
                                                                className="w-25 me-2"
                                                                style={{ textAlign: "center" }}
                                                            />
                                                            <Button
                                                                variant="primary"
                                                                className="w-25 d-flex justify-content-center align-items-center"
                                                                onClick={() => updateDeliveryPriceHandler("wj")}
                                                            >
                                                                <BsCheckLg />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">West bank to 48 areas</th>
                                                    <td>
                                                        <div className="d-flex justify-content-end">
                                                            <Form.Control
                                                                ref={wdRef}
                                                                type="number"
                                                                placeholder={deliveryPriceList?.wd}
                                                                className="w-25 me-2"
                                                                style={{ textAlign: "center" }}
                                                            />
                                                            <Button
                                                                variant="primary"
                                                                className="w-25 d-flex justify-content-center align-items-center"
                                                                onClick={() => updateDeliveryPriceHandler("wd")}
                                                            >
                                                                <BsCheckLg />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">West bank to Jordan</th>
                                                    <td>
                                                        <div className="d-flex justify-content-end">
                                                            <Form.Control
                                                                ref={waRef}
                                                                type="number"
                                                                placeholder={deliveryPriceList?.wa}
                                                                className="w-25 me-2"
                                                                style={{ textAlign: "center" }}
                                                            />
                                                            <Button
                                                                variant="primary"
                                                                className="w-25 d-flex justify-content-center align-items-center"
                                                                onClick={() => updateDeliveryPriceHandler("wa")}
                                                            >
                                                                <BsCheckLg />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Jerusalem to West bank</th>
                                                    <td>
                                                        <div className="d-flex justify-content-end">
                                                            <Form.Control
                                                                ref={jwRef}
                                                                type="number"
                                                                placeholder={deliveryPriceList?.jw}
                                                                className="w-25 me-2"
                                                                style={{ textAlign: "center" }}
                                                            />
                                                            <Button
                                                                variant="primary"
                                                                className="w-25 d-flex justify-content-center align-items-center"
                                                                onClick={() => updateDeliveryPriceHandler("jw")}
                                                            >
                                                                <BsCheckLg />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Jerusalem to Jerusalem</th>
                                                    <td>
                                                        <div className="d-flex justify-content-end">
                                                            <Form.Control
                                                                ref={jjRef}
                                                                type="number"
                                                                placeholder={deliveryPriceList?.jj}
                                                                className="w-25 me-2"
                                                                style={{ textAlign: "center" }}
                                                            />
                                                            <Button
                                                                variant="primary"
                                                                className="w-25 d-flex justify-content-center align-items-center"
                                                                onClick={() => updateDeliveryPriceHandler("jj")}
                                                            >
                                                                <BsCheckLg />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Jerusalem to 48 areas</th>
                                                    <td>
                                                        <div className="d-flex justify-content-end">
                                                            <Form.Control
                                                                ref={jdRef}
                                                                type="number"
                                                                placeholder={deliveryPriceList?.jd}
                                                                className="w-25 me-2"
                                                                style={{ textAlign: "center" }}
                                                            />
                                                            <Button
                                                                variant="primary"
                                                                className="w-25 d-flex justify-content-center align-items-center"
                                                                onClick={() => updateDeliveryPriceHandler("jd")}
                                                            >
                                                                <BsCheckLg />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Jerusalem to Jordan</th>
                                                    <td>
                                                        <div className="d-flex justify-content-end">
                                                            <Form.Control
                                                                ref={jaRef}
                                                                type="number"
                                                                placeholder={deliveryPriceList?.ja}
                                                                className="w-25 me-2"
                                                                style={{ textAlign: "center" }}
                                                            />
                                                            <Button
                                                                variant="primary"
                                                                className="w-25 d-flex justify-content-center align-items-center"
                                                                onClick={() => updateDeliveryPriceHandler("ja")}
                                                            >
                                                                <BsCheckLg />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">48 areas to West bank</th>
                                                    <td>
                                                        <div className="d-flex justify-content-end">
                                                            <Form.Control
                                                                ref={dwRef}
                                                                type="number"
                                                                placeholder={deliveryPriceList?.dw}
                                                                className="w-25 me-2"
                                                                style={{ textAlign: "center" }}
                                                            />
                                                            <Button
                                                                variant="primary"
                                                                className="w-25 d-flex justify-content-center align-items-center"
                                                                onClick={() => updateDeliveryPriceHandler("dw")}
                                                            >
                                                                <BsCheckLg />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">48 areas to Jerusalem</th>
                                                    <td>
                                                        <div className="d-flex justify-content-end">
                                                            <Form.Control
                                                                ref={djRef}
                                                                type="number"
                                                                placeholder={deliveryPriceList?.dj}
                                                                className="w-25 me-2"
                                                                style={{ textAlign: "center" }}
                                                            />
                                                            <Button
                                                                variant="primary"
                                                                className="w-25 d-flex justify-content-center align-items-center"
                                                                onClick={() => updateDeliveryPriceHandler("dj")}
                                                            >
                                                                <BsCheckLg />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">48 areas to 48 areas</th>
                                                    <td>
                                                        <div className="d-flex justify-content-end">
                                                            <Form.Control
                                                                ref={ddRef}
                                                                type="number"
                                                                placeholder={deliveryPriceList?.dd}
                                                                className="w-25 me-2"
                                                                style={{ textAlign: "center" }}
                                                            />
                                                            <Button
                                                                variant="primary"
                                                                className="w-25 d-flex justify-content-center align-items-center"
                                                                onClick={() => updateDeliveryPriceHandler("dd")}
                                                            >
                                                                <BsCheckLg />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">48 areas to Jordan</th>
                                                    <td>
                                                        <div className="d-flex justify-content-end">
                                                            <Form.Control
                                                                ref={daRef}
                                                                type="number"
                                                                placeholder={deliveryPriceList?.da}
                                                                className="w-25 me-2"
                                                                style={{ textAlign: "center" }}
                                                            />
                                                            <Button
                                                                variant="primary"
                                                                className="w-25 d-flex justify-content-center align-items-center"
                                                                onClick={() => updateDeliveryPriceHandler("da")}
                                                            >
                                                                <BsCheckLg />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </Col>
                                </Row>
                            </Container>
                        </Card.Body>
                    </Card>
                </Tab>
            </Tabs >
            <Modal fullscreen={true} show={viewImg} onHide={handleClose}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body className="d-flex justify-content-center">
                    <img
                        src={tempImgPath.split("/")[tempImgPath.split("/").length - 1].includes(".") ? tempImgPath + "?t=" + Math.random() : tempImgPath}
                        style={{ objectFit: "cover" }}
                        alt="No image!"
                    />
                </Modal.Body>
            </Modal>
        </>
    )
}

function Network({ member }) {

    let dispatch = useDispatch();

    const [autoOffer, setAutoOffer] = useState(member?.isAutoOffer);

    const changeAutoOfferHandler = (e, networkMemberId) => {
        autoOffer == 1 ? setAutoOffer(0) : setAutoOffer(1);

        const isChecked = e.target.checked == true ? 1 : 0;

        updateClientAutoOfferForAdmin(isChecked, networkMemberId).then((res) => {
            // console.log(res.data);
            if (res.data === "updated") {
                dispatch(toastNotification("Updated", "Auto offer updated sucessfully!", "success"));
            } else {
                dispatch(toastNotification("Error", res.data, "error"));
            }
        })
    }

    // console.log("---------img: " + `${imgBaseUrl}${member.PersonalImgPath}`);
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
                        src={`${imgBaseUrl}${member.Image}`}
                        alt={member.PhoneNumber}
                    />
                </div>
            </td>
            <td>{member?.FullName}</td>
            <td>{member?.PhoneNumber}</td>
            <td>{member?.isApproved == 1 &&
                <Form className="d-flex justify-content-center">
                    <Form.Check
                        type="switch"
                        id="custom-switch"
                        label=""
                        checked={autoOffer == 1 ? true : false}
                        onChange={(e) => changeAutoOfferHandler(e, member?.NetworkMemberId)}
                    />
                </Form>
            }</td>
            <td>{member?.isApproved == 0 && <Badge bg="warning">Request sent from client</Badge>}</td>
        </tr>
    )
}

function AddTransporterToNetworkDialog({ clientId, onSuccess }) {

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
    const handleClose = () => {
        setShow(false);
    }

    const [transportersToAdd, setTransportersToAdd] = useState([]);

    useEffect(() => {
        getAllTransportersToAddForAdmin(clientId).then(res => {
            // console.log(res.data.server_response);
            setTransportersToAdd(res.data.server_response);
        });
    }, [])

    return (
        <>
            <Button className="border mt-3 me-5 rounded-22 btn-grad" onClick={() => {
                setShow(true);
            }}>
                Add Transporter
                <i className={"ms-2 bi bi-plus-circle"}></i>
            </Button>

            <Modal show={show} size="lg" centered onHide={handleClose}>
                <Modal.Header style={styles.cardHeaderLg}>
                    Add Transporter
                </Modal.Header>

                <Modal.Body className="mt-4">

                    <Table responsive hover style={{ fontSize: "1rem", marginRight: '20px', marginLeft: "20px" }}>
                        <thead>
                            <tr>
                                <th scope="col"></th>
                                <th scope="col">Name</th>
                                <th scope="col">Phone</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>

                        <tbody>
                            {transportersToAdd?.map((member, index) => {
                                return (
                                    <ClientNetweokMemberCar
                                        clientId={clientId}
                                        key={index}
                                        handleClose={handleClose}
                                        member={member}
                                        onSuccess={onSuccess}
                                    />
                                )
                            })}
                        </tbody>
                    </Table>
                </Modal.Body>
            </Modal>
        </>
    )
}

function ClientNetweokMemberCar({ clientId, member, handleClose, onSuccess }) {

    const [loading, setLoading] = useState(false);

    let dispatch = useDispatch();

    const addTransporterHandler = (transPhone) => {
        setLoading(true);

        AddTransporterToClientNetworkFoAdmin(transPhone, clientId).then((res) => {

            // console.log(res.data);

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
                <Button disable={loading ? true : false} onClick={() => addTransporterHandler(member?.TransPhone)} variant="primary" className="grad-button ms-3 w-50">
                    Add To Network
                    {loading && <Spinner animation="border" size="sm" />}
                </Button>
            </td>

        </tr>
    )
}