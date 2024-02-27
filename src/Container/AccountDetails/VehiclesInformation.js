import React, {useEffect, useState} from "react";
import {Box, Grid, Text} from "@chakra-ui/layout";
import {Icon} from "@chakra-ui/icon";
import {FaCarSide} from 'react-icons/fa';
import styles from './Styles';
import {getVehicleInfo} from "../../Actions/ProfileActions";
import {useDispatch, useSelector} from 'react-redux';
import Loader from "../../components/Loader/Loader";
import translate from "../../i18n/translate";


export default function VehiclesInformation() {
    const {LicenceNumber, Name} = useSelector(state => state.profile.vehicleInfo);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    let vehiclesInformation = [
        {
            title: translate('VEHICLES_INFORMATION.VEHICLE_NUMBER'),
            value: LicenceNumber
        },
        {
            title: translate('VEHICLES_INFORMATION.VEHICLE_TYPE'),
            value: Name
        }
    ];

    useEffect(() => {
        dispatch(getVehicleInfo(() => {
            setLoading(false);
        }));
    }, [dispatch]);

    return (
        <Box {...styles.content}>
            {loading ? <Loader/> : <Box textAlign="center" w="80%">
                <Icon as={FaCarSide} w={10} h={10} color="#a02c4ad6"/>
                <Grid gridTemplateColumns="repeat(2, 1fr)" textAlign="center">
                    {vehiclesInformation.map((item, index) =>
                        <Box key={index}>
                            <Text {...styles.title} {...styles.greyTitle} textAlign="center">
                                {item.title}
                            </Text>
                            <Text {...styles.subTitle}>
                                {item.value}
                            </Text>
                        </Box>
                    )}
                </Grid>
            </Box>}
        </Box>
    )
};
