import React, { useState, useEffect, useRef } from "react";
import UsersCard from "./UserCard";
import { GetAllClients } from "../../../APIs/AdminPanelApis";

export default function AllClients() {
    const [allClients, setAllClients] = useState([]); // all clients

    const [loadingClients, setLoadingClients] = useState(false);

    useEffect(() => {

        setLoadingClients(true);

        // get all clients
        GetAllClients().then((res) => {
            // console.log(res.data.clients_list)

            let tempArr = res.data.clients_list;

            tempArr.sort((a, b) => b.balance - a.balance);

            setAllClients(tempArr);

            setLoadingClients(false);
        });
    }, []);

    return (
        <div className="d-flex w-100 panel-wrapper" style={{ backgroundColor: "#eaeced" }}>
            <div className="m-3" style={{ width: "100%" }}>
                <UsersCard title="All Clients" list={allClients} loading={loadingClients} />
            </div>
        </div>)
}