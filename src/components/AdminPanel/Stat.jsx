import React, { useState, useEffect } from "react";
import "./Stat.css"; import {
    getTotalBalance,
    GetAllClientsNum,
    GetAllTransportersNum,
    getTotalTempBalance,
    getOrdersCount,
    getTotalTodayCOD,
    getTotalTodayActiveCount
} from "../../APIs/AdminPanelApis";
import Transporter from "../../assets/images/transporter_icon.png";
import Transporter_white from "../../assets/images/transporter_icon_white.png";
import Merchant from "../../assets/images/merchant_icon.png";
import Merchant_white from "../../assets/images/merchant_icon_white.png";
import { Spinner } from "react-bootstrap";
import { GiRabbit } from 'react-icons/gi';
import RabbitIcon from '../../assets/icons/rabbit.png';
import Bugs_Bunny from '../../assets/Bugs_Bunny.png';

export default function Stat() {
    const [creditAmount, setCreditAmount] = useState(0); // total escrow
    const [totalEscrowBalance, setTotalEscrowBalance] = useState(0); // total in escrow (active money)
    const [totalTodayCOD, setTotalTodayCOD] = useState(0); // total today COD
    const [totalClients, setTotalClinets] = useState(); // number of clients
    const [totalTransporters, setTotalTransporters] = useState(); // number of transporters
    const [todayActiveCount, setTodayActiveCount] = useState(0); // number today active orders

    const [transportersLoading, setTransportersLoading] = useState(false);
    const [clientsLoading, setClientsLoading] = useState(false);
    const [inEscrowLoading, setInEscrowLoading] = useState(false);
    const [escrowLoading, setEscrowLoading] = useState(false);
    const [loanLoading, setLoanLoading] = useState(false);
    const [todayCODLoading, setTodayCODLoading] = useState(false);
    const [todayActiveLoading, setTodayActiveLoading] = useState(false);

    const [tempBalance, setTempBalance] = useState(0);

    const [newOrdersCount, setNewOrdersCount] = useState(0);
    const [activeOdersCount, setActiveOrdersCount] = useState(0);
    const [finishedOrdersCount, setFinishesOrdersCount] = useState(0);

    useEffect(() => {
        getOrdersCount().then(res => {
            setNewOrdersCount(res.data.newOrdersCount);
            setActiveOrdersCount(res.data.activeOrdersCount);
            setFinishesOrdersCount(res.data.finishedOrdersCount);
        })
    }, [])

    useEffect(() => {
        setLoanLoading(true);
        getTotalTempBalance().then((res) => {
            /* console.log("#########")
            console.log(res.date) */
            setTempBalance(res.data);
            setLoanLoading(false);
        })
    }, [])

    /* get total balance */
    useEffect(() => {
        setInEscrowLoading(true);
        setEscrowLoading(true);
        getTotalBalance().then((res) => {
            // console.log(res.data?.server_response?.data?.result);
            setTotalEscrowBalance(res.data?.server_response?.data?.result.differ_balance);
            setCreditAmount(res.data?.server_response?.data?.result.credit_amount);
            setInEscrowLoading(false);
            setEscrowLoading(false);
        });
    }, []);

    /* get total today COD */
    useEffect(() => {
        setTodayCODLoading(true);
        getTotalTodayCOD().then((res) => {
            // console.log(res.data);

            if (res.data.status == "error") {
                console.log(res.data.error);
            } else {
                setTotalTodayCOD(res.data.totalCOD);
            }
            
            setTodayCODLoading(false);
        });
    }, []);

    /* get total today active count */
    useEffect(() => {
        setTodayActiveLoading(true);
        getTotalTodayActiveCount().then((res) => {
            console.log(res.data);

            if (res.data.status == "error") {
                console.log(res.data.error);
            } else {
                setTodayActiveCount(res.data.total_active);
            }
            
            setTodayActiveLoading(false);
        });
    }, []);

    useEffect(() => {
        setTransportersLoading(true);
        setClientsLoading(true);

        // get all transporters count
        GetAllTransportersNum().then((res) => {
            setTotalTransporters(res.data.NumberOfTransporters);
            setTransportersLoading(false);
        });

        // get all clients count
        GetAllClientsNum().then((res) => {
            setTotalClinets(res.data.NumberOfClients);
            setClientsLoading(false);
        });
    }, []);

    const RabbitFormat = ({ balance }) => {

        const number = balance;
        const millions = Math.floor(number / 1000000);
        const change = parseInt(number % 1000000);

        const rabbits = [];
        for (let i = 0; i < millions; i++) {
            rabbits.push(<div key={i} className="ms-1" style={{width: "40px"}}><img src={Bugs_Bunny} /></div>);
        }

        return (
            <div className="d-flex justify-content-start">
                {rabbits}
                <div className="ms-2 d-flex align-items-center">{millions > 0 && " + "}{change}</div>
            </div>
        )
    }

    return (
        <div className="container-fluid p-3">
            <div className="row d-flex justify-content-center">
                <div className="col-lg pt-3">
                    <div className="stat-card">
                        <div className="card-header">
                            <img src={Merchant_white} alt="" />
                            <span>Total Clients</span>
                        </div>

                        <div className="card-body">
                            <div className="bg" style={{ backgroundImage: "url(" + Merchant + ")", backgroundRepeat: "no-repeat", backgroundPosition: "right" }}></div>
                            {clientsLoading ? <Spinner animation="border" size="lg" /> : totalClients}
                        </div>
                    </div>
                </div>


                <div className="col-lg pt-3">
                    <div className="stat-card">
                        <div className="card-header">
                            <img src={Transporter_white} alt="" />
                            <span>Total Transporters</span>
                        </div>

                        <div className="card-body">
                            <div className="bg" style={{ backgroundImage: "url(" + Transporter + ")", backgroundRepeat: "no-repeat", backgroundPosition: "right" }}></div>
                            {transportersLoading ? <Spinner animation="border" size="lg" /> : totalTransporters}
                        </div>
                    </div>
                </div>
            </div>

            <hr />

            <div className="row d-flex justify-content-center">
                <div className="col-lg pt-3">
                    <div className="stat-card">
                        <div className="card-header">
                            {/* <img src={Transporter_white} alt="" /> */}
                            <span>Total New Orders</span>
                        </div>

                        <div className="card-body">
                            <div className="bg" style={{ backgroundImage: "url(" + Transporter + ")", backgroundRepeat: "no-repeat", backgroundPosition: "right" }}></div>
                            {inEscrowLoading ? <Spinner animation="border" size="lg" /> : newOrdersCount}
                        </div>
                    </div>
                </div>


                <div className="col-lg pt-3">
                    <div className="stat-card">
                        <div className="card-header">
                            {/* <img src={Transporter_white} alt="" /> */}
                            <span>Total Active Orders</span>
                        </div>

                        <div className="card-body">
                            <div className="bg" style={{ backgroundImage: "url(" + Transporter + ")", backgroundRepeat: "no-repeat", backgroundPosition: "right" }}></div>
                            {escrowLoading ? <Spinner animation="border" size="lg" /> : activeOdersCount}
                        </div>
                    </div>
                </div>


                <div className="col-lg pt-3">
                    <div className="stat-card">
                        <div className="card-header">
                            {/* <img src={Transporter_white} alt="" /> */}
                            <span>Total Finished Orders</span>
                        </div>

                        <div className="card-body">
                            <div className="bg" style={{ backgroundImage: "url(" + Transporter + ")", backgroundRepeat: "no-repeat", backgroundPosition: "right" }}></div>
                            {loanLoading ? <Spinner animation="border" size="lg" /> : finishedOrdersCount}
                        </div>
                    </div>
                </div>
            </div>

            <hr />

            <div className="row d-flex justify-content-center">
                <div className="col-lg pt-3">
                    <div className="stat-card">
                        <div className="card-header">
                            {/* <img src={Transporter_white} alt="" /> */}
                            <span>Total in Escrow</span>
                        </div>

                        <div className="card-body">
                            <div className="bg" style={{ backgroundImage: "url(" + Transporter + ")", backgroundRepeat: "no-repeat", backgroundPosition: "right" }}></div>
                            {inEscrowLoading ? <Spinner animation="border" size="lg" /> : totalEscrowBalance}{" NIS"}
                        </div>
                    </div>
                </div>


                <div className="col-lg pt-3">
                    <div className="stat-card">
                        <div className="card-header">
                            {/* <img src={Transporter_white} alt="" /> */}
                            <span>Total Escrow</span>
                        </div>

                        <div className="card-body">
                            <div className="bg" style={{ backgroundImage: "url(" + Transporter + ")", backgroundRepeat: "no-repeat", backgroundPosition: "right" }}></div>
                            {escrowLoading ? <Spinner animation="border" size="lg" /> : <RabbitFormat balance={creditAmount} />}{" NIS"}
                        </div>
                    </div>
                </div>


                <div className="col-lg pt-3">
                    <div className="stat-card">
                        <div className="card-header">
                            {/* <img src={Transporter_white} alt="" /> */}
                            <span>Total Loan Balance</span>
                        </div>

                        <div className="card-body">
                            <div className="bg" style={{ backgroundImage: "url(" + Transporter + ")", backgroundRepeat: "no-repeat", backgroundPosition: "right" }}></div>
                            {loanLoading ? <Spinner animation="border" size="lg" /> : tempBalance}{" NIS"}
                        </div>
                    </div>
                </div>
            </div>

            <hr />

            {/* total finished orders cod for today */}
            <div className="row d-flex justify-content-center">
                <div className="col-lg pt-3">
                    <div className="stat-card">
                        <div className="card-header">
                            {/* <img src={Transporter_white} alt="" /> */}
                            <span>Total COD Collected Today</span>
                        </div>

                        <div className="card-body">
                            <div className="bg" style={{ backgroundImage: "url(" + Transporter + ")", backgroundRepeat: "no-repeat", backgroundPosition: "right" }}></div>
                            {todayCODLoading ? <Spinner animation="border" size="lg" /> : totalTodayCOD}{" NIS"}
                        </div>
                    </div>
                </div>

                <div className="col-lg pt-3">
                    <div className="stat-card">
                        <div className="card-header">
                            {/* <img src={Transporter_white} alt="" /> */}
                            <span>Total Today Active Orders Count</span>
                        </div>

                        <div className="card-body">
                            <div className="bg" style={{ backgroundImage: "url(" + Transporter + ")", backgroundRepeat: "no-repeat", backgroundPosition: "right" }}></div>
                            {todayActiveLoading ? <Spinner animation="border" size="lg" /> : todayActiveCount}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}