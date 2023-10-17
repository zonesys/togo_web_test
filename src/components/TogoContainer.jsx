import React from "react";
import logo from "../assets/logo.png";

export default function TogoContainer(props){
    return (
        <div className="m-auto text-center w-75 mainbg">
            <img src={logo} alt="logo" className="m-auto"/>
            <p>The Transport Marketplace</p>
            {props.children}
        </div>
    )
}