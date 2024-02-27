import React, { useState, useEffect, useRef } from "react";
import { getAllOrders } from "../../APIs/AdminPanelApis";
import { Form, FloatingLabel, Spinner, Button } from 'react-bootstrap';
import OrdersCard from "./OrdersCard";

export default function SearchOrders() {

    const [orders, setOrders] = useState([]);
    const [searching, setSearching] = useState(false);

    const searchRef = useRef();

    const searchOrdersHandler = (val) => {

        if (!!!searchRef.current.value/* val.target.value */) {
            setOrders([]);
        } else {
            setSearching(true);
            getAllOrders(/* val.target.value */searchRef.current.value).then((res) => {
                // console.log(res.data);
                setOrders(res.data.orders_list);
                setSearching(false);
            });
        }

    }

    return (
        <div className="d-flex w-100 panel-wrapper" style={{ backgroundColor: "#eaeced" }}>
            <div className="m-3" style={{ width: "100%" }}>
                {/* <UsersMap /> */}
                <FloatingLabel controlId="floating" label="Search: Order ID, Sender Name/Address, Receiver Name/Addres Order Status ...">
                    <Form.Control type="text" placeholder="..." className="rounded-22 mb-4 mt-1" /* onChange={(e) => { searchOrdersHandler(e) }} */ ref={searchRef} onKeyPress={(e) => { if (e.charCode === 13) { searchOrdersHandler() }}} />
                    {/* {searching ? <i className="bi bi-x-lg"  style={{ position: "absolute", right: "20px", top: "20px", cursor: "pointer" }} onClick={() => {clearSearch()}}></i> : */}
                    <Button className="btn-grad-circle" style={{ position: "absolute", right: "20px", top: "10px" }}>{searching ? <Spinner animation="border" size="sm" /> : <i className="bi bi-search" onClick={() => { searchOrdersHandler() }}></i>}</Button>
                </FloatingLabel>

                <OrdersCard title="Matched Orders" list={orders} loading={true} />
            </div>
        </div>)
}