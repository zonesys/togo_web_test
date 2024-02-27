import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { Accordion, Card, Button, Badge, Spinner, Form, FloatingLabel } from "react-bootstrap";
import translate from "../../../i18n/translate";
import { useHistory } from "react-router";
import { FixedSizeList } from 'react-window';
import { ImBlocked } from 'react-icons/im';
import { AiOutlineCheckCircle } from 'react-icons/ai';

export default function UsersCard(props) {

    const history = useHistory();

    const [users, setUsers] = useState(props.list);

    // window height and width variables to set records container width and height
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth / 5.5);

    const [loading, setLoading] = useState(false);

    // update window width and height when change window dimensions (zoom in and out, move to a bigger screen)
    useEffect(() => {
        function handleResize() {
            setWindowHeight(window.innerHeight)
            setWindowWidth(window.innerWidth / 5.5)
        }

        window.addEventListener('resize', handleResize)
    })

    useEffect(() => {
        setUsers(props.list)
        setLoading(props.loading);

    }, [props.list])

    /* using search bar, filter users (transporters/clients) by their names or phone numbers */
    const filterHandler = (val) => {
        let tempUsers = props.list.filter(user => (user.BusinessName && user.BusinessName.toLowerCase().includes(val.toLowerCase())) || (user.FullName && user.FullName.toLowerCase().includes(val.toLowerCase())) || (user.PhoneNumber && user.PhoneNumber.includes(val)));
        setUsers(tempUsers)
    }

    /* FixedSizeList at each row */
    const RowComponent = ({ user, num, style }) => (
        <div style={style} className={"list-group-item-custom"}>
            <div className="d-flex justify-content-between user-div h4">

                <div
                    className="rounded-circle d-flex light-turquoise-bg me-3 img-div"
                    style={{ position: "relative", width: "50px", height: "50px" }}
                >
                    <img
                        className="user-img"

                        src={user.PersonalImgPath ? "https://togo.ps/togo/MobileAPi/" + user.PersonalImgPath : "https://freepikpsd.com/file/2019/10/avatar-icon-png-5-Images-PNG-Transparent.png"}

                        alt="user-profile-pic"
                    />
                    {user.isActive && <div style={{ backgroundColor: "green", width: "10px", height: "10px", borderRadius: "50%", position: "absolute", right: "0", top: "0" }}></div>}
                </div>
                <div style={{ width: "20%", margin: "auto" }}>
                    <div className="user-name">{user.BusinessName}</div>
                </div>
                <div style={{ width: "5%", margin: "auto" }} className="d-flex justify-content-center">
                    {user.IsBlocked == 1 ?
                        <ImBlocked style={{ color: "red", backgroundColor: "white", borderRadius: "50%" }} /> :
                        <AiOutlineCheckCircle style={{ color: "green", backgroundColor: "white", borderRadius: "50%" }} />}
                </div>
                <div style={{ width: "20%", margin: "auto" }} className="d-flex justify-content-center">
                    <div>{user.PhoneNumber}</div>
                </div>
                {user.IsTransporter == null && <div style={{ width: "10%", margin: "auto" }} className="d-flex justify-content-center">
                    <div><span style={{ color: "#26a69a" }}>{user.totalCOD != null ? user.totalCOD : "0"} {" NIS"}</span></div>
                </div>}
                <div style={{ width: "10%", margin: "auto" }} className="d-flex justify-content-center">
                    <div style={{ color: "#26a69a" }}>{user.balance} {" NIS"}</div>
                </div>
                <div style={{ width: "20%", margin: "auto" }} className="d-flex justify-content-center">
                    <Button className="w-100 btn-grad" onClick={() => { history.push("/adminapp/customerInfo/" + user.id + "/" + (user.IsTransporter === "1" ? "1" : "0")) }}>View</Button>
                </div>
            </div>
            {/* </div> */}
        </div>
    );

    /* FixedSizeList row */
    const Row = ({ index, style }) => {
        return <RowComponent user={users[index]} num={index} style={style} />
    };

    /* FixedSizeList, used to render only the visible rows to the DOM to enhance the performance */
    const ListComponent = () => {
        return <FixedSizeList
            height={windowHeight}
            width={windowWidth}
            itemSize={70}
            itemCount={users?.length}
            className="list-container"
        >
            {Row}
        </FixedSizeList>
    };

    return (
        <div className="h-100 d-flex flex-column bg-white p-3 rounded-22 shadow" style={{ position: "relative" }}>

            <div style={{ position: "absolute", top: "15px", left: "20px", right: "15px" }}>
                <p className="text-black h3">{props.title}</p>
                <FloatingLabel controlId="floatingSearch" label="Search" style={{ position: "absolute", right: 0, top: "-10px", width: "30%" }}>
                    <Form.Control type="text" placeholder="search..." onChange={(e) => filterHandler(e.target.value)} className="rounded-22" />
                </FloatingLabel>
            </div>

            {loading == true ?
                users?.length != 0 ? <>
                    <div style={{ marginTop: "70px" }}>
                        <div className="d-flex justify-content-between user-div h4">

                            <div
                                className="rounded-circle d-flex light-turquoise-bg me-3 img-div"
                                style={{ position: "relative", width: "50px", height: "50px" }}
                            >

                            </div>
                            <div style={{ width: "20%", margin: "auto" }}>
                                <div className="user-name">Client Name</div>
                            </div>
                            <div style={{ width: "5%", margin: "auto" }} className="d-flex justify-content-center">
                                Status
                            </div>
                            <div style={{ width: "20%", margin: "auto" }} className="d-flex justify-content-center">
                                <div>Phone</div>
                            </div>
                            {props.title == "All Clients" && <div style={{ width: "10%", margin: "auto" }} className="d-flex justify-content-center">
                                <ul style={{ listStyleType: "none", textAlign: "center" }}>
                                    <li>
                                        Total COD
                                    </li>
                                    <li>
                                        <span className="h6 ms-1 mt-1">(Waiting for Bids)</span>
                                    </li>
                                </ul>
                            </div>}
                            <div style={{ width: "10%", margin: "auto" }} className="d-flex justify-content-center">
                                Balance
                            </div>
                            <div style={{ width: "20%", margin: "auto" }} className="d-flex justify-content-center">

                            </div>
                        </div>
                    </div>
                    <ListComponent />
                </> : <>
                    <div className="mt-5 d-flex justify-content-center h4">
                        No {props.title.split(" ")[1]} Found!
                    </div>
                    <div className="mt-5 d-flex justify-content-center h4">
                        <i className="bi bi-list" style={{ fontSize: "10rem", color: "lightgray" }}></i>
                    </div>
                </>
                : <div className="mt-5 d-flex justify-content-center h4">
                    <Spinner animation="border" size="lg" />
                </div>}
        </div>
    )
}