import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Button, Table, Modal, Form, FloatingLabel, Spinner } from 'react-bootstrap'
import {
    createSubaccount,
    getSubaccounts,
    updateCanCreateOrders,
    updateCanViewWallet,
    updateBlockedAccount,
    checkSubaccountUserName
} from "../../APIs/ProfileAPIs";
import { useDispatch } from "react-redux";
import { toastNotification } from "../../Actions/GeneralActions";

export default function Subaccounts() {

    let dispatch = useDispatch();

    const [refresh, setRefresh] = useState(false);
    const [loadingGetSubaccounts, setLoadingGetSubaccounts] = useState(false);
    const [loadingCreateAccount, setLoadingCreateAccount] = useState(false);

    const [validated, setValidated] = useState(false);
    const [openAddAccountModal, setOpenAddAccountModal] = useState(false);

    const [subaccounts, setSubaccounts] = useState([]);
    const [showUsernameFoundError, setShowUsernameFoundError] = useState(false);

    useEffect(() => {
        setLoadingGetSubaccounts(true)
        getSubaccounts().then(res => {
            if (res.data.status == "error") {
                console.log(res.data.error)
                dispatch(toastNotification("Error!", "something went wrong!", "error"))
            } else {
                setSubaccounts(res.data.subaccounts)
            }
            setLoadingGetSubaccounts(false)
        })
    }, [refresh])

    const handleShowAddAccountModal = () => { setOpenAddAccountModal(true) }
    const handleHideAddAccountModal = () => { setOpenAddAccountModal(false); document.getElementById("createSubaccountForm").reset() }

    const handleToggleCreateOrders = (accountId, currentStatus) => {

        updateCanCreateOrders(accountId, currentStatus === "1" ? "0" : "1").then(res => {
            if (res.data.status == "error") {
                console.log(res.data.error)
                dispatch(toastNotification("Error!", "something went wrong!", "error"))
            } else {
                setSubaccounts(prevSubaccounts =>
                    prevSubaccounts.map(subaccount =>
                        subaccount.subaccount_id === accountId
                            ? { ...subaccount, create_orders: currentStatus === "1" ? "0" : "1" }
                            : subaccount
                    )
                );

                dispatch(toastNotification("Success", "updated successfully", "success"))
            }
        })
    }

    const handleToggleViewWallet = (accountId, currentStatus) => {

        updateCanViewWallet(accountId, currentStatus === "1" ? "0" : "1").then(res => {
            if (res.data.status == "error") {
                console.log(res.data.error)
                dispatch(toastNotification("Error!", "something went wrong!", "error"))
            } else {
                setSubaccounts(prevSubaccounts =>
                    prevSubaccounts.map(subaccount =>
                        subaccount.subaccount_id === accountId
                            ? { ...subaccount, view_balance: currentStatus === "1" ? "0" : "1" }
                            : subaccount
                    )
                );

                dispatch(toastNotification("Success", "updated successfully", "success"))
            }
        })
    }

    const handleUpdateBlockedAccount = (accountId, currentStatus) => {

        updateBlockedAccount(accountId, currentStatus === "1" ? "0" : "1").then(res => {
            if (res.data.status == "error") {
                console.log(res.data.error)
                dispatch(toastNotification("Error!", "something went wrong!", "error"))
            } else {
                setSubaccounts(prevSubaccounts =>
                    prevSubaccounts.map(subaccount =>
                        subaccount.subaccount_id === accountId
                            ? { ...subaccount, blocked: currentStatus === "1" ? "0" : "1", create_orders: "0", view_balance: "0" }
                            : subaccount
                    )
                );

                dispatch(toastNotification("Success", "updated successfully", "success"))
            }
        })
    }

    const createSubaccountHandler = (
        subaccountName,
        subaccountPhone,
        subaccountUsername,
        subaccountPassword,
        canCreateOrder,
        canViewBalance
    ) => {

        setLoadingCreateAccount(true)

        createSubaccount(
            subaccountName,
            subaccountPhone,
            subaccountUsername,
            subaccountPassword,
            canCreateOrder,
            canViewBalance
        ).then(res => {
            if (res.data.status == "error") {
                console.log(res.data.error)
                dispatch(toastNotification("Error!", "something went wrong!", "error"))
            } else {
                dispatch(toastNotification("Success", res.data.response, "success"))
            }

            setLoadingCreateAccount(false)
            handleHideAddAccountModal()
            setRefresh(!refresh)
        })
    }

    return (
        <>
            <Container className="d-flex align-items-start">
                <Col>
                    <Row className='py-4'>
                        <Col sm={3}>
                            <Button
                                onClick={handleShowAddAccountModal}
                                className="btn-grad"
                            >
                                Add Subaccount
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Subaccount Name</th>
                                        <th>Phone</th>
                                        <th>Username</th>
                                        <th>Logged In</th>
                                        <th>Blocked</th>
                                        <th>Can Create Orders</th>
                                        <th>Can View Wallet</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        !loadingGetSubaccounts ?
                                            subaccounts?.length > 0 ?
                                                subaccounts?.map((account, index) => {
                                                    return <tr key={index} style={{ backgroundColor: account.blocked === "1" && "#f2d8cd" }}>
                                                        <td>
                                                            <FloatingLabel className="mb-2" label="Account Name">
                                                                <Form.Control disabled type="text" placeholder="..." defaultValue={account.subaccount_name} />
                                                            </FloatingLabel>
                                                        </td>
                                                        <td>
                                                            <FloatingLabel className="mb-2" label="Phone">
                                                                <Form.Control disabled type="text" placeholder="..." defaultValue={account.subaccount_phone} />
                                                            </FloatingLabel>
                                                        </td>
                                                        <td>
                                                            <FloatingLabel className="mb-2" label="Username">
                                                                <Form.Control disabled type="text" placeholder="..." defaultValue={account.subaccount_username} />
                                                            </FloatingLabel>
                                                        </td>
                                                        <td>
                                                            <div className='w-100 d-flex justify-content-center'>
                                                                <div style={{
                                                                    borderRadius: "50%",
                                                                    width: "20px",
                                                                    height: "20px",
                                                                    display: "flex",
                                                                    justifyContent: "center",
                                                                    alignItems: "center",
                                                                    backgroundColor: account.logged_in === "1" ? "#b4ff9e" : "#ffa0a0",
                                                                    border: "1px solid " + (account.logged_in === "1" ? "green" : "red")
                                                                }}>
                                                                    <div style={{
                                                                        borderRadius: "50%",
                                                                        width: "10px",
                                                                        height: "10px",
                                                                        display: "flex",
                                                                        justifyContent: "center",
                                                                        alignItems: "center",
                                                                        backgroundColor: account.logged_in === "1" ? "green" : "red"
                                                                    }}></div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <Form.Check
                                                                type="switch"
                                                                checked={account.blocked === "1"}
                                                                onChange={() => handleUpdateBlockedAccount(account.subaccount_id, account.blocked)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <Form.Check
                                                                type="switch"
                                                                checked={account.create_orders === "1"}
                                                                disabled={account.blocked === "1" ? true : false}
                                                                onChange={() => handleToggleCreateOrders(account.subaccount_id, account.create_orders)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <Form.Check
                                                                type="switch"
                                                                checked={account.view_balance === "1"}
                                                                disabled={account.blocked === "1" ? true : false}
                                                                onChange={() => handleToggleViewWallet(account.subaccount_id, account.view_balance)}
                                                            />
                                                        </td>
                                                    </tr>
                                                })
                                                : <tr><td colSpan={7}>No Subaccounts Found!</td></tr>
                                            : <tr><td colSpan={7}><Spinner animation="border" size="sm" /></td></tr>
                                    }
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </Col>
            </Container>

            <Modal
                show={openAddAccountModal}
                onHide={handleHideAddAccountModal}
                centered
                animation={true}
                /* backdrop="static" */
                size="lg"
            >
                <Modal.Header closeButton className='card-header-lg'>
                    <Modal.Title>Add Subaccount</Modal.Title>
                </Modal.Header>
                <Modal.Body className='pt-5 mt-3'>
                    <Form id="createSubaccountForm" validated={validated} noValidate onSubmit={(event) => {
                        event.preventDefault();
                        event.stopPropagation();

                        const formData = new FormData(event.target), formDataObj = Object.fromEntries(formData.entries());

                        // <debug>
                        // console.log(formDataObj);
                        // return

                        const form = event.currentTarget;

                        if (form.checkValidity() === true && showUsernameFoundError === false) {

                            const accountName = formDataObj.account_name
                            const phone = formDataObj.phone
                            const username = formDataObj.username
                            const password = formDataObj.password
                            let createOrders = "0"
                            let viewBalance = "0"

                            if (!!formDataObj.create_orders) {
                                createOrders = "1"
                            }

                            if (!!formDataObj.view_balance) {
                                viewBalance = "1"
                            }

                            // <debug>
                            /* console.log(accountName)
                            console.log(phone)
                            console.log(username)
                            console.log(password)
                            console.log(createOrders)
                            console.log(viewBalance) */
                            // return

                            // <debug>
                            // alert("create subaccount")
                            // return

                            createSubaccountHandler(
                                accountName,
                                phone,
                                username,
                                password,
                                createOrders,
                                viewBalance
                            );
                        }

                        setValidated(true);
                    }}>
                        <FloatingLabel className="mb-2" controlId="account-name" label="Account Name">
                            <Form.Control required type="text" name="account_name" placeholder="..." />
                        </FloatingLabel>

                        <FloatingLabel className="mb-2" controlId="phone" label="Phone">
                            <Form.Control required pattern="0\d{9}" type="tel" name="phone" placeholder="..." />
                        </FloatingLabel>

                        <FloatingLabel className="mb-2" controlId="username" label="Username">
                            <Form.Control required isInvalid={showUsernameFoundError} type="text" name="username" placeholder="..." onChange={(e) => {
                                checkSubaccountUserName(e.target.value).then(res => {
                                    if (res.data.status === "found") {
                                        setShowUsernameFoundError(true)
                                    } else {
                                        setShowUsernameFoundError(false)
                                    }
                                })
                            }} />
                            {showUsernameFoundError && (
                                <Form.Control.Feedback type="invalid">
                                    Username already used
                                </Form.Control.Feedback>
                            )}
                        </FloatingLabel>

                        <FloatingLabel className="mb-2" controlId="password" label="Password">
                            <Form.Control required type="password" name="password" placeholder="..." autoComplete="new-password" />
                        </FloatingLabel>

                        <div className='d-flex justify-content-center my-4'>
                            <Form.Check
                                className="mx-3"
                                type="checkbox"
                                label="Create Orders"
                                name='create_orders'
                                defaultChecked
                            />

                            <Form.Check
                                className="mx-3"
                                type="checkbox"
                                label="View Balance"
                                name='view_balance'
                                defaultChecked
                            />
                        </div>

                        <Button disabled={loadingCreateAccount} type="submit" className='btn-grad'>
                            {loadingCreateAccount && <Spinner animation="border" size="sm" />}
                            Create Subaccount
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal >
        </>
    )
}
