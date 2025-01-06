import React, { useEffect, useState } from "react";
import { useLocation, useParams, } from "react-router-dom/cjs/react-router-dom.min";
import { getOrdersById } from "../APIs/financialsAPIs";
import BootstrapTable from 'react-bootstrap-table-next';
import { useDispatch } from "react-redux";
import { toastMessage } from "../Actions/GeneralActions";
import Loader from "./Loader/Loader"
import { Button } from "react-bootstrap";
import translate from "../i18n/translate";
import { Link } from "react-router-dom";


export default function RequestDetails() {
    const dispatch = useDispatch();
 //   const location = useLocation();
    const [orders, setOrders] = useState([]);
    const [columns, setColumns] = useState([]);
    const params = useParams();
    console.log(params);
    const orderIds = params.orderIds;
    const requestDate = params.reqDate;
    
    
    useEffect(() => {
        getOrdersById(orderIds).then(response => {
            try {
                console.log(response.data);
                const netAmount = response.data.netAmount;
                const data =  response.data.orders.map(val => {
                    return Object.assign({}, val, { net: netAmount[val.order_id] });
                });
                if (!data || data.length == 0) {
                    // dispatch(toastMessage("No orders"))
                    setOrders(null);
                    return;
                }
                
                
                const columns = [
                    {
                        dataField: "created_at",
                        text: "Created At",
                        style: (cell, row, rowIndex, colIndex) => {
                            return {
                                textAlign: "center",
                            }
                        },
                        formatter: (cell, row) => {
                            return (<div>
                                {row.created_at.split(" ")[0]}
                            </div>)
                        }
                    },
                    {
                        dataField: "order_id",
                        text: "Order Id",
                        style: (cell, row, rowIndex, colIndex) => {
                            return {
                                textAlign: "center"
                            }
                        }
                    },
                    {
                        dataField: "cod",
                        text: "COD",
                        style: (cell, row, rowIndex, colIndex) => {
                            return {
                                textAlign: "center",
                            }
                        }
                    },
                    {
                        dataField: "delivery_cost",
                        text: "Delivery Cost",
                        style: (cell, row, rowIndex, colIndex) => {
                            return {
                                textAlign: "center",
                            }
                        }
                    },
                    
                    {
                        dataField: "net",
                        text: "Net Amount",
                        style: (cell, row, rowIndex, colIndex) => {
                            return {
                                textAlign: "center",
                            }
                        }
                    },
                    {
                        dataField: "",
                        text: "Full Details",
                        style: (cell, row, rowIndex, colIndex) => {
                            return {
                                textAlign: "center",
                                width: "10%"
                            }
                        },
                        formatter: (cell, row) => {
                            
                            return(
                                <Link
                                to={{
                                    pathname: `/account/Order/${row.order_id}`,
                                }}
                                target={"_blank"}
                                style={{
                                    paddingRight: "20%",
                                    paddingLeft: "20%",
                                    border: "none",
                                    width: "100%",
                                    textAlign: "center",
                                }}
                                className="btn btn-primary btn-rounded btn-grad"
                                >
                                
                                {translate("ORDERS.SHOW")}
                                </Link>
                            );
                            
                        }
                    },
                ]
                setColumns(columns)
                setOrders(data);
            } catch (e) {
                console.log("getOrdersById error: " + e);
                dispatch(toastMessage("API Error"))
                
            }
            
        })
    }, []);
    
    if(!params) return null;
    return (
        <div style={{ height: null }} className="d-flex flex-column justify-content-center">
            {
                requestDate && <h1 className="d-flex justify-content-center" style={{ marginBlock: "2%", fontSize: "20px" }}>Request Date : {requestDate}</h1>
                
            }


            {

             orders &&  orders.length > 0 ?

                    <div style={{ marginInline: "0", border: "none" }}>
                        <BootstrapTable
                            bordered={false}
                            columns={columns}
                            data={orders}
                            keyField="order_id"
                            hover

                        />
                    </div>

                    : orders ?
                    <Loader />
                    : null
            }
        </div>
    );
}