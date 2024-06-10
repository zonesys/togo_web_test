import { Box, Grid } from "@chakra-ui/layout";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { getPersonalInfo } from "../../Actions/ProfileActions";
import Loader from "../../components/Loader/Loader";
import { isTransporter } from "../../Util";
import translate from '../../i18n/translate';
import { imgBaseUrl } from "../../Constants/GeneralCont"; 
import { Table } from "react-bootstrap"; 

export default function PersonalDetails() {
    const dispatch = useDispatch();
    const { FullName, NamePlace, IDNumber, LicenceNumber, Email, AccountName, LogoUrl } = useSelector(state => state.profile.personalInfo);
    const [loading, setLoading] = useState(true);
    const isTransporterVal = isTransporter();

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

    return (
        <>
            {loading ? <Loader /> : (
                <div className="container-fluid" data-test="account-container">
                    <div className="d-flex w-100 justify-content-center">
                        <img
                            data-test="profile-picture"
                            style={{
                                borderRadius: "50%",
                                border: "4px solid rgba(0,0,0,0.15)",
                                width: "100px",
                                height: "100px",
                                objectFit: "cover"
                            }}
                            src={`${imgBaseUrl}${LogoUrl}`}
                            alt="Profile"
                        />
                    </div>

                    <Table>
                        <tbody>
                            {personalDetails.map((item, index) => (
                                <tr key={index}>
                                    <th scope="row">{item.title}:</th>
                                    <td style={{ textAlign: "right" }}>
                                        <span style={{ color: "#3FB79E", fontSize: "20px" }}
                                              data-test={index === 0 ? "user-full-name" : "user-email"}>
                                            {item.value}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}
        </>
    );
}
