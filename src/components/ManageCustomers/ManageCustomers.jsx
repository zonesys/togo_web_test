import React, { useEffect, useState } from 'react'
import "./ManageCustomers.css"
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { imgBaseUrl } from "../../Constants/GeneralCont";
import { FiEdit2 } from 'react-icons/fi';
import { AiOutlineUserAdd } from 'react-icons/ai';
import {
    getExclusiveCustomers,
    addExclusiveCustomer
} from "../../APIs/OrdersAPIs";
import { useDispatch } from "react-redux";
import { toastNotification } from "../../Actions/GeneralActions";

function ManageCustomers() {

    let dispatch = useDispatch();

    const [clients, setClients] = useState([/* 
        { client_id: 1, client_name: "client 1", client_phone: "051111", client_logo_path: "img/BusinessLogo/BlankProfile.png" },
        { client_id: 2, client_name: "client 2", client_phone: "052222", client_logo_path: "img/BusinessLogo/BlankProfile.png" },
        { client_id: 3, client_name: "client 3", client_phone: "053333", client_logo_path: "img/BusinessLogo/BlankProfile.png" },
        { client_id: 4, client_name: "client 1", client_phone: "054444", client_logo_path: "img/BusinessLogo/BlankProfile.png" },
        { client_id: 5, client_name: "client 5", client_phone: "055555", client_logo_path: "img/BusinessLogo/BlankProfile.png" },
        { client_id: 6, client_name: "client 6", client_phone: "056666", client_logo_path: "img/BusinessLogo/BlankProfile.png" },
     */])
    const [searchedClients, setSearchedClients] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedClient, setSelectedClient] = useState({});
    const [loadingClients, setLoadingClients] = useState(false);
    const [loadingAddClient, setLoadingAddClient] = useState(false);
    const [validated, setValidated] = useState(false);
    const [refresh, setRefresh] = useState(false);

    const handleShowEditModal = () => { setShowEditModal(true) }
    const handleCloseEditModal = () => { setShowEditModal(false) }
    const handleShowAddModal = () => { setShowAddModal(true) }
    const handleCloseAddModal = () => { setShowAddModal(false) }

    const editClient = (client) => {
        handleShowEditModal()
        setSelectedClient(client)
    }

    useEffect(() => {
        setLoadingClients(true)
        getExclusiveCustomers().then((res) => {
            if (res.data.status === "error") {
                dispatch(toastNotification("Error!", res.data.error, "error"));
            } else if (res.data.status === "not-found") {
                dispatch(toastNotification("warning!", res.data.response, "warning"));
            } else {
                setClients(res.data.customers)
                setSearchedClients(res.data.customers)
                setLoadingClients(false)
            }
        })
    }, [refresh])

    const handleSearch = (str) => {
        const tempArr = clients.filter((client) => {
            return (
                client.client_name.toLowerCase().includes(str.toLowerCase()) ||
                client.client_phone.includes(str)
            )
        });

        setSearchedClients(tempArr);
    }

    const addNewClient = (name, email, phone) => {
        setLoadingAddClient(true)
        addExclusiveCustomer(name, email, phone).then((res) => {
            if (res.data.status === "error") {
                dispatch(toastNotification("Error!", res.data.error, "error"));
            } else {
                dispatch(toastNotification("Success!", res.data.response, "success"));
                setRefresh(!refresh);
            }
            setLoadingAddClient(false)
        })
    }

    return (
        <div style={{ color: "gray" }}>
            <div className='search-container'>
                <Form.Control
                    className="w-50"
                    type="text"
                    placeholder="Search..."
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>
            <div className='clients-container'>
                <div className='client-div add-client' onClick={handleShowAddModal}>
                    <span className='h2 me-3'><AiOutlineUserAdd /></span>
                    Add New Client
                </div>
                {loadingClients && <Spinner animation="border" size="sm" />}
                {
                    searchedClients?.map((client, index) => {
                        return <div key={index} className='client-div'>
                            <div className='client-image'>
                                <img style={{
                                    width: "50px",
                                    height: "50px",
                                    objectFit: "cover"
                                }}
                                    className="rounded-circle align-self-center" src={`${imgBaseUrl}${client.client_logo_path}`} alt="transImg"
                                />
                            </div>

                            <div className='client-name'>
                                {client.client_name}
                            </div>

                            <div className='edit-client' onClick={() => editClient(client)}>
                                <FiEdit2 />
                            </div>
                        </div>
                    })
                }
            </div>

            <Modal
                show={showEditModal}
                onHide={handleCloseEditModal}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                style={{ color: "gray" }}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Edit Client
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='w-100 d-flex justify-content-center'>
                        <img style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                            boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
                        }}
                            className="rounded-circle align-self-center" src={`${imgBaseUrl}${selectedClient.client_logo_path}`} alt="transImg"
                        />
                    </div>
                    <h2 className='w-100 h2 text-center mt-3' style={{ color: "#26a69a" }}>{selectedClient.client_name}</h2>
                    <hr />
                    <h4 className='w-100 h4 text-center mt-2'>{selectedClient.client_phone}</h4>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleCloseEditModal}>Close</Button>
                </Modal.Footer>
            </Modal>

            <Modal
                show={showAddModal}
                onHide={handleCloseAddModal}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                style={{ color: "gray" }}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Add New Client
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form id="orderForm" validated={validated} noValidate onSubmit={(event) => {
                        event.preventDefault();
                        event.stopPropagation();

                        const formData = new FormData(event.target), formDataObj = Object.fromEntries(formData.entries());

                        // console.log(formDataObj);

                        const form = event.currentTarget;
                        if (form.checkValidity() === true) {

                            addNewClient(formDataObj.client_name, formDataObj.client_email, formDataObj.client_phone)

                        }

                        setValidated(true);
                    }}>
                        <Form.Control
                            name="client_name"
                            type="text"
                            placeholder="client name..."
                            required
                        />

                        <Form.Control
                            name="client_email"
                            type="email"
                            placeholder="client email..."
                            className="my-2"
                            required
                        />

                        <Form.Control
                            name="client_phone"
                            type="number"
                            placeholder="client phone..."
                            required
                        />

                        <Button disabled={loadingAddClient} type='submit' className='mt-4 btn-grad w-100'>
                            Add Client
                            {loadingAddClient && <Spinner animation="border" size="sm" />}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default ManageCustomers