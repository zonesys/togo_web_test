import React, { Component } from "react";
import "leaflet/dist/leaflet.css";
import "./Address.css";
import MoneyIcon from "../../assets/images/voucher.png";
import PhoneIcon from "../../assets/images/phone-call.png";
import AddressIcon from "../../assets/images/address.png";
import translate from "../../i18n/translate";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

import { imgBaseUrl } from "../../Constants/GeneralCont"; /* edited (new import) */

import { Badge } from "react-bootstrap"; /* edited (new import) */

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

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

L.Marker.prototype.options.icon = DefaultIcon;
class Address extends Component {
    state = {
        isDisplayed: true
    };

    render() {
        return (
            <div className="Address">
                {/* edited (old adress info commented) */}

                {/*{this.props.address.lat !== undefined && 
                    <MapContainer 
                    key={JSON.stringify([this.props.address.lat, this.props.address.long])}
                    center={[this.props.address.lat, this.props.address.long]} 
                    zoom={15} 
                    style={{height: "300px"}}
                    >
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={L.latLng(this.props.address.lat, this.props.address.long)}>
                            <Popup>
                                {this.props.address.otherDetails}
                            </Popup>
                        </Marker>
                        
                </MapContainer>}
                <div className="">
                    <img src={PhoneIcon} className="m-inline-e-2" alt="phone"/>
                    <div className="flex-grow-1">{translate("ORDER_DETAILS.PHONE_NUMBER")}</div>
                    <div>{this.props.address.phoneCustomer}</div>
                </div>
                <div>
                    <img src={AddressIcon} className="m-inline-e-2" alt="address" />
                    <div className="flex-grow-1">{translate("ORDER_DETAILS.OTHER_DETAILS")}</div>
                    {this.props.address.otherDetails}
                </div>*/}

                {/*edited (new adress info added)*/}

                {this.props.customerName && <div className="">
                    <div className="flex-grow-1">{translate("TEMP.ORDERED_BY")}</div>
                    <div style={{ backgroundColor: "#26a69a", borderRadius: "50%", width: "55px", height: "55px" }}>
                        <img style={{
                            width: "45px",
                            height: "45px",
                            objectFit: "cover",
                            borderRadius: "50%",
                            margin: "auto",
                            marginTop: "5px"
                        }} src={`${imgBaseUrl}${this.props.image}`} className="m-inline-e-2" alt="phone" />
                    </div>
                    <div className="mx-2">{this.props.customerName}</div>
                </div>}

                {this.props.customerName && <hr className="mb-3" />}

                <div className="">
                    <img src={PhoneIcon} className="m-inline-e-2" alt="phone" />
                    <div className="flex-grow-1">{translate("ORDER_DETAILS.PHONE_NUMBER")}</div>
                    <div>{this.props.phone ? this.props.phone : this.props.address.phoneCustomer}</div>
                </div>

                {this.props.price && <hr className="mb-3" />}

                {this.props.price && <div className="">
                    <img src={MoneyIcon} className="m-inline-e-2" alt="money" />
                    <div className="flex-grow-1">Price</div>
                    <div>{this.props.price + " NIS"}</div>
                </div>}

                <hr className="mb-3" />

                {this.props.address.otherDetails && <div>
                    <img src={AddressIcon} className="m-inline-e-2" alt="address" />
                    <div className="flex-grow-1">{translate("ORDER_DETAILS.OTHER_DETAILS")}</div>
                    {this.props.address.otherDetails}
                </div>}

                {
                    this.props.type == 2 && <>{
                        this.props.pickupDate ? <div>
                            <div className="flex-grow-1">{translate("ORDER_DETAILS.PICKUP_DATE")}</div>
                            {this.props.pickupDate.split(" ")[0]} {" "} <Badge bg="secondary" className="mx-2">{timeFormat(this.props.pickupDate.split(" ")[1])}</Badge>
                        </div> : <div>
                            <div className="flex-grow-1">{translate("ORDER_DETAILS.PICKUP_DATE")}</div>
                            ---
                        </div>
                    }</>
                }

            </div>
        );
    }
}

export default Address;
