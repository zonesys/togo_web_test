import React, { useState, useEffect } from "react";
import { Badge, Form } from "react-bootstrap";
import { FixedSizeList } from 'react-window';
import './styles.css';

export default function CodesCard(props) {

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

    /* FixedSizeList at each row */
    const RowComponent = ({ record, num, style }) => (
        <div style={style} className={"list-group-item-custom"}>
            <div className="d-flex justify-content-between">
                <div style={{ width: "40%" }}>
                    <div style={{ fontWeight: "bold", color: "#03A65A" }}>{record.description}</div>
                    <div>{record.time_stamp.split(" ")[0] + " "}<Badge bg="primary">{record.time_stamp.split(" ")[1]}</Badge></div>
                </div>
                <div style={{ width: "70%" }}>{"Verification Code: "} <span style={{ fontWeight: "bold", color: "#03A65A" }}>{record.code}</span> {", sent to " + record.mobile}</div>
            </div>
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
                {/* <Form.Control style={{ position: "absolute", right: "0", top: "0", height: "25px" }} className="w-25" type="text" placeholder="Order ID..." onChange={(e) => filterHandler(e.target.value)} /> */}
            </div>

            {
                props.list?.length != 0 ?
                    <ListComponent /> : <>
                        <div className="mt-5 d-flex justify-content-center h4">
                            No {props.title} Found!
                        </div>
                        <div className="mt-5 d-flex justify-content-center h4">
                            <i className="bi bi-list" style={{ fontSize: "10rem", color: "lightgray" }}></i>
                        </div>
                    </>
            }
        </div>
    )
}