import React, { useState, useEffect, useRef } from "react";
import UsersCard from "./UserCard";
import { GetAllTransporters } from "../../../APIs/AdminPanelApis";

export default function AllTransporters() {

    const [allTransporters, setAllTransporters] = useState([]); // all transporters

    const [loadingTransporters, setLoadingTransporters] = useState(false);

    useEffect(() => {

        setLoadingTransporters(true);

        // get all transporters
        GetAllTransporters().then((res) => {
            let tempArr = res.data.transporters_list;

            tempArr.sort((a, b) => b.balance - a.balance);

            setAllTransporters(tempArr);

            setLoadingTransporters(false);
        });
    }, []);

    return (
        <div className="d-flex w-100 panel-wrapper" style={{ backgroundColor: "#eaeced" }}>
            <div className="m-3" style={{ width: "100%" }}>
                <UsersCard title="All Transporters" list={allTransporters} loading={loadingTransporters} />
            </div>
        </div>)
}