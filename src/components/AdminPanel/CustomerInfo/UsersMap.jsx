import React, { Component, useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Badge from "react-bootstrap/Badge";
import Table from "react-bootstrap/Table";
import './styles.css';
import { GetAllCities, getLocationUsers } from "../../../APIs/AdminPanelApis";
import { BiLocationPlus } from 'react-icons/bi';
import { useHistory } from "react-router";

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

const UsersMap = (props) => {

    const history = useHistory();

    /* const [windowHeight, setWindowHeight] = useState(window.innerHeight);

    useEffect(() => {
        function handleResize() {
            setWindowHeight(window.innerHeight)
        }

        window.addEventListener('resize', handleResize)
    }, []) */

    const [btnClients, setBtnClients] = useState("");
    const [btnTransporters, setBtnTransporters] = useState("active");
    const [locationUsers, setTempLocationUsers] = useState([]);
    const [show, setShow] = useState(false);
    const [modalTitle, setModalTitle] = useState("");

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const toggleHandler = () => {
        if (btnClients === "active") {
            setBtnClients("");
            setBtnTransporters("active");
            GetAllCities("transporters").then((res) => {
                setAllCities(res.data.cities_list);
            })
        } else {
            setBtnClients("active");
            setBtnTransporters("");
            GetAllCities("clients").then((res) => {
                setAllCities(res.data.cities_list);
            })
        }
    }

    const [allCities, setAllCities] = useState([]);
    const [centerMarkerPosition, setCenterMarkerPosition] = useState({ "centerLat": 0, "centerLong": 0 });

    useEffect(() => {
        GetAllCities("transporters").then((res) => {
            setAllCities(res.data.cities_list);
            // console.log(res.data);
            // setCenterMarkerPosition(getCenter(res.data.cities_list));
            // console.log(getCenter(res.data.cities_list))
        })
    }, [])

    const getCenter = (points) => {
        let sumX = 0;
        let sumY = 0;
        const n = points.length;

        for (let i = 0; i < points.length; i++) {
            sumX += parseFloat(points[i].LatRegion);
            sumY += parseFloat(points[i].LongRegion);
        }

        return { "centerLat": (1 / n) * sumX, "centerLong": (1 / n) * sumY };
    }

    const viewLocationUsers = (cityId, cityName) => {

        const type = btnTransporters == "active" ? "transporters" : "clients";

        handleShow();
        setModalTitle(type.charAt(0).toUpperCase() + type.slice(1) + " in " + cityName);

        getLocationUsers(cityId, type).then((res) => {
            // console.log(res.data.users_list);
            setTempLocationUsers(res.data.users_list);
        })
    }

    return (
        <>
            <div className="h-100 d-flex flex-column bg-white p-3 rounded-22 shadow map-container">
                <div className="toggle-users">
                    <Button variant="outline-secondary" className={btnClients + " toggleButtonLeft"} onClick={toggleHandler} >Clients</Button>
                    <Button variant="outline-secondary" className={btnTransporters + " toggleButtonRight"} onClick={toggleHandler} >Transporters</Button>
                    {/* <div className="ms-5 mt-2 ">
                    <i className="bi bi-plus-lg h5">Add New City/Village</i>
                </div> */}
                    {/* <BiLocationPlus /> */}
                    {/* <Button variant="outline-primary" className="d-flex justify-content-between ms-3" style={{ height: "35px" }}>
                    <BiLocationPlus className="me-2 h2" />
                    <span className="mt-1">Add New City/Village</span>
                </Button> */}
                    {/* <Button><BiLocationPlus className="h1 add-city-icon" /></Button> */}
                </div>
                <MapContainer
                    key={JSON.stringify([0, 0])}
                    id="mapId"
                    center={[31.9522, 35.2332]}
                    zoom={9.5}
                    style={{ height: "100%" }}
                    className="rounded-22"
                >
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {allCities?.map((city, index) => {
                        return <Marker key={index} position={L.latLng(parseFloat(city.LatRegion), parseFloat(city.LongRegion))} onClick={() => {
                            console.log("test");
                        }}>
                            <Popup>
                                {city.Name}{" "}
                                <Button variant="outline-primary" onClick={() => viewLocationUsers(city.id, city.Name)} className="view-users-icon"><i className="bi bi-people-fill"></i></Button>
                            </Popup>
                        </Marker>
                    })}

                </MapContainer>
            </div>

            <Modal size="lg" show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table>
                        <thead>
                            <tr>
                                <th scope="col"></th>
                                <th scope="col">Full Name</th>
                                <th scope="col">Business Name</th>
                                <th scope="col">Phone Number</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                locationUsers?.map((user, index) => {
                                    return <tr key={index}>
                                        <td>
                                            <div
                                                className="rounded-circle d-flex light-turquoise-bg me-3 img-div"
                                                style={{ position: "relative", width: "50px", height: "50px" }}
                                            >
                                                <img
                                                    className="user-img"

                                                    src={user.imgURL ? "https://togo.ps/togo/MobileAPi/" + user.imgURL : "https://freepikpsd.com/file/2019/10/avatar-icon-png-5-Images-PNG-Transparent.png"}

                                                    alt="user-profile-pic"
                                                />
                                            </div>
                                        </td>
                                        <td>{user.fullName}</td>
                                        <td>{user.businessName}</td>
                                        <td>{user.PhoneNumber}</td>
                                        <td>
                                            <Button variant="outline-primary" onClick={() => { history.push("/adminapp/customerInfo/" + user.id + "/" + (btnTransporters == "active" ? "1" : "0")) }}>
                                                Show User <i class="bi bi-info-circle"></i>
                                            </Button>
                                        </td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )

}

export default UsersMap;
