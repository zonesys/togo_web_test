import React from "react";
import { motion } from "framer-motion";
import { Badge } from "react-bootstrap";

export default function OrderActions({ actions }) {

    const formatAction = (record) => {

        if (record.action_id == 30) {
            return <div className="d-flex justify-content-between w-100">
                <div style={{ width: "40%" }}>
                    <div style={{ fontWeight: "bold", color: "#03A65A" }}>{record.title}</div>
                    <div>{record.time_stamp.split(" ")[0] + " "}<Badge bg="primary">{record.time_stamp.split(" ")[1]}</Badge></div>
                </div>
                <div style={{ width: "60%" }}>{record.description}</div>
            </div>
        }

        const tempHolder = <div style={{ width: "40%" }}>
            <div style={{ fontWeight: "bold", color: "#03A65A" }}>{record.description}</div>
            <div>{record.time_stamp.split(" ")[0] + " "}<Badge bg="primary">{record.time_stamp.split(" ")[1]}</Badge></div>
        </div>

        switch (record.action_id) {
            case "2":
                return <>
                    {tempHolder}
                    <div style={{ width: "60%" }}>{record.party_one_name + " created order "} <span style={{ fontWeight: "bold", color: "#03A65A" }}>{record.order_id}</span></div>
                </>;
            case "3":
                return <>
                    {tempHolder}
                    <div style={{ width: "60%" }}>{"Transporter " + record.party_one_name + " offered " + record.price + "NIS to order "} <span style={{ fontWeight: "bold", color: "#03A65A" }}>{record.order_id}</span></div>
                </>;
            case "4":
                return <>
                    {tempHolder}
                    <div style={{ width: "60%" }}>{record.party_one_name + " cancel order "} <span style={{ fontWeight: "bold", color: "#03A65A" }}>{record.order_id}</span></div>
                </>;
            case "5":
                return <>
                    {tempHolder}
                    <div style={{ width: "60%" }}>{"Trasnporter " + record.party_one_name + " updated order "} <span style={{ fontWeight: "bold", color: "#03A65A" }}>{record.order_id}</span> {" to " + record.price + "NIS"}</div>
                </>;
            case "6":
                return <>
                    {tempHolder}
                    <div style={{ width: "60%" }}>{record.party_one_name + " canceled bid on order "} <span style={{ fontWeight: "bold", color: "#03A65A" }}>{record.order_id}</span></div>
                </>;
            case "7":
                return <>
                    {tempHolder}
                    <div style={{ width: "60%" }}>{record.party_one_name + " accepted " + record.party_two_name + "'s bid on order "} <span style={{ fontWeight: "bold", color: "#03A65A" }}>{record.order_id}</span></div>
                </>;
            case "8":
                return <>
                    {tempHolder}
                    <div style={{ width: "60%" }}>{record.party_one_name + " picked up order "} <span style={{ fontWeight: "bold", color: "#03A65A" }}>{record.order_id}</span></div>
                </>;
            case "9":
                return <>
                    {tempHolder}
                    <div style={{ width: "60%" }}>{record.party_one_name + " finished order "} <span style={{ fontWeight: "bold", color: "#03A65A" }}>{record.order_id}</span></div>
                </>;
            case "10":
                return <>
                    {tempHolder}
                    <div style={{ width: "60%" }}>{record.party_one_name + " assigned order "} <span style={{ fontWeight: "bold", color: "#03A65A" }}>{record.order_id}</span> {" to " + record.party_two_name}</div>
                </>;
            case "11":
                return <>
                    {tempHolder}
                    <div style={{ width: "60%" }}>{record.party_one_name + " rejected order "} <span style={{ fontWeight: "bold", color: "#03A65A" }}>{record.order_id}</span></div>
                </>;
            case "12":
                return <>
                    {tempHolder}
                    <div style={{ width: "60%" }}>{record.party_one_name + " accepted order "} <span style={{ fontWeight: "bold", color: "#03A65A" }}>{record.order_id}</span></div>
                </>;
            case "17":
                return <>
                    {tempHolder}
                    <div style={{ width: "60%" }}>{record.party_one_name + " canceled assign on order "} <span style={{ fontWeight: "bold", color: "#03A65A" }}>{record.order_id}</span></div>
                </>;
            case "18":
                return <>
                    {tempHolder}
                    <div style={{ width: "60%" }}>{record.party_one_name + " created and assigned order "} <span style={{ fontWeight: "bold", color: "#03A65A" }}>{record.order_id}</span> {" to " + record.party_two_name}</div>
                </>;
            case "19":
                return <>
                    {tempHolder}
                    <div style={{ width: "60%" }}>{record.party_one_name + " marked order "} <span style={{ fontWeight: "bold", color: "#03A65A" }}>{record.order_id}</span> {" as stuck"}</div>
                </>;
            case "20":
                return <>
                    {tempHolder}
                    <div style={{ width: "60%" }}>{record.party_one_name + " marked order "} <span style={{ fontWeight: "bold", color: "#03A65A" }}>{record.order_id}</span> {" as returned"}</div>
                </>;
            case "21":
                return <>
                    {tempHolder}
                    <div style={{ width: "60%" }}>{"Client " + record.party_one_name + " accepted returned order "} <span style={{ fontWeight: "bold", color: "#03A65A" }}>{record.order_id}</span></div>
                </>;
            case "22":
                return <>
                    {tempHolder}
                    <div style={{ width: "60%" }}>{"Client " + record.party_one_name + " rejected returned order "} <span style={{ fontWeight: "bold", color: "#03A65A" }}>{record.order_id}</span></div>
                </>;
            case "23":
                return <>
                    {tempHolder}
                    <div style={{ width: "60%" }}>{"Admin canceled order "} <span style={{ fontWeight: "bold", color: "#03A65A" }}>{record.order_id}</span></div>
                </>;
            case "25":
                return <div className="d-flex justify-content-between">
                    {tempHolder}
                    <div style={{ width: "60%" }}>{"Transporter " + record.party_one_name + " shipment status with courier for order "} <span style={{ fontWeight: "bold", color: "#03A65A" }}>{record.order_id}</span></div>
                </div>;
            case "26":
                return <div className="d-flex justify-content-between">
                    {tempHolder}
                    <div style={{ width: "60%" }}>{"Transporter " + record.party_one_name + " shipment status deleted for order "} <span style={{ fontWeight: "bold", color: "#03A65A" }}>{record.order_id}</span></div>
                </div>;
            case "27":
                return <div className="d-flex justify-content-between">
                    {tempHolder}
                    <div style={{ width: "60%" }}>{"Transporter " + record.party_one_name + " shipment error for order "} <span style={{ fontWeight: "bold", color: "#03A65A" }}>{record.order_id}</span></div>
                </div>;
            case "29":
                return <div className="d-flex justify-content-between">
                    {tempHolder}
                    <div style={{ width: "60%" }}>{"Transporter " + record.party_one_name + " received order "} <span style={{ fontWeight: "bold", color: "#03A65A" }}>{record.order_id}</span></div>
                </div>;
            case "31":
                return <div className="d-flex justify-content-between">
                    {tempHolder}
                    <div style={{ width: "60%" }}>{"Admin finished order "} <span style={{ fontWeight: "bold", color: "#03A65A" }}>{record.order_id}</span></div>
                </div>;
            case "32":
                return <div className="d-flex justify-content-between">
                    {tempHolder}
                    <div style={{ width: "60%" }}>{"Admin uncanceled order "} <span style={{ fontWeight: "bold", color: "#03A65A" }}>{record.order_id}</span></div>
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