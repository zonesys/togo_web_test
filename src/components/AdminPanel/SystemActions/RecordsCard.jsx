import React, { useState, useEffect } from "react";
import { Badge, Form } from "react-bootstrap";
import { FixedSizeList } from 'react-window';
import './styles.css';

export default function RecordsCard(props) {

    const [records, setRecords] = useState(props.list);

    // window height and width variables to set records container width and height
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth / 4.5);

    useEffect(() => {
        setRecords(props.list)
    }, [props.list])

    // update window width and height when change window dimensions (zoom in and out, move to a bigger screen)
    useEffect(() => {
        function handleResize() {
            setWindowHeight(window.innerHeight)
            setWindowWidth(window.innerWidth / 4.5)
        }

        window.addEventListener('resize', handleResize)
    })

    // filter records (search by order id)
    const filterHandler = (val) => {
        let tempRecords = props.list.filter(record => record.order_id.includes(val.toLowerCase()));

        setRecords(tempRecords)
    }

    // format action by action-id to meet its description
    const formatAction = (record) => {

        // action_id == 30 -> this will be the only action soon as it contains title and descrition ready
        if (record.action_id == 30) {
            return <div className="d-flex justify-content-between">
                <div style={{ width: "40%" }}>
                    <div style={{ fontWeight: "bold", color: "#03A65A" }}>{record.title}</div>
                    <div>{record.time_stamp.split(" ")[0] + " "}<Badge bg="primary">{record.time_stamp.split(" ")[1]}</Badge></div>
                </div>
                <div style={{ width: "70%" }}>{record.description}</div>
            </div>
        }

        const tempHolder = <div style={{ width: "40%" }}>
            <div style={{ fontWeight: "bold", color: "#03A65A" }}>{record.description}</div>
            <div>{record.time_stamp.split(" ")[0] + " "}<Badge bg="primary">{record.time_stamp.split(" ")[1]}</Badge></div>
        </div>

        // action_id != 30 -> this will be removed soon to be repalced with the condition apove
        switch (record.action_id) {
            case "2":
                return <div className="d-flex justify-content-between">
                    {tempHolder}
                    <div style={{ width: "70%" }}><span style={{ fontStyle: "italic" }}>{record.party_one_name}</span>{" created order "} <span style={{ fontWeight: "bold", color: "#03A65A" }}>{record.order_id}</span></div>
                </div>;
            case "3":
                return <div className="d-flex justify-content-between">
                    {tempHolder}
                    <div style={{ width: "70%" }}>{"Transporter " + record.party_one_name + " offered " + record.price + "NIS to order "} <span style={{ fontWeight: "bold", color: "#03A65A" }}>{record.order_id}</span></div>
                </div>;
            case "4":
                return <div className="d-flex justify-content-between">
                    {tempHolder}
                    <div style={{ width: "70%" }}>{"Client " + record.party_one_name + " cancel order "} <span style={{ fontWeight: "bold", color: "#03A65A" }}>{record.order_id}</span></div>
                </div>;
            case "5":
                return <div className="d-flex justify-content-between">
                    {tempHolder}
                    <div style={{ width: "70%" }}>{"Trasnporter " + record.party_one_name + " updated order "} <span style={{ fontWeight: "bold", color: "#03A65A" }}>{record.order_id}</span> {" to " + record.price + "NIS"}</div>
                </div>;
            case "6":
                return <div className="d-flex justify-content-between">
                    {tempHolder}
                    <div style={{ width: "70%" }}>{"Transporter " + record.party_one_name + " canceled bid on order "} <span style={{ fontWeight: "bold", color: "#03A65A" }}>{record.order_id}</span></div>
                </div>;
            case "7":
                return <div className="d-flex justify-content-between">
                    {tempHolder}
                    <div style={{ width: "70%" }}>{"Client " + record.party_one_name + " accepted " + record.party_two_name + "'s bid on order "} <span style={{ fontWeight: "bold", color: "#03A65A" }}>{record.order_id}</span></div>
                </div>;
            case "8":
                return <div className="d-flex justify-content-between">
                    {tempHolder}
                    <div style={{ width: "70%" }}>{"Transporter " + record.party_one_name + " picked up order "} <span style={{ fontWeight: "bold", color: "#03A65A" }}>{record.order_id}</span></div>
                </div>;
            case "9":
                return <div className="d-flex justify-content-between">
                    {tempHolder}
                    <div style={{ width: "70%" }}>{"Transporter " + record.party_one_name + " finished order "} <span style={{ fontWeight: "bold", color: "#03A65A" }}>{record.order_id}</span></div>
                </div>;
            case "10":
                return <div className="d-flex justify-content-between">
                    {tempHolder}
                    <div style={{ width: "70%" }}>{record.party_one_name + " assigned order "} <span style={{ fontWeight: "bold", color: "#03A65A" }}>{record.order_id}</span> {" to " + record.party_two_name}</div>
                </div>;
            case "11":
                return <div className="d-flex justify-content-between">
                    {tempHolder}
                    <div style={{ width: "70%" }}>{"Transporter " + record.party_one_name + " rejected order "} <span style={{ fontWeight: "bold", color: "#03A65A" }}>{record.order_id}</span></div>
                </div>;
            case "12":
                return <div className="d-flex justify-content-between">
                    {tempHolder}
                    <div style={{ width: "70%" }}>{"Transporter " + record.party_one_name + " accepted order "} <span style={{ fontWeight: "bold", color: "#03A65A" }}>{record.order_id}</span></div>
                </div>;
            case "17":
                return <div className="d-flex justify-content-between">
                    {tempHolder}
                    <div style={{ width: "70%" }}>{record.party_one_name + " canceled assign on order "} <span style={{ fontWeight: "bold", color: "#03A65A" }}>{record.order_id}</span></div>
                </div>;
            case "18":
                return <div className="d-flex justify-content-between">
                    {tempHolder}
                    <div style={{ width: "70%" }}>{"Client " + record.party_one_name + " created and assigned order "} <span style={{ fontWeight: "bold", color: "#03A65A" }}>{record.order_id}</span> {" to " + record.party_two_name}</div>
                </div>;
            case "19":
                return <div className="d-flex justify-content-between">
                    {tempHolder}
                    <div style={{ width: "70%" }}>{"Transporter " + record.party_one_name + " marked order "} <span style={{ fontWeight: "bold", color: "#03A65A" }}>{record.order_id}</span> {" as stuck"}</div>
                </div>;
            case "20":
                return <div className="d-flex justify-content-between">
                    {tempHolder}
                    <div style={{ width: "70%" }}>{"Transporter " + record.party_one_name + " marked order "} <span style={{ fontWeight: "bold", color: "#03A65A" }}>{record.order_id}</span> {" as returned"}</div>
                </div>;
            case "21":
                return <div className="d-flex justify-content-between">
                    {tempHolder}
                    <div style={{ width: "70%" }}>{"Client " + record.party_one_name + " accepted returned order "} <span style={{ fontWeight: "bold", color: "#03A65A" }}>{record.order_id}</span></div>
                </div>;
            case "22":
                return <div className="d-flex justify-content-between">
                    {tempHolder}
                    <div style={{ width: "70%" }}>{"Client " + record.party_one_name + " rejected returned order "} <span style={{ fontWeight: "bold", color: "#03A65A" }}>{record.order_id}</span></div>
                </div>;
            case "23":
                return <div className="d-flex justify-content-between">
                    {tempHolder}
                    <div style={{ width: "70%" }}>{"Admin canceled order "} <span style={{ fontWeight: "bold", color: "#03A65A" }}>{record.order_id}</span></div>
                </div>;
            case "25":
                return <div className="d-flex justify-content-between">
                    {tempHolder}
                    <div style={{ width: "70%" }}>{"Transporter " + record.party_one_name + " shipment status with courier for order "} <span style={{ fontWeight: "bold", color: "#03A65A" }}>{record.order_id}</span></div>
                </div>;
            case "26":
                return <div className="d-flex justify-content-between">
                    {tempHolder}
                    <div style={{ width: "70%" }}>{"Transporter " + record.party_one_name + " shipment status deleted for order "} <span style={{ fontWeight: "bold", color: "#03A65A" }}>{record.order_id}</span></div>
                </div>;
            case "27":
                return <div className="d-flex justify-content-between">
                    {tempHolder}
                    <div style={{ width: "70%" }}>{"Transporter " + record.party_one_name + " shipment error for order "} <span style={{ fontWeight: "bold", color: "#03A65A" }}>{record.order_id}</span></div>
                </div>;
            case "29":
                return <div className="d-flex justify-content-between">
                    {tempHolder}
                    <div style={{ width: "70%" }}>{"Transporter " + record.party_one_name + " received order "} <span style={{ fontWeight: "bold", color: "#03A65A" }}>{record.order_id}</span></div>
                </div>;
            case "31":
                return <div className="d-flex justify-content-between">
                    {tempHolder}
                    <div style={{ width: "70%" }}>{"Admin finished order "} <span style={{ fontWeight: "bold", color: "#03A65A" }}>{record.order_id}</span></div>
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

    /* FixedSizeList at each row */
    const RowComponent = ({ record, num, style }) => (
        <div style={style} className={"list-group-item-custom"}>
            {formatAction(record)}
        </div>
    );

    /* FixedSizeList row */
    const Row = ({ index, style }) => {
        return <RowComponent record={records[index]} num={index} style={style} />
    };

    /* FixedSizeList, used to render only the visible rows to the DOM to enhance the performance */
    const ListComponent = () => {
        return <FixedSizeList
            height={windowHeight}
            width={windowWidth}
            itemSize={75}
            itemCount={records?.length}
            className="list-container"
        >
            {Row}
        </FixedSizeList>
    };

    return (
        <div className="d-flex flex-column bg-white p-3 rounded-22 shadow" style={{ position: "relative", height: "100%" }}>

            <div style={{ position: "absolute", top: "15px", left: "20px", right: "15px" }}>
                <p className="text-black">{props.title}</p>
                <Form.Control style={{ position: "absolute", right: "0", top: "0", height: "25px" }} className="w-25" type="text" placeholder="Order ID..." onChange={(e) => filterHandler(e.target.value)} />
            </div>

            {
                records?.length != 0 ?
                    <ListComponent /> : <>
                        <div className="mt-5 d-flex justify-content-center h4">
                            No Actions Found!
                        </div>
                        <div className="mt-5 d-flex justify-content-center h4">
                            <i className="bi bi-list" style={{ fontSize: "10rem", color: "lightgray" }}></i>
                        </div>
                    </>
            }
        </div>
    )
}