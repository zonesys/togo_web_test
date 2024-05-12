import React, { useEffect, useState } from 'react'
import { Spinner, Table } from 'react-bootstrap'
import "./Stat.css"; import {
    getTransportersStat,
    getCODCollectedLastWeek
} from "../../APIs/AdminPanelApis"

import "./TransportersStat.css"

function TransportersStat() {

    const [transportes, setTransportes] = useState([]);
    const [weeklyCOD, setWeeklyCOD] = useState([]);

    const [transporterLoading, setTransporterLoading] = useState(false);
    const [weeklyCODLoading, setWeeklyCODLoading] = useState(false);

    useEffect(() => {
        setTransporterLoading(true)
        getTransportersStat().then((res) => {
            // console.log(res.data)

            if (res.data.status === "error") {
                console.log(res.data.error)
            } else {
                console.log(res.data.transporters)
                setTransportes(res.data.transporters)
            }

            setTransporterLoading(false)
        })
    }, [])

    useEffect(() => {
        setWeeklyCODLoading(true)
        getCODCollectedLastWeek().then((res) => {
            // console.log(res.data)

            if (res.data.status === "error") {
                console.log(res.data.error)
            } else {
                setWeeklyCOD(res.data.totalWeeklyCOD)
            }

            setWeeklyCODLoading(false)
        })
    }, [])

    function formatAmount(number) {
        return !!number ? parseFloat(number).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "0.00"
    }

    function caluculateToPay(transporter) {
        const { loan_balance, balance, total_cod } = transporter
        return formatAmount(parseFloat(loan_balance) - (parseFloat(balance) + parseFloat(total_cod)))
    }

    return (
        <div className='container-fluid p-3'>
            <div className="row">
                <div className="col">
                    {/* <Custometable
                        headers={[
                            "Transporter Name",
                            "Balance",
                            "Loan Balance",
                            "Active Orders Count",
                            "Total Active COD",
                            "To Pay",
                        ]}
                        data={transportes}
                        loading={transporterLoading}
                    /> */}
                    <Table striped bordered>
                        <thead>
                            <tr>
                                <th>Transporter Name</th>
                                <th>Balance</th>
                                <th>Loan Balance</th>
                                <th>Active Orders Count</th>
                                <th>Total Active COD</th>
                                <th>To Pay</th>
                            </tr>
                        </thead>

                        <tbody>
                            {transporterLoading ? <tr><td colSpan={6} className='text-center'><Spinner animation="border" size="lg" /></td></tr> :
                                transportes?.map((tranporter, index) =>
                                    <tr key={index}>
                                        <td>
                                            {tranporter.transporter_name}
                                        </td>
                                        <td>
                                            {formatAmount(tranporter.balance)}
                                        </td>
                                        <td>
                                            {formatAmount(tranporter.loan_balance)}
                                        </td>
                                        <td>
                                            {tranporter.orders_count}
                                        </td>
                                        <td>
                                            {formatAmount(tranporter.total_cod)}
                                        </td>
                                        <td>
                                            {formatAmount(tranporter.active_order_bill_total)}
                                        </td>
                                        <td>
                                            {caluculateToPay(tranporter)}
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </Table>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <Table striped bordered>
                        <thead>
                            <tr>
                                <th>Transporter Name</th>
                                <th>Today</th>
                                <th>Yesterday</th>
                                <th>Minus 2 Days</th>
                                <th>Minus 3 Days</th>
                                <th>Minus 4 Days</th>
                                <th>Minus 5 Days</th>
                                <th>Minus 6 Days</th>
                            </tr>
                        </thead>

                        <tbody>
                            {weeklyCODLoading ? <tr><td colSpan={8} className='text-center'><Spinner animation="border" size="lg" /></td></tr> :
                                weeklyCOD?.map((row, index) =>
                                    <tr key={index}>
                                        <td>
                                            {row.transporter_name}
                                        </td>
                                        <td>
                                            {formatAmount(row.Today)}
                                        </td>
                                        <td>
                                            {formatAmount(row.Yesterday)}
                                        </td>
                                        <td>
                                            {formatAmount(row.Minus_2_days)}
                                        </td>
                                        <td>
                                            {formatAmount(row.Minus_3_days)}
                                        </td>
                                        <td>
                                            {formatAmount(row.Minus_4_days)}
                                        </td>
                                        <td>
                                            {formatAmount(row.Minus_5_days)}
                                        </td>
                                        <td>
                                            {formatAmount(row.Minus_6_days)}
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </Table>
                </div>
            </div>
        </div>
    )
}

export default TransportersStat

const Custometable = ({headers, data, loading}) => {

    return (
        <Table striped bordered>
            <thead>
                <tr>
                    {
                        headers?.map((header, index) => {
                            return <th key={index}>{header}</th>
                        })
                    }
                </tr>
            </thead>

            <tbody>
                {loading ? <tr><td colSpan={6} className='text-center'><Spinner animation="border" size="lg" /></td></tr> :
                    data?.map((item, index) =>
                        <tr key={index}>
                            <td>
                                {item.transporter_name}
                            </td>
                            <td>
                                {item.balance}
                            </td>
                            <td>
                                {item.loan_balance}
                            </td>
                            <td>
                                {item.orders_count}
                            </td>
                            <td>
                                {item.total_cod}
                            </td>
                            <td>
                                {"item"}
                            </td>
                        </tr>
                    )
                }
            </tbody>
        </Table>
    )
}