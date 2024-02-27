import { Button, Dropdown, Form, Modal, Spinner, Table } from "react-bootstrap";
import React, { useEffect, useRef, useState } from "react";
import translate from "../i18n/translate";
import { ReactComponent as SendIcon } from "../assets/images/send.svg";
import { CreateNewOrderReq, GetDefinedAddresses, testBarq, GetAllClientNetworkMembers } from "../APIs/OrdersAPIs";
// import { GetAllClients } from "../APIs/AdminPanelApis"; /* edited (import GetAllClients) */
import { GetTransporterClients } from "../APIs/OrdersAPIs"; /* edited (import GetTransporterClients) */
import { ReactComponent as FoodIcon } from "../assets/images/food.svg";
import { ReactComponent as SmBoxIcon } from "../assets/images/smallBox.svg";
import { ReactComponent as MedBoxIcon } from "../assets/images/medbox.svg";
import { ReactComponent as BigBoxIcon } from "../assets/images/largebox.svg";
import { ReactComponent as DeliveryTruckIcon } from "../assets/images/deliveryTruck.svg";
import { ReactComponent as LocationIcon } from "../assets/images/location.svg";
import { ReactComponent as AttachmentIcon } from "../assets/images/attachment.svg";
import { IoIosGitNetwork } from 'react-icons/io';
import { DeliveryTypes, PackageTypes } from "./Orders/OrdersTabularView";
import AddressDropdown from "./AddressDropdown";
import ClientDropdown from "./ClientDropdown"; /* edited (import ClientDropdown) */
import CreateAddress from "./CreateAddress";
import { AddIcon } from "@chakra-ui/icons";
import { useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import { toastNotification } from "../Actions/GeneralActions";

import { isTransporter } from "../Util"; /* edited (new import) */

import SubmitAndAssignDialog from "./SubmitAndAssignDialog"; /* edited (new import) */

import "./CreateNewOrder.css";

import { useHistory } from "react-router";

export const PackageTypesIcons = {
    "1": FoodIcon,
    "2": SmBoxIcon,
    "3": MedBoxIcon,
    "4": BigBoxIcon
};


export function CreateNewOrder(props) {

    const history = useHistory();

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

    const [open, setOpen] = useState(false);
    const [openConf, setOpenConf] = useState(false);
    const handleClose = () => { setOpen(false); }
    const [packageType, setPackageType] = useState("1");
    const [deliveryType, setDeliveryType] = useState("1");
    const [inputValue, setInputValue] = useState('');
    const [clientInputValue, setClientInputValue] = useState(''); /* edited (clientInputValue added) */
    const [deliverAddresses, setDeliverAddresses] = useState([]);
    const [allClients, setAllClients] = useState([]); /* edited (setAllClients added) Note: not all clients */
    const [selectedDeliveryAddress, setSelectedDeliveryAddress] = useState("");
    const [selectedPickUpAddress, setSelectedPickUpAddress] = useState("");
    const [selectedClient, setSelectedClient] = useState(""); /* edited (setSelectedClient added) */
    const [loading, setLoading] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    const [openAssignDialog, setOpenAssignDialog] = useState(false);
    const [assignAddressClint, setAssignAddressClint] = useState(false);
    const [assignDeliveryParams, setAssignDeliveryParams] = useState(false);

    /* edited (validation variables) */

    const [beginValidation, setBeginValidation] = useState(false);
    const [selectedClientCheck, setSelectedClientCheckShow] = useState(false);
    const [deliveryCostCheck, setDeliveryCostCheckShow] = useState(false);
    const [selectedPickUpAddressCheck, setSelectedPickUpAddressCheckShow] = useState(false);
    const [selectedDeliveryAddressCheck, setSelectedDeliveryAddressCheckShow] = useState(false);

    const [deliverTypeArr, setDeliverTypeArr] = useState([{ name: translate("ORDERS." + DeliveryTypes[1]), type: "1", active: "active" }, { name: translate("ORDERS." + DeliveryTypes[2]), type: "2", active: "" }]);

    const [myNetwork, setMyNetwork] = useState([]);
    const [networkInputValue, setNetworkInputValue] = useState('');
    const [networkLoading, setNetworkLoading] = useState('');

    const deliveryCostRef = useRef(); /* edited (deliveryCostRef added) */
    // const clientMobileNumberRef = useRef(); /* edited (clientMobileNumberRef added) */
    const orderIdRef = useRef();
    const notesRef = useRef();
    const heightRef = useRef();
    const widthRef = useRef();
    const lengthRef = useRef();
    const weightRef = useRef();
    const codAmountRef = useRef();
    const pickAmountRef = useRef();
    const intl = useIntl();

    useEffect(() => {

        setNetworkLoading(true);

        console.log(selectedPickUpAddress.cityId + " -> " + selectedDeliveryAddress.cityId);

        GetAllClientNetworkMembers(selectedPickUpAddress.cityId, selectedDeliveryAddress.cityId).then((res) => {

            setNetworkLoading(false);

            setMyNetwork(res.data.membersData); // .filter(member => member.FullName.toLowerCase().replaceAll("أ", 'ا').replaceAll("إ", 'ا').includes(networkInputValue.toLowerCase()) || member.PhoneNumber.includes(networkInputValue))
        });

    }, [networkInputValue, selectedPickUpAddress, selectedDeliveryAddress]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (open) {
                setLoading(true);

                GetDefinedAddresses(inputValue).then((res) => {
                    setLoading(false);
                    setDeliverAddresses(res.data);
                });
            }
        }, 500)

        return () => {
            return clearTimeout(timer)
        }
    }, [inputValue, open]);


    /* edited (get all clients) */
    useEffect(() => {
        const timer = setTimeout(() => {
            if (open) {
                setLoading(true);

                GetTransporterClients().then((res) => {
                    setLoading(false);

                    setAllClients(res.data.membersData.filter(client => client.FullName.toLowerCase().replaceAll("أ", 'ا').replaceAll("إ", 'ا').includes(clientInputValue.toLowerCase())));
                });
            }
        }, 500)

        return () => {
            return clearTimeout(timer)
        }
    }, [clientInputValue, open]);

    /* edited (show and hide validation error messages handles) */

    function showValidation() {
        // selectedClient && deliveryCostRef && selectedPickUpAddress && selectedDeliveryAddress && deliveryCostRef.current.value > 0

        if (isTransporter()) {
            if (selectedClient) {
                setSelectedClientCheckShow(false)
            } else {
                setSelectedClientCheckShow(true)
            }

            if (deliveryCostRef && deliveryCostRef.current.value > 0) {
                setDeliveryCostCheckShow(false)
            } else {
                setDeliveryCostCheckShow(true)
            }
        }

        if (selectedPickUpAddress) {
            setSelectedPickUpAddressCheckShow(false)
        } else {
            setSelectedPickUpAddressCheckShow(true)
        }

        if (selectedDeliveryAddress) {
            setSelectedDeliveryAddressCheckShow(false)
        } else {
            setSelectedDeliveryAddressCheckShow(true)
        }

        // console.log("show validation");
    }

    function hideValidation() {
        setBeginValidation(false);
        setSelectedClientCheckShow(false);
        setDeliveryCostCheckShow(false);
        setSelectedPickUpAddressCheckShow(false);
        setSelectedDeliveryAddressCheckShow(false);

        // console.log("hide validation");
    }

    function setCloseAssignDialog() {
        setOpenAssignDialog(false);
    }

    function setCloseMainDialog() {
        setOpen(false);
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

    return (
        <>
            {/* edited (change button style if the user is transporter) */}

            {/* edited (on-header button commented) */}
            {/*<Button className={`${props.children ? "" : !isTransporter() && "btn-grad text-white"}`} variant={isTransporter() && "outline-light"} onClick={()=>{
                setOpen(true);
            }}>
                {props.children && props.children}
                {!props.children && (
                    <>
                        <SendIcon style={{display: "inline-block", width: "22px", height: "22px", marginRight:"5px", fill:"currentcolor"}} />
                        {translate("ORDERS.NEW_CUSTOMER_ORDER")}
                    </>
                )}
            </Button>*/}
            {/* {isTransporter() && <Button className={"btn-grad text-white"} onClick={() => {
                setOpen(true);
            }}>
                {props.children && props.children}
                {!props.children && (
                    <>
                        <SendIcon style={{ display: "inline-block", width: "22px", height: "22px", marginRight: "5px", marginLeft: "5px", fill: "currentcolor" }} />
                        {isTransporter() ? translate("ORDERS.NEW_CUSTOMER_ORDER") : translate("ORDERS.CREATE_NEW_ORDER")}
                    </>
                )}
            </Button>} */}

            {/* create new order for client */}
            {!isTransporter() && <Button className={"btn-grad text-white"} onClick={() => {
                history.push("/account/create-order");
            }}>
                <SendIcon style={{ display: "inline-block", width: "22px", height: "22px", marginRight: "5px", marginLeft: "5px", fill: "currentcolor" }} />
                {translate("ORDERS.CREATE_NEW_ORDER")}
            </Button>}

            {/* <span style={{ color: "white", position: "absolute", left: "0", cursor: "pointer" }} onClick={() => {
                 history.push("/account/create-order");
            }}>
                dont't click
            </span> */}

            <Modal size="lg" show={open} onHide={handleClose} centered animation={true} backdrop="static">

                <Modal.Header closeButton style={styles.cardHeaderLg}>
                    <Modal.Title>{translate("ORDERS.CREATE_ORDER")}</Modal.Title>
                </Modal.Header>

                <Modal.Body className="mt-5">

                    {/* edited (Client Mobile Number & Delivery Cost Fields added) */}
                    {isTransporter() && <>
                        <div className="row">
                            <div className="col-md-9">
                                {/*<Form.Control type="text" className="mt-2" placeholder="Client Mobile Number" ref={clientMobileNumberRef} />*/}

                                {/* edited (add clients dropdown) */}

                                <ClientDropdown /* fofo */
                                    loading={loading}
                                    clients={allClients}
                                    onSearch={setClientInputValue}
                                    onSelect={setSelectedClient}
                                    selectedClient={selectedClient}
                                />

                                {/* edited (add validation message) */}
                                {beginValidation && selectedClientCheck && <span style={{ color: "red" }}>required!</span>}

                            </div>
                            <div className="col-md-3">
                                <Form.Control type="number" style={{ marginTop: "9px" }} className="rounded-22 shadow" placeholder={intl.formatMessage({ id: "TEMP.DELIVERY_COST" })} ref={deliveryCostRef} />

                                {/* edited (add validation message) */}
                                {beginValidation && deliveryCostCheck && <span style={{ color: "red" }}>required!</span>}
                            </div>
                        </div>

                        <hr className="mt-4 mb-3" />
                    </>}

                    {/* <div className="row mt-3 mb-4">
                        <div className="col-lg-3" style={(localStorage.getItem("Language") || "en") === "en" ? { paddinRight: 0 } : { paddingLeft: 0 }}>
                            <hr className="mt-3" />
                        </div>
                        <div className="col-lg-6 d-flex justify-content-center" style={{borderRight: "1px solid lightgray", borderLeft: "1px solid lightgray"}}>
                            <div className="h5" style={{ color: "#26a69a" }}>
                                {translate("ORDERS.WHAT_TO_TRANS")}
                            </div>
                        </div>
                        <div className="col-lg-3" style={(localStorage.getItem("Language") || "en") === "en" ? { paddingLeft: 0 } : { paddinRight: 0 }}>
                            <hr className="mt-3" />
                        </div>
                    </div> */}

                    <div className="row">
                        <div className="mb-2 h5" style={{ color: "#26a69a" }}>
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
                                    <Dropdown.Item eventKey="1" className="d-flex">
                                        <FoodIcon style={{ width: "20px", height: "20px" }} className="me-1" />
                                        {translate("ORDERS." + PackageTypes[1])}
                                    </Dropdown.Item>
                                    <Dropdown.Item eventKey="4" className="d-flex">
                                        <BigBoxIcon style={{ width: "20px", height: "20px" }} className="me-1" />
                                        {translate("ORDERS." + PackageTypes[4])}
                                    </Dropdown.Item>
                                    <Dropdown.Item eventKey="3" className="d-flex">
                                        <MedBoxIcon style={{ width: "20px", height: "20px" }} className="me-1" />
                                        {translate("ORDERS." + PackageTypes[3])}
                                    </Dropdown.Item>
                                    <Dropdown.Item eventKey="2" className="d-flex">
                                        <SmBoxIcon style={{ width: "20px", height: "20px" }} className="me-1" />
                                        {translate("ORDERS." + PackageTypes[2])}
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>

                        {packageType !== "1" && packageType !== "2" && <div className="col-lg-8" style={{ marginTop: "2px" }}>
                            {/* <div className="row">
                                <div className="my-1">{translate("ORDERS.DIMENSIONS_LABEL")}</div>
                            </div> */}
                            <div className="row">
                                <div className="col-md-3">
                                    <Form.Group>
                                        <Form.Control
                                            type="number"
                                            className="rounded-22 shadow"
                                            placeholder={intl.formatMessage({ id: "TEMP.HEIGHT" })}
                                            ref={heightRef}
                                        />
                                        {/* <Form.Text muted>
                                            optional
                                        </Form.Text> */}
                                    </Form.Group>
                                </div>
                                <div className="col-md-3">
                                    <Form.Control
                                        type="number"
                                        className="rounded-22 shadow"
                                        placeholder={intl.formatMessage({ id: "TEMP.WIDTH" })}
                                        ref={widthRef}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <Form.Control
                                        type="number"
                                        className="rounded-22 shadow"
                                        placeholder={intl.formatMessage({ id: "TEMP.LENGTH" })}
                                        ref={lengthRef}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <Form.Control
                                        type="number"
                                        className="rounded-22 shadow"
                                        placeholder={intl.formatMessage({ id: "TEMP.WEIGHT" })}
                                        ref={weightRef}
                                    />
                                </div>
                            </div>
                        </div>}
                    </div>

                    <hr className="mt-4 mb-3" />

                    <div className="d-flex align-items-center mb-2 h5" style={{ color: "#26a69a" }}>
                        <DeliveryTruckIcon style={{ width: "20px", height: "20px" }} className="me-1" />
                        {translate("ORDERS.DELIVERY_TYPE")}
                    </div>

                    {/* <div className="row mt-3 mb-3">
                        <div className="col-lg-3" style={(localStorage.getItem("Language") || "en") === "en" ? { borderRight: "1px solid lightgray" } : { borderLeft: "1px solid lightgray" }}>
                            <div className="d-flex align-items-center my-1 h5" style={{ color: "#26a69a" }}>
                                <DeliveryTruckIcon style={{ width: "20px", height: "20px" }} className="me-1" />
                                {translate("ORDERS.DELIVERY_TYPE")}
                            </div>
                        </div>
                        <div className="col-lg-9" style={(localStorage.getItem("Language") || "en") === "en" ? { paddingLeft: 0 } : { paddinRight: 0 }}>
                            <hr className="mt-3" />
                        </div>
                    </div> */}

                    <div className="row">
                        <div className="col-lg-6">
                            <div className="toggleButtonsContainer">
                                {
                                    deliverTypeArr.map((item, index) => {
                                        return <div key={index} className={"toggleButton " + item.active} onClick={() => { handleDeliveryTypeClick(index, item.type) }}>
                                            <div className="radio"><div className="innerRadio"></div></div> {item.name}
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                        <div className="col-lg-6">
                            {deliveryType === "2" &&
                                <Form.Control
                                    type="number"
                                    className="rounded-22 shadow" style={{ width: "35%", marginTop: "5px" }}
                                    placeholder={intl.formatMessage({ id: "ORDERS.AMOUNT" })}
                                    ref={codAmountRef}
                                />
                            }
                        </div>
                    </div>

                    <hr className="mt-4 mb-3" />

                    <div className="d-flex justify-content-between">
                        <div className="w-50 m-inline-e-2">
                            <div className="d-flex align-items-center mb-2 h5" style={{ color: "#26a69a" }}>
                                <LocationIcon style={{ width: "20px", height: "20px" }} className="me-1" />
                                {translate("ORDERS.PICKUP_ADDRESS")}
                            </div>

                            <AddressDropdown
                                loading={loading}
                                addresses={deliverAddresses}
                                onSearch={setInputValue}
                                onSelect={setSelectedPickUpAddress}
                                selectedAddress={selectedPickUpAddress}
                            />

                            {/* edited (add validation message) */}
                            {beginValidation && selectedPickUpAddressCheck && <span style={{ color: "red" }}>required!</span>}

                        </div>

                        {/* <div className="mt-5">
                            <i className="bi bi-arrow-right h3"></i>
                        </div> */}

                        <div className="w-50 m-inline-e-2">
                            <div className="d-flex align-items-center mb-2 h5" style={{ color: "#26a69a" }}>
                                <SendIcon style={{ width: "20px", height: "20px" }} className="me-1" />
                                <p>{translate("ORDERS.DELIVER_TO")}</p>
                            </div>

                            <AddressDropdown
                                loading={loading}
                                addresses={deliverAddresses}
                                onSearch={setInputValue}
                                onSelect={setSelectedDeliveryAddress}
                                selectedAddress={selectedDeliveryAddress}
                            />

                            {/* edited (add validation message) */}
                            {beginValidation && selectedDeliveryAddressCheck && <span style={{ color: "red" }}>required!</span>}

                        </div>
                        <CreateAddress>
                            <div style={{ cursor: "pointer", marginTop: "30px" }} className="btn-grad-circle p-2">
                                <AddIcon w={6} h={6} color="gray.50" />
                            </div>
                        </CreateAddress>
                    </div>

                    <hr className="mt-4 mb-3" />

                    <div className="d-flex align-items-center mb-2 h5" style={{ color: "#26a69a" }}>
                        <AttachmentIcon style={{ width: "20px", height: "20px" }} className="me-1" />
                        {translate("ORDERS.ATTACHMENTS_LABEL")}
                    </div>

                    <Form.Control type="text" className="mt-2 rounded-22 shadow" placeholder={intl.formatMessage({ id: "TEMP.NOTES" })} ref={notesRef} />

                    {false && selectedPickUpAddress !== "" && selectedDeliveryAddress !== "" && <>
                        <hr className="mt-4 mb-3" />

                        <div className="d-flex align-items-center mb-2 h5" style={{ color: "#26a69a" }}>
                            <IoIosGitNetwork style={{ width: "20px", height: "20px", color: "black" }} className="me-1" />
                            {translate("TEMP.CHOOSE_FROM_NETWORK")}
                        </div>

                        {/* <div className="row">
                            <div className="col">
                                <Table>
                                    <thead>
                                        <tr>
                                            <th scope="col">{translate("TEMP.NAME")}</th>
                                            <th scope="col">{translate("TEMP.PHONE")}</th>
                                            <th scope="col">{translate("TEMP.PRICE")}</th>
                                            <th scope="col">{translate("TEMP.ASSIGN")}</th>
                                        </tr>
                                    </thead>
                                </Table>
                            </div>
                        </div> */}

                        <div className="row" style={{ height: "200px", overflowY: "scroll" }}>
                            <div className="col-lg-12">
                                <Table>
                                    <thead>
                                        <tr>
                                            <th scope="col">{translate("TEMP.NAME")}</th>
                                            <th scope="col">{translate("TEMP.PHONE")}</th>
                                            <th scope="col">{translate("TEMP.PRICE")}</th>
                                            <th scope="col">{translate("TEMP.ASSIGN")}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            myNetwork.map((member, index) => {
                                                return <tr key={index}>
                                                    <td>{member.FullName}</td>
                                                    <td>{member.PhoneNumber}</td>
                                                    <td>{member.deliveryPrice + " NIS"}</td>
                                                    <td>
                                                        <Button>
                                                            {translate("TEMP.ASSIGN")}
                                                        </Button>
                                                    </td>
                                                </tr>
                                            })
                                        }
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    </>}

                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-center">

                    {/*<Form.Check type="checkbox" label="Only for my network" />*/}

                    <Button
                        className="btn-grad"
                        style={{ width: "45%" }}
                        disabled={loadingSubmit}
                        onClick={() => {

                            setBeginValidation(true);

                            let CreatedBy = ""; /* edited (CreatedBy variable added) */
                            let DeliveryParams = {}; /* edited (DeliveryParams as empty object) */

                            if (isTransporter()) {
                                if (selectedClient && deliveryCostRef && selectedPickUpAddress && selectedDeliveryAddress && deliveryCostRef.current.value > 0) {
                                    // console.log("true");

                                    setLoadingSubmit(true);

                                    hideValidation();

                                    CreatedBy = "Transporter";

                                    DeliveryParams = {
                                        deliveryWay: deliveryType,
                                        TypeLoad: packageType,
                                        // ClientMobileNumber: clientMobileNumberRef.current.value, /* edited (add ClientMobileNumber) */
                                        ClientMobileNumber: selectedClient.PhoneNumber, /* edited (add ClientMobileNumber from dropdown) */
                                        DeliveryPrice: deliveryCostRef.current.value, /* edited (add DeliveryPrice) */
                                        CostLoad: (deliveryType === "2" && codAmountRef.current.value) || (deliveryType === "4" && pickAmountRef.current.value) || "", // 2 or 4
                                        DetailsLoad: notesRef.current.value,
                                        LengthLoad: lengthRef.current?.value || "",
                                        WidthLoad: widthRef.current?.value || "",
                                        HeightLoad: heightRef.current?.value || "",
                                        WeightLoad: weightRef.current?.value || "",
                                        qrCode: ""
                                    };

                                    /* edited (fix client mobile number intro) */
                                    if (DeliveryParams.ClientMobileNumber.charAt(0) === '0') {
                                        const firstZero = DeliveryParams.ClientMobileNumber[0];
                                        const replaced = DeliveryParams.ClientMobileNumber.replace(firstZero, '+972');
                                        DeliveryParams.ClientMobileNumber = replaced;
                                    }

                                    const AddressClint = {
                                        IdCity: selectedPickUpAddress.cityId,  // from selected pick up address
                                        IdArea: selectedPickUpAddress.areaId,  // from selected pick up address
                                        OtherDetails: selectedPickUpAddress.details, // details from selected pickup address
                                        LatSender: selectedPickUpAddress.latitude, // from selected pick up address
                                        LongSender: selectedPickUpAddress.longitude, //  from selected pick up address
                                        SenderAddressId: selectedPickUpAddress.id, // from selected pick up address

                                        IdCityDes: selectedDeliveryAddress.cityId, // from selected delivery to address
                                        IdAreaDes: selectedDeliveryAddress.areaId, // from selected delivery to address
                                        OtherDetailsDes: selectedDeliveryAddress.details, // details from selected delivery to address
                                        LatReciver: selectedDeliveryAddress.latitude, // from selected delivery to address
                                        LongReciver: selectedDeliveryAddress.longitude, // from selected delivery to address
                                        ReciverAddressId: selectedDeliveryAddress.id,// from selected delivery to address
                                        ReceiverAddressNum: selectedDeliveryAddress.phone_number
                                    };

                                    CreateNewOrderReq(JSON.stringify(DeliveryParams), CreatedBy /* edited (add CreatedBy parameter) */, JSON.stringify(AddressClint)).then((res) => {
                                        /* edited (test data) */
                                        // console.log("---------------\nres : " + res.data);

                                        /* to be edited (to print order by returned id) */

                                        // orderIdRef.current = JSON.parse(res.data.replace("}{", ",")).server_response[0].OrderId;
                                        //https://therichpost.com/reactjs-convert-html-into-pdf-working-functionality/

                                        // setOpenConf(true);

                                        /* if (res.data == "Blocked") {
                                            dispatch(toastNotification("Warning!", translate("GENERAL.BLOCKED"), "warning"));
                                        } */

                                        setOpen(false);
                                        setLoadingSubmit(false);
                                        props.onSuccess();
                                    });

                                } else {
                                    // console.log("false");
                                    showValidation();
                                }
                            } else {
                                if (selectedPickUpAddress && selectedDeliveryAddress) {

                                    setLoadingSubmit(true);

                                    // console.log("true");

                                    hideValidation();

                                    CreatedBy = "Client";

                                    DeliveryParams = {
                                        deliveryWay: deliveryType,
                                        TypeLoad: packageType,
                                        CostLoad: (deliveryType === "2" && codAmountRef.current.value) || (deliveryType === "4" && pickAmountRef.current.value) || "", // 2 or 4
                                        DetailsLoad: notesRef.current.value,
                                        LengthLoad: lengthRef.current?.value || "",
                                        WidthLoad: widthRef.current?.value || "",
                                        HeightLoad: heightRef.current?.value || "",
                                        WeightLoad: weightRef.current?.value || "",
                                        qrCode: ""
                                    };

                                    const AddressClint = {
                                        IdCity: selectedPickUpAddress.cityId,  // from selected pick up address
                                        IdArea: selectedPickUpAddress.areaId,  // from selected pick up address
                                        OtherDetails: selectedPickUpAddress.details, // details from selected pickup address
                                        LatSender: selectedPickUpAddress.latitude, // from selected pick up address
                                        LongSender: selectedPickUpAddress.longitude, //  from selected pick up address
                                        SenderAddressId: selectedPickUpAddress.id, // from selected pick up address

                                        IdCityDes: selectedDeliveryAddress.cityId, // from selected delivery to address
                                        IdAreaDes: selectedDeliveryAddress.areaId, // from selected delivery to address
                                        OtherDetailsDes: selectedDeliveryAddress.details, // details from selected delivery to address
                                        LatReciver: selectedDeliveryAddress.latitude, // from selected delivery to address
                                        LongReciver: selectedDeliveryAddress.longitude, // from selected delivery to address
                                        ReciverAddressId: selectedDeliveryAddress.id,// from selected delivery to address
                                        ReceiverAddressNum: selectedDeliveryAddress.phone_number
                                    };

                                    CreateNewOrderReq(JSON.stringify(DeliveryParams), CreatedBy /* edited (add CreatedBy parameter) */, JSON.stringify(AddressClint)).then((res) => {
                                        /* edited (test data) */
                                        // console.log("---------------\nres : " + res.data);

                                        /* to be edited (to print order by returned id) */

                                        // orderIdRef.current = JSON.parse(res.data.replace("}{", ",")).server_response[0].OrderId;
                                        //https://therichpost.com/reactjs-convert-html-into-pdf-working-functionality/

                                        // setOpenConf(true);

                                        /*  if (res.data == "Blocked") {
                                             dispatch(toastNotification("Warning!", translate("GENERAL.BLOCKED"), "warning"));
                                         } */

                                        // console.log(res.data)

                                        setOpen(false);
                                        setLoadingSubmit(false);
                                        props.onSuccess();
                                    });
                                } else {
                                    // console.log("false");
                                    showValidation();
                                }

                                /* - deliveryWay 
                                This one from radio button for delivery type it contains four values 
                                    (Delivery = 1, Cache on delivery = 2, Pickup = 3, Pay and Pickup = 4)
                                - CostLoad   
                                    This amount inserted in case of (Cache on delivery/Pay and pickup)
                                - TypeLoad   
                                    This one from the list we pick Food or Small/Medium/Large package where 
                                        Food = 1, Small Package = 2, Medium Package =3, Large Package = 4
                                - qrCode
                                    in case of submit with qrcode we will put the value else it will be empty */
                            }
                        }}
                    >
                        {loadingSubmit && <Spinner animation="border" size="sm" />}
                        {isTransporter() ? translate("ORDERS.CREATE_ORDER") : translate("ORDERS.SUBMIT_ORDER")}
                    </Button>

                    {!isTransporter() && <Button
                        className="btn-grad"
                        style={{ width: "45%" }}
                        onClick={() => {
                            setBeginValidation(true);

                            if (selectedPickUpAddress && selectedDeliveryAddress) {

                                hideValidation();

                                const tempDeliveryParams = {
                                    deliveryWay: deliveryType,
                                    TypeLoad: packageType,
                                    CostLoad: (deliveryType === "2" && codAmountRef.current.value) || (deliveryType === "4" && pickAmountRef.current.value) || "", // 2 or 4
                                    DetailsLoad: notesRef.current.value,
                                    LengthLoad: lengthRef.current?.value || "",
                                    WidthLoad: widthRef.current?.value || "",
                                    HeightLoad: heightRef.current?.value || "",
                                    WeightLoad: weightRef.current?.value || "",
                                    qrCode: ""
                                };

                                // console.log(selectedDeliveryAddress);

                                const tempAddressClint = {
                                    IdCity: selectedPickUpAddress.cityId,  // from selected pick up address
                                    IdArea: selectedPickUpAddress.areaId,  // from selected pick up address
                                    IdGov: selectedPickUpAddress.governoratId,  // from selected pick up address
                                    IdProv: selectedPickUpAddress.provinceId,  // from selected pick up address
                                    OtherDetails: selectedPickUpAddress.details, // details from selected pickup address
                                    LatSender: selectedPickUpAddress.latitude, // from selected pick up address
                                    LongSender: selectedPickUpAddress.longitude, //  from selected pick up address
                                    SenderAddressId: selectedPickUpAddress.id, // from selected pick up address

                                    IdCityDes: selectedDeliveryAddress.cityId, // from selected delivery to address
                                    IdAreaDes: selectedDeliveryAddress.areaId, // from selected delivery to address
                                    IdProvDes: selectedDeliveryAddress.provinceId, // from selected delivery to address
                                    IdGovDes: selectedDeliveryAddress.governoratId, // from selected delivery to address
                                    OtherDetailsDes: selectedDeliveryAddress.details, // details from selected delivery to address
                                    LatReciver: selectedDeliveryAddress.latitude, // from selected delivery to address
                                    LongReciver: selectedDeliveryAddress.longitude, // from selected delivery to address
                                    ReciverAddressId: selectedDeliveryAddress.id, // from selected delivery to address
                                    ReceiverAddressNum: selectedDeliveryAddress.phone_number,
                                    ReceiverAddressName: selectedDeliveryAddress.name
                                };

                                // console.log(selectedPickUpAddress.areaId + " -> " + selectedDeliveryAddress.areaId);

                                setAssignDeliveryParams(tempDeliveryParams);
                                setAssignAddressClint(tempAddressClint);

                                setOpenAssignDialog(true);
                            } else {
                                showValidation();
                            }
                        }}
                    >
                        {translate("TEMP.SUBMIT_AND_ASSIGN")}
                    </Button>}
                </Modal.Footer>
            </Modal>

            {openAssignDialog && <SubmitAndAssignDialog
                onSuccess={() => props.onSuccess()}
                setCloseAssignDialog={setCloseAssignDialog}
                setCloseMainDialog={setCloseMainDialog}
                loadingSubmit={loadingSubmit}
                assignDeliveryParams={assignDeliveryParams}
                assignAddressClint={assignAddressClint} />}

            <Modal
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
            </Modal>

        </>
    )
}