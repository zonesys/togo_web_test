import {
    Grid, Checkbox, Box, Flex, Select, Button
} from "@chakra-ui/react"
import styles from "./Styles";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { getBusinessLocation, updateTransporterBusniessLocation } from "../../Actions/ProfileActions";
import Loader from "../../components/Loader/Loader";
import { isTransporter } from "../../Util";
import { Input, Text } from "@chakra-ui/react"
import { getBusinessTypes, setClientBusiness, getAllGovernorates } from "../../APIs/ProfileAPIs";
import { Formik, Form } from "formik";
import { toastMessage } from "../../Actions/GeneralActions";
import './BusinessLocation.css';
import translate from "../../i18n/translate";
import { Container, Row, Col, Tab, Nav } from 'react-bootstrap';

export default function BusinessLocation() {
    const dispatch = useDispatch();
    const businessLocations = useSelector(state => state.profile.businessLocations);
    const [loading, setLoading] = useState(true);
    const isTransporterVal = isTransporter();

    const fetchData = useCallback(() => {
        setLoading(true);
        dispatch(getBusinessLocation(() => {
            setLoading(false);
        }, (err) => {
            setLoading(false);
            dispatch(toastMessage(err));
        }));
    }, [dispatch]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <Box {...styles.content}>
            {loading ? <Loader /> :
                isTransporterVal ? <TransporterBusinessLocation businessLocations={businessLocations} /> :
                    <ClientBusinessLocation businessLocations={businessLocations} fetchData={fetchData} />
            }
        </Box>
    )
};


const ClientBusinessLocation = ({ businessLocations: { BusinessName, BusinessPlace, BusinessTypeId }, fetchData }) => {
    const [bussinessTypes, setBusinessTypes] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        getBusinessTypes().then(({ data: { server_response } }) => {
            setBusinessTypes(server_response);
        }).catch(err => {
            console.log(err);
        })
    }, []);

    const handleSubmit = (values) => {
        setClientBusiness(values).then(() => {
            fetchData();
            dispatch(toastMessage("Business location has been updated", "Updated Successfully", "success"));
        }).catch(err => {
            console.log(err);
            dispatch(toastMessage(err));
        });
    };

    return <Flex direction="column" w="80%">
        <Formik
            enableReinitialize
            initialValues={{ BusinessName, BusinessPlace, BusinessTypeId }}
            onSubmit={handleSubmit}
        >
            {({
                values,
                handleChange,
                handleSubmit,
                setFieldValue
            }) => (
                <Form onSubmit={handleSubmit}>
                    <Text {...styles.title} {...styles.greyTitle}>{translate("BUSINESS_LOCATION.NAME")}:</Text>
                    <Input placeholder="Business Name"
                        name="BusinessName"
                        onChange={handleChange}
                        value={values.BusinessName}
                        ml={3} />
                    <Text {...styles.title} {...styles.greyTitle}>{translate("BUSINESS_LOCATION.PLACE")}:</Text>
                    <Input placeholder="Business Place"
                        name="BusinessPlace"
                        onChange={handleChange}
                        value={values.BusinessPlace}
                        ml={3} />
                    <Text {...styles.title} {...styles.greyTitle}>{translate("BUSINESS_LOCATION.TYPE")}:</Text>
                    <Select placeholder="Business Type" ml={3} name="BusinessTypeId"
                        onChange={({ target: { value } }) => setFieldValue('BusinessTypeId', value)}>
                        {bussinessTypes.map(({ Name, id }) => <option key={id} selected={BusinessTypeId === id}
                            value={id}>{Name}</option>)}
                    </Select>
                    <Button type="submit" {...styles.updateButton}>{translate("BUSINESS_LOCATION.UPDATE")}</Button>
                </Form>
            )}
        </Formik>
    </Flex>
};


const TransporterBusinessLocation = ({ businessLocations }) => {
    const dispatch = useDispatch();
    const [selectedGovernorate, setSelectedGovernorate] = useState(1);
    const [allGovernorates, setAllGovernorates] = useState([]);

    useEffect(() => {
        getAllGovernorates().then((res) => {
            // console.log(res.data)
            setAllGovernorates(res.data.response);
            setSelectedGovernorate(res.data.response[0].govId);
        })
    }, [localStorage.getItem("Language")])

    const handleClick = ({ target: { value, checked } }) => {
        dispatch(updateTransporterBusniessLocation(value, checked ? "Add" : "Remove"));
    };

    return <Tab.Container id="left-tabs-example" defaultActiveKey="item-0">
        <Row className="w-100">
            <Col sm={6} className="govsNav inner-shadow">
                <Nav variant="pills" className="flex-column">
                    {
                        allGovernorates.map((item, index) => {
                            return <Nav.Item key={index}>
                                <Nav.Link eventKey={"item-" + index} onClick={() => { setSelectedGovernorate(item.govId) }}>{item.govName}</Nav.Link>
                            </Nav.Item>
                        })
                    }
                </Nav>
            </Col >
            <Col sm={6} className="govsNav">
                <Tab.Content className="d-flex justify-content-left">
                    {/* <Tab.Pane eventKey="first">
                        test1
                    </Tab.Pane> */}
                    <Grid gridTemplateColumns="repeat(1, 1fr)">
                        {businessLocations.map(({ IdCity, CityName, GovernorateId, CheckAdded }) => {
                            return GovernorateId == selectedGovernorate && <div key={IdCity}>
                                <Checkbox
                                    colorScheme="green"
                                    defaultIsChecked={CheckAdded === "Added"}
                                    value={IdCity}
                                    onChange={handleClick}
                                    {...styles.subTitle}>{CityName}</Checkbox>
                                <hr />
                            </div>
                        })}
                    </Grid>
                </Tab.Content>
            </Col>
        </Row>
    </Tab.Container>
};
