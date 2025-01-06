import React from "react";
import { motion } from "framer-motion";
import { Badge } from "react-bootstrap";

export default function OrderActions({ actions }) {
    const formatAction = (record) => {
        if (record.action_id == 30 && record.title_en != "foreign delivery cost") {
            return <div className="d-flex justify-content-start">
                <div style={{ width: "40%" }}>
                    <div style={{ fontWeight: "bold", color: "#03A65A" }}>{record.title_en}</div>
                    <div>{record.time_stamp.split(" ")[0] + " "}<Badge bg="primary">{record.time_stamp.split(" ")[1]}</Badge></div>
                </div>
                <div style={{ width: "60%" }}>{record.description_en}</div>
            </div>
        }

        const tempHolder = <div style={{ width: "40%" }}>
            <div style={{ fontWeight: "bold", color: "#03A65A" }}>{record.description_en}</div>
            <div>{record.time_stamp.split(" ")[0] + " "}<Badge bg="primary">{record.time_stamp.split(" ")[1]}</Badge></div>
        </div>

        switch (record.action_id) {
            case "2":
                return <>
                    {tempHolder}
                    <div style={{ width: "60%" }}><span style={{ fontStyle: "italic" }}>{record.party_one_name}</span>{" created order " + record.order_id}</div>
                </>;
            case "3":
                return <>
                    {tempHolder}
                    <div style={{ width: "60%" }}>{"Transporter " + record.party_one_name + " offered " + record.price + "NIS to order " + record.order_id}</div>
                </>;
            case "4":
                return <>
                    {tempHolder}
                    <div style={{ width: "60%" }}>{"Client " + record.party_one_name + " cancel order " + record.order_id}</div>
                </>;
            case "5":
                return <>
                    {tempHolder}
                    <div style={{ width: "60%" }}>{"Trasnporter " + record.party_one_name + " updated order " + record.order_id + " to " + record.price + "NIS"}</div>
                </>;
            case "6":
                return <>
                    {tempHolder}
                    <div style={{ width: "60%" }}>{"Transporter " + record.party_one_name + " canceled bid on order " + record.order_id}</div>
                </>;
            case "7":
                return <>
                    {tempHolder}
                    <div style={{ width: "60%" }}>{"Client " + record.party_one_name + " accepted " + record.party_two_name + "'s bid on order " + record.order_id}</div>
                </>;
            case "8":
                return <>
                    {tempHolder}
                    <div style={{ width: "60%" }}>{"Transporter " + record.party_one_name + " picked up order " + record.order_id}</div>
                </>;
            case "9":
                return <>
                    {tempHolder}
                    <div style={{ width: "60%" }}>{"Transporter " + record.party_one_name + " finished order " + record.order_id}</div>
                </>;
            case "10":
                return <>
                    {tempHolder}
                    <div style={{ width: "60%" }}>{record.party_one_name + " assigned order " + record.order_id + " to " + record.party_two_name}</div>
                </>;
            case "11":
                return <>
                    {tempHolder}
                    <div style={{ width: "60%" }}>{"Transporter " + record.party_one_name + " rejected order " + record.order_id}</div>
                </>;
            case "12":
                return <>
                    {tempHolder}
                    <div style={{ width: "60%" }}>{"Transporter " + record.party_one_name + " accepted order " + record.order_id}</div>
                </>;
            case "17":
                return <>
                    {tempHolder}
                    <div style={{ width: "60%" }}>{record.party_one_name + " canceled assign on order " + record.order_id}</div>
                </>;
            case "18":
                return <>
                    {tempHolder}
                    <div style={{ width: "60%" }}>{"Client " + record.party_one_name + " created and assigned order " + record.order_id + " to " + record.party_two_name}</div>
                </>;
            case "19":
                return <>
                    {tempHolder}
                    <div style={{ width: "60%" }}>{"Transporter " + record.party_one_name + " marked order " + record.order_id + " as stuck"}</div>
                </>;
            case "20":
                return <>
                    {tempHolder}
                    <div style={{ width: "60%" }}>{"Transporter " + record.party_one_name + " marked order " + record.order_id + " as returned"}</div>
                </>;
            case "21":
                return <>
                    {tempHolder}
                    <div style={{ width: "60%" }}>{"Client " + record.party_one_name + " accepted returned order " + record.order_id}</div>
                </>;
            case "22":
                return <>
                    {tempHolder}
                    <div style={{ width: "60%" }}>{"Client " + record.party_one_name + " rejected returned order " + record.order_id}</div>
                </>;
            case "23":
                return <>
                    {tempHolder}
                    <div style={{ width: "60%" }}>{"Admin canceled order " + record.order_id}</div>
                </>;
            case "31":
                return <div className="d-flex justify-content-between">
                    {tempHolder}
                    <div style={{ width: "70%" }}>{"Admin finished order "} <span style={{ fontWeight: "bold", color: "#03A65A" }}>{record.order_id}</span></div>
                </div>;
            case "32":
                return <div className="d-flex justify-content-between">
                    {tempHolder}
                    <div style={{ width: "70%" }}>{"Admin uncanceled order "} <span style={{ fontWeight: "bold", color: "#03A65A" }}>{record.order_id}</span></div>
                </div>;
            case "33":
                return <div className="d-flex justify-content-between">
                    {tempHolder}
                    <div style={{ width: "60%" }}>{"Admin changed order "} <span style={{ fontWeight: "bold", color: "#03A65A" }}>{record.order_id}</span> {" COD"}</div>
                </div>;
        }
    }

    return (
        <>
            {actions?.map((record, index) => {
                return (<div key={index}>
                    <motion.div
                        key={index}
                        initial={{ backgroundColor: "#fff" }}
                        whileHover={{ backgroundColor: "#f0fff0" }}
                        whileTap={{ scale: 0.95 }}
                        className="align-items-center d-flex gap-3 mb-2 w-100"
                    >
                        {formatAction(record)}

                    </motion.div>
                    <hr style={{ marginRight: "10px" }} />
                </div>
                )
            })}
        </>
    )
}