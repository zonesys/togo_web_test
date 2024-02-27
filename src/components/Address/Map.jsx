import React, { Component, useState } from "react";
import "leaflet/dist/leaflet.css";
import "./Address.css";
import PhoneIcon from "../../assets/images/phone-call.png";
import AddressIcon from "../../assets/images/address.png";
import translate from "../../i18n/translate";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Badge from "react-bootstrap/Badge";

/*import RoutingMachine from "./RoutingMachine";*/

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

const Map = (props) => {


    // console.log(props.address1.lat !== undefined && props.address2.lat !== undefined && props.address1.lat + " - " + props.address2.lat);

    return (
            <div className="Address">
                {props.address1.lat !== undefined && props.address2.lat !== undefined &&
                    <MapContainer
                        key={JSON.stringify([props.address1.lat, props.address1.long])}
                        id="mapId"
                        center={[(parseFloat(props.address1.lat) + parseFloat(props.address2.lat))/2, (parseFloat(props.address1.long) + parseFloat(props.address2.long))/2]}
                        zoom={15}
                        style={{ height: "370px" }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        
                        <Marker position={L.latLng(props.address1.lat, props.address1.long)}>
                            <Popup>
                                <Badge bg="primary">Sender</Badge>{" "}
                                {props.address1.otherDetails}
                            </Popup>
                        </Marker>

                        <Marker position={L.latLng(props.address2.lat, props.address2.long)}>
                            <Popup>
                            <Badge bg="primary">Reciever</Badge>{" "}
                                {props.address2.otherDetails}
                            </Popup>
                        </Marker>

                        {/* <RoutingMachine lat1={props.address1.lat} lat2={props.address1.long} long1={props.address2.lat} long2={props.address2.long} /> */}

                    </MapContainer>}
            </div>
    )

}

export default Map;
