import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router";
// import { getBusinessLocation, getPersonalInfo } from "../../../Actions/ProfileActions";
import translate from "../../../i18n/translate";
import { getOrderDetailsForAdmin, getCustomerInfoForWayBill, checkForForeignId, getQrCodeForOrder, generateHashedId, encodeId } from "../../../APIs/AdminPanelApis";
import { packageFormatter } from "../../Orders/OrdersTabularView";
import whiteLogo from '../../../assets/whiteLogo.png';
//import html2canvas from "html2canvas";
import DomToImage from "dom-to-image";
import jsPDF from "jspdf";
import { Button } from "react-bootstrap";
import albarq_logo from "../../../assets/barq_logo.png";
import { imgBaseUrl } from '../../../Constants/GeneralCont';
import QRCode from 'qrcode.react';

var Barcode = require('react-barcode');

function Convert_HTML_To_PDF() {
    var elementHTML = document.querySelector('.togo-waybill');
    DomToImage.toPng(elementHTML, { width: elementHTML.offsetWidth }).then((dataUrl) => {
        var htmlImage = new Image();
        htmlImage.src = dataUrl;
        var pdf = new jsPDF("p", "mm", "a4");

        var pageWidth = pdf.internal.pageSize.getWidth();
        var pageHeight = pdf.internal.pageSize.getHeight();
        var imageWidth = elementHTML.offsetWidth;
        var imageHeight = elementHTML.offsetHeight;
        var ratio = imageWidth / imageHeight >= pageWidth / pageHeight ? pageWidth / imageWidth : pageHeight / imageHeight;
        //pdf = new jsPDF(this.state.orientation, undefined, format);
        pdf.addImage(htmlImage, 'PNG', 5, 5, imageWidth * ratio - 10, imageHeight * ratio);

        pdf.save('waybill.pdf');
    }).catch((error) => {
        console.error('Error: ', error);
    });

    /* html2canvas(elementHTML, {
        logging: true,
        allowTaint: false,
        useCORS: true,
    }).then((canvas) =>{
        document.body.appendChild(canvas);
        var imgData = canvas.toDataURL("image/png",1);
        var pdf = new jsPDF("p", "mm", "a4");
        var pageWidth = pdf.internal.pageSize.getWidth();
        var pageHeight = pdf.internal.pageSize.getHeight();
        var imageWidth = canvas.width;
        var imageHeight = canvas.height;

        var ratio = imageWidth/imageHeight >= pageWidth/pageHeight ? pageWidth/imageWidth : pageHeight/imageHeight;
        //pdf = new jsPDF(this.state.orientation, undefined, format);
        pdf.addImage(imgData, 'PNG', 0, 0, imageWidth * ratio, imageHeight * ratio);
        //pdf.save("waybill.pdf");

    }); */
}

export default function AdminWayBill() {
    const { id } = useParams();
    console.log("opened way bill admin");

    const [hashedId, setHashedId] = useState(null);

    useEffect(() => {
        const result = encodeId(id);

        setHashedId(result); // Store the hashed ID in state

        console.log("Generated Hashed ID:", result); // Log the result directly

    }, [id]);



    const [orderDetails, setOrderDetails] = useState();
    const location = useLocation();
    const dispatch = useDispatch();
    // const { FullName, Email, LogoUrl } = useSelector(state => state.profile.personalInfo);
    const { BusinessName } = useSelector(state => state.profile.businessLocations);
    const [loading, setLoading] = useState(true);

    const [businessName, setBusinessName] = useState("");
    const [logoURL, setLogoURL] = useState("");
    const [FullName, setFullName] = useState("");
    const [Email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    const [foreignComapny, setForeignComapny] = useState("");


    useEffect(() => {
        checkForForeignId(id).then((res) => {
            console.log("foreign info --------------------");
            console.log(res.data);

            if (res.data !== "noForeigId") {
                setForeignComapny(res.data);
            }
        })
    }, [])

    useEffect(() => {
        if (FullName && Email && orderDetails && BusinessName) {
            if (new URLSearchParams(location.search).get("print") === "true") {
                window.print();
            }
        }
    }, [FullName, Email, orderDetails]);

    useEffect(() => {
        getCustomerInfoForWayBill(id).then((res) => {
            console.log("customer info --------------------");
            console.log(res.data);


            setBusinessName(res.data.BusinessName);
            setLogoURL(res.data.logoURL);
            setFullName(res.data.FullName);
            setEmail(res.data.Email);
            // setPhone(res.data.phone);
        })
    }, [])

    /* useEffect(() => {
        dispatch(getPersonalInfo(() => {
            setLoading(false);
        }));
        dispatch(getBusinessLocation());
    }, [dispatch]); */

    useEffect(() => {

        getOrderDetailsForAdmin(id).then((orderDetails) => {
            console.log("order/receiver info --------------------");
            console.log(orderDetails); // temp test
            setOrderDetails(orderDetails);
            console.log({ orderDetails });
            setPhone(orderDetails.senderPhone)
        });

    }, [id]);

    /* edited (add the following variables to control bill size) */

    const [showTrems, setShowTrems] = useState(true);
    const [containerWidth, setContainerWidth] = useState("1000px");
    const [isSelected, setIsSelected] = useState(true);
    console.log({ phone })
    return (
        <>
            <div className="d-flex justify-content-center py-3 d-print-none">
                <div className="px-3" style={{ width: "1000px" }}>
                    {/* edited (PDF button commented and bill-size options were added) */}

                    {/*<Button onClick={Convert_HTML_To_PDF} className="">PDF</Button>*/}

                    <Button style={{ width: "100px", borderRadius: "20px 0 0 20px" }} variant={isSelected ? "primary" : "outline-primary"} onClick={() => { setShowTrems(true); setContainerWidth("1000px"); setIsSelected(true) }} className="">Large</Button>
                    <Button style={{ width: "100px", borderRadius: "0 20px 20px 0" }} variant={!isSelected ? "primary" : "outline-primary"} onClick={() => { setShowTrems(false); setContainerWidth("800px"); setIsSelected(false) }} className="">Medium</Button>
                </div>
                <Button variant="outline-primary" onClick={() => window.print()} style={{
                    /* marginRight: "5px",
                    marginLeft: "5px", */
                    width: "150px"
                }}>
                    <svg style={{ display: "inline-block", marginLeft: "5px", marginRight: "5px" }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-printer-fill" viewBox="0 0 16 16">
                        <path d="M5 1a2 2 0 0 0-2 2v1h10V3a2 2 0 0 0-2-2H5zm6 8H5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1z" />
                        <path d="M0 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2H2a2 2 0 0 1-2-2V7zm2.5 1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z" />
                    </svg>
                    Print
                </Button>
            </div>

            <div className="d-flex justify-content-center print-container">

                <div className="togo-waybill px-3" style={{ width: containerWidth }}>

                    {
                        foreignComapny?.companyId == 145 ? <div className="">

                            <div className="w-100 m-inline-e-2">
                                <div className="row">
                                    <div className="col-4">
                                        <div className="row h-25">
                                            <div className="col d-flex justify-content-center align-items-end">
                                                <p>{translate("WAYBILL.PRINT_DATE")}: {new Date().toDateString()} </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div className="row">
                                            <div className="col d-flex justify-content-center align-items-center border-start border-end">
                                                <img
                                                    style={{
                                                        borderRadius: "5px",
                                                        border: "1px solid black",
                                                        float: "left",
                                                        width: "200px",
                                                        height: "200px",
                                                        objectFit: "cover",
                                                        margin: "auto"
                                                    }}
                                                    alt="business logo"
                                                    src={`/togo/MobileAPi/${foreignComapny.trans_img}`}
                                                />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col d-flex justify-content-center align-items-center border-start border-end">
                                                <p className="h5 mt-1">{foreignComapny.trans_phone}</p>
                                            </div>
                                        </div>

                                    </div>
                                    <div className="col-4 d-flex justify-content-center align-items-center">
                                        <Barcode height={100} value={foreignComapny.super_id == 1 ? foreignComapny.foreignOrderId : foreignComapny.barcode} />
                                    </div>
                                </div>
                            </div>

                            <div className="w-100 mt-4 m-inline-e-2">
                                <fieldset
                                    style={{
                                        all: "revert",
                                        margin: "0"
                                    }}
                                    className="border-dark"
                                >
                                    <legend
                                        style={{
                                            all: "revert",
                                            fontSize: "30px"
                                        }}
                                    >
                                        Receiver Information
                                    </legend>

                                    <div className="row">
                                        <div className="col-12">
                                            <p className="h2">{orderDetails?.ReceiverName}</p>
                                            <hr className="my-1" />
                                            <p className="h4">
                                                {orderDetails?.IdCityDes} - {orderDetails?.IdAreaDes},<br />
                                                {orderDetails?.OtherDetailsDes}
                                            </p>
                                            <p className="h5">
                                                {orderDetails?.ReceiverAddressNum}
                                            </p>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>

                            <div className="w-100 mt-4 m-inline-e-2">
                                <fieldset
                                    style={{
                                        all: "revert",
                                        margin: "0",
                                        fontSize: "12px"
                                    }}
                                    className="border-dark"
                                >
                                    <legend
                                        style={{
                                            all: "revert",
                                            fontSize: "30px"
                                        }}
                                    >
                                        Sender Information
                                    </legend>

                                    <div className="row">
                                        <div className="col-3">
                                            <img
                                                style={{
                                                    borderRadius: "5px",
                                                    border: "1px solid black",
                                                    float: "left",
                                                    width: "200px",
                                                    height: "200px",
                                                    objectFit: "cover",
                                                    margin: "auto"
                                                }}
                                                alt="business logo"
                                                src={`/togo/MobileAPi/${logoURL}`}
                                            //src="https://cdn.dribbble.com/users/1111447/screenshots/7697273/media/ba28a6aaee0f52b59662c6d6122c94ef.png?compress=1&resize=400x300" 
                                            />
                                        </div>
                                        <div className="col-6 border-start">
                                            <p className="h2">{businessName}</p>
                                            <hr className="my-1" />
                                            <p className="h4">
                                                {orderDetails?.IdCitySource} - {orderDetails?.IdAreaSource},<br />
                                                {orderDetails?.OtherDetails}
                                            </p>
                                            <p className="h5">
                                                {orderDetails.senderPhone}
                                            </p>
                                        </div>
                                        <div className="col-3 border-start d-flex justify-content-center align-items-center">
                                            <p className="h1">{orderDetails?.CostLoad}</p>
                                            {orderDetails?.CostLoad && <p>NIS</p>}
                                            {!orderDetails?.CostLoad && <p>--</p>}
                                        </div>
                                    </div>
                                </fieldset>
                            </div>

                            <div className="row mt-4">

                                <div className="col-6">
                                    <fieldset
                                        style={{
                                            all: "revert",
                                            margin: "0"
                                        }}
                                        className="border-dark"
                                    >
                                        <legend
                                            style={{
                                                all: "revert"
                                            }}
                                        >
                                            <img src={whiteLogo} style={{
                                                width: "80px", filter: "brightness(0)"
                                            }} alt="logo" className="mb-3" />
                                        </legend>
                                        <div className="d-flex justify-content-center">
                                            {orderDetails && orderDetails.BarCode && <Barcode value={orderDetails.BarCode} />}
                                            {orderDetails && !orderDetails.BarCode && <Barcode value={id.padStart(8, 0)} />}
                                        </div>
                                    </fieldset>
                                </div>

                                <div className="col-6" style={{ marginTop: "8px" }}>
                                    <fieldset
                                        style={{
                                            all: "revert",
                                            margin: "0",
                                            height: "190px"
                                        }}
                                        className="border-dark"
                                    >
                                        <legend style={{
                                            all: "revert",
                                            fontSize: "30px"
                                        }}>
                                            Load Details
                                        </legend>
                                        <div>
                                            {orderDetails?.DetailsLoad}
                                        </div>
                                    </fieldset>
                                </div>
                            </div>

                        </div> :
                            <>
                                <h1 className="fw-bold h3 text-center">{translate("WAYBILL.TITLE")}</h1> {/* logooooooo */}

                                {foreignComapny !== "" && <div className="w-100 d-flex justify-content-center py-3 mb-4" style={{ borderBottom: "4px solid lightgray" }}>
                                    <img src={imgBaseUrl + foreignComapny.trans_img} alt="logo" className="mb-3 mx-3" style={{ width: "auto", height: "80px" }} />
                                    {/* <span className="mt-3 me-3 h2">{foreignComapny.AccountName}</span> */}
                                    <Barcode height={50} value={foreignComapny.super_id == 1 ? foreignComapny.foreignOrderId : foreignComapny.barcode} />
                                    {/* <img src={foreignComapny.barcode_img} alt="barcode" className="mb-3" /> */}
                                </div>}

                                <p>{translate("WAYBILL.PRINT_DATE")}: {new Date().toDateString()} </p>

                                <div className="d-flex">
                                    <div className={"border border-dark border-2 p-2 m-inline-e-2 " + (foreignComapny != "" && "w-75")}>
                                        {businessName != "" && <>
                                            <div className="row">
                                                <div className="col" style={{ textAlign: "center" }}>
                                                    <p style={{ fontWeight: "bold", fontSize: "1.2rem" }}>{/* {translate("PERSONAL_DETAILS.BUSINESS_NAME")}:  */}{businessName}</p>
                                                    {/* {BusinessName && <hr /> */}
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col d-flex justify-content-center">
                                                    <div style={{ width: "80%", borderBottom: "3px solid lightgray" }}></div>
                                                </div>
                                            </div>
                                        </>}
                                        <div className="row p-2">
                                            <div className={"col" + (foreignComapny != "" && "-4") + " d-flex justify-content-center"}>
                                                <img
                                                    style={{
                                                        borderRadius: "5px",
                                                        //margin: "auto",
                                                        // border: "4px solid rgba(0,0,0,0.15)",
                                                        width: "110px",
                                                        height: "110px",
                                                        objectFit: "cover",
                                                        margin: "auto"
                                                    }}
                                                    alt="business logo"
                                                    src={`/togo/MobileAPi/${logoURL}`}
                                                //src="https://cdn.dribbble.com/users/1111447/screenshots/7697273/media/ba28a6aaee0f52b59662c6d6122c94ef.png?compress=1&resize=400x300" 
                                                />
                                            </div>
                                            <div className={"col" + (foreignComapny != "" && "-8") + " mt-3"}>
                                                <div style={{ width: foreignComapny == "" && "200px" }}>
                                                    {/* <p>{{translate("PERSONAL_DETAILS.FULL_NAME")}: }{FullName}</p> */}
                                                    {Email != "" && <p>{translate("PERSONAL_DETAILS.EMAIL")}: {Email}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={(foreignComapny != "" ? "w-25" : "w-50")}>
                                        {
                                            foreignComapny == "" ? <>
                                                {/* <p>{translate("WAYBILL.PRINT_DATE")}: {new Date().toDateString()} </p> */}
                                                <div className="d-flex justify-content-center align-items-center flex-column">
                                                    Track & Pay
                                                    <QRCode
                                                        value={`https://${process.env.REACT_APP_NEW_BACKEND_URL}/ar/track/${hashedId}`}
                                                        className="pt-2"
                                                        size={showTrems ? 150 : 100}
                                                    />

                                                </div>
                                            </> : <div className="border border-dark border-2" style={{ textAlign: "center" }}>
                                                <p className="p-2 border-bottom border-dark">{translate("WAYBILL.AMOUNT")}</p>

                                                <div className="d-flex justify-content-center flex-column amount-section" style={{ padding: "30px 0 30px 0" }}>
                                                    <h1 className="h1">{orderDetails?.CostLoad}</h1>
                                                    {orderDetails?.CostLoad && <p>{translate("WAYBILL.NIS")}</p>}
                                                    {!orderDetails?.CostLoad && <p>--</p>}
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>

                                <div className="d-flex">

                                    <div className="w-50  m-inline-e-2">
                                        <fieldset
                                            style={{
                                                all: "revert",
                                                margin: "0"
                                            }}
                                            className="border-dark"
                                        >
                                            <legend
                                                style={{
                                                    all: "revert"
                                                }}
                                            >
                                                {translate("WAYBILL.SENDER")}
                                            </legend>
                                            <p>{translate("WORKING_TIME.FROM")}: {orderDetails?.SenderName ? orderDetails?.SenderName : businessName},<br />
                                                {orderDetails?.IdCitySource},<br />
                                                {orderDetails?.OtherDetails}
                                            </p>
                                            <hr className="my-2" />
                                            <p>{translate("ADMIN.MOBILE_NUMBER")}: {phone/* orderDetails?.PhoneCustomer */}</p>
                                        </fieldset>
                                    </div>

                                    <div className="w-50">
                                        <fieldset
                                            style={{
                                                all: "revert",
                                                margin: "0",
                                            }}
                                            className="border-dark"
                                        >
                                            <legend style={{
                                                all: "revert"
                                            }}>
                                                {translate("WAYBILL.RECEIVER")}
                                            </legend>
                                            <div>
                                                <p>{translate("WORKING_TIME.TO")}: {orderDetails?.ReceiverName}, <br /> {orderDetails?.IdCityDes},<br /> {orderDetails?.OtherDetailsDes}</p>
                                                <hr className="my-2" />
                                                <p>{translate("ADMIN.MOBILE_NUMBER")}: {orderDetails?.ReceiverAddressNum}</p>
                                            </div>
                                        </fieldset>
                                    </div>
                                </div>

                                <div className="d-flex">
                                    <div className="w-75 m-inline-e-2 d-flex flex-column justify-content-between h-100" style={{ rowGap: "0.5rem" }}>

                                        <fieldset
                                            style={{
                                                all: "revert",
                                                margin: "0",
                                                paddingBottom: "8px",
                                                height: "39px"
                                            }}
                                            className="border-dark"
                                        >
                                            <legend
                                                style={{
                                                    all: "revert",
                                                    fontSize: "14px"
                                                }}
                                            >
                                                {translate("WAYBILL.NOTES")}
                                            </legend>
                                            <p>{orderDetails?.DetailsLoad}</p>
                                        </fieldset>


                                        <div className="d-flex " style={{ height: "88px" }}  >
                                            <div className="w-75 m-inline-e-2" style={{ height: "88px" }} >
                                                <table className="table table-bordered border-2 border-dark mb-0" style={{ height: "88px" }}  >
                                                    <thead>
                                                        <tr>
                                                            <th style={{ fontSize: "1rem" }}>{translate("WAYBILL.LENGTH")}</th>
                                                            <th style={{ fontSize: "1rem" }}>{translate("WAYBILL.HEIGHT")}</th>
                                                            <th style={{ fontSize: "1rem" }}>{translate("WAYBILL.WIDTH")}</th>
                                                            <th style={{ fontSize: "1rem" }}>{translate("WAYBILL.WEIGHT")}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>
                                                                {orderDetails?.LengthLoad || "N/A"}
                                                            </td>
                                                            <td>
                                                                {orderDetails?.HeightLoad || "N/A"}
                                                            </td>
                                                            <td>
                                                                {orderDetails?.WidthLoad || "N/A"}
                                                            </td>
                                                            <td>
                                                                {orderDetails?.WeightLoad || "N/A"}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="w-25" style={{ height: "88px" }}  >
                                                <table className="table table-bordered border-2 border-dark mb-0" style={{ height: "88px" }}  >
                                                    <thead>
                                                        <tr>
                                                            <th style={{ fontSize: showTrems ? "1.2rem" : "1rem" }}>
                                                                {translate("WAYBILL.SHIP")}
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>{packageFormatter({ PackageType: orderDetails?.TypeLoad })}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* edited (add delivery price to the bill) not needed! */}
                                            {/*<div className="w-25 ms-1">
        <table className="table table-bordered border-2 border-dark">
            <thead>
                <tr>
                    <th>{translate("WAYBILL.DELIVER_PRICE")}</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{orderDetails?.DeliveryPrice + " NIS"}</td>
                </tr>
            </tbody>
        </table>
    </div>*/}
                                        </div>
                                        <div className="border border-dark p-2  border-2 d-flex" >
                                            <p>{translate("WAYBILL.ORDER_ID")}: </p>
                                            <p className="mt-0 ms-1">{id}</p>
                                        </div>
                                    </div>
                                    {
                                        foreignComapny == "" ? <>
                                            <div className="border border-2 border-dark w-25 text-center mb-3 mt-2"> {/* fofofo */}

                                                <p className="p-2 border-bottom border-dark">{translate("WAYBILL.AMOUNT")}</p>

                                                <div className="d-flex justify-content-center flex-column" style={{ height: "calc(100% - 38px)" }}>
                                                    <h1 className="h1">{orderDetails?.CostLoad}</h1>
                                                    {orderDetails?.CostLoad && <p>{translate("WAYBILL.NIS")}</p>}
                                                    {!orderDetails?.CostLoad && <p>--</p>}
                                                </div>
                                            </div>
                                        </> :


                                            <fieldset
                                                style={{
                                                    all: "revert",
                                                    margin: "0",
                                                    paddingBottom: "8px",
                                                    height: "184px",
                                                    width:"25%"
                                                }}
                                                className="border-dark">
                                                <legend
                                                    style={{
                                                        all: "revert",
                                                        fontSize: "14px"
                                                    }}
                                                >
                                                    {translate("WAYBILL.QR")}
                                                </legend>
                                                <div className={`d-flex justify-content-center align-items-center h-100 flex-column `}>

                                                    {/* Render QR code only if hashed_id is available */}

                                                    <QRCode
                                                        value={`https://${process.env.REACT_APP_NEW_BACKEND_URL}/ar/track/${hashedId}`}
                                                        // className="w-100 h-100"
                                                        style={{objectFit:"cover",width:"170px",height:"170px"}}
                                                        
                                                    />
                                                </div>
                                            </fieldset>

                                    }

                                </div>
                                {showTrems && <div className="d-flex mt-3">
                                    <div className="w-50">
                                        <h1 className="h6">{translate("WAYBILL.TERMS_AND_CONDITIONS")}</h1>
                                        <ol style={{ fontSize: "8px", padding: "revert", listStyle: localStorage.getItem("Language") === "en" ? "normal" : "arabic-indic" }}>
                                            <li>{translate("WAYBILL.CLOUSE_ONE")}</li>
                                            <li>{translate("WAYBILL.CLOUSE_TWO")}</li>
                                            <li>{translate("WAYBILL.CLOUSE_THREE")}</li>
                                            <li>{translate("WAYBILL.CLOUSE_FOUR")}</li>
                                            <li>{translate("WAYBILL.CLOUSE_FIVE")}</li>
                                            <li>{translate("WAYBILL.CLOUSE_SIX")}</li>
                                        </ol>
                                    </div>

                                    <div className="w-50" style={{ direction: localStorage.getItem("Language") === "en" ? "rtl" : "ltr" }}>
                                        <h1 className="h6">{translate("WAYBILL.TERMS_AND_CONDITIONS_AR")}</h1>
                                        <ol style={{ fontSize: "8px", padding: "revert", listStyle: localStorage.getItem("Language") === "en" ? "arabic-indic" : "normal" }}>
                                            <li>{translate("WAYBILL.CLOUSE_ONE_AR")}</li>
                                            <li>{translate("WAYBILL.CLOUSE_TWO_AR")}</li>
                                            <li>{translate("WAYBILL.CLOUSE_THREE_AR")}</li>
                                            <li>{translate("WAYBILL.CLOUSE_FOUR_AR")}</li>
                                            <li>{translate("WAYBILL.CLOUSE_FIVE_AR")}</li>
                                            <li>{translate("WAYBILL.CLOUSE_SIX_AR")}</li>
                                        </ol>

                                    </div>

                                </div>}
                                <hr className="my-3" />
                                <img src={whiteLogo} style={{
                                    width: "80px", filter: "brightness(0)"
                                }} alt="logo" className="mb-3" />
                            </>
                    }


                </div>
            </div>
        </>
    )
}