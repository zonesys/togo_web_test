import React from "react";
import contact from '../assets/images/contact.jpg';

export default function ContactUs() {
    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <div className="card" style={{width: "400px"}}>
                        <img className="card-img-top" src={contact} alt="Card image" />
                        <div className="card-body">
                            <h4 className="card-title">Contact Us</h4>
                            <h1 className="card-text h1">email: noc@zone.ps</h1>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}