import React, { useEffect, useState } from "react";
import { Badge, Button, Card, Tab, Tabs, Form } from "react-bootstrap";
import { imgBaseUrl } from "../Constants/GeneralCont";
import AddMemberToNetworkDialog from "./AddMemberToNetworkDialog";
import { GetAllNetworkMembers, GetAllClientNetworkMembers, getTransporterOtherNetwork, getTransporterDirectClients, updateClientAutoOffer, updateTransporterAutoAccept, acceptClientInvitation } from "../APIs/OrdersAPIs";
import { NetworkInvitesListDialog } from "./NetworkInvitesListDialog";
import Table from "react-bootstrap/Table";
import { isTransporter } from "../Util";
import AddTransporterToNetworkDialog from "./AddTransporterToNetworkDialog";
import translate from "../i18n/translate";
import { useDispatch } from "react-redux";
import { toastNotification } from "../Actions/GeneralActions";
import { useIntl } from "react-intl";
import { refreshPage } from "../Functions/CommonFunctions";

export function TransporterMemberCar({ member }) {

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
                        src={`${imgBaseUrl}${member.PersonalImgPath}`}
                        alt={member.PhoneNumber}
                    />
                </div>
            </td>
            <td>{member?.FullName}</td>
            <td>{member?.PhoneNumber}</td>
            <td>
                {member.IsMemberAccepted == 1 && <Badge className="fs-6 align-middle" pill bg="success">{translate("TEMP.ACTIVE")}</Badge>}
                {member.IsMemberAccepted != 1 && <Badge className="fs-6 align-middle" pill bg="secondary">{translate("TEMP.WATING")}</Badge>}
            </td>
            <td>{member.Note}</td>
            <td>
                <Button variant="outline-secondary" className="" >
                    <Badge bg="secondary">{member.DeliveryCost || "N/A"}</Badge>
                </Button>
            </td>
        </tr>
    )
}

export function TransporterOtherNetworkMemberCar({ member }) {
    let dispatch = useDispatch();

    const [autoAccept, setAutoAccept] = useState(member?.isAutoAccept);

    const changeAutoAcceptrHandler = (e, networkMemberId) => {
        autoAccept == 1 ? setAutoAccept(0) : setAutoAccept(1);

        const isChecked = e.target.checked == true ? 1 : 0;

        updateTransporterAutoAccept(networkMemberId, isChecked).then((res) => {
            // console.log(res.data);
            if (res.data === "updated") {
                dispatch(toastNotification("Updated", "Auto Accept updated sucessfully!", "success"));
            } else {
                dispatch(toastNotification("Error", res.data, "error"));
            }
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
                        alt={member.PhoneNumber}
                    />
                </div>
            </td>
            <td>{member?.FullName}</td>
            <td>{member?.PhoneNumber}</td>
            <td>
                {member.IsMemberAccepted == 1 && <Badge className="fs-6 align-middle" pill bg="success">{translate("TEMP.ACTIVE")}</Badge>}
                {member.IsMemberAccepted != 1 && <Badge className="fs-6 align-middle" pill bg="secondary">{translate("TEMP.WATING")}</Badge>}
            </td>
            <td>{member.Note}</td>
            <td>
                <Button variant="outline-secondary" className="" >
                    <Badge bg="secondary">{member.DeliveryCost || "N/A"}</Badge>
                </Button>
            </td>
            <td>
                <Form className="d-flex justify-content-center">
                    <Form.Check
                        type="switch"
                        id="custom-switch"
                        label=""
                        checked={autoAccept == 1 ? true : false}
                        onChange={(e) => changeAutoAcceptrHandler(e, member?.NetworkRowId)}
                    />
                </Form>
            </td>
        </tr>
    )
}

export function ForClientsMemberCar({ member }) {

    let dispatch = useDispatch();

    const [autoOffer, setAutoOffer] = useState(member?.isAutoOffer);

    const changeAutoOfferHandler = (e, networkMemberId) => {
        autoOffer == 1 ? setAutoOffer(0) : setAutoOffer(1);

        const isChecked = e.target.checked == true ? 1 : 0;

        updateClientAutoOffer(networkMemberId, isChecked).then((res) => {
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
                        src={`${imgBaseUrl}${member.PersonalImgPath}`}
                        alt={member.PhoneNumber}
                    />
                </div>
            </td>
            <td>{member?.BusinessName}</td>{/*  */}
            <td>{member?.FullName}</td>{/*  */}
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
            <td>{
                member?.isApproved == 0 && <Button variant="outline-success" onClick={() => {
                    acceptClientInvitation(member?.NetworkMemberId).then((res) => {
                        // console.log(res.data);

                        if (res.data == "accepted") {
                            refreshPage();
                        } else {
                            dispatch(toastNotification("Error", res.data, "error"));
                        }
                    })
                }}>
                    {translate("TEMP.ACCEPT_INVITATION")}
                </Button>
            }</td>
        </tr>
    )
}

export function ClientNetweokMemberCar({ member }) {
    // console.log(member);
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
            <td>{member?.isApproved == 1 && (member?.isAutoOffer == 1 ? <i className="bi bi-check-circle-fill h5" style={{ color: "green" }}></i> : <i className="bi bi-x-circle-fill h5" style={{ color: "red" }}></i>)}</td>
            <td>{member?.isApproved == 0 && <Badge bg="warning">{translate("TEMP.INVITATION_SENT")}</Badge>}</td>
        </tr>
    )
}

export default function Network() {

    const intl = useIntl();

    const styles = {
        cardHeaderLg: {
            position: 'absolute',
            left: '20px',
            right: '20px',
            top: '-20px',
            background: "linear-gradient(90deg, #26a69a, #69d4a5)",
            color: 'white',
            borderRadius: '10px',
            fontWeight: 'bold'
        },
        cardHeaderSm: {
            position: 'absolute',
            left: '20px',
            top: '-20px',
            background: "linear-gradient(90deg, #26a69a, #69d4a5)",
            color: 'white',
            borderRadius: '10px',
            fontWeight: 'bold'
        }
    }

    const [members, setMembers] = useState([]);
    const [otherMembers, setOtherMembers] = useState([]);
    const [directClients, setDirectClients] = useState([]);

    const updateTransporterNetwork = () => {
        GetAllNetworkMembers().then((res) => {
            setMembers(res.data.server_response);
        });
    }

    const updateClientNetwork = () => {
        GetAllClientNetworkMembers().then((res) => {
            // console.log(res.data); // temp test
            setMembers(res.data.membersData);
        });
    }

    useEffect(() => {
        getTransporterOtherNetwork().then((res) => {
            // console.log(res.data); // temp test
            setOtherMembers(res.data.server_response);
        });
    }, [])

    useEffect(() => {
        getTransporterDirectClients().then((res) => {
            console.log(res.data); // temp test
            setDirectClients(res.data.server_response);
        });
    }, [])

    useEffect(() => {
        if (isTransporter()) {
            updateTransporterNetwork();
        } else {
            updateClientNetwork();
        }
    }, []);

    return (
        <div>
            <Tabs defaultActiveKey="myNetwork" id="uncontrolled-tab-example" className="mb-3 mt-3 ms-5">
                <Tab eventKey="myNetwork" title={translate("NETWORK.NETWORK_TITLE")}>
                    {isTransporter() && <div className="d-flex justify-content-end mt-3">
                        <NetworkInvitesListDialog update={updateTransporterNetwork} />
                        <AddMemberToNetworkDialog />
                    </div>}

                    {!isTransporter() && <div className="d-flex justify-content-end">
                        <AddTransporterToNetworkDialog update={updateClientNetwork} onSuccess={() => { refreshPage() }} />
                    </div>}

                    <Card className="m-5 shadow">
                        <Card.Header style={styles.cardHeaderSm}>
                            {translate("NETWORK.NETWORK_TITLE")}
                        </Card.Header>
                        <Card.Body>
                            <div className="container-fluid mt-3">
                                <div className="row">

                                    <Table responsive hover style={{ fontSize: "1rem", marginRight: '20px', marginLeft: "20px" }}>
                                        <thead>
                                            {isTransporter() && <tr>
                                                <th scope="col" style={{ width: "5%" }}></th>
                                                <th scope="col">{translate("TEMP.NAME")}</th>
                                                <th scope="col" style={{ width: "10%" }}>{translate("TEMP.PHONE")}</th>
                                                <th scope="col" style={{ width: "5%" }}>{translate("TEMP.STATUS")}</th>
                                                <th scope="col" style={{ width: "40%" }}>{translate("TEMP.DESC")}</th>
                                                <th scope="col" style={{ width: "10%" }}>{translate("TEMP.LOAD_COST")}</th>
                                            </tr>}
                                            {!isTransporter() && <tr>
                                                <th scope="col"></th>
                                                <th scope="col">{translate("TEMP.NAME")}</th>
                                                <th scope="col">{translate("TEMP.PHONE")}</th>
                                                <th scope="col">{translate("TEMP.AUTO_OFFER")}</th>
                                                <th scope="col"></th>
                                            </tr>}
                                        </thead>

                                        <tbody>
                                            {isTransporter() && members?.map((member, index) => {
                                                return (
                                                    <TransporterMemberCar
                                                        key={index}
                                                        src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4DIB9mSrwArVWd1WGdqVwb9Sf-cHXSNuEbg&usqp=CAU"}
                                                        isActive
                                                        member={member}
                                                    />
                                                )
                                            })}

                                            {!isTransporter() && members?.map((member, index) => {
                                                return (
                                                    <ClientNetweokMemberCar
                                                        key={index}
                                                        src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4DIB9mSrwArVWd1WGdqVwb9Sf-cHXSNuEbg&usqp=CAU"}
                                                        isActive
                                                        member={member}
                                                    />
                                                )
                                            })}
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Tab>
                {isTransporter() && <Tab eventKey="otherNetworks" title={translate("NETWORK.MEMBER_ON_OTHER_NETWORKS")}>
                    <Card className="m-5 shadow">
                        <Card.Header style={styles.cardHeaderSm}>
                            {translate("NETWORK.OTHER_NETWORK")}
                        </Card.Header>
                        <Card.Body>
                            <div className="container-fluid mt-3">
                                <div className="row">

                                    <Table responsive hover style={{ fontSize: "1rem", marginRight: '20px', marginLeft: "20px" }}>
                                        <thead>
                                            {isTransporter() && <tr>
                                                <th scope="col" style={{ width: "5%" }}></th>
                                                <th scope="col">{translate("TEMP.NAME")}</th>
                                                <th scope="col" style={{ width: "10%" }}>{translate("TEMP.PHONE")}</th>
                                                <th scope="col" style={{ width: "5%" }}>{translate("TEMP.STATUS")}</th>
                                                <th scope="col" style={{ width: "40%" }}>{translate("TEMP.DESC")}</th>
                                                <th scope="col" style={{ width: "10%" }}>{translate("TEMP.LOAD_COST")}</th>
                                                <th scope="col">
                                                    {translate("TEMP.AUTO_ACCEPT")} <i className="bi bi-info-circle" style={{ cursor: "pointer" }} data-bs-toggle="tooltip" title={intl.formatMessage({ id: "TEMP.AUTO_ACCEPT_DESC" })}></i>
                                                </th>
                                            </tr>}
                                        </thead>

                                        <tbody>
                                            {isTransporter() && otherMembers?.map((member, index) => {
                                                return (
                                                    <TransporterOtherNetworkMemberCar
                                                        key={index}
                                                        src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4DIB9mSrwArVWd1WGdqVwb9Sf-cHXSNuEbg&usqp=CAU"}
                                                        isActive
                                                        member={member}
                                                    />
                                                )
                                            })}
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Tab>}
                {isTransporter() && <Tab eventKey="myClients" title={translate("NETWORK.MY_CLIENTS")}>
                    <Card className="m-5 shadow">
                        <Card.Header style={styles.cardHeaderSm}>
                            {translate("NETWORK.OTHER_NETWORK")}
                        </Card.Header>
                        <Card.Body>
                            <div className="container-fluid mt-3">
                                <div className="row">

                                    <Table responsive hover style={{ fontSize: "1rem", marginRight: '20px', marginLeft: "20px" }}>
                                        <thead>
                                            {isTransporter() && <tr>
                                                <th scope="col" style={{ width: "5%" }}></th>
                                                <th scope="col">{translate("TEMP.BUSINESS_NAME")}</th>
                                                <th scope="col">{translate("TEMP.FULL_NAME")}</th>
                                                <th scope="col" style={{ width: "10%" }}>{translate("TEMP.PHONE")}</th>
                                                <th scope="col">
                                                    {translate("TEMP.AUTO_OFFER")} <i className="bi bi-info-circle" style={{ cursor: "pointer" }} data-bs-toggle="tooltip" title={intl.formatMessage({ id: "TEMP.AUTO_OFFER_DESC" })}></i>
                                                </th>
                                                <th scope="col"></th>
                                            </tr>}
                                        </thead>

                                        <tbody>
                                            {isTransporter() && directClients?.map((member, index) => {
                                                return (
                                                    <ForClientsMemberCar
                                                        key={index}
                                                        src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4DIB9mSrwArVWd1WGdqVwb9Sf-cHXSNuEbg&usqp=CAU"}
                                                        isActive
                                                        member={member}
                                                    />
                                                )
                                            })}
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Tab>}
            </Tabs>
        </div>
    );
}
