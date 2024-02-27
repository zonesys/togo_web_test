import React, { useEffect, useState } from "react";
import { getTransporterCitiesPrices, updateTransporterCitiesPrices/* , getAllGovernorates */ } from '../../APIs/ProfileAPIs';
import { Container, Row, Col, Form, Table, Card, Spinner } from 'react-bootstrap';
import { TbCurrencyShekel } from 'react-icons/tb';
import { GrEdit } from 'react-icons/gr';
import { toastNotification } from "../../Actions/GeneralActions";
import { useDispatch } from "react-redux";
import translate from "../../i18n/translate";

export default function CitiesPrices() {

    let dispatch = useDispatch();

    const styles = {
        cardHeaderLg: {
            position: 'absolute',
            left: '20px',
            right: '20px',
            top: '-20px',
            background: "linear-gradient(90deg, #26a69a, #69d4a5)",
            color: 'white',
            borderRadius: '10px',
            fontWeight: 'bold',
            fontSize: "1.5rem"
        },
        cardHeaderSm: {
            position: 'absolute',
            left: '20px',
            top: '-20px',
            background: "linear-gradient(90deg, #26a69a, #69d4a5)",
            color: 'white',
            borderRadius: '10px',
            fontWeight: 'bold',
            fontSize: "1.2rem"
        },
    }

    const [pricesArr, setPricesArr] = useState([]);
    const [fromInputValue, setFromInputValue] = useState('');
    const [toInputValue, setToInputValue] = useState('');
    const [pricesLoading, setPricesLoading] = useState(false);
    // const [selectedGovernorate, setSelectedGovernorate] = useState(1);
    // const [allGovernorates, setAllGovernorates] = useState([]);

    useEffect(() => {
        setPricesLoading(true);

        getTransporterCitiesPrices().then((res) => {
            // console.log(res.data);

            if (fromInputValue == '' && toInputValue == '') {
                setPricesArr(res.data.response);
            } else {
                setPricesArr(res.data.response.filter(city => {
                    return city.fromName.toLowerCase().replaceAll("أ", 'ا').replaceAll("إ", 'ا').includes(fromInputValue.toLowerCase()) &&
                        city.toName.toLowerCase().replaceAll("أ", 'ا').replaceAll("إ", 'ا').includes(toInputValue.toLowerCase())
                }));
            }

            setPricesLoading(false);
        })
    }, [fromInputValue, toInputValue, localStorage.getItem("Language")])

    const handleSearchFrom = (event) => {
        // console.log(event.target.value);
        setFromInputValue(event.target.value);
    }

    const handleSearchTo = (event) => {
        // console.log(event.target.value);
        setToInputValue(event.target.value);
    }

    /* useEffect(() => {
        getAllGovernorates().then((res) => {
            // console.log(res.data)
            setAllGovernorates(res.data.response);
            setSelectedGovernorate(res.data.response[0].govId);
        })
    }, []) */

    const handleChange = (from, to, newPrice) => {
        updateTransporterCitiesPrices(from, to, newPrice).then(res => {
            // console.log(res.data);
            if (res.data == "error") {
                dispatch(toastNotification("Error!", "Something went wrong!", "error"));
            }
        })
    }

    return (
        <Container fluid className="p-5">
            <Row>
                <Col>
                    <Card className="shadow rounded-22">
                        {/* <Card.Header style={styles.cardHeaderLg} className="d-flex justify-content-left">
                            <span className="ms-3 me-3">{translate("TEMP.SELECT_GOV")}</span>
                            <Form.Select className="w-25">
                                {
                                    allGovernorates.map((item, index) => {
                                        return <option key={index} value={item.govId}>{item.govName}</option>
                                    })
                                }
                            </Form.Select>
                        </Card.Header> */}

                        <Card.Body className="mt-5">
                            <Table hover>
                                <thead>
                                    <tr>
                                        <th scope="col" style={{ width: "30%" }}>
                                            <Form.Group className="d-flex justify-content-center">
                                                <Form.Label className="me-3 mt-1">{translate("TEMP.FROM")}</Form.Label>
                                                <Form.Control className="w-50" placeholder={"Search by name..."} onChange={(e) => {
                                                    handleSearchFrom(e)
                                                }} />
                                            </Form.Group>
                                        </th>
                                        <th scope="col" style={{ width: "10%" }}></th>
                                        <th scope="col" style={{ width: "30%" }}>
                                            <Form.Group className="d-flex justify-content-center">
                                                <Form.Label className="me-3 mt-1">{translate("TEMP.TO")}</Form.Label>
                                                <Form.Control className="w-50" placeholder={"Search by name..."} onChange={(e) => {
                                                    handleSearchTo(e)
                                                }} />
                                            </Form.Group></th>
                                        <th scope="col" style={{ width: "30%" }}>{translate("TEMP.PRICE")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        pricesLoading ? <tr><td colSpan="4"><Spinner animation="border" variant="success" /></td></tr> : pricesArr.map((item, index) => {
                                            return <tr key={index}>
                                                <td>{item.fromName}</td>
                                                <td>{(localStorage.getItem("Language") || "en") === "en" ? <i className="bi bi-arrow-right"></i> : <i className="bi bi-arrow-left"></i>}</td>
                                                <td>{item.toName}</td>
                                                <td>
                                                    <Form.Group className="d-flex justify-content-center" controlId={index}>
                                                        <Form.Control style={{ width: "100px", textAlign: "center" }} type="number" placeholder={item.price} onChange={(e) => {
                                                            handleChange(item.fromId, item.toId, e.target.value)
                                                        }} />
                                                        {/* <TbCurrencyShekel style={{ fontSize: "20px", marginTop: "10px" }} /> */}
                                                        <GrEdit style={{ fontSize: "20px", marginTop: "10px", marginLeft: "5px" }} />
                                                    </Form.Group>
                                                </td>
                                            </tr>
                                        })
                                    }
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}