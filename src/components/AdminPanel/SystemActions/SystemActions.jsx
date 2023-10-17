import React, { useState, useEffect } from "react";
import RecordsCard from "./RecordsCard";
import CodesCard from "./CodesCard";
import TransfersCard from "./TransfersCard";
import {
    getAllVerifyCodes,
    getRecordsActions,
    getAllBalanceChargeActions
} from "../../../APIs/AdminPanelApis";

export default function SystemActions() {

    const [records, setRecords] = useState([]); // all system actions
    const [codes, setCodes] = useState([]); // all system verification codes
    const [rechargeBalaneRecords, setRechargeBalaneRecords] = useState([]); // all recharge-balance actions

    useEffect(() => {
        getAllVerifyCodes().then((res) => {
            setCodes(res.data.codes_list);
        })
    }, [])

    useEffect(() => {
        getRecordsActions().then((res) => {
            setRecords(res.data.records_list);
        });
    }, []);

    useEffect(() => {
        getAllBalanceChargeActions().then((res) => {
            setRechargeBalaneRecords(res.data.recharges_list);
        })
    }, [])

    return (
        <>
            <div className="d-flex w-100 panel-wrapper" style={{ backgroundColor: "#eaeced" }}>
                <div className="m-3" style={{ width: "33%" }}>
                    <RecordsCard title="Records Log Table" list={records} />
                </div>
                <div className="m-3" style={{ width: "33%" }}>
                    <CodesCard title="Verifications Codes" list={codes} />
                </div>
                <div className="m-3" style={{ width: "33%" }}>
                    <TransfersCard title="Transfers" list={rechargeBalaneRecords} />
                </div>
            </div>
        </>
    )
}