import React, { useState, useEffect } from 'react';
import Modal from "react-bootstrap/Modal";
import translate from "../../i18n/translate";
/*import AccountInfo from "../AccountInfo/AccountInfo";*/
import { Accordion, Card, Button, Badge, Container, Row, Col, Table, Spinner } from "react-bootstrap";
import './TimeLine.css';
import './TimeLineEn.css';
import Address from "../Address/Address";
import { imgBaseUrl } from "../../Constants/GeneralCont";
import { transactionsByOrder } from '../../APIs/AdminPanelApis.js';

export default function Timeline(props) {

    // console.log(props.transportationParties) // temp test

    const [show, setShow] = useState(false);
    const [user, setUser] = useState({});
    const [isEn, setIsEn] = useState(localStorage.getItem("Language") === 'en' ? true : false);

    const [transactions, setTransactions] = useState([]);
    const [loadingTransactions, setLoadingTransactions] = useState(false);

    // const [users, setUsers] = useState(props.transportationParties[1].name === null ? props.transportationParties.splice(1,1) : props.transportationParties);

    const handleClose = () => {
        setShow(false);
    };

    const handleShow = () => { setShow(true) }

    useEffect(() => {
        if (localStorage.getItem("Language") === 'en') {
            setIsEn(true);
        } else {
            setIsEn(false);
        }
    })

    // console.log(props.users); /* test */

    const getTransactions = (customerId) => {
        setLoadingTransactions(true);
        setTransactions([]);

        transactionsByOrder(customerId, props.orderId).then(res => {

            // console.log(res.data);

            let tempArr = res.data.server_response.data.result.response;
            tempArr = tempArr?.filter(data => (
                ((data.journal_id_name == "Customer Invoices" && data.debit != 0) || (data.journal_id_name != "Customer Invoices")) &&
                ((data.journal_id_name == "Vendor Bills" && data.credit != 0) || (data.journal_id_name != "Vendor Bills"))
            ));

            console.log(tempArr)

            setTransactions(tempArr);

            setLoadingTransactions(false);
        })
    }

    /* format time from 24hr system to 12hr (am/pm) system */
    function timeFormat(time) {
        // Check correct time format and split into components
        time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

        if (time.length > 1) { // If time format correct
            time = time.slice(1);  // Remove full string match value
            time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
            time[0] = +time[0] % 12 || 12; // Adjust hours
        }
        return time.join(''); // return adjusted time or original string
    }

    return (
        <>
            <div className={!isEn ? "arrows" : "arrowsEn"}>
                {/*{console.log(window.innerWidth)}*/}
                {props.transportationParties.length !== 1 && props.transportationParties.map((user, index) =>
                    <div key={index} className={!isEn ? "arrow " + (index % 2 == 0 ? "step1" : "step2") : "arrowEn " + (index % 2 == 0 ? "step1En" : "step2En")} onClick={() => { handleShow(); setUser(user); props.showTransactions ? getTransactions(user.id) : setTransactions([]); }}>

                        {user.imageURL !== undefined ? <div // image
                            style={{
                                // background: "linear-gradient(90deg, #26a69a, #69d4a5)",
                                position: "absolute",
                                left: "10%",
                                top: "10px",
                                width: "50px",
                                height: "50px",
                                borderRadius: "50%",
                            }}

                            className={!isEn ? "img d-flex justify-content-center rounded-circle align-self-center" : "imgEn d-flex justify-content-center rounded-circle align-self-center"}>
                            <img
                                style={{
                                    width: "45px",
                                    height: "45px",
                                    objectFit: "cover"
                                }}
                                className="rounded-circle align-self-center"
                                src={`${imgBaseUrl}${user.imageURL}`}
                                alt="img"
                            />
                        </div> : <div style={{ // alt. image
                            background: "white",//"linear-gradient(90deg, #ff9966, #ff5e62)",
                            position: "absolute",
                            left: "10%",
                            top: "10px",
                            width: "50px",
                            height: "50px",
                        }}
                            className={!isEn ? "img d-flex justify-content-center rounded-circle align-self-center" : "imgEn d-flex justify-content-center rounded-circle align-self-center"}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="90%" height="90%" fill="currentColor" className="bi bi-person-fill" viewBox="0 0 16 16">
                                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                            </svg>
                        </div>}
                        <span className={!isEn ? "text" : "textEn"}>{user.type == 1 ? (user.name.length > 15 ? user.name.substring(0, 13) + "..." : user.name) : user.type == 2 ? /*"Transporter" + index*/(user.name.length > 11 ? user.name.substring(0, 8) + "..." : user.name) : (user.name.length > 15 ? user.name.substring(0, 13) + "..." : user.name)}{' '}{user.current ? <span className="badge bg-danger">Current</span> : ""}{user.type == 1 ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className={!isEn ? "svg-icon bi bi-send" : "svg-iconEn bi bi-send"} viewBox="0 0 16 16">
                            <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z" />
                        </svg> : user.type == 3 ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className={!isEn ? "svg-icon bi bi-envelope-open" : "svg-iconEn bi bi-envelope-open"} viewBox="0 0 16 16">
                            <path d="M8.47 1.318a1 1 0 0 0-.94 0l-6 3.2A1 1 0 0 0 1 5.4v.817l5.75 3.45L8 8.917l1.25.75L15 6.217V5.4a1 1 0 0 0-.53-.882l-6-3.2ZM15 7.383l-4.778 2.867L15 13.117V7.383Zm-.035 6.88L8 10.082l-6.965 4.18A1 1 0 0 0 2 15h12a1 1 0 0 0 .965-.738ZM1 13.116l4.778-2.867L1 7.383v5.734ZM7.059.435a2 2 0 0 1 1.882 0l6 3.2A2 2 0 0 1 16 5.4V14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V5.4a2 2 0 0 1 1.059-1.765l6-3.2Z" />
                        </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className={!isEn ? "svg-icon bi bi-truck" : "svg-iconEn bi bi-truck"} viewBox="0 0 16 16">
                            <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5v-7zm1.294 7.456A1.999 1.999 0 0 1 4.732 11h5.536a2.01 2.01 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456zM12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12v4zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                        </svg>}</span>
                    </div>
                )}
            </div>
            <Modal show={show} onHide={handleClose} centered size='lg' className="modal-radius-20">
                <Modal.Header /*closeButton*/ style={{ background: "linear-gradient(90deg, #26a69a, #69d4a5)" }}>
                    {/* <Modal.Title>{translate("TEMP.INFO")}</Modal.Title>*/}

                    <div className="container-fluid">
                        <div className="d-flex justify-content-center" style={{ position: "" }} >

                            {/*<svg style={{ position: "absolute", left: "-10px", top: "-10px", color: "white", opacity: "0.5" }} xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor"className="bi bi-truck" viewBox="0 0 16 16">
                              <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5v-7zm1.294 7.456A1.999 1.999 0 0 1 4.732 11h5.536a2.01 2.01 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456zM12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12v4zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                            </svg>*/}

                            {user.type === 2 ? <div className="d-flex justify-content-between" style={{ paddingRight: "10px", paddingLeft: "10px", position: "absolute", left: "0", top: "5%", color: "white", background: "red", height: "30px", borderRadius: "0 10px 10px 0" }} >
                                <svg style={{ marginLeft: "10px" }} xmlns="http://www.w3.org/2000/svg" width="90%" height="90%" fill="currentColor" className="bi bi-truck" viewBox="0 0 16 16">
                                    <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5v-7zm1.294 7.456A1.999 1.999 0 0 1 4.732 11h5.536a2.01 2.01 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456zM12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12v4zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                                </svg>
                                <span style={{ marginTop: "4px", marginLeft: "10px" }} >Transporter</span>
                            </div> : user.type === 1 ? <div className="d-flex justify-content-between" style={{ paddingRight: "10px", paddingLeft: "10px", position: "absolute", left: "0", top: "5%", color: "white", background: "red", height: "30px", borderRadius: "0 10px 10px 0" }} >
                                <svg style={{ marginTop: "5px", marginLeft: "10px" }} xmlns="http://www.w3.org/2000/svg" width="70%" height="70%" fill="currentColor" className="bi bi-send" viewBox="0 0 16 16">
                                    <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z" />
                                </svg>
                                <span style={{ marginTop: "4px", marginLeft: "10px" }} >Sender</span>
                            </div> : <div className="d-flex justify-content-between" style={{ paddingRight: "10px", paddingLeft: "10px", position: "absolute", left: "0", top: "5%", color: "white", background: "red", height: "30px", borderRadius: "0 10px 10px 0" }} >
                                <svg style={{ marginTop: "3px", marginLeft: "10px" }} xmlns="http://www.w3.org/2000/svg" width="70%" height="70%" fill="currentColor" className="bi bi-envelope-open" viewBox="0 0 16 16">
                                    <path d="M8.47 1.318a1 1 0 0 0-.94 0l-6 3.2A1 1 0 0 0 1 5.4v.817l5.75 3.45L8 8.917l1.25.75L15 6.217V5.4a1 1 0 0 0-.53-.882l-6-3.2ZM15 7.383l-4.778 2.867L15 13.117V7.383Zm-.035 6.88L8 10.082l-6.965 4.18A1 1 0 0 0 2 15h12a1 1 0 0 0 .965-.738ZM1 13.116l4.778-2.867L1 7.383v5.734ZM7.059.435a2 2 0 0 1 1.882 0l6 3.2A2 2 0 0 1 16 5.4V14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V5.4a2 2 0 0 1 1.059-1.765l6-3.2Z" />
                                </svg>
                                <span style={{ marginTop: "4px", marginLeft: "10px" }} >Receiver</span>
                            </div>}

                            {/*user.type === 2 && <div className="d-flex justify-content-between" style={{ paddingRight: "10px", paddingLeft: "10px", position: "absolute", left: "0", top: "5%", color: "white", background: "red", height: "30px",  borderRadius: "0 10px 10px 0" }} >
                                <svg style={{ marginLeft: "10px" }} xmlns="http://www.w3.org/2000/svg" width="90%" height="90%" fill="currentColor"className="bi bi-truck" viewBox="0 0 16 16">
                                  <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5v-7zm1.294 7.456A1.999 1.999 0 0 1 4.732 11h5.536a2.01 2.01 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456zM12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12v4zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                                </svg>
                                <span style={{ marginTop: "4px", marginLeft: "10px" }} >Transporter</span>
                            </div>*/}

                            {/*user.imageURL !== undefined ? <div // image
                                style={{
                                    background: "white",
                                    width: "70px",
                                    height: "70px",
                                    borderRadius: "50%",
                                }}

                                className="d-flex justify-content-center rounded-circle align-self-center"
                            >
                                <img
                                    style={{
                                        width: "60px",
                                        height: "60px",
                                        objectFit: "cover"
                                    }}
                                    className="rounded-circle align-self-center"
                                    src={`${imgBaseUrl}${user.imageURL}`}
                                    alt="img"
                                />
                            </div> : <div style={{ // alt. image
                                    background: "white",
                                    width: "60px",
                                    height: "60px",
                                }}
                                    className="d-flex justify-content-center rounded-circle align-self-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="90%" height="90%" fill="currentColor" className="bi bi-person-fill" viewBox="0 0 16 16">
                                        <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                                    </svg>
                            </div>*/}

                            {user.type === 1 ? <svg style={{ color: "white", marginBottom: "10px" }} xmlns="http://www.w3.org/2000/svg" width="10%" height="10%" fill="currentColor" className="bi bi-send" viewBox="0 0 16 16">
                                <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z" />
                            </svg> : user.type === 3 ? <svg style={{ color: "white", marginBottom: "10px" }} xmlns="http://www.w3.org/2000/svg" width="10%" height="10%" fill="currentColor" className="bi bi-envelope-open" viewBox="0 0 16 16">
                                <path d="M8.47 1.318a1 1 0 0 0-.94 0l-6 3.2A1 1 0 0 0 1 5.4v.817l5.75 3.45L8 8.917l1.25.75L15 6.217V5.4a1 1 0 0 0-.53-.882l-6-3.2ZM15 7.383l-4.778 2.867L15 13.117V7.383Zm-.035 6.88L8 10.082l-6.965 4.18A1 1 0 0 0 2 15h12a1 1 0 0 0 .965-.738ZM1 13.116l4.778-2.867L1 7.383v5.734ZM7.059.435a2 2 0 0 1 1.882 0l6 3.2A2 2 0 0 1 16 5.4V14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V5.4a2 2 0 0 1 1.059-1.765l6-3.2Z" />
                            </svg> : <div // image
                                style={{
                                    background: "white",
                                    width: "70px",
                                    height: "70px",
                                    borderRadius: "50%",
                                }}

                                className="d-flex justify-content-center rounded-circle align-self-center"
                            >
                                <img
                                    style={{
                                        width: "60px",
                                        height: "60px",
                                        objectFit: "cover"
                                    }}
                                    className="rounded-circle align-self-center"
                                    src={`${imgBaseUrl}${user.imageURL}`}
                                    alt="img"
                                />
                            </div>}

                        </div>
                        <div className="row d-flex justify-content-center" style={{ fontSize: "1.5rem", color: "white" }}>{user.name}</div>
                    </div>
                </Modal.Header>

                <Modal.Body>

                    <Address address={user.address != null && user.address} customerName={user.customerName} name={user.name} phone={user.phone} price={user.price} image={user.imageURL} pickupDate={user.pickupDate} type={user.type} />

                    {
                        props.showTransactions && user.type != 3 && <>
                            <hr className='mb-3 mt-1' />

                            <Row className="mt-5 w-100 d-flex justify-content-center h3">
                                <span style={{ borderBottom: "2px solid lightgray", width: "fit-content", color: "#26a69a", fontWeight: "bold" }}>Customer Finacial Transactions</span>
                            </Row>

                            {
                                loadingTransactions ? <Row className="mt-4">
                                    <Table>
                                        <tr>
                                            <td><Spinner animation="border" size="lg" /></td>
                                        </tr>
                                    </Table>
                                </Row> :
                                    transactions?.length > 0 ? <Row className="mt-4">
                                        <Table>
                                            <thead>
                                                <tr>
                                                    <th scope="col">Name</th>
                                                    <th scope="col">Date</th>
                                                    <th scope="col">Time</th>
                                                    <th scope="col">Journal Name</th>
                                                    <th scope="col">In</th>
                                                    <th scope="col">Out</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    transactions?.map((item, index) => {
                                                        return <tr
                                                            key={index}
                                                        >
                                                            <td>
                                                                {item.move_name}
                                                            </td>
                                                            <td>
                                                                {item.create_date.split(" ")[0]}
                                                            </td>
                                                            <td>
                                                                {timeFormat(item.create_date.split(" ")[1])}
                                                            </td>
                                                            <td>
                                                                {item.journal_id_name}
                                                            </td>
                                                            <td>
                                                                <span style={{ fontWeight: item.credit > 0 ? "bold" : "", color: item.credit === 0 ? "lightgray" : "" }}>{item.credit !== 0 ? item.credit + " NIS" : 0}</span>
                                                            </td>
                                                            <td>
                                                                <span style={{ fontWeight: item.debit > 0 ? "bold" : "", color: item.debit === 0 ? "lightgray" : "" }}>{item.debit !== 0 ? item.debit + " NIS" : 0}</span>
                                                            </td>

                                                        </tr>
                                                    })
                                                }
                                            </tbody>
                                        </Table>

                                    </Row> : <Row className="mt-4">
                                        <Table>
                                            <tr>
                                                <td>There are no financial transactions yet!</td>
                                            </tr>
                                        </Table>
                                    </Row>
                            }
                        </>
                    }

                </Modal.Body>
                <Modal.Footer>
                    <Button className="w-100" variant="outline-secondary" onClick={handleClose}>
                        {translate("GENERAL.CLOSE")}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
