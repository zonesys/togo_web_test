import React, { useEffect, useRef, useState } from "react";
import './styles.css';
import { Container, Row, Col, Card, Table, Button, Form, Tab, Tabs, Modal, Spinner } from 'react-bootstrap';
import { Checkbox, Grid } from "@chakra-ui/react";
import {
    GetTransporterPersonalInfo,
    GetTransporterWorkingTimes,
    GetTransporterBusinessLocation,
    GetTransporterVehiclesInfo,
    updateTransporterPersonalInfo,
    updateTransporterBusinessLocations,
    blockUser,
    getTransporterCitiesPricesForAdmin,
    updateTransporterCitiesPricesForAdmin,
    getTransporterTotalOrdersNum,
    getUserTotalTempBalance,
    lendMoney,
    collectMoney,
    getTempTransactions,
    sendLoanVerifyCodeForAdmin
} from "../../../APIs/AdminPanelApis";
import { convert24TimeTo12 } from "../../../Util";
import { useDispatch } from "react-redux";
import { toastNotification } from "../../../Actions/GeneralActions";
import { toastMessage } from "../../../Actions/GeneralActions";
import UploadAndEditImage from '../../UploadImage/UploadAndEditImage';
import { refreshPage } from "../../../Functions/CommonFunctions";
import { BiBlock } from 'react-icons/bi';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { GrEdit } from 'react-icons/gr';
import { imgBaseUrl } from "../../../Constants/GeneralCont";

export default function TransporterPersonalInfoDisplay({ id }) {

    /* useEffect(() => {
        caches.open('v1').then((cache) => {
            // console.log(cache);
            cache.keys().then((keys) => {
                keys.forEach((request, index, array) => {
                    cache.delete(request);
                    // console.log(index);
                });
            });
        })
    }, [updatePersonalButtonLoading]) */

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

    const [info, setInfo] = useState();

    const [isBlocked, setIsBlocked] = useState(false);

    const [profileImage, setProfileImage] = useState("");
    const [originalProfileImage, setOriginalProfileImage] = useState("");
    const [personalImageToUpload, setPersonalImageToUpload] = useState("");

    const [licenceImage, setLicenceImage] = useState("");
    const [originalLicenceImage, setOriginalLicenceImage] = useState("");
    const [licenceImageToUpload, setLicenceImageToUpload] = useState("");

    const [updatePersonalButtonLoading, setUpdatePersonalButtonLoading] = useState(false);

    const [workingTimeList, setWorkingTimeList] = useState([]);

    const [businessLocations, setBusinessLocations] = useState([]);

    const [vehiclesInfo, setVehiclesInfo] = useState([]);

    const [viewImg, setViewImg] = useState(false);
    const [tempImgPath, setTempImgPath] = useState("");
    const [refreshPersonalInfo, setRefreshPersonalInfo] = useState(false);
    const [refreshBusinessLocations, setRefreshBusinessLocations] = useState(false);

    const [pricesArr, setPricesArr] = useState([]);
    const [fromInputValue, setFromInputValue] = useState('');
    const [toInputValue, setToInputValue] = useState('');
    const [pricesLoading, setPricesLoading] = useState(false);

    const [transporterTotalOrdersNum, setTransporterTotalOrdersNum] = useState(0);

    const [openTempBalanceModal, setOpenTempBalanceModal] = useState(false);

    const [tempBalance, setTempBalance] = useState(0);
    const [tempLoading, setTempLoading] = useState(false);
    const [showTempAmountError, setShowTempAmountError] = useState(false);

    const [tempAccountTransactions, setTempAccountTransactions] = useState([]);

    const [showVerifiCodeError, setShowVerifiCodeError] = useState(false);
    const [openVerifiModal, setOpenVerifiModal] = useState(false);
    const [loanActionType, setLoanActionType] = useState("");

    const [refresh, setRefresh] = useState(false);

    const firstNameRef = useRef();
    const lastNameRef = useRef();
    const accountNameRef = useRef();
    const emailRef = useRef();
    const idNumberRef = useRef();
    const licenceNumberRef = useRef();

    const tempAmountRef = useRef();
    const verifyCodeRef = useRef();

    const handleClose = () => {
        setViewImg(false);
    }

    useEffect(() => {
        getTransporterTotalOrdersNum(id).then((res) => {
            setTransporterTotalOrdersNum(res.data.ordersNum);
        })
    }, [])

    useEffect(() => {
        getTempTransactions(id).then(res => {
            setTempAccountTransactions(res.data.server_response);
            // console.log(res.data);
        })
    }, [refresh])

    useEffect(() => {
        GetTransporterPersonalInfo(id).then((res) => {
            /* console.log("=====================");
            console.log("personal info:");
            console.log(res.data.server_response); */
            setIsBlocked(res.data.server_response.IsBlocked == 1 ? true : false);
            setOriginalProfileImage(res.data.server_response.img);
            setOriginalLicenceImage(res.data.server_response.LicenceImgPath);
            setProfileImage(imgBaseUrl + res.data.server_response.img);
            setLicenceImage(imgBaseUrl + res.data.server_response.LicenceImgPath);
            setInfo(res.data.server_response);
        })
    }, [refreshPersonalInfo, refresh])

    useEffect(() => {
        GetTransporterBusinessLocation(id).then((res) => {
            /* console.log("=====================");
            console.log("business location:");
            console.log(res.data.CityResponse); */
            const tempArr = res.data.CityResponse.sort(function (a, b) {
                var textA = a.CityName.toUpperCase();
                var textB = b.CityName.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            });
            // console.log(tempArr)
            setBusinessLocations(tempArr);
        })
    }, [refreshBusinessLocations, refresh])

    useEffect(() => { // nono
        setPricesLoading(true);

        getTransporterCitiesPricesForAdmin(id).then((res) => {
            // console.log(res.data);

            if (fromInputValue == '' && toInputValue == '') {
                setPricesArr(res.data.response);
            } else {
                setPricesArr(res.data.response.filter(city => {
                    return city.fromName.toLowerCase().replaceAll("أ", 'ا').replaceAll("إ", 'ا').includes(fromInputValue.toLowerCase()) &&
                        city.toName.toLowerCase().replaceAll("أ", 'ا').replaceAll("إ", 'ا').includes(toInputValue.toLowerCase())
                }));
            }

            setPricesLoading(false);
        })
    }, [fromInputValue, toInputValue])

    useEffect(() => {
        GetTransporterWorkingTimes(id).then((res) => {
            /* console.log("=====================");
            console.log("working times:");
            console.log(res.data.TimeResponse); */
            const workingTime = res.data.TimeResponse;

            let tempWorkingTimeList = [
                {
                    title: "Saturday",
                    id: "Sat",
                    from: formatTime(workingTime[0]?.SatTimeStart),
                    to: formatTime(workingTime[0]?.SatTimeFinish)
                },
                {
                    title: "Sunday",
                    id: "Sun",
                    from: formatTime(workingTime[0]?.SunTimeStart),
                    to: formatTime(workingTime[0]?.SunTimeFinish)
                },
                {
                    title: "Monday",
                    id: "Mon",
                    from: formatTime(workingTime[0]?.MonTimeStart),
                    to: formatTime(workingTime[0]?.MonTimeFinish)
                },
                {
                    title: "Tuesday",
                    id: "Tue",
                    from: formatTime(workingTime[0]?.TueTimeStart),
                    to: formatTime(workingTime[0]?.TueTimeFinish)
                },
                {
                    title: "Wednesday",
                    id: "Wen",
                    from: formatTime(workingTime[0]?.WenTimeStart),
                    to: formatTime(workingTime[0]?.WenTimeFinish)
                },
                {
                    title: "Thursday",
                    id: "Thu",
                    from: formatTime(workingTime[0]?.ThuTimeStart),
                    to: formatTime(workingTime[0]?.ThuTimeFinish)
                },
                {
                    title: "Friday",
                    id: "Fri",
                    from: formatTime(workingTime[0]?.FriTimeStart),
                    to: formatTime(workingTime[0]?.FriTimeFinish)
                }
            ];

            setWorkingTimeList(tempWorkingTimeList);
        })

        GetTransporterVehiclesInfo(id).then((res) => {
            /*  console.log("=====================");
             console.log("vehicle info:");
             console.log(res.data.server_response); */
            if (res.data.server_response !== "No Info Found") {
                setVehiclesInfo(res.data.server_response);
            }
        })

    }, [])

    useEffect(() => {
        getUserTotalTempBalance(id).then((res) => {
            setTempBalance(res.data)
        })
    }, [refresh])

    const formatTime = (value) => {
        if (!value) return null;
        let time = value.split(" ")[1].slice(0, -3);
        return convert24TimeTo12(time);
    };

    function updatePersonalInfo() {

        setUpdatePersonalButtonLoading(true);

        let firstName = "";
        let lastName = "";
        let accountName = "";
        let email = "";
        let idNumber = "";
        let licenceNumber = "";

        firstNameRef.current.value == "" ? firstName = firstNameRef.current.attributes.placeholder.value : firstName = firstNameRef.current.value;
        lastNameRef.current.value == "" ? lastName = lastNameRef.current.attributes.placeholder.value : lastName = lastNameRef.current.value;
        accountNameRef.current.value == "" ? accountName = accountNameRef.current.attributes.placeholder.value : accountName = accountNameRef.current.value;
        emailRef.current.value == "" ? email = emailRef.current.attributes.placeholder.value : email = emailRef.current.value;
        idNumberRef.current.value == "" ? idNumber = idNumberRef.current.attributes.placeholder.value : idNumber = idNumberRef.current.value;
        licenceNumberRef.current.value == "" ? licenceNumber = licenceNumberRef.current.attributes.placeholder.value : licenceNumber = licenceNumberRef.current.value;

        // personal info array
        const tempPersonalInfoArr = [id, firstName, lastName, accountName, email, idNumber, licenceNumber];

        // ################################################################

        /* 
            personal image update
        */

        let tempPersonalImageName = ""; // image name (including extension)
        let isNewPersonalImage = false; // true if there is no previous image for this transporter

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
            // TimeToRefresh = 5000;
            isPersonalImageUpdated = true;
        }

        // console.log("image name: " + tempPersonalImageName + " ------- is image updated? " + isPersonalImageUpdated + " ------- is it a new image? " + isNewPersonalImage + " ------- image code: " + personalImageCode + " :::"); 

        // ################################################################

        /* 
            licence image update
        */

        let tempLicenceImageName = ""; // image name (including extension)
        let isNewLicenceImage = false; // true if there is no previous image for this transporter

        let licenceImageCode = licenceImageToUpload; // new-licence-image code to be uploaded as image file data
        let licenceImageName = licenceImage.split("/")[licenceImage.split("/").length - 1]; // new-licence-image file name
        let originallicencePath = originalLicenceImage; // original licence-image path (if existed)

        // check if there is an originial image path in the database
        if (originallicencePath == "" || originallicencePath == null) {
            isNewLicenceImage = true;
            let tempExtension = "";
            tempExtension = (licenceImageCode.split(";", 2)[0]).split("/")[1];
            tempLicenceImageName = "img/LicenceImg/" + licenceImageName + "." + tempExtension;
        } else {
            isNewLicenceImage = false;
            tempLicenceImageName = originallicencePath;
        }

        let isLicenceImageUpdated = false; // true if there is a new image uploaded 

        // check if there is a new image edited/uploaded
        if (licenceImageToUpload === "") {
            // TimeToRefresh = 1000;
            isLicenceImageUpdated = false;
        } else {
            // TimeToRefresh = 5000;
            isLicenceImageUpdated = true;
        }

        /* let imagesUpdated = false;
        // let TimeToRefresh = 0;

        if (personalImageToUpload !== "" || licenceImageToUpload !== "") {
            // TimeToRefresh = 1000;
            imagesUpdated = true;
        } else {
            // TimeToRefresh = 1000;
            imagesUpdated = false;
        } */

        // console.log("image name: " + tempLicenceImageName + " ------- is image updated? " + isLicenceImageUpdated + " ------- is it a new image? " + isNewLicenceImage + " ------- image code: " + licenceImageCode + " :::"); 
        // console.log(licenceImageCode)

        /* let today = new Date();
        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        tempPersonalImageName = tempPersonalImageName + "?t=" + time; */

        updateTransporterPersonalInfo(
            tempPersonalInfoArr,
            personalImageCode,
            tempPersonalImageName,
            isPersonalImageUpdated,
            isNewPersonalImage,
            licenceImageCode,
            tempLicenceImageName,
            isLicenceImageUpdated,
            isNewLicenceImage
        ).then((res) => {
            /* if (imagesUpdated) {
                setTimeout(() => {
                    refreshPage();
                }, TimeToRefresh);
            } else {
                setRefreshPersonalInfo(!refreshPersonalInfo);
                setUpdatePersonalButtonLoading(false);
                setPersonalImageToUpload("");

                if (res.data.includes("error") || res.data == "TokenError") {
                    dispatch(toastNotification("Error!", res.data, "warning"));
                } else {
                    dispatch(toastNotification("Updated!", res.data, "success"));
                }
            } */

            // setTimeout(() => {
            setRefreshPersonalInfo(!refreshPersonalInfo);
            setUpdatePersonalButtonLoading(false);
            setPersonalImageToUpload("");
            setLicenceImageToUpload("");

            if (res.data.includes("error") || res.data == "TokenError") {
                dispatch(toastNotification("Error!", res.data, "warning"));
            } else {
                dispatch(toastNotification("Updated!", res.data, "success"));
            }
            // }, TimeToRefresh);
        })
    }

    function updateLocations(locationId, checked) {
        // console.log(locationId + " - " + checked);

        updateTransporterBusinessLocations(locationId, checked ? 1 : 0, id).then((res) => {
            if (res.data === "AddeddSucessfully" || res.data === "UpdatedAddSucessfully" || res.data === "UpdatedRemoveSucessfully") {
                setRefreshBusinessLocations(!refreshBusinessLocations);
                dispatch(toastMessage("Business Location Updated Successfully", "Updated Successfully", "success"));
            } else {
                dispatch(toastMessage("Error Update Business Location"));
            }
        }).catch(err => {
            dispatch(toastMessage(err, "Error Update Business Location"));
        })
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

    const handlePriceChange = (transId, fromId, toId, newPrice) => { // nono
        updateTransporterCitiesPricesForAdmin(transId, fromId, toId, newPrice).then(res => {
            // console.log(res.data);
            if (res.data == "error") {
                dispatch(toastNotification("Error!", "Something went wrong!", "error"));
            }
        })
    }

    const handleSearchFrom = (event) => {
        // console.log(event.target.value);
        setFromInputValue(event.target.value);
    }

    const handleSearchTo = (event) => {
        // console.log(event.target.value);
        setToInputValue(event.target.value);
    }

    const confirmHandler = (cl) => {
        const amount = tempAmountRef.current.value;

        if (amount <= 0) {
            setShowTempAmountError(true);
        } else {
            setShowTempAmountError(false);

            // send verification code to admin

            setTempLoading(true);

            sendLoanVerifyCodeForAdmin(info?.FirstName + " " + info?.LastName, amount, cl).then(res => {
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

    return (
        <>
            <Tabs defaultActiveKey="PersonalInformation" id="uncontrolled-tab-example" className="tabPane">
                <Tab eventKey="PersonalInformation" title="Personal Information">
                    <Card className="customCardSm shadow m-5">
                        <Card.Body>

                            {info ? <Container fluid>
                                <Row>
                                    <Col lg={6}>
                                        <Table className="infoTable">
                                            <tbody>
                                                <tr>
                                                    <th scope="row">Full Name:</th>
                                                    <td className="d-flex justify-content-between">
                                                        <Form.Control
                                                            ref={firstNameRef}
                                                            placeholder={info?.FirstName}
                                                            className="w-50"
                                                        // placeholder={info?.fullName}
                                                        />
                                                        <Form.Control
                                                            ref={lastNameRef}
                                                            placeholder={info?.LastName}
                                                            className="w-50"
                                                        // placeholder={info?.fullName}
                                                        />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Account Name:</th>
                                                    <td>
                                                        <Form.Control
                                                            placeholder={info?.AccountName}
                                                            ref={accountNameRef}
                                                        />

                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Phone Number:</th>
                                                    <td>
                                                        {info?.phone}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Email:</th>
                                                    <td>
                                                        <Form.Control
                                                            type="email"
                                                            placeholder={info?.Email}
                                                            ref={emailRef}
                                                        />

                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">ID Number:</th>
                                                    <td>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder={info?.IDNumber}
                                                            ref={idNumberRef}
                                                        />

                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Licence Number:</th>
                                                    <td>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder={info?.LicenceNumber}
                                                            ref={licenceNumberRef}
                                                        />

                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Licence Photo:</th>
                                                    <td className="img-container">
                                                        <img
                                                            src={!licenceImage.includes("null") && (licenceImage.split("/")[licenceImage.split("/").length - 1].includes(".") ? licenceImage + "?t=" + Math.random() : licenceImage)}
                                                            className="image"
                                                            alt="user-profile-pic"
                                                        />
                                                        <div className="img-overlay" onClick={() => { setViewImg(true); setTempImgPath(imgBaseUrl + info?.LicenceImgPath) }}>
                                                            <div className="img-overlay-text"><i className="bi bi-arrows-fullscreen h1"></i></div>
                                                        </div>
                                                        <UploadAndEditImage currentImage={licenceImage.split("/")[licenceImage.split("/").length - 1].includes(".") ? licenceImage + "?t=" + Math.random() : licenceImage} setImageToUpload={setLicenceImageToUpload} setImage={setLicenceImage} imageBorderRadius={0} imageHeight={200} imageWidth={300} />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </Col>
                                    <Col lg={6}>
                                        <div className="w-100 d-flex justify-content-center">
                                            <div
                                                className="rounded-circle d-flex light-turquoise-bg wh-45px logo-img-container"
                                                style={{ width: "200px", height: "200px" }}
                                            >

                                                <img
                                                    className="logo-image"
                                                    src={!profileImage.includes("null") ? (profileImage.split("/")[profileImage.split("/").length - 1].includes(".") ? profileImage + "?t=" + Math.random() : profileImage) : "https://freepikpsd.com/file/2019/10/avatar-icon-png-5-Images-PNG-Transparent.png"}

                                                    alt="user-profile-pic"
                                                />
                                                <div className="logo-img-overlay" onClick={() => { setViewImg(true); setTempImgPath(profileImage) }}>
                                                    <div className="logo-img-overlay-text"><i className="bi bi-arrows-fullscreen h1"></i></div>
                                                </div>
                                                <UploadAndEditImage currentImage={profileImage.split("/")[profileImage.split("/").length - 1].includes(".") ? profileImage + "?t=" + Math.random() : profileImage} setImageToUpload={setPersonalImageToUpload} setImage={setProfileImage} imageBorderRadius={250} imageHeight={250} imageWidth={250} />
                                            </div>
                                        </div>
                                        <div className="mt-3 ms-3 d-flex justify-content-center" style={{ fontSize: "1.5rem" }}>{info?.FirstName + " " + info?.LastName}</div>
                                        {/* <div className="mt-3 ms-3 d-flex justify-content-center" style={{ fontSize: "0.8rem", color: "gray" }}>Customer ID: {id}</div>
                                        <div className="mt-3 ms-3 d-flex justify-content-center" style={{ fontSize: "0.8rem", color: "gray" }}>Odoo ID: {info?.OdooId}</div>
                                        <div className="mt-3 ms-3 d-flex justify-content-center" style={{ fontSize: "0.8rem", color: "gray" }}>Balance: {info?.balance} NIS</div> */}
                                        <Table>
                                            <tbody>
                                                <tr>
                                                    <th scope="row">Customer ID</th>
                                                    <td>{id}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Odoo ID</th>
                                                    <td>{info?.OdooId}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Total Balance</th>
                                                    <td>{info?.balance} NIS</td>
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
                                                    <td>{transporterTotalOrdersNum}</td>
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
                            {info ? <Button disabled={updatePersonalButtonLoading && true} className="btn-grad update-btn" onClick={updatePersonalInfo}>
                                {updatePersonalButtonLoading && <Spinner animation="border" variant="success" />} UPDATE
                            </Button> : <Spinner animation="border" variant="success" />}
                        </Card.Footer>
                    </Card>
                </Tab>
                <Tab eventKey="WorkingTimeAndBusinessLocation" title=" Working Time and Business Location">
                    <Row>
                        <Col xl={6}>
                            <Card className="customCardSm shadow m-5">
                                <Card.Header>
                                    Business Times
                                </Card.Header>
                                <Card.Body>
                                    <Container fluid>
                                        <Row>
                                            <Col>
                                                <Table>
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">Day</th>
                                                            <th scope="col">From</th>
                                                            <th scope="col">To</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            workingTimeList?.map((day, index) =>
                                                                <tr key={index}>
                                                                    <th scope="row">{day.title}:</th>
                                                                    <td>{day.from}</td>
                                                                    <td>{day.to}</td>
                                                                </tr>
                                                            )
                                                        }
                                                    </tbody>
                                                </Table>
                                            </Col>
                                        </Row>
                                    </Container>
                                </Card.Body>
                                <Card.Footer>
                                    <Button disabled className="update-btn">
                                        UPDATE
                                    </Button>
                                </Card.Footer>
                            </Card>
                        </Col>
                        <Col xl={6}>
                            <Card className="customCardSm shadow m-5">
                                <Card.Header>
                                    Business Locations
                                </Card.Header>
                                <Card.Body>
                                    <Container fluid>
                                        <Row>
                                            <Col>
                                                <Grid gridTemplateColumns="repeat(2, 1fr)">
                                                    {businessLocations.map(({ IdCity, CityName, CheckAdded }, index) => (
                                                        <Checkbox
                                                            colorScheme="green"
                                                            key={index}
                                                            defaultIsChecked={CheckAdded === "Added"}
                                                            value={IdCity}
                                                            onChange={(e) => { updateLocations(e.target.value, e.target.checked) }}
                                                        >
                                                            {CityName}
                                                        </Checkbox>
                                                    ))}
                                                </Grid>
                                            </Col>
                                        </Row>
                                    </Container>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Tab>
                <Tab eventKey="citiesPrices" title="Prices Between Cities"> {/* nono */}
                    <Card className="customCardLg shadow m-5">
                        <Card.Header>
                            <Table hover>
                                <thead>
                                    <tr>
                                        <th scope="col" style={{ width: "30%", border: "none", color: "white" }}>
                                            <Form.Group className="d-flex justify-content-center">
                                                <Form.Label className="me-3 mt-1">From</Form.Label>
                                                <Form.Control className="w-50" placeholder={"Search by name..."} onChange={(e) => {
                                                    handleSearchFrom(e)
                                                }} />
                                            </Form.Group>
                                        </th>
                                        <th scope="col" style={{ width: "10%", border: "none", color: "white" }}></th>
                                        <th scope="col" style={{ width: "30%", border: "none", color: "white" }}>
                                            <Form.Group className="d-flex justify-content-center">
                                                <Form.Label className="me-3 mt-1">To</Form.Label>
                                                <Form.Control className="w-50" placeholder={"Search by name..."} onChange={(e) => {
                                                    handleSearchTo(e)
                                                }} />
                                            </Form.Group></th>
                                        <th scope="col" style={{ width: "30%", border: "none", color: "white", paddingTop: "-100px" }}><Form.Label className="t-1">Price</Form.Label></th>
                                    </tr>
                                </thead>
                            </Table>
                        </Card.Header>
                        <Card.Body style={{ height: "500px", overflowY: "scroll" }}>
                            <Table hover>
                                <tbody>
                                    {
                                        pricesLoading ? <tr><td colSpan="4"><Spinner animation="border" variant="success" /></td></tr> : pricesArr.map((item, index) => {
                                            return <tr key={index}>
                                                <td>{item.fromName}</td>
                                                <td>{(localStorage.getItem("Language") || "en") === "en" ? <i className="bi bi-arrow-right"></i> : <i className="bi bi-arrow-left"></i>}</td>
                                                <td>{item.toName}</td>
                                                <td>
                                                    <Form.Group className="d-flex justify-content-center" controlId={index}>
                                                        <Form.Control style={{ width: "100px", textAlign: "center" }} type="number" placeholder={item.price} onChange={(e) => {
                                                            handlePriceChange(item.transporterId, item.fromId, item.toId, e.target.value)
                                                        }} />
                                                        {/* <TbCurrencyShekel style={{ fontSize: "20px", marginTop: "10px" }} /> */}
                                                        <GrEdit style={{ fontSize: "20px", marginTop: "10px", marginLeft: "5px" }} />
                                                    </Form.Group>
                                                </td>
                                            </tr>
                                        })
                                    }
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Tab>
                <Tab eventKey="VehiclesInformation" title="Vehicles Information">
                    <Card className="customCardSm shadow m-5">
                        <Card.Body>
                            {/* <Table>
                                <thead>
                                    <tr>
                                        <th scope="col">Vehicle Name</th>
                                        <th scope="col">Licence Number</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        vehiclesInfo?.map((car, index) => {
                                            return <tr key={index}>
                                                <td><Form.Control placeholder={car.Name} /></td>
                                                <td><Form.Control placeholder={car.LicenceNumber} /></td>
                                            </tr>
                                        })
                                    }
                                </tbody>
                            </Table> */}
                            <Table>
                                <tbody>
                                    <tr>
                                        <th scope="row">Vehicle Type</th>
                                        <td><Form.Control placeholder={vehiclesInfo[0]?.Name} /></td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Licence Number</th>
                                        <td><Form.Control placeholder={vehiclesInfo[0]?.LicenceNumber} /></td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Registration Number</th>
                                        <td><Form.Control placeholder={vehiclesInfo[0]?.RegistrationNumber} /></td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Registration Finish Day</th>
                                        <td><Form.Control placeholder={vehiclesInfo[0]?.RegistrationFinshDay} /></td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Registration Photo</th>
                                        <td className="img-container">
                                            <img
                                                src={imgBaseUrl + vehiclesInfo[0]?.RegistrationImgPath}
                                                alt="user-profile-pic"
                                                className="image"
                                            />
                                            <div className="img-overlay" onClick={() => { setViewImg(true); setTempImgPath(imgBaseUrl + vehiclesInfo[0]?.RegistrationImgPath) }}>
                                                <div className="img-overlay-text"><i className="bi bi-arrows-fullscreen h1"></i></div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Vehicle Photo</th>
                                        <td className="img-container">
                                            <img
                                                src={imgBaseUrl + vehiclesInfo[0]?.CarImgPath}
                                                alt="user-profile-pic"
                                                className="image"
                                            />
                                            <div className="img-overlay" onClick={() => { setViewImg(true); setTempImgPath(imgBaseUrl + vehiclesInfo[0]?.CarImgPath) }}>
                                                <div className="img-overlay-text"><i className="bi bi-arrows-fullscreen h1"></i></div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Card.Body>
                        <Card.Footer>
                            <Button disabled className="update-btn">
                                UPDATE
                            </Button>
                        </Card.Footer>
                    </Card>
                </Tab>
            </Tabs>
            <Modal fullscreen={true} show={viewImg} onHide={handleClose}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body className="d-flex justify-content-center">
                    <img
                        src={tempImgPath.split("/")[tempImgPath.split("/").length - 1].includes(".") ? tempImgPath + "?t=" + Math.random() : tempImgPath}
                        style={{ objectFit: "cover"/* , borderRadius: "50%" */ }}
                        alt="No image!"
                    />
                </Modal.Body>
                {/* <Modal.Footer>
                    <UploadAndEditImage currentImage={profileImage} setImage={setProfileImage} />
                </Modal.Footer> */}
            </Modal>
        </>
    )
}