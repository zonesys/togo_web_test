import { Button, Dropdown, Form, Modal, Spinner, Table, Container, Row, Col, ListGroup, FloatingLabel, Badge } from "react-bootstrap";
import React, { useEffect, useRef, useState } from "react";
import translate from "../../i18n/translate";
import { ReactComponent as SendIcon } from "../../assets/images/send.svg";
import {
    createOrder_v2,
    GetDefinedAddresses,
    GetCitiesArea,
    getClientDefaultAddress,
    setClientDefaultAddress,
    getClientTempAddress,
    getPrivateAddresses,
    sendCustomNotification
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
import { AddIcon } from "@chakra-ui/icons";
import { useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import { toastNotification } from "../../Actions/GeneralActions";
import { isTransporter } from "../../Util";
import "./CreateOrder_v2.css";
import { useHistory } from "react-router";
import CreateAddress from "../CreateAddress";
import { FaSearch } from "react-icons/fa";

export const PackageTypesIcons = {
    "1": FoodIcon,
    "2": SmBoxIcon,
    "3": MedBoxIcon,
    "4": BigBoxIcon
};

export default function CreateOrder_v2(props) {

    const history = useHistory();
    let dispatch = useDispatch();

    // refresh component based on state changes
    const [refresh, setRefresh] = useState(false);

    // to show "fields required" error
    const [showError, setShowError] = useState(false);

    const intl = useIntl();

    // form validation
    const [validated, setValidated] = useState(false);
    const [packageType, setPackageType] = useState("2");
    const [deliveryType, setDeliveryType] = useState("2");
    const [inputValue, setInputValue] = useState('');
    const [clientInputValue, setClientInputValue] = useState('');
    const [deliverAddresses, setDeliverAddresses] = useState([]);
    const [clientAddresses, setClientAddresses] = useState([]);
    const [allClients, setAllClients] = useState([]);
    const [pickUpAddress, setPickUpAddress] = useState({});
    const [selectedClient, setSelectedClient] = useState("");
    const [deliverTypeArr, setDeliverTypeArr] = useState([]);
    const [isNewAddress, setIsNewAddress] = useState(true);
    const [dileveryAddress, setDileveryAddress] = useState({});

    const [loading, setLoading] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [loadingSetDefault, setLoadingSetDefault] = useState(false);

    const [showPickupAddressModal, setShowPickupAddressModal] = useState(false);
    const [showReceiverAddressModal, setShowReceiverAddressModal] = useState(false);

    // selected areas
    const [provinces, setProvinces] = useState([]);
    const [governorates, setGovernorates] = useState([]);
    const [cities, setCities] = useState([]);
    const [areas, setAreas] = useState([]);

    const codAmountRef = useRef();
    const returnedAmountRef = useRef();

    useEffect(() => {

        // delivery types
        setDeliverTypeArr([
            { name: translate("ORDERS." + DeliveryTypes[2]), type: "2", active: /* !!id ? "" :  */"active" },
            { name: translate("ORDERS." + DeliveryTypes[1]), type: "1", active: "" },
            /* { name: translate("ORDERS." + DeliveryTypes[4]), type: "4", active: !!id ? "active" : "" }, */
        ])
    }, [])

    // get client's default address
    useEffect(() => {
        getClientDefaultAddress().then((res) => {
            if (res.data != null) {
                setPickUpAddress(res.data);
            }
        })
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

    const createOrderHandler = (delivery_params, addresses_params, returned_params) => {

        setLoadingSubmit(true)

        createOrder_v2(JSON.stringify(delivery_params), JSON.stringify(addresses_params), JSON.stringify(returned_params)).then((res) => {

            if (res.data.status == "error") {
                console.log(res.data.error)
                dispatch(toastNotification("Error!", "something went wrong!", "error"))
                setLoadingSubmit(false)
            } else {
                let orderId = res.data.order_id

                const num = parseInt(orderId, 10)
                if (!isNaN(num) && Number.isInteger(num)) {
                    history.push("/account/Order/" + orderId)
                } else {
                    console.log("order id response error, order_id: " + orderId)
                    dispatch(toastNotification("Error!", "something went wrong!", "error"))
                    setLoadingSubmit(false)
                }
            }

        });
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

        setDileveryAddress(selectedAddress);
        setIsNewAddress(false);
        setShowReceiverAddressModal(false);
    }

    return (
        <>
            {/* upper background */}
            <div className="upperBackground">
            </div>

            <div className="mainContainer" style={{ height: null, marginTop:"10%" }}>
                <Container fluid className="pb-5">
                    <Row className="h2 d-flex justify-content-center" style={{ marginTop: "50px", marginBottom: "0px", fontWeight: "bold", color: "white" }}>
                        {translate("CREATE_NEW_ORDER.CREATE_ORDER")}
                    </Row>

                    {/* ------------------( order info )------------------ */}
                    <Row className="mb-5">
                        <Col>
                            <Form
                                id="orderForm"
                                validated={validated}
                                noValidate
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();

                                    const formData = new FormData(event.target), formDataObj = Object.fromEntries(formData.entries());

                                    // debug
                                    /* console.log("--==( formDataObj )==--")
                                    console.log(formDataObj); */
                                    // return

                                    const form = event.currentTarget;
                                    if (form.checkValidity() === true) {
                                        // if all set, create order here: (get data from formDataObj, pickUpAddress, and dileveryAddress)

                                        // delivery params
                                        let delivery_params = {
                                            cod: formDataObj.codAmount != undefined ? formDataObj.codAmount : "",
                                            currency: formDataObj.currency != undefined ? formDataObj.currency : "1",
                                            delivery_type: deliveryType,
                                            load_type: packageType,
                                            notes: formDataObj.notes != undefined ? formDataObj.notes : "",
                                            load_length: formDataObj.length != undefined ? formDataObj.length : "",
                                            load_width: formDataObj.width != undefined ? formDataObj.width : "",
                                            load_height: formDataObj.height != undefined ? formDataObj.height : "",
                                            load_weight: formDataObj.weight != undefined ? formDataObj.weight : "",
                                        }

                                        // debug
                                        /* console.log("--==( delivery_params )==--")
                                        console.log(delivery_params) */
                                        // return

                                        // sender address params
                                        let addresses_params = {
                                            sender_address_id: pickUpAddress.id,
                                            sender_other_details: pickUpAddress.details,
                                            sender_governorate_id: pickUpAddress.governoratId,
                                            sender_city_id: pickUpAddress.cityId,
                                            sender_area_id: pickUpAddress.areaId,
                                            /* sender_latitude: pickUpAddress.latitude,
                                            sender_longitude: pickUpAddress.longitude */

                                            is_new_receiver_address: "",
                                            receiver_name: "",
                                            receiver_phone: "",
                                            receiver_other_details: "",
                                            receiver_notes: "",
                                            receiver_area_id: "",
                                            receiver_city_id: "",
                                            receiver_governorate_id: "",
                                            receiver_province_id: "",
                                            receiver_address_id: "",
                                        }

                                        // receiver address params
                                        if (isNewAddress) {
                                            // if new receiver address
                                            addresses_params.is_new_receiver_address = "1"
                                            addresses_params.receiver_name = formDataObj.placeName
                                            addresses_params.receiver_phone = formDataObj.receiverPhone
                                            addresses_params.receiver_other_details = (formDataObj.address != undefined ? formDataObj.address : "")
                                            addresses_params.receiver_notes = (formDataObj.addressinfo != undefined ? formDataObj.addressinfo : "")
                                            addresses_params.receiver_area_id = formDataObj.area
                                            addresses_params.receiver_city_id = formDataObj.city
                                            addresses_params.receiver_governorate_id = formDataObj.governorate
                                            addresses_params.receiver_province_id = formDataObj.province
                                            /* addresses_params.receiver_latitude = ""
                                            addresses_params.receiver_longitude = "" */
                                        } else {
                                            // if selected receiver address
                                            addresses_params.is_new_receiver_address = "0"
                                            addresses_params.receiver_address_id = dileveryAddress.id
                                            addresses_params.receiver_other_details = dileveryAddress.details
                                            addresses_params.receiver_phone = dileveryAddress.phone_number
                                            addresses_params.receiver_city_id = dileveryAddress.cityId
                                            addresses_params.receiver_governorate_id = dileveryAddress.governoratId
                                            addresses_params.receiver_area_id = dileveryAddress.areaId
                                            /* addresses_params.receiver_latitude = dileveryAddress.latitude
                                            addresses_params.receiver_longitude = dileveryAddress.longitude */
                                        }

                                        // debug
                                        /* console.log("--==( addresses_params )==--")
                                        console.log(addresses_params) */
                                        // return

                                        const returned_params = {
                                            is_returned_order: "0"
                                        }

                                        // debug
                                        /* console.log("--==( returned_params )==--")
                                        console.log(returned_params) */
                                        // return

                                        createOrderHandler(delivery_params, addresses_params, returned_params);

                                        setShowError(false);
                                    } else {
                                        setShowError(true);
                                    }

                                    setValidated(true);
                                }}>
                                <ListGroup variant="flush" className="mt-5 list-divs">

                                    {/* ------------------( package types )------------------ */}
                                    <ListGroup.Item className="py-4">
                                        <div className="container-fluid" data-test="package-types-container">
                                            <div className="div-title">
                                                {translate("ORDERS.WHAT_TO_TRANS")}
                                            </div>

                                            <div className="row">
                                                <div className="col-lg-4">
                                                    <Dropdown
                                                        style={{ width: "100%" }}
                                                        className="togo-dropdown shadow"
                                                        data-test="package-types-dropdown"
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
                                                            <Form.Control
                                                                name="height"
                                                                type="number"
                                                                data-test="package-height"
                                                                className="input-inner-shadow"
                                                                placeholder={intl.formatMessage({ id: "TEMP.HEIGHT" })}
                                                            />
                                                            <span style={{ color: "#1f8379" }}>({translate("CREATE_NEW_ORDER.OPTIONAL")})</span>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <Form.Control
                                                                name="width"
                                                                type="number"
                                                                data-test="package-width"
                                                                className="input-inner-shadow"
                                                                placeholder={intl.formatMessage({ id: "TEMP.WIDTH" })}
                                                            />
                                                            <span style={{ color: "#1f8379" }}>({translate("CREATE_NEW_ORDER.OPTIONAL")})</span>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <Form.Control
                                                                name="length"
                                                                type="number"
                                                                className="input-inner-shadow"
                                                                data-test="package-length"
                                                                placeholder={intl.formatMessage({ id: "TEMP.LENGTH" })}
                                                            />
                                                            <span style={{ color: "#1f8379" }}>({translate("CREATE_NEW_ORDER.OPTIONAL")})</span>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <Form.Control
                                                                name="weight"
                                                                type="number"
                                                                className="input-inner-shadow"
                                                                data-test="package-weight"
                                                                placeholder={intl.formatMessage({ id: "TEMP.WEIGHT" })}
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
                                        <div className="container-fluid" data-test="delivery-type-container">
                                            <div className="div-title">
                                                <DeliveryTruckIcon className="title-icon-stroke" />
                                                {translate("CREATE_NEW_ORDER.SELECT_DELIVERY_TYPE")}
                                            </div>

                                            <div className="row">
                                                <div className="col-lg-12">
                                                    <div className="toggleButtonsContainer">
                                                        {
                                                            deliverTypeArr.map((item, index) => {
                                                                return <div key={index} data-test={"radio-"+ item.name} className={"toggleButton " + item.active + ((localStorage.getItem("Language") || "en") === "en" ? " me-2" : " ms-2")} onClick={() => { handleDeliveryTypeClick(index, item.type) }}>
                                                                    <div className="radio"><div className="innerRadio"></div></div> {item.name}
                                                                </div>
                                                            })
                                                        }

                                                        {deliveryType === "2" && <div className="d-flex justify-content-center" style={(localStorage.getItem("Language") || "en") === "en" ? { position: "absolute", left: "230px", top: "87.5px", width: "180px" } : { position: "absolute", right: "240px", top: "87.5px", width: "180px" }}>
                                                            <Form.Control
                                                                required={true}
                                                                name="codAmount"
                                                                min="1"
                                                                type="number"
                                                                step="0.01"
                                                                className="input-inner-shadow"
                                                                data-test="amount-input"
                                                                placeholder={intl.formatMessage({ id: "ORDERS.AMOUNT" })}
                                                                ref={codAmountRef}
                                                                style={{ width: "100px" }}
                                                            />
                                                            {<Form.Select style={{ cursor: "pointer" }} className="shadow ms-2" name="currency" required aria-label="Default select example" data-test="currency-type-dropdown">
                                                                <option value={1}>ILS</option>
                                                                <option value={2}>JOD</option>
                                                            </Form.Select>}
                                                        </div>}

                                                        {/* PAP -> temp canceled */}
                                                        {false && deliveryType === "4" && <div className="d-flex justify-content-center" style={{ position: "absolute", left: "230px", top: "200px", width: "180px" }}>
                                                            <Form.Control
                                                                required={true}
                                                                name="returnedAmount"
                                                                min="1"
                                                                type="number"
                                                                step="0.01"
                                                                className="rounded-22 input-inner-shadow"
                                                                placeholder={intl.formatMessage({ id: "ORDERS.AMOUNT" })}
                                                                ref={returnedAmountRef}
                                                                style={{ width: "100px" }}
                                                            />
                                                            {<Form.Select style={{ cursor: "pointer" }} className="shadow rounded-22 ms-2" name="currency" required aria-label="Default select example">
                                                                <option value={1}>ILS</option>
                                                                <option value={2}>JOD</option>
                                                            </Form.Select>}
                                                        </div>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </ListGroup.Item>

                                    {/* ------------------( sender address )------------------ */}
                                    <ListGroup.Item className="py-4">
                                        <div className="container-fluid" data-test="pickup-address-container">
                                            <div className="div-title">
                                                <LocationIcon className="title-icon-fill" />
                                                {translate("ORDERS.PICKUP_ADDRESS")}
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
                                                                <td><Form.Control readOnly data-test="name-input" placeholder={pickUpAddress.name} /></td>
                                                                <td><Form.Control readOnly data-test="address-input" placeholder={pickUpAddress.details + ", " + pickUpAddress.areaName} /></td>
                                                                <td><Form.Control readOnly data-test="mobile-number-input" placeholder={pickUpAddress.phone_number} /></td>
                                                                <td>
                                                                    <Button
                                                                        className="btn-grad-circle"
                                                                        style={{ height: "50px" }}
                                                                        onClick={() => {
                                                                            setShowPickupAddressModal(true);
                                                                        }}
                                                                        data-test="pickup-address-button"
                                                                    >
                                                                        <i className="bi bi-arrow-repeat h3"></i>
                                                                    </Button>
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
                                        <div className="container-fluid" data-test="receiver-address-container">
                                            <div className="div-title">
                                                {
                                                    (isNewAddress) ? <>
                                                        <SendIcon className="title-icon-fill" />
                                                        {translate("CREATE_NEW_ORDER.SET_NEW_ADDRESS")} &nbsp; <Badge className="custome-link rounded-pill" onClick={() => {
                                                            setShowReceiverAddressModal(true);
                                                            setInputValue("");
                                                        }}>{translate("CREATE_NEW_ORDER.OR_CHOOSE_FROM_LIST")} <i className="bi bi-list"></i></Badge>
                                                    </> : <>
                                                        <SendIcon className="title-icon-fill" />
                                                        <Badge className="rounded-pill custome-link" onClick={() => {
                                                            setIsNewAddress(true);
                                                        }}>{translate("CREATE_NEW_ORDER.SET_NEW_ADDRESS")}</Badge> &nbsp; <Badge className="custome-link rounded-pill" onClick={() => {
                                                            setShowReceiverAddressModal(true);
                                                            setInputValue("");
                                                        }}>{translate("CREATE_NEW_ORDER.CHANGE_FROM_LIST")} <i className="bi bi-arrow-repeat"></i></Badge>
                                                    </>
                                                }
                                            </div>

                                            {(isNewAddress == true) ? <>
                                                <div className="row mt-1">
                                                    <div className="col-lg-6">
                                                        <Form.Group>
                                                            <FloatingLabel className="mb-3" controlId="placeName" label={translate("CREATE_NEW_ORDER.NAME")}>
                                                                <Form.Control className=" input-inner-shadow" type="text" placeholder="..." name="placeName" data-test="receiver-name-input" required />
                                                                <Form.Control.Feedback type="invalid">
                                                                    {translate("CREATE_NEW_ORDER.PLEASE_ADD_PLACE_NAME")}
                                                                </Form.Control.Feedback>
                                                            </FloatingLabel>
                                                        </Form.Group>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <Form.Group>
                                                            <FloatingLabel className="mb-3" controlId="userPhone" label={translate("CREATE_NEW_ORDER.MOBILE_NUMBER")}>
                                                                <Form.Control className=" input-inner-shadow" type="tel" placeholder="..." name="receiverPhone" data-test="receiver-phone-input" pattern="^0[0-9]{9}$" required />
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
                                                        <Form.Select style={{ cursor: "pointer" }} className="shadow" name="province" data-test="receiver-province-dropdown" required aria-label="Default select example"
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
                                                        <Form.Select style={{ cursor: "pointer" }} className="shadow" name="governorate" data-test="receiver-governorate-dropdown" required aria-label="Default select example" onChange={(e) => {
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
                                                        <Form.Select style={{ cursor: "pointer" }} className="shadow" data-test="receiver-city-dropdown" name="city" required aria-label="Default select example" onChange={(e) => {
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
                                                        <Form.Select style={{ cursor: "pointer" }} className="shadow" name="area" required aria-label="Default select example" data-test="receiver-area-dropdown">
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
                                                                <Form.Control required className="input-inner-shadow" type="text" placeholder="..." name="address" data-test="receiver-address-input" />
                                                            </FloatingLabel>
                                                            {/*  <span style={{ color: "#1f8379" }}>({translate("CREATE_NEW_ORDER.OPTIONAL")})</span> */}
                                                        </Form.Group>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <Form.Group>
                                                            <FloatingLabel className="" controlId="addressInfo" label={translate("CREATE_NEW_ORDER.ADDRESS_INFO")}>
                                                                <Form.Control className="input-inner-shadow" type="text" placeholder="..." name="addressinfo" data-test="receiver-address-info-input" />
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
                                                        <Form.Control disabled className="input-inner-shadow" type="text" placeholder={dileveryAddress?.name} />
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <label>{translate("CREATE_NEW_ORDER.MOBILE_NUMBER")}</label>
                                                        <Form.Control disabled className="input-inner-shadow" type="tel" placeholder={dileveryAddress?.phone_number} />
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
                                                        <Form.Control disabled className="input-inner-shadow" type="text" placeholder={dileveryAddress?.details} />
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <label>{translate("CREATE_NEW_ORDER.ADDRESS_INFO")}</label>
                                                        <Form.Control disabled className="input-inner-shadow" type="text" placeholder={dileveryAddress?.additional_info} />
                                                    </div>
                                                </div>
                                            </>}
                                        </div>
                                    </ListGroup.Item>

                                    {/* ------------------( order notes )------------------ */}
                                    <ListGroup.Item className="py-4">
                                        <div className="container-fluid" data-test="attachments-container">
                                            <div className="div-title">
                                                <AttachmentIcon className="title-icon-fill" />
                                                {translate("CREATE_NEW_ORDER.ATTACHMENTS_LABEL")}
                                            </div>

                                            <Form.Control name="notes" type="text" className="mt-2 input-inner-shadow" placeholder={intl.formatMessage({ id: "CREATE_NEW_ORDER.NOTES" })} data-test="new-order-notes-input"/>
                                            <span style={{ color: "#1f8379" }}>({translate("CREATE_NEW_ORDER.OPTIONAL")})</span>
                                        </div>
                                    </ListGroup.Item>

                                    {/* ------------------( create order )------------------ */}
                                    <ListGroup.Item className="py-4" style={{ backgroundColor: "#ededed" }}>
                                        <div className="container-fluid" data-test="required-error-container">
                                            {showError && <span style={{ color: "#d9534f" }}>
                                                <i className="bi bi-info-circle"></i>{" "}
                                                {translate("CREATE_NEW_ORDER.REQUIRED_ERROR")}
                                            </span>}
                                            {true ? <Button
                                                className="btn-grad"
                                                style={{ width: "30%", float: "right" }}
                                                disabled={loadingSubmit}
                                                data-test="submit-order-button"
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

                    <Modal
                        show={showPickupAddressModal}
                        onHide={() => { setShowPickupAddressModal(false); setInputValue("") }}
                        centered
                        animation={true}
                        size="xl"
                        data-test="change-pickup-address-model"
                        style={{ backgroundColor: "rgba(0,0,0,0.5)", }}
                    >
                        <Modal.Header closeButton className="card-header-lg">
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
                                            <Button style={{ cursor: "pointer" }} className="btn-grad p-2" data-test="create-address-button">
                                                <AddIcon w={6} h={6} color="gray.50" />
                                            </Button>
                                        </CreateAddress>
                                    </Col>
                                </Row>
                                <Row>
                                    <Table>
                                        <thead >
                                            <tr>
                                                <th style={{ width: "25%" }} scope="col">
                                                    <FloatingLabel className="mb-2 fs-6" controlId="addressName" label={translate("CREATE_NEW_ORDER.NAME")}>
                                                        <Form.Control className="input-inner-shadow" type="text" placeholder="..." data-test="address-name-search-input" onChange={(e) => {
                                                            setInputValue(e.target.value);
                                                        }} />

                                                        <div style={(localStorage.getItem("Language") || "en") === "en" ? { position: "absolute", right: "15px", top: "20px", opacity: "0.2" } : { position: "absolute", left: "15px", top: "20px", opacity: "0.2" }}>
                                                            <FaSearch />
                                                        </div>
                                                    </FloatingLabel>
                                                </th>
                                                <th style={{ width: "25%", paddingBottom: "30px" }} className="fs-6" scope="col">{translate("CREATE_NEW_ORDER.ADDRESS")}</th>
                                                <th style={{ width: "20%" }} scope="col">
                                                    <FloatingLabel className="mb-2 fs-6" controlId="addressName" label={translate("CREATE_NEW_ORDER.MOBILE_NUMBER")}>
                                                        <Form.Control className="input-inner-shadow" type="text" placeholder="..." data-test="mobile-number-search-input" onChange={(e) => {
                                                            setInputValue(e.target.value);
                                                        }} />

                                                        <div style={(localStorage.getItem("Language") || "en") === "en" ? { position: "absolute", right: "15px", top: "20px", opacity: "0.2" } : { position: "absolute", left: "15px", top: "20px", opacity: "0.2" }}>
                                                            <FaSearch />
                                                        </div>
                                                    </FloatingLabel>
                                                </th>
                                                <th style={{ width: "30%" }} scope="col"> </th>
                                            </tr>
                                        </thead>
                                    </Table>
                                    <div style={{ height: "300px", overflowY: "scroll", fontSize: "1rem" }}>
                                        <Table>
                                            <tbody data-test="pickup-addresses-table">
                                                {
                                                    clientAddresses.map((address, index) => {
                                                        return <tr key={index}>
                                                            <td style={{ width: "25%" }}>{address.name}</td>
                                                            <td style={{ width: "25%" }}>{address.details + ", " + address.cityName}</td>
                                                            <td style={{ width: "20%" }}>{address.phone_number}</td>
                                                            {address.is_default == "0" ? <td style={{ width: "30%" }}>
                                                                <Button disabled={loadingSetDefault ? true : false} className="btn-grad fs-4" onClick={() => {
                                                                    setDefaultAddressHandler(address.id);
                                                                }}>
                                                                    {loadingSetDefault && <Spinner animation="border" size="sm" />}
                                                                    {translate("CREATE_NEW_ORDER.SET_DEFAULT")}
                                                                </Button>
                                                                <Button disabled={loadingSetDefault ? true : false} className="btn-grad mx-2 fs-4" onClick={() => {
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

                    <Modal
                        show={showReceiverAddressModal}
                        onHide={() => { setShowReceiverAddressModal(false); setInputValue("") }}
                        centered
                        animation={true}
                        size="xl"

                        style={{ backgroundColor: "rgba(0,0,0,0.5)", }}
                    >
                        <Modal.Header closeButton className="card-header-lg">
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
                                                    <FloatingLabel className="mb-2 fs-6" controlId="addressName" label={translate("CREATE_NEW_ORDER.NAME")}>
                                                        <Form.Control className="input-inner-shadow" type="text" placeholder="..." onChange={(e) => {
                                                            setInputValue(e.target.value);
                                                        }} />

                                                        <div style={(localStorage.getItem("Language") || "en") === "en" ? { position: "absolute", right: "15px", top: "20px", opacity: "0.2" } : { position: "absolute", left: "15px", top: "20px", opacity: "0.2" }}>
                                                            <FaSearch />
                                                        </div>
                                                    </FloatingLabel>
                                                </th>
                                                <th style={{ width: "35%", paddingBottom: "30px" }} className="fs-6" scope="col">{translate("CREATE_NEW_ORDER.ADDRESS")}</th>
                                                <th style={{ width: "20%" }} scope="col">
                                                    <FloatingLabel className="mb-2 fs-6" controlId="addressName" label={translate("CREATE_NEW_ORDER.MOBILE_NUMBER")}>
                                                        <Form.Control className="input-inner-shadow" type="text" placeholder="..." onChange={(e) => {
                                                            setInputValue(e.target.value);
                                                        }} />

                                                        <div style={(localStorage.getItem("Language") || "en") === "en" ? { position: "absolute", right: "15px", top: "20px", opacity: "0.2" } : { position: "absolute", left: "15px", top: "20px", opacity: "0.2" }}>
                                                            <FaSearch />
                                                        </div>
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

                </Container>
            </div>
        </>
    )
}