import { Button, Dropdown, Form, Modal, Spinner, Table, Card, Container, Row, Col, ListGroup, FloatingLabel, Badge } from "react-bootstrap";
import React, { useEffect, useRef, useState } from "react";
import translate from "../../i18n/translate";
import { ReactComponent as SendIcon } from "../../assets/images/send.svg";
import {
    CreateNewOrderReq,
    GetDefinedAddresses,
    GetCitiesArea,
    getClientDefaultAddress,
    setClientDefaultAddress,
    getClientTempAddress,
    getPrivateAddresses,
    sendCustomNotification,
    getOrderInfoForReturnedOrder
} from "../../APIs/OrdersAPIs";
import { GetTransporterClients } from "../../APIs/OrdersAPIs"
import { ReactComponent as FoodIcon } from "../../assets/images/food.svg";
import { ReactComponent as SmBoxIcon } from "../../assets/images/smallBox.svg";
import { ReactComponent as MedBoxIcon } from "../../assets/images/medbox.svg";
import { ReactComponent as BigBoxIcon } from "../../assets/images/largebox.svg";
import { ReactComponent as DeliveryTruckIcon } from "../../assets/images/deliveryTruck.svg";
import { ReactComponent as LocationIcon } from "../../assets/images/location.svg";
import { ReactComponent as AttachmentIcon } from "../../assets/images/attachment.svg";
import { DeliveryTypes, PackageTypes } from "../Orders/OrdersTabularView";
import ClientDropdown from "../ClientDropdown";
import { AddIcon } from "@chakra-ui/icons";
import { useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import { toastNotification } from "../../Actions/GeneralActions";
import { isTransporter } from "../../Util";
import "../CreateNewOrder.css";
import { useHistory } from "react-router";
import CreateAddress from "../CreateAddress";
import { imgBaseUrl } from "../../Constants/GeneralCont";

export const PackageTypesIcons = {
    "1": FoodIcon,
    "2": SmBoxIcon,
    "3": MedBoxIcon,
    "4": BigBoxIcon
};


export default function CreateNewOrder(props) {
    console.log("create order page");
    const history = useHistory();

    const styles = {
        cardHeaderLg: {
            position: 'absolute',
            left: '20px',
            right: '20px',
            top: '-35px',
            background: "linear-gradient(90deg, #26a69a, #69d4a5)",
            color: 'white',
            borderRadius: '10px',
            fontWeight: 'bold',
            fontSize: "1rem"
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

    const [refresh, setRefresh] = useState(false);
    const [showError, setShowError] = useState(false);

    const [openConf, setOpenConf] = useState(false);
    const [packageType, setPackageType] = useState("2");
    const [deliveryType, setDeliveryType] = useState("2");
    const [inputValue, setInputValue] = useState('');
    const [clientInputValue, setClientInputValue] = useState('');
    const [deliverAddresses, setDeliverAddresses] = useState([]);
    const [clientAddresses, setClientAddresses] = useState([]);
    const [allClients, setAllClients] = useState([]);
    const [pickUpAddress, setPickUpAddress] = useState({});
    const [selectedClient, setSelectedClient] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    const [loadingSetDefault, setLoadingSetDefault] = useState(false);

    const [deliverTypeArr, setDeliverTypeArr] = useState([]);


    const [showPickupAddressModal, setShowPickupAddressModal] = useState(false);
    const [showReceiverAddressModal, setShowReceiverAddressModal] = useState(false);

    const [validated, setValidated] = useState(false);

    const [provinces, setProvinces] = useState([]);
    const [governorates, setGovernorates] = useState([]);
    const [cities, setCities] = useState([]);
    const [areas, setAreas] = useState([]);

    const [isNewAddress, setIsNewAddress] = useState(true);
    const [isReturnedOrder, setIsReturnedOrder] = useState(true);
    const [dileveryAddress, setDileveryAddress] = useState({});

    const deliveryCostRef = useRef();
    const notesRef = useRef();
    const heightRef = useRef();
    const widthRef = useRef();
    const lengthRef = useRef();
    const weightRef = useRef();
    const codAmountRef = useRef();
    const returnedAmountRef = useRef();
    const intl = useIntl();

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const id = queryParams.get('id');

        setDeliverTypeArr([
            { name: translate("ORDERS." + DeliveryTypes[2]), type: "2", active: !!id ? "" : "active" },
            { name: translate("ORDERS." + DeliveryTypes[1]), type: "1", active: "" },
            /* { name: translate("ORDERS." + DeliveryTypes[4]), type: "4", active: !!id ? "active" : "" }, */
        ])

        if (!!id) {
            setIsReturnedOrder(true);
            setIsNewAddress(false);
            // console.log("old");

            // 1- get old order info
            // 2- auto fill fields and set sender and reciever areas
            // 3- wait for user to enter the price (after setting order-type to pay and pickup)

            getOrderInfoForReturnedOrder(id).then((res) => {
                // console.log(res.data);

                setPickUpAddress({
                    "cityId": res.data.senderAddressCityId,
                    "areaId": res.data.senderAddressAreaId,
                    "governoratId": res.data.governoratId,
                    "provinceId": res.data.senderAddressGovernoratId,
                    "details": res.data.senderAddressDetails,
                    "latitude": res.data.senderAddressLatitude,
                    "longitude": res.data.senderAddressLongitude,
                    "id": res.data.senderAddressId,
                    "name": res.data.senderAddressName,
                    "areaName": res.data.senderAddressAreaName,
                    "phone_number": res.data.senderAddressPhone,
                });

                setDileveryAddress({
                    "name": res.data.receiverAddressName,
                    "phone_number": res.data.receiverAddressPhone,
                    "areaName": res.data.receiverAreaName,
                    "cityName": res.data.receiverCityName,
                    "govName": res.data.receiverGovName,
                    "provName": res.data.receiverProvName,
                    "cityId": res.data.receiverAddressCityId,
                    "areaId": res.data.receiverAddressAreaId,
                    "details": res.data.receiverAddressDetails,
                    "additional_info": res.data.receiverAddressAdditionalInfo,
                    "latitude": res.data.receiverAddressLatitude,
                    "longitude": res.data.receiverAddressLongitude,
                    "id": res.data.receiverAddressId,
                    "ReceiverAddressNum": res.data.receiverAddressPhone
                });

                setPackageType(res.data.packageType);

                setDeliveryType("4");
            });
        } else {
            setIsReturnedOrder(false)
            // console.log("new");
        }
    }, [])

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const id = queryParams.get('id');


        if (!isTransporter() && !!!id) {
            getClientDefaultAddress().then((res) => {
                if (res.data != null) {
                    setPickUpAddress(res.data);
                }
            })
        }
    }, [refresh]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(true);

            GetTransporterClients().then((res) => {
                setLoading(false);

                setAllClients(res.data.membersData.filter(client => client.FullName.toLowerCase().replaceAll("أ", 'ا').replaceAll("إ", 'ا').includes(clientInputValue.toLowerCase())));
            });
        }, 500)

        return () => {
            return clearTimeout(timer)
        }
    }, [clientInputValue, refresh]);

    useEffect(() => {
        getClientAddresses();
        getDeliveryAddresses();
    }, [refresh, inputValue])

    const getClientAddresses = () => {
        getPrivateAddresses(inputValue).then((res) => {
            setLoading(false);
            setClientAddresses(res.data);
        });
    }

    const getDeliveryAddresses = () => {
        GetDefinedAddresses(inputValue).then((res) => {
            setLoading(false);
            setDeliverAddresses(res.data);
        });
    }

    const handleDeliveryTypeClick = (index, type) => {
        setDeliveryType(type);

        let tempArr = [...deliverTypeArr];

        for (let i = 0; i < tempArr.length; i++) {
            tempArr[i].active = "";
        }

        tempArr[index].active = "active";

        setDeliverTypeArr(tempArr);
    }

    const createOrderHandler = (DeliveryParams, CreatedBy, AddressClint) => {

        /* console.log(DeliveryParams)
        console.log("----------------------------------")
        console.log(CreatedBy)
        console.log("----------------------------------")
        console.log(AddressClint) */

        CreateNewOrderReq(JSON.stringify(DeliveryParams), CreatedBy, JSON.stringify(AddressClint), isNewAddress ? "1" : "0").then((res) => {

            if (isReturnedOrder && false) {
                console.log(res.data);
            } else {

                /* edited (test data) */
                // console.log(res.data); // {"server_response":[{"OrderId":"936"}]}

                /* to be edited (to print order by returned id) */

                // orderIdRef.current = JSON.parse(res.data.replace("}{", ",")).server_response[0].OrderId;   // <--------------------------------------------------------------------------- to test
                //https://therichpost.com/reactjs-convert-html-into-pdf-working-functionality/

                /*  if (res.data == "Blocked") {
                     dispatch(toastNotification("Warning!", translate("GENERAL.BLOCKED"), "warning"));
                 } */

                let orderId = res.data/* .split('OrderId":"')[1].split('"')[0] */;

                const num = parseInt(orderId, 10);
                if(!isNaN(num) && Number.isInteger(num)) {
                    if (!isTransporter()) {
                        history.push("/account/Order/" + orderId);
                    }
    
                    setLoadingSubmit(false);
                } else {
                    alert("something went wrong!");
                }


                // let orderId = res.data.server_response[0].OrderId;

                // setOpenConf(true);

                /* if (!isTransporter()) {
                    history.push("/account/Order/" + orderId);
                }

                setLoadingSubmit(false); */

                /*  sendCustomNotification("createOrder", orderId).then(res => {
                     console.log(res.data);
                 }); */

                /* if (isTransporter()) {
                    history.push("/account/Order/" + orderId);
                } */
            }

        });
    }

    const getAllAreas = () => {
        // ...
    }

    const getProvences = () => {
        GetCitiesArea("provinces", -1).then((res) => {
            setProvinces(res.data.server_response);
        })
    }

    const updateSubLevel = (type, superId) => {
        GetCitiesArea(type, superId, 1).then((res) => {
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

    const setDefaultAddressHandler = (addressId) => {
        setLoadingSetDefault(true);

        setClientDefaultAddress(addressId).then((res) => {
            if (res.data === "previousDefaultUpdateError!" || res.data === "newDefaultUpdateError!") {
                dispatch(toastNotification("Error", res.data, "error"));
            } else {
                setShowPickupAddressModal(false);
                setRefresh(!refresh);
            }

            setLoadingSetDefault(false);
        })
    }

    const setTempAddressHandler = (addressId) => {
        setLoadingSetDefault(true);

        getClientTempAddress(addressId).then((res) => {
            // console.log(res.data);
            if (res.data != null) {
                setPickUpAddress(res.data);

                setShowPickupAddressModal(false);
                setLoadingSetDefault(false);
            }

        })
    }

    const setDeliverAddressHandler = (selectedAddress) => {
        // console.log(selectedAddress);

        setDileveryAddress(selectedAddress);
        setIsNewAddress(false);
        setIsReturnedOrder(false);
        setShowReceiverAddressModal(false);
    }

    return (
        <>
            {/* upper background */}
            <div className="upperBackground">
            </div>

            <div className="mainContainer" style={{ height: "80%", top: "150px" }}>
                <Container fluid className="pb-5">
                    <Row className="h2 d-flex justify-content-center" style={{ marginTop: "50px", marginBottom: "0px", fontWeight: "bold", color: "white" }}>
                        {translate("CREATE_NEW_ORDER.CREATE_ORDER")}
                    </Row>

                    {/* ------------------( transporter clients )------------------ */}
                    {isTransporter() && <Row className="mb-5">
                        <Col>
                            <Card className="rounded-3 shadow">
                                <Card.Header style={styles.cardHeaderLg}>
                                    <Card.Title className="mt-1">{translate("TEMP.MY_CLIENTS")}</Card.Title>
                                </Card.Header>
                                <Card.Body className="mb-3 mt-5">
                                    <div className="row">
                                        <div className="col-lg-9">

                                            <ClientDropdown
                                                loading={loading}
                                                clients={allClients}
                                                onSearch={setClientInputValue}
                                                onSelect={setSelectedClient}
                                                selectedClient={selectedClient}
                                            />

                                            {/*  {beginValidation && selectedClientCheck && <span style={{ color: "red" }}>required!</span>} */}

                                        </div>
                                        <div className="col-lg-3">
                                            <Form.Control type="number" style={{ marginTop: "9px" }} className="rounded-22 shadow" placeholder={intl.formatMessage({ id: "TEMP.DELIVERY_COST" })} ref={deliveryCostRef} />

                                            {/* {beginValidation && deliveryCostCheck && <span style={{ color: "red" }}>required!</span>} */}
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>}

                    {/* ------------------( order info )------------------ */}
                    <Row className="mb-5">
                        <Col>
                            {/* <Card className="rounded-3 shadow"> */}
                            {/*  <Card.Header style={styles.cardHeaderLg}>
                                    <Card.Title className="mt-2">{translate("CREATE_NEW_ORDER.ORDER_INFO")}</Card.Title>
                                </Card.Header> */}

                            <Form id="orderForm" validated={validated} noValidate onSubmit={(event) => {
                                event.preventDefault();
                                event.stopPropagation();

                                const formData = new FormData(event.target), formDataObj = Object.fromEntries(formData.entries());

                                // console.log(formDataObj);

                                const form = event.currentTarget;
                                if (form.checkValidity() === true) {
                                    // if all set, create order here: (get data from formDataObj)

                                    // nono

                                    let CreatedBy = "";

                                    let DeliveryParams = {
                                        deliveryWay: deliveryType,
                                        TypeLoad: packageType,
                                        CostLoad: formDataObj.codAmount != undefined ? formDataObj.codAmount : "",
                                        returnedCost: formDataObj.returnedAmount != undefined ? formDataObj.returnedAmount : "",
                                        DetailsLoad: formDataObj.notes != undefined ? formDataObj.notes : "",
                                        LengthLoad: formDataObj.length != undefined ? formDataObj.length : "",
                                        WidthLoad: formDataObj.width != undefined ? formDataObj.width : "",
                                        HeightLoad: formDataObj.height != undefined ? formDataObj.height : "",
                                        WeightLoad: formDataObj.weight != undefined ? formDataObj.weight : "",
                                        currency: formDataObj.currency != undefined ? formDataObj.currency : "1",
                                        qrCode: ""
                                    };

                                    // console.log(DeliveryParams);
                                    // console.log(dileveryAddress)

                                    let AddressClint = {};

                                    if (isNewAddress) {
                                        AddressClint = {
                                            IdCity: pickUpAddress.cityId,
                                            IdArea: pickUpAddress.areaId,
                                            IdGov: pickUpAddress.governoratId,
                                            IdProv: pickUpAddress.provinceId,
                                            OtherDetails: pickUpAddress.details,
                                            LatSender: pickUpAddress.latitude,
                                            LongSender: pickUpAddress.longitude,
                                            SenderAddressId: pickUpAddress.id,

                                            IdCityDes: formDataObj.city,
                                            IdAreaDes: formDataObj.area,
                                            IdGovDes: formDataObj.governorate,
                                            IdProvDes: formDataObj.province,
                                            OtherDetailsDes: formDataObj.address != undefined ? formDataObj.address : "",
                                            addressName: formDataObj.placeName != undefined ? formDataObj.placeName : "",
                                            LatReciver: "",
                                            LongReciver: "",
                                            ReceiverAddressNum: formDataObj.receiverPhone,
                                            zipCode: "00000",
                                            country: "Palestine",
                                            isShared: "false",
                                            additionalInfo: formDataObj.addressinfo != undefined ? formDataObj.addressinfo : "",
                                        };
                                    } else {
                                        AddressClint = {
                                            IdCity: pickUpAddress.cityId,
                                            IdArea: pickUpAddress.areaId,
                                            IdGov: pickUpAddress.governoratId,
                                            IdProv: pickUpAddress.provinceId,
                                            OtherDetails: pickUpAddress.details,
                                            LatSender: pickUpAddress.latitude,
                                            LongSender: pickUpAddress.longitude,
                                            SenderAddressId: pickUpAddress.id,

                                            IdCityDes: dileveryAddress.cityId,
                                            IdAreaDes: dileveryAddress.areaId,
                                            OtherDetailsDes: dileveryAddress.details,
                                            LatReciver: dileveryAddress.latitude,
                                            LongReciver: dileveryAddress.longitude,
                                            ReciverAddressId: dileveryAddress.id,
                                            ReceiverAddressNum: dileveryAddress.phone_number
                                        };
                                    }

                                    if (isReturnedOrder) {
                                        const queryParams = new URLSearchParams(window.location.search);
                                        const oldOrderId = queryParams.get('id');
                                        DeliveryParams.oldOrderId = oldOrderId;
                                    }

                                    // console.log(pickUpAddress);

                                    if (isTransporter()) {
                                        setLoadingSubmit(true);

                                        CreatedBy = "Transporter";

                                        DeliveryParams.ClientMobileNumber = selectedClient.PhoneNumber;
                                        DeliveryParams.DeliveryPrice = deliveryCostRef.current.value;

                                        createOrderHandler(DeliveryParams, CreatedBy, AddressClint);
                                    } else {
                                        setLoadingSubmit(true);

                                        CreatedBy = "ClientNew";

                                        // console.log(DeliveryParams);
                                        // console.log(AddressClint);

                                        createOrderHandler(DeliveryParams, CreatedBy, AddressClint);
                                    }

                                    setShowError(false);
                                } else {
                                    setShowError(true);
                                }

                                setValidated(true);
                            }}>
                                <ListGroup variant="flush" className="mt-5 customListGroup">

                                    {/* ------------------( package types )------------------ */}
                                    <ListGroup.Item className="py-4" disabled={isReturnedOrder ? true : false}>
                                        <div className="container-fluid">
                                            <div className="row">
                                                <div className="mb-3 h5" style={{ color: "#26a69a" }}>
                                                    {translate("ORDERS.WHAT_TO_TRANS")}
                                                </div>

                                                <div className="col-lg-4">
                                                    <Dropdown
                                                        style={{ width: "100%" }}
                                                        className="togo-dropdown shadow"
                                                        onSelect={(eve) => {
                                                            setPackageType(eve);
                                                        }}>
                                                        <Dropdown.Toggle variant="" className="w-100 text-start d-flex align-items-center">
                                                            {React.createElement(PackageTypesIcons[packageType], { style: { width: "20px", height: "20px" }, className: "me-1" })}
                                                            <div style={{ width: "97%" }}>
                                                                {translate("ORDERS." + PackageTypes[packageType])}
                                                            </div>
                                                        </Dropdown.Toggle>

                                                        <Dropdown.Menu className="w-100">
                                                            <Dropdown.Item eventKey="2" className="d-flex">
                                                                <FoodIcon style={{ width: "20px", height: "20px" }} className="me-1" />
                                                                {translate("ORDERS." + PackageTypes[2])}
                                                            </Dropdown.Item>
                                                            <Dropdown.Item eventKey="4" className="d-flex">
                                                                <BigBoxIcon style={{ width: "20px", height: "20px" }} className="me-1" />
                                                                {translate("ORDERS." + PackageTypes[4])}
                                                            </Dropdown.Item>
                                                            <Dropdown.Item eventKey="3" className="d-flex">
                                                                <MedBoxIcon style={{ width: "20px", height: "20px" }} className="me-1" />
                                                                {translate("ORDERS." + PackageTypes[3])}
                                                            </Dropdown.Item>
                                                            {/* temp comment food choice */}
                                                            {/* <Dropdown.Item eventKey="1" className="d-flex">
                                                                <SmBoxIcon style={{ width: "20px", height: "20px" }} className="me-1" />
                                                                {translate("ORDERS." + PackageTypes[1])}
                                                            </Dropdown.Item> */}
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </div>

                                                {packageType !== "1" && packageType !== "2" && <div className="col-lg-8" style={{ marginTop: "2px" }}>
                                                    <div className="row">
                                                        <div className="col-md-3">
                                                            <Form.Group>
                                                                <Form.Control
                                                                    name="height"
                                                                    type="number"
                                                                    className="rounded-22 input-inner-shadow"
                                                                    placeholder={intl.formatMessage({ id: "TEMP.HEIGHT" })}
                                                                    ref={heightRef}
                                                                />
                                                            </Form.Group>
                                                            <span style={{ color: "#1f8379" }}>({translate("CREATE_NEW_ORDER.OPTIONAL")})</span>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <Form.Control
                                                                name="width"
                                                                type="number"
                                                                className="rounded-22 input-inner-shadow"
                                                                placeholder={intl.formatMessage({ id: "TEMP.WIDTH" })}
                                                                ref={widthRef}
                                                            />
                                                            <span style={{ color: "#1f8379" }}>({translate("CREATE_NEW_ORDER.OPTIONAL")})</span>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <Form.Control
                                                                name="length"
                                                                type="number"
                                                                className="rounded-22 input-inner-shadow"
                                                                placeholder={intl.formatMessage({ id: "TEMP.LENGTH" })}
                                                                ref={lengthRef}
                                                            />
                                                            <span style={{ color: "#1f8379" }}>({translate("CREATE_NEW_ORDER.OPTIONAL")})</span>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <Form.Control
                                                                name="weight"
                                                                type="number"
                                                                className="rounded-22 input-inner-shadow"
                                                                placeholder={intl.formatMessage({ id: "TEMP.WEIGHT" })}
                                                                ref={weightRef}
                                                            />
                                                            <span style={{ color: "#1f8379" }}>({translate("CREATE_NEW_ORDER.OPTIONAL")})</span>
                                                        </div>
                                                    </div>
                                                </div>}
                                            </div>
                                        </div>
                                    </ListGroup.Item>

                                    {/* ------------------( delivery type )------------------ */}
                                    <ListGroup.Item className="py-4" style={{ backgroundColor: "#ededed" }}>
                                        <div className="container-fluid">
                                            <div className="d-flex align-items-center mb-3 h5" style={{ color: "#26a69a" }}>
                                                <DeliveryTruckIcon style={{ width: "20px", height: "20px" }} className="me-1" />
                                                {translate("CREATE_NEW_ORDER.SELECT_DELIVERY_TYPE")}
                                            </div>

                                            <div className="row">
                                                <div className="col-lg-12">
                                                    <div className={"toggleButtonsContainer"}>
                                                        {
                                                            deliverTypeArr.map((item, index) => {
                                                                return <div key={index} className={"toggleButton " + item.active + ((localStorage.getItem("Language") || "en") === "en" ? " me-2" : " ms-2")} onClick={() => { handleDeliveryTypeClick(index, item.type) }}>
                                                                    <div className="radio"><div className="innerRadio"></div></div> {item.name}
                                                                </div>
                                                            })
                                                        }
                                                        {deliveryType === "2" && <div className="d-flex justify-content-center" style={{ position: "absolute", left: "230px", top: "68px", width: "180px" }}>
                                                            <Form.Control
                                                                required={true}
                                                                name="codAmount"
                                                                min="1"
                                                                type="number"
                                                                step="0.01"
                                                                className="rounded-22 input-inner-shadow"
                                                                placeholder={intl.formatMessage({ id: "ORDERS.AMOUNT" })}
                                                                ref={codAmountRef}
                                                            />
                                                            {/* <Form.Label>{translate("CREATE_NEW_ORDER.CURRENCY")}:</Form.Label> */}
                                                            {/* localStorage.getItem("userId") == 41 */ true && <Form.Select style={{ cursor: "pointer" }} className="shadow rounded-22 ms-2" name="currency" required aria-label="Default select example">
                                                                <option value={1}>ILS</option>
                                                                <option value={2}>JOD</option>
                                                            </Form.Select>}
                                                        </div>}

                                                        {deliveryType === "4" && <div className="d-flex justify-content-center" style={{ position: "absolute", left: "230px", top: "200px", width: "180px" }}>
                                                            <Form.Control
                                                                required={true}
                                                                name="returnedAmount"
                                                                min="1"
                                                                type="number"
                                                                step="0.01"
                                                                className="rounded-22 input-inner-shadow"
                                                                placeholder={intl.formatMessage({ id: "ORDERS.AMOUNT" })}
                                                                ref={returnedAmountRef}
                                                            />
                                                            {/* <Form.Label>{translate("CREATE_NEW_ORDER.CURRENCY")}:</Form.Label> */}
                                                            {/* localStorage.getItem("userId") == 41 */ true && <Form.Select style={{ cursor: "pointer" }} className="shadow rounded-22 ms-2" name="currency" required aria-label="Default select example">
                                                                <option value={1}>ILS</option>
                                                                <option value={2}>JOD</option>
                                                            </Form.Select>}
                                                        </div>}
                                                    </div>
                                                </div>
                                                {/* <div className="col-lg-2">
                                                        {deliveryType === "2" && <>
                                                            <Form.Control
                                                                required={true}
                                                                name="codAmount"
                                                                min="3"
                                                                type="number"
                                                                className="rounded-22 input-inner-shadow" style={{ width: "100%" }}
                                                                placeholder={intl.formatMessage({ id: "ORDERS.AMOUNT" })}
                                                                ref={codAmountRef}
                                                            />
                                                        </>}
                                                    </div> */}
                                            </div>
                                        </div>
                                    </ListGroup.Item>

                                    {/* ------------------( addresses )------------------ */}
                                    <ListGroup.Item className="py-4">
                                        <div className="container-fluid">
                                            <div className="row">
                                                <div className="d-flex align-items-center mb-2 h5" style={{ color: "#26a69a" }}>
                                                    <LocationIcon style={{ width: "20px", height: "20px" }} className="me-1" />
                                                    {translate("ORDERS.PICKUP_ADDRESS")}
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-lg-12">

                                                    <Table>
                                                        <thead>
                                                            <tr>
                                                                <th scope="col">{translate("CREATE_NEW_ORDER.NAME")}</th>
                                                                <th style={{ width: "50%" }} scope="col">{translate("CREATE_NEW_ORDER.ADDRESS")}</th>
                                                                <th scope="col">{translate("CREATE_NEW_ORDER.MOBILE_NUMBER")}</th>
                                                                <th scope="col"></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td><Form.Control readOnly placeholder={pickUpAddress.name} /></td>
                                                                <td><Form.Control readOnly placeholder={pickUpAddress.details + ", " + pickUpAddress.areaName} /></td>
                                                                <td><Form.Control readOnly placeholder={pickUpAddress.phone_number} /></td>
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
                                                                        onHide={() => { setShowPickupAddressModal(false); setInputValue("") }}
                                                                        centered
                                                                        animation={true}
                                                                        size="xl"

                                                                        style={{ backgroundColor: "rgba(0,0,0,0.5)", }}
                                                                    >
                                                                        <Modal.Header closeButton style={styles.cardHeaderLg}>
                                                                            <Modal.Title>{translate("CREATE_NEW_ORDER.CHANGE_PICKUP_ADDRESS")}</Modal.Title>
                                                                        </Modal.Header>
                                                                        <Modal.Body className="mt-5">
                                                                            <Container fluid>
                                                                                <Row className="mb-2">
                                                                                    <Col lg={11}>
                                                                                        <span className="h4">{translate("CREATE_NEW_ORDER.SET_DAFAULT_ADDRESS")}:</span>
                                                                                    </Col>
                                                                                    <Col lg={1}>
                                                                                        <CreateAddress onSuccess={() => { setRefresh(!refresh) }}>
                                                                                            <Button style={{ cursor: "pointer" }} className="btn-grad p-2">
                                                                                                <AddIcon w={6} h={6} color="gray.50" />
                                                                                            </Button>
                                                                                        </CreateAddress>
                                                                                    </Col>
                                                                                </Row>
                                                                                <Row>
                                                                                    <Table >
                                                                                        <thead>
                                                                                            <tr>
                                                                                                <th style={{ width: "25%" }} scope="col">
                                                                                                    <FloatingLabel className="mb-2" controlId="addressName" label={translate("CREATE_NEW_ORDER.NAME")}>
                                                                                                        <Form.Control className="input-inner-shadow" type="text" placeholder="..." onChange={(e) => {
                                                                                                            setInputValue(e.target.value);
                                                                                                        }} />
                                                                                                    </FloatingLabel>
                                                                                                </th>
                                                                                                <th style={{ width: "25%", paddingBottom: "30px" }} scope="col">{translate("CREATE_NEW_ORDER.ADDRESS")}</th>
                                                                                                <th style={{ width: "20%" }} scope="col">
                                                                                                    <FloatingLabel className="mb-2" controlId="addressName" label={translate("CREATE_NEW_ORDER.MOBILE_NUMBER")}>
                                                                                                        <Form.Control className="input-inner-shadow" type="text" placeholder="..." onChange={(e) => {
                                                                                                            setInputValue(e.target.value);
                                                                                                        }} />
                                                                                                    </FloatingLabel>
                                                                                                </th>
                                                                                                <th style={{ width: "30%" }} scope="col"> </th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                    </Table>
                                                                                    <div style={{ height: "300px", overflowY: "scroll" }}>
                                                                                        <Table>
                                                                                            <tbody>
                                                                                                {
                                                                                                    clientAddresses.map((address, index) => {
                                                                                                        return <tr key={index}>
                                                                                                            <td style={{ width: "25%" }}>{address.name}</td>
                                                                                                            <td style={{ width: "25%" }}>{address.details + ", " + address.cityName}</td>
                                                                                                            <td style={{ width: "20%" }}>{address.phone_number}</td>
                                                                                                            {address.is_default == "0" ? <td style={{ width: "30%" }}>
                                                                                                                <Button disabled={loadingSetDefault ? true : false} className="btn-grad" onClick={() => {
                                                                                                                    setDefaultAddressHandler(address.id);
                                                                                                                }}>
                                                                                                                    {loadingSetDefault && <Spinner animation="border" size="sm" />}
                                                                                                                    {translate("CREATE_NEW_ORDER.SET_DEFAULT")}
                                                                                                                </Button>
                                                                                                                <Button disabled={loadingSetDefault ? true : false} className="btn-grad mx-2" onClick={() => {
                                                                                                                    setTempAddressHandler(address.id);
                                                                                                                }}>
                                                                                                                    {loadingSetDefault && <Spinner animation="border" size="sm" />}
                                                                                                                    {translate("CREATE_NEW_ORDER.SET_FOR_NOW")}
                                                                                                                </Button>
                                                                                                            </td> : <td>
                                                                                                                <Button disabled variant="danger">
                                                                                                                    {translate("CREATE_NEW_ORDER.DEFAULT_ADDRESS")}
                                                                                                                </Button>
                                                                                                            </td>}
                                                                                                        </tr>
                                                                                                    })
                                                                                                }
                                                                                            </tbody>
                                                                                        </Table>
                                                                                    </div>
                                                                                </Row>
                                                                            </Container>
                                                                        </Modal.Body>
                                                                    </Modal>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </Table>
                                                </div>
                                            </div>
                                        </div>
                                    </ListGroup.Item>

                                    {/* ------------------( receiver address )------------------ */}
                                    <ListGroup.Item className="py-4" style={{ backgroundColor: "#ededed" }}>
                                        <div className="container-fluid">
                                            <div className="row">
                                                <div className="col-lg-11 d-flex align-items-center h5 mb-3" style={{ color: "#26a69a" }}>
                                                    {
                                                        (isNewAddress && !isReturnedOrder) ? <>
                                                            <SendIcon style={{ width: "20px", height: "20px" }} className="me-1" />
                                                            {translate("CREATE_NEW_ORDER.SET_NEW_ADDRESS")} &nbsp; <Badge className="custome-link rounded-pill" onClick={() => {
                                                                setShowReceiverAddressModal(true);
                                                                setInputValue("");
                                                            }}>{translate("CREATE_NEW_ORDER.OR_CHOOSE_FROM_LIST")} <i className="bi bi-list"></i></Badge>
                                                        </> : <>
                                                            <SendIcon style={{ width: "20px", height: "20px" }} className="me-1" />
                                                            <Badge className="custome-link rounded-pill" onClick={() => {
                                                                setIsNewAddress(true);
                                                            }}>{translate("CREATE_NEW_ORDER.SET_NEW_ADDRESS")}</Badge> &nbsp; <Badge className="custome-link rounded-pill" onClick={() => {
                                                                setShowReceiverAddressModal(true);
                                                                setInputValue("");
                                                            }}>{translate("CREATE_NEW_ORDER.CHANGE_FROM_LIST")} <i className="bi bi-arrow-repeat"></i></Badge>
                                                        </>
                                                    }
                                                </div>

                                                <Modal
                                                    show={showReceiverAddressModal}
                                                    onHide={() => { setShowReceiverAddressModal(false); setInputValue("") }}
                                                    centered
                                                    animation={true}
                                                    size="xl"

                                                    style={{ backgroundColor: "rgba(0,0,0,0.5)", }}
                                                >
                                                    <Modal.Header closeButton style={styles.cardHeaderLg}>
                                                        <Modal.Title>{translate("CREATE_NEW_ORDER.CHOOSE_DELIVERY_ADDRESS")}</Modal.Title>
                                                    </Modal.Header>
                                                    <Modal.Body className="mt-5">
                                                        <Container fluid>
                                                            <Row className="mb-2">
                                                                <Col lg={11}>
                                                                    <span className="h4">{translate("CREATE_NEW_ORDER.SELECT_DELIVERY_ADDRESS_FROM_LIST")}:</span>
                                                                </Col>
                                                                {/* <Col lg={1}>
                                                                    <CreateAddress onSuccess={() => { setRefresh(!refresh) }}>
                                                                        <Button style={{ cursor: "pointer" }} className="btn-grad p-2">
                                                                            <AddIcon w={6} h={6} color="gray.50" />
                                                                        </Button>
                                                                    </CreateAddress>
                                                                </Col> */}
                                                            </Row>
                                                            <Row>
                                                                <Table>
                                                                    <thead>
                                                                        <tr>
                                                                            <th style={{ width: "30%" }} scope="col">
                                                                                <FloatingLabel className="mb-2" controlId="addressName" label={translate("CREATE_NEW_ORDER.NAME")}>
                                                                                    <Form.Control className="input-inner-shadow" type="text" placeholder="..." onChange={(e) => {
                                                                                        setInputValue(e.target.value);
                                                                                    }} />
                                                                                </FloatingLabel>
                                                                            </th>
                                                                            <th style={{ width: "35%", paddingBottom: "30px" }} scope="col">{translate("CREATE_NEW_ORDER.ADDRESS")}</th>
                                                                            <th style={{ width: "20%" }} scope="col">
                                                                                <FloatingLabel className="mb-2" controlId="addressName" label={translate("CREATE_NEW_ORDER.MOBILE_NUMBER")}>
                                                                                    <Form.Control className="input-inner-shadow" type="text" placeholder="..." onChange={(e) => {
                                                                                        setInputValue(e.target.value);
                                                                                    }} />
                                                                                </FloatingLabel>
                                                                            </th>
                                                                            <th style={{ width: "15%" }} scope="col"> </th>
                                                                        </tr>
                                                                    </thead>
                                                                </Table>
                                                                <div style={{ height: "300px", overflowY: "scroll" }}>
                                                                    <Table>
                                                                        <tbody>
                                                                            {
                                                                                deliverAddresses.map((address, index) => {
                                                                                    return <tr key={index}>
                                                                                        <td style={{ width: "30%" }}>{address.name}</td>
                                                                                        <td style={{ width: "35%" }}>{address.details + ", " + address.cityName}</td>
                                                                                        <td style={{ width: "20%" }}>{address.phone_number}</td>
                                                                                        <td style={{ width: "15%" }}>
                                                                                            <Button disabled={loadingSetDefault ? true : false} className="btn-grad" onClick={() => {
                                                                                                setDeliverAddressHandler(address);
                                                                                            }}>
                                                                                                {loadingSetDefault && <Spinner animation="border" size="sm" />}
                                                                                                {translate("CREATE_NEW_ORDER.SELECT")}
                                                                                            </Button>
                                                                                        </td>
                                                                                    </tr>
                                                                                })
                                                                            }
                                                                        </tbody>
                                                                    </Table>
                                                                </div>
                                                            </Row>
                                                        </Container>
                                                    </Modal.Body>
                                                </Modal>
                                            </div>

                                            {(isNewAddress == true && !isReturnedOrder) ? <>
                                                <div className="row mt-1">
                                                    <div className="col-lg-6">
                                                        <Form.Group>
                                                            <FloatingLabel className="mb-3" controlId="placeName" label={translate("CREATE_NEW_ORDER.NAME")}>
                                                                <Form.Control className="rounded-22 input-inner-shadow" type="text" placeholder="..." name="placeName" data-test="receiver-name-input" required />
                                                                <Form.Control.Feedback type="invalid">
                                                                    {translate("CREATE_NEW_ORDER.PLEASE_ADD_PLACE_NAME")}
                                                                </Form.Control.Feedback>
                                                            </FloatingLabel>
                                                        </Form.Group>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <Form.Group>
                                                            <FloatingLabel className="mb-3" controlId="userPhone" label={translate("CREATE_NEW_ORDER.MOBILE_NUMBER")}>
                                                                <Form.Control className="rounded-22 input-inner-shadow" type="tel" placeholder="..." name="receiverPhone" pattern="^0[0-9]{9}$" required />
                                                                <Form.Control.Feedback type="invalid">
                                                                    {translate("CREATE_NEW_ORDER.PLEASE_ENTER_VALID_NUMBER")}
                                                                </Form.Control.Feedback>
                                                            </FloatingLabel>
                                                        </Form.Group>
                                                    </div>
                                                </div>

                                                <div className="row">
                                                    <Col lg={3} className="mb-4">
                                                        <Form.Label>{translate("CREATE_NEW_ORDER.PROVINCE")}:</Form.Label>
                                                        <Form.Select style={{ cursor: "pointer" }} className="shadow" name="province" required aria-label="Default select example"
                                                            onClick={() => {
                                                                getProvences();
                                                            }}
                                                            onChange={(e) => {
                                                                updateSubLevel("governorates", e.target.value)
                                                            }}>
                                                            <option value={""} style={{ color: "lightgray" }}>{intl.formatMessage({ id: "CREATE_NEW_ORDER.SELECT_PROVINCE" })}</option>
                                                            {
                                                                provinces.map((item, index) => {
                                                                    return <option key={index} value={item.id}>{item.name}</option>
                                                                })
                                                            }
                                                        </Form.Select>
                                                    </Col>
                                                    <Col lg={3} className="mb-4">
                                                        <Form.Label>{translate("CREATE_NEW_ORDER.GOVERNORATE")}:</Form.Label>
                                                        <Form.Select style={{ cursor: "pointer" }} className="shadow" name="governorate" required aria-label="Default select example" onChange={(e) => {
                                                            updateSubLevel("cities", e.target.value)
                                                        }}>
                                                            <option value={""} style={{ color: "lightgray" }}>{intl.formatMessage({ id: "CREATE_NEW_ORDER.SELECT_GOVERNORATE" })}</option>
                                                            {
                                                                governorates.map((item, index) => {
                                                                    return <option key={index} value={item.id}>{item.name}</option>
                                                                })
                                                            }
                                                        </Form.Select>
                                                    </Col>
                                                    <Col lg={3} className="mb-4">
                                                        <Form.Label>{translate("CREATE_NEW_ORDER.CITY")}:</Form.Label>
                                                        <Form.Select style={{ cursor: "pointer" }} className="shadow" name="city" required aria-label="Default select example" onChange={(e) => {
                                                            updateSubLevel("areas", e.target.value)
                                                        }}>
                                                            <option value={""} style={{ color: "lightgray" }}>{intl.formatMessage({ id: "CREATE_NEW_ORDER.SELECT_CITY" })}</option>
                                                            {
                                                                cities.map((item, index) => {
                                                                    return <option key={index} value={item.id}>{item.name}</option>
                                                                })
                                                            }
                                                        </Form.Select>
                                                    </Col>
                                                    <Col lg={3} className="">
                                                        <Form.Label>{translate("CREATE_NEW_ORDER.AREA")} {/* <span style={{ color: "#1f8379" }}>({translate("CREATE_NEW_ORDER.OPTIONAL")})</span> */}:</Form.Label>
                                                        <Form.Select style={{ cursor: "pointer" }} className="shadow" name="area" required aria-label="Default select example">
                                                            <option value={""} style={{ color: "lightgray" }}>{intl.formatMessage({ id: "CREATE_NEW_ORDER.SELECT_AREA" })}</option>
                                                            {
                                                                areas.map((item, index) => {
                                                                    return <option key={index} value={item.id}>{item.name}</option>
                                                                })
                                                            }
                                                        </Form.Select>
                                                    </Col>
                                                </div>

                                                <div className="row">
                                                    <div className="col-lg-6">
                                                        <Form.Group>
                                                            <FloatingLabel className="" controlId="userAddress" label={translate("CREATE_NEW_ORDER.ADDRESS")}>
                                                                <Form.Control required className="rounded-22 input-inner-shadow" type="text" placeholder="..." name="address" />
                                                            </FloatingLabel>
                                                            {/*  <span style={{ color: "#1f8379" }}>({translate("CREATE_NEW_ORDER.OPTIONAL")})</span> */}
                                                        </Form.Group>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <Form.Group>
                                                            <FloatingLabel className="" controlId="addressInfo" label={translate("CREATE_NEW_ORDER.ADDRESS_INFO")}>
                                                                <Form.Control className="rounded-22 input-inner-shadow" type="text" placeholder="..." name="addressinfo" />
                                                            </FloatingLabel>
                                                            <span style={{ color: "#1f8379" }}>({translate("CREATE_NEW_ORDER.OPTIONAL")})</span>
                                                        </Form.Group>
                                                    </div>
                                                </div>
                                                {/* ------------------------------------------------------------------------------- */}
                                            </> : <>
                                                <div className="row mt-1 mb-3">
                                                    <div className="col-lg-6">
                                                        <label>{translate("CREATE_NEW_ORDER.NAME")}</label>
                                                        <Form.Control disabled className="rounded-22 input-inner-shadow" type="text" data-test="receiver-name-input" placeholder={dileveryAddress?.name} />
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <label>{translate("CREATE_NEW_ORDER.MOBILE_NUMBER")}</label>
                                                        <Form.Control disabled className="rounded-22 input-inner-shadow" type="tel" placeholder={dileveryAddress?.phone_number} />
                                                    </div>
                                                </div>

                                                <div className="row">
                                                    <Col lg={3} className="mb-4">
                                                        <Form.Label>{translate("CREATE_NEW_ORDER.PROVINCE")}:</Form.Label>
                                                        <Form.Select disabled className="shadow" aria-label="Default select example">
                                                            <option>{dileveryAddress?.provName}</option>
                                                        </Form.Select>
                                                    </Col>
                                                    <Col lg={3} className="mb-4">
                                                        <Form.Label>{translate("CREATE_NEW_ORDER.GOVERNORATE")}:</Form.Label>
                                                        <Form.Select disabled className="shadow" aria-label="Default select example">
                                                            <option>{dileveryAddress?.govName}</option>
                                                        </Form.Select>
                                                    </Col>
                                                    <Col lg={3} className="mb-4">
                                                        <Form.Label>{translate("CREATE_NEW_ORDER.CITY")}:</Form.Label>
                                                        <Form.Select disabled className="shadow" aria-label="Default select example">
                                                            <option>{dileveryAddress?.cityName}</option>
                                                        </Form.Select>
                                                    </Col>
                                                    <Col lg={3} className="">
                                                        <Form.Label>{translate("CREATE_NEW_ORDER.AREA")}:</Form.Label>
                                                        <Form.Select disabled className="shadow" aria-label="Default select example">
                                                            <option>{dileveryAddress?.areaName}</option>
                                                        </Form.Select>
                                                    </Col>
                                                </div>

                                                <div className="row">
                                                    <div className="col-lg-6">
                                                        <label>{translate("CREATE_NEW_ORDER.ADDRESS")}</label>
                                                        <Form.Control disabled className="rounded-22 input-inner-shadow" type="text" placeholder={dileveryAddress?.details} />
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <label>{translate("CREATE_NEW_ORDER.ADDRESS_INFO")}</label>
                                                        <Form.Control disabled className="rounded-22 input-inner-shadow" type="text" placeholder={dileveryAddress?.additional_info} />
                                                    </div>
                                                </div>
                                            </>}
                                        </div>
                                    </ListGroup.Item>

                                    {/* ------------------( order notes )------------------ */}
                                    <ListGroup.Item className="py-4">
                                        <div className="container-fluid">
                                            <div className="d-flex align-items-center mb-3 h5" style={{ color: "#26a69a" }}>
                                                <AttachmentIcon style={{ width: "20px", height: "20px" }} className="me-1" />
                                                {translate("CREATE_NEW_ORDER.ATTACHMENTS_LABEL")}
                                            </div>

                                            <Form.Control name="notes" type="text" className="mt-2 rounded-22 input-inner-shadow" placeholder={intl.formatMessage({ id: "CREATE_NEW_ORDER.NOTES" })} ref={notesRef} />
                                            <span style={{ color: "#1f8379" }}>({translate("CREATE_NEW_ORDER.OPTIONAL")})</span>
                                        </div>
                                    </ListGroup.Item>

                                    {/* ------------------( order notes )------------------ */}
                                    <ListGroup.Item className="py-4" style={{ backgroundColor: "#ededed" }}>
                                        <div className="container-fluid">
                                            {showError && <span style={{ color: "#d9534f" }}>
                                                <i className="bi bi-info-circle"></i>{" "}
                                                {translate("CREATE_NEW_ORDER.REQUIRED_ERROR")}
                                            </span>}
                                            {true ? <Button
                                                className="btn-grad"
                                                style={{ width: "30%", float: "right" }}
                                                disabled={loadingSubmit}
                                                type="submit"
                                            >
                                                {loadingSubmit && <Spinner animation="border" size="sm" />}
                                                {isTransporter() ? translate("ORDERS.CREATE_ORDER") : translate("CREATE_NEW_ORDER.SUBMIT_ORDER")}
                                            </Button> : <span className="h6" style={{ color: "#26a69a", float: "right" }}>{isTransporter() ? translate("TEMP.SUCCISSFULLY_PUBLISHED") : translate("TEMP.SUCCISSFULLY_PUBLISHED_CLIENT")}</span>}
                                        </div>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Form>
                            {/* </Card> */}
                        </Col>
                    </Row>

                    {/* <Modal
                        show={openConf}
                        onHide={() => {

                            setOpenConf(false);
                        }}
                        animation={false}
                        backdrop="static"
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>Confirmation</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <p>Would you like to print a waybill ?</p>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    setOpenConf(false);
                                }}
                            >
                                No
                            </Button>

                            <Button
                                variant="primary"
                                onClick={() => {
                                    setOpenConf(false);
                                    window.open("/account/bill-for-order/" + orderIdRef.current + "?print=true")
                                }}
                            >
                                Yes
                            </Button>
                        </Modal.Footer>
                    </Modal> */}

                </Container>
            </div>
        </>
    )
}