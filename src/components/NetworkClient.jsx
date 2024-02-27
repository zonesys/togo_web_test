import React, {useEffect, useState} from "react";
import { Badge, Button } from "react-bootstrap";
import { imgBaseUrl } from "../Constants/GeneralCont";
import AddTransporterToNetworkDialog from "./AddTransporterToNetworkDialog";
import {  GetAllClientNetworkMembers } from "../APIs/OrdersAPIs";
import { NetworkInvitesListDialog } from "./NetworkInvitesListDialog";
import Table from "react-bootstrap/Table";
import translate from "../i18n/translate";

import { Accordion, Card } from "react-bootstrap"; /* edited (Accordion, Card imported) */

export function MemberCar({member}){
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
        </tr>
    )
}


export default function NetworkClient() {

    // dummy data to test
    /*const members = [
        {
            FullName: "name1",
            PhoneNumber: "0590000000",
            IsMemberAccepted: 1,
            Note: "note1",
            DeliveryCost: 15
        },
        {
            FullName: "name2",
            PhoneNumber: "0591111111",
            IsMemberAccepted: 0,
            Note: "note2",
            DeliveryCost: 30
        },
        {
            FullName: "name3",
            PhoneNumber: "0592222222",
            IsMemberAccepted: 1,
            Note: "note3",
            DeliveryCost: 40
        }
    ]*/
    
    const [members, setMembers] = useState();
    const arra = [
        "linear-gradient(#fceeb5, #fcf1c3)",
        "linear-gradient(#92bCa6, #A2CCB6)",
        "linear-gradient(#dE685E, #EE786E)",
    ]
    const update = () => {
        GetAllClientNetworkMembers().then((res) => {
            setMembers(res.data.membersData);
            // console.log(res.data);
        });
    }

    useEffect(()=>{
        update();
    }, []);

    return (
        <div>
            <div className="d-flex justify-content-end">
                <AddTransporterToNetworkDialog />
            </div>
            
            <div className="container-fluid mt-3">

                <Card
                    bg={"Danger"}
                    text={"black"}
                    className="mt-3"
                >
                    <Card.Header style={{ background: "linear-gradient(90deg, #26a69a, #69d4a5)", color: "white" }}>{translate("NETWORK.NETWORK_TITLE")}</Card.Header>
                    <Card.Body className="d-flex">
                        <Table hover style={{ fontSize: "1rem", marginRight: '20px', marginLeft: "20px", width: "100%" }}>
                            <thead>
                                <tr>
                                    <th scope="col"></th>
                                    <th scope="col">{translate("TEMP.NAME")}</th>
                                    <th scope="col">{translate("TEMP.PHONE")}</th>
                                </tr>
                            </thead>

                            <tbody>
                                {members ? members.map((member, index) => {
                                    return (
                                        <MemberCar 
                                            key={index}
                                            src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4DIB9mSrwArVWd1WGdqVwb9Sf-cHXSNuEbg&usqp=CAU"}
                                            isActive
                                            member={member}
                                        />
                                    )
                                }) : <tr><td style={{ color: "gray" }} colSpan="6">{translate("TEMP.NO_MEMBERS")}</td></tr>}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>

                {/*<div className="row">

                    <div className="row justify-content-center" style={{ fontSize: "1.5rem", color: "#46BC9F" }}>{translate("NETWORK.NETWORK_TITLE")}</div>

                    <Table responsive hover style={{ fontSize: "1rem", marginRight: '20px', marginLeft: "20px", marginTop: "20px" }}>
                        <thead>
                            <tr>
                                <th scope="col"></th>
                                <th scope="col">Name</th>
                                <th scope="col">Phone Number</th>
                            </tr>
                        </thead>

                        <tbody>
                            {members ? members.map((member, index) => {
                                return (
                                    <MemberCar 
                                        key={index}
                                        src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4DIB9mSrwArVWd1WGdqVwb9Sf-cHXSNuEbg&usqp=CAU"}
                                        isActive
                                        member={member}
                                    />
                                )
                            }) : <tr><td style={{ color: "lightgray" }} colSpan="6">There are no Member!</td></tr>}
                        </tbody>
                    </Table>
                </div>*/}
            </div>
        </div>
    );
}