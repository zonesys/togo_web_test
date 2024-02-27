import {Box, Grid} from "@chakra-ui/layout";
import styles from "./Styles";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from 'react-redux';
import {getPersonalInfo} from "../../Actions/ProfileActions";
import Loader from "../../components/Loader/Loader";
import {isTransporter} from "../../Util";
import translate from '../../i18n/translate';

import { imgBaseUrl } from "../../Constants/GeneralCont"; /* edited (import imgBaseUrl) */

import { Table } from "react-bootstrap"; /* edited (Table importd) */

/*export function PersonalDetailsOut() {
    const dispatch = useDispatch();
    const {FullName} = useSelector(state => state.profile.personalInfo);
    const [loading, setLoading] = useState(true);
    const isTransporterVal = isTransporter();

    useEffect(() => {
        dispatch(getPersonalInfo(() => {
            setLoading(false);
        }));
    }, [dispatch]);

    let name = FullName;

    return name
}*/

export default function PersonalDetails() {
    const dispatch = useDispatch();
    const {FullName, NamePlace, IDNumber, LicenceNumber, Email, AccountName, LogoUrl} = useSelector(state => state.profile.personalInfo);
    const [loading, setLoading] = useState(true);
    const isTransporterVal = isTransporter();

    // console.log(imgBaseUrl + " - " + LogoUrl); // temp test

    useEffect(() => {
        dispatch(getPersonalInfo(() => {
            setLoading(false);
        }));
    }, [dispatch]);

    let personalDetails = [
        {
            title: translate("PERSONAL_DETAILS.FULL_NAME"),
            value: FullName
        },
        {
            title: translate("PERSONAL_DETAILS.EMAIL"),
            value: Email
        }
    ];

    if (isTransporterVal) {
        personalDetails.push(
            {
                title: translate("PERSONAL_DETAILS.ISSUING_IDENTITY"),
                value: NamePlace
            },
            {
                title: translate("PERSONAL_DETAILS.ID_NUMBER"),
                value: IDNumber
            },
            {
                title: translate("PERSONAL_DETAILS.DRIVER_NUM"),
                value: LicenceNumber
            },
            {
                title: translate("PERSONAL_DETAILS.ACCOUNT_NAME"),
                value: AccountName
            }
        )
    }

    /* edited (styles added) */
    const styles = {
        defaultLine: {
            width: "80%",
            margin: "auto",
            marginTop: "10px",
            marginBottom: "10px"
        },
        info: {
            color: "#3FB79E",
            fontSize: "20px",
            textAlign: "right"
        },
        fontSize_1: {
            fontSize: "20px"
        }
    }

    /* edited (return below commented) */

    /*return <Box {...styles.content}>
        {loading ? <Loader/> :
            <Grid {...styles.personalInfoContainer} gridTemplateColumns={`repeat(${isTransporterVal ? 3 : 2}, 1fr)`}>
                {personalDetails.map((item, index) => (
                    <Box key={index}>
                        <Box {...styles.title} {...styles.greyTitle} textAlign="center">
                            {item.title}
                        </Box>
                        <Box {...styles.subTitle}>
                            {item.value}
                        </Box>
                    </Box>
                ))}
                <img src={`${imgBaseUrl}${LogoUrl}`} />
            </Grid>
        }
    </Box>*/

    /* edited (new return added) */

    return <>
        {loading ? <Loader/> :<div className="container-fluid">
            <div className="d-flex w-100 justify-content-center">
                <img  style={{
                                borderRadius: "50%",
                                //margin: "auto",
                                border: "4px solid rgba(0,0,0,0.15)",
                                width: "100px",
                                height: "100px",
                                objectFit: "cover"
                            }} 
                    src={`${imgBaseUrl}${LogoUrl}`} />
            </div>

            <Table>
                <tbody>
                    {personalDetails?.map((item, index) => (
                        <tr key={index}>
                            <th scope="row">{item?.title}:</th>
                            <td style={{ textAlign: "right" }}><span style={{ color: "#3FB79E", fontSize: "20px" }}>{item?.value}</span></td>
                        </tr>
                        /*<div key={index}>
                            {index !== 0 && <hr style={styles.defaultLine} />}

                            <div className="row">
                                <div className="col d-flex justify-content-between">
                                    <span style={styles.fontSize_1}>{item.title}:</span>
                                    <span style={styles.info}>{item.value}</span>
                                </div>
                            </div>
                        </div>*/
                    ))}
                </tbody>
            </Table>

        </div>}
    </>
};