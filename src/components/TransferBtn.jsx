import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import React, { useEffect, useState } from "react";
import { Button, Table, Modal, Alert, ButtonGroup } from "react-bootstrap";
import translate from "../i18n/translate";
import { GetTransactions } from "../APIs/OrdersAPIs";
import Receipt from "./Receipt";

export default function TransferBtn({TransporterId, onSuccess}){
    
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShow(false);
    };
    const [transactions, setTransactions] = useState();
    
    useEffect(()=>{
        if(show === true){
            GetTransactions(TransporterId).then((res)=>{
                setTransactions(res.data);
            });
        }
    }, [show]);
    
    return (
        <>
        <Button variant="info" className="text-white" onClick={(event)=>{
            event.stopPropagation();
            handleShow();
        }}>
            {translate("ADMIN.REVIEW_TRANSACTION")}
        </Button>
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{translate("ADMIN.TRANSACTIONS_HISTORY")}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Table className="togo-table">
                    <thead style={{ display: "block", overflowY:"scroll"}}>
                        <tr style={{display: "table",width:"100%",
                                tableLayout:"fixed"}}>
                            <th>OrderId</th>
                            <th>TransactionDate</th>
                            <th>FromCustomer</th>
                            <th>ToCustomer</th>
                            <th>Amount</th>
                            {/* <th>Description</th> */}
                            
                        </tr>
                    </thead>
                    <tbody style={{height: "280px", display: "block", overflowY:"auto"}}>
                        {transactions?.transactions_list?.map?.(({Amount, Description, FromCustomer, OrderId, ToCustomer, TransactionDate}, idx)=>{
                            return (<tr key={OrderId + "_" + idx} style={{display: "table",width:"100%",
                                tableLayout:"fixed"}}>
                                <td>{OrderId}</td>
                                <td>{TransactionDate}</td>
                                <td>{FromCustomer}</td>
                                <td>{ToCustomer}</td>
                                <td>{Amount}</td>
                                {/* <td>{Description}</td> */}
                            </tr>);
                        })}
                    </tbody>
                </Table>
                <Alert variant="info" className="d-flex align-items-center">
                    <p><span className="font-bold">Total: </span>{transactions?.sum_of_balance}</p>
                    <ButtonGroup variant="danger" className="ms-5">
                        <Receipt toMaster={true} TransporterId={TransporterId}>
                            <Button variant="outline-secondary" className="m-inline-e-2" onClick={()=>{
                                // TransferToMaster(TransporterId, ref.current.value).then(()=>{
                                //     dispatch(toastMessage("Debited", "Successful", "success"));
                                //     handleClose();
                                //     //onSuccess();32f9f1ab3c8c30fac1bd1eff8c46235992485fbd
                                // });
                            }}>
                                <AddIcon /> Debit (Receive Cash From Transporter)
                            </Button>
                        </Receipt>
                        <Receipt toMaster={false} TransporterId={TransporterId}>
                            <Button variant="outline-secondary" onClick={()=>{
                                // TransferToMember(TransporterId, ref.current.value).then(()=>{
                                //     dispatch(toastMessage("Credited", "Successful", "success"));
                                //     handleClose();
                                //     //onSuccess();
                                // });
                            }}>
                                <MinusIcon /> Credit (Hand Cash To Transporter)
                            </Button>
                        </Receipt>
                    </ButtonGroup>
                </Alert>
                
            </Modal.Body>
            <Modal.Footer>
                {/* <Button variant="danger" onClick={() => {
                    //onConfirm();
                    handleClose();
                }}>
                    
                </Button> */}
            </Modal.Footer>
        </Modal>
        </>
        
    )
}