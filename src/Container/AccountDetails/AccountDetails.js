import React, { useEffect } from 'react';
import {
    Grid, GridItem, Box, Divider
} from "@chakra-ui/react";
import { useDispatch } from 'react-redux';
import VehiclesInformation from "./VehiclesInformation";
import styles from './Styles';
import BusinessLocation from "./BusinessLocation";
import PersonalDetails from "./PersonalDetails";
import WorkingTime from "./WorkingTime";
import { isTransporter } from "../../Util";
import { accountDetailsCleanUp } from "../../Actions/ProfileActions";
import translate from "../../i18n/translate";

import { Accordion, Card } from "react-bootstrap"; /* edited (Accordion, Card imported) */

export function CardComponent(props) {
    const styles = {
        cardHeaderLg: {
            position: 'absolute',
            left: '20px',
            right: '20px',
            top: '-20px',
            background: "linear-gradient(90deg, #26a69a, #69d4a5)",
            color: 'white',
            borderRadius: '10px',
            fontWeight: 'bold'
        },
        cardHeaderSm: {
            position: 'absolute',
            left: '20px',
            top: '-20px',
            background: "linear-gradient(90deg, #26a69a, #69d4a5)",
            color: 'white',
            borderRadius: '10px',
            fontWeight: 'bold'
        }
    }

    return (
        <Card
            bg={"Danger"}
            text={"black"}
            className="mt-5 shadow"
        >
            <Card.Header style={styles.cardHeaderSm}>{props?.title}</Card.Header>
            <Card.Body className="d-flex align-items-center mt-3">
                {
                    props?.bodyNumber === 1 ? <PersonalDetails /> :

                        props?.bodyNumber === 2 ? <BusinessLocation /> :

                            props?.bodyNumber === 3 ? <VehiclesInformation /> :

                                <WorkingTime />
                }
            </Card.Body>
        </Card>
    )
}

export default function AccountDetails() {
    let isTransporterVal = isTransporter();
    const dispatch = useDispatch();

    useEffect(() => {
        return () => dispatch(accountDetailsCleanUp())
    }, [dispatch]);

    const containerStyle = {
        /*background: "white",
        borderRadius: "10px",
        borderWidth: "1px",
        boxShadow: "5px 5px 5px lightgray",
        padding: "50px 10px 10px 10px",*/
    }

    return (
        /*<Grid {...styles.container} templateColumns={isTransporterVal ? "3fr 2fr" : "1fr"} >
            <Grid h="fit-content" gap={4} templateColumns={`repeat(${isTransporterVal ? 2 : 3}, 1fr)`}>
                <GridItem {...styles.gridItems} maxHeight={isTransporter() ? 330 : 390} colSpan={2}>
                    <Box {...styles.title}>{translate("ACCOUNT_DETAILS.PERSONAL_INFORMATION")}</Box>
                    <Divider {...styles.divider}/>
                    <PersonalDetails/>
                </GridItem>
                <GridItem {...styles.gridItems} maxHeight={isTransporter() ? 195 : 390}>
                    <Box {...styles.title}>{translate("ACCOUNT_DETAILS.BUSINESS_LOCATION")}</Box>
                    <Divider {...styles.divider}/>
                    <div style={{ marginTop: "30px" }}>
                        <BusinessLocation/>
                    </div>
                </GridItem>
                {isTransporterVal &&
                <GridItem {...styles.gridItems} maxHeight={195}>
                    <Box {...styles.title}>{translate("ACCOUNT_DETAILS.VEHICLE_INFORMATION")}</Box>
                    <Divider {...styles.divider}/>
                    <VehiclesInformation/>
                </GridItem>
                }
            </Grid>
            {isTransporterVal &&
            <GridItem {...styles.gridItems} maxHeight={545}>
                <Box {...styles.title}>{translate("ACCOUNT_DETAILS.WORKING_TIME")}</Box>
                <Divider {...styles.divider}/>
                <div style={{ marginTop: "10px" }}>
                    <WorkingTime/>
                </div>
            </GridItem>
            }
        </Grid>*/

        <div className="container-fluid" style={{ paddingLeft: "20px", paddingRight: "20px" }}>

            {isTransporterVal ? <div className="row justify-content-md-center">

                <div className="col-xl-6">

                    <div className="row">

                        <div style={containerStyle} className="col-md-12"><CardComponent title={translate("ACCOUNT_DETAILS.PERSONAL_INFORMATION")} bodyNumber={1} /></div>

                        <div style={containerStyle} className="col-md-12"><CardComponent title={translate("ACCOUNT_DETAILS.VEHICLE_INFORMATION")} bodyNumber={3} /></div>

                    </div>

                </div>

                <div className="col-xl-6 h-100">

                    <div className="row h-100">

                        <div style={containerStyle} className="col-md-12"><CardComponent title={translate("ACCOUNT_DETAILS.OP_AREAS")} bodyNumber={2} /></div>

                        <div style={containerStyle} className="col-md-12"><CardComponent title={translate("ACCOUNT_DETAILS.WORKING_TIME")} bodyNumber={4} /></div>

                    </div>

                </div>

            </div> : <div className="row">

                <div style={containerStyle} className="col-xl-6"><CardComponent title={translate("ACCOUNT_DETAILS.PERSONAL_INFORMATION")} bodyNumber={1} /></div>

                <div style={containerStyle} className="col-xl-6"><CardComponent title={translate("ACCOUNT_DETAILS.BUSINESS_INFO")} bodyNumber={2} /></div>

            </div>}

        </div>
    );

};