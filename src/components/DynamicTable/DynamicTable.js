import React, { useState } from 'react';
import { Table, Badge } from "react-bootstrap";
import translate from '../../i18n/translate';

export default function DynamicTable({ columns, data, onRowSelect, selected, currentPage }) {

    // console.log(data); // temp test
    
    const [reviewed, setReviewed] = useState(0);

    return (
        <Table hover size="sm" responsive className="ms-4 me-4 mt-2">
            <thead>
                <tr>
                    {columns.map(({ label, key }, idx) => <th key={key + "-" + idx}>{label}</th>)}
                </tr>
            </thead>
            <tbody>
                {data.map((item, index) => {
                    
                    const handleCheck = () => {
                        reviewed == 1 ? setReviewed(0) : setReviewed(1)
                    }

                    return <tr
                        id={"tr-" + item.idOrder}
                        style={{
                            backgroundColor: reviewed == 1 && currentPage !== "reviewed-orders" ? "rgb(103,211,165, 0.3)" : ""
                        }}
                        key={index + "-tr"}
                        // onClick={/* onRowSelect ? ()=>{onRowSelect(item, index)} : undefined */ () => { /* reviewed == 1 ? setReviewed(0) : setReviewed(1) */ }}
                        className={`${selected === index ? "highlight-row" : ""}`}>
                        {columns.map(({ key, format }, idx) =>
                            <td key={key + "-td" + idx} style={{
                                textAlign: "center",
                            }}>

                                <span>{!!format ? format(item, reviewed, handleCheck) : item[key]}</span>
                            </td>
                        )}
                    </tr>
                }
                )}
                {!data.length && <tr><td colSpan={columns.length}>{translate("ORDERS.NO_ORDERS_FOUND")}</td></tr>}
            </tbody>
        </Table>
    );
};
