import React, {useEffect, useState} from "react";
import { Badge, Button } from "react-bootstrap";
import { imgBaseUrl } from "../Constants/GeneralCont";
import AddMemberToNetworkDialog from "./AddMemberToNetworkDialog";
import {  GetAllNetworkMembers } from "../APIs/OrdersAPIs";
import { NetworkInvitesListDialog } from "./NetworkInvitesListDialog";
import Table from "react-bootstrap/Table"; /* edited (Table imported) */

export function InviteRow({label, value, secLabel, secValue}){
    return (
        <div className="d-flex">
            <div className="w-50">
                <div className="togo-label">{label}</div>
                <div>{value}</div>
            </div>

            <div className="w-50">
                <div className="togo-label">{secLabel}</div>
                <div>{secValue}</div>
            </div>
        </div>
    )
}
export function MemberListItem({member}){
    return (
        <div key={member.NetworkMemberId} className={"px-3"}>
            <div className="align-items-center d-flex m-4" style={{
                //height: "200px",
                background: "linear-gradient(#f8f8f8, #fff)",
                boxShadow: "0px 0px 5px 0px rgb(0 0 0 / 40%)",
                borderRadius: "6px",
                overflow: "hidden"
            }}>
                <div className={"d-flex h-100 "}/* w-250px */
                style={{
                    //background: arra[index % arra.length]
                }}>
                    <img
                        style={{
                            maxHeight: "200px",
                            height: "150px",
                            borderRadius: "50%",
                            width: "150px",
                            //margin: "auto",
                            border: "4px solid rgba(0,0,0,0.15)"
                        }} 
                        className="m-3"
                        src={`${imgBaseUrl}${member.PersonalImgPath}`} alt={member.PhoneNumber}  
                    />
                </div>
                <div className="d-flex flex-column flex-grow-1 h-100 justify-content-evenly ps-3 gap-3"
                style={{
                    borderLeft: "1px solid #dee2e6",
                }} >
                    <InviteRow 
                        label={"Name"} 
                        value={member.FullName}
                        secLabel={"Load cost"}
                        secValue={member.DeliveryCost}
                    />
                    <InviteRow 
                        label={"Phone number"} 
                        value={member.PhoneNumber}
                        secLabel={"Status"}
                        secValue={member.IsMemberAccepted == 1 ? "Active" : "Waiting"}
                    />  
                </div>
            </div>
            <hr className="my-2" />
        </div>
    )
}

export function MemberCar({member}){
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
                {member.IsMemberAccepted == 1 && <Badge className="fs-6 align-middle" pill bg="success">Active</Badge>}
                {member.IsMemberAccepted != 1 && <Badge className="fs-6 align-middle" pill bg="secondary">Waiting</Badge>}
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

/* edited (new Network function, convert to tabular view) */

export default function Network() {
    const [members, setMembers] = useState();
    const arra = [
        "linear-gradient(#fceeb5, #fcf1c3)",
        "linear-gradient(#92bCa6, #A2CCB6)",
        "linear-gradient(#dE685E, #EE786E)",
    ]
    const update = () => {
        GetAllNetworkMembers().then((res) => {
            setMembers(res.data.server_response);
        });
    }
    useEffect(()=>{
        update();
    }, []);

    return (
        <div>
            <div className="d-flex justify-content-end mt-3">
                <NetworkInvitesListDialog update={update} />
                <AddMemberToNetworkDialog />
            </div>
            
            <div className="container-fluid mt-3">
                <div className="row">

                    <Table responsive hover style={{ fontSize: "1rem", marginRight: '20px', marginLeft: "20px" }}>
                        <thead>
                            <tr>
                                <th scope="col" style={{ width: "5%" }}></th>
                                <th scope="col">Name</th>
                                <th scope="col" style={{ width: "10%" }}>Phone Number</th>
                                <th scope="col" style={{ width: "5%" }}>Status</th>
                                <th scope="col" style={{ width: "40%" }}>Description</th>
                                <th scope="col" style={{ width: "10%" }}>Load Cost</th>
                            </tr>
                        </thead>

                        <tbody>
                            {members?.map((member, index) => {
                                return (
                                    <MemberCar 
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
        </div>
    );
}


/* edited (old Network function commented) */

/*export default function Network() {
    const [members, setMembers] = useState();
    const arra = [
        "linear-gradient(#fceeb5, #fcf1c3)",
        "linear-gradient(#92bCa6, #A2CCB6)",
        "linear-gradient(#dE685E, #EE786E)",
    ]
    const update = () => {
        GetAllNetworkMembers().then((res) => {
            setMembers(res.data.server_response);
        });
    }
    useEffect(()=>{
        update();
    }, []);

    return (
        <div>
            <div className="d-flex justify-content-end">
                <NetworkInvitesListDialog update={update} />
                <AddMemberToNetworkDialog />
            </div>
            
            <div className="d-flex flex-wrap justify-content-center m-4">
            {members?.map((member, index) => {
                return (
                    <MemberCar 
                        src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4DIB9mSrwArVWd1WGdqVwb9Sf-cHXSNuEbg&usqp=CAU"}
                        isActive
                        member={member}
                    />
                )
            })}
            </div>
        </div>
    );
}*/
