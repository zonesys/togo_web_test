import React, {useEffect, useState} from 'react';
import {Flex, Image, Text, Box} from "@chakra-ui/react";
import {getWallet} from "../../APIs/ProfileAPIs";
import {setWallet, toastMessage} from "../../Actions/GeneralActions";
import {useDispatch, useSelector} from "react-redux";
import styles from './Styles';
import walletImage from '../../assets/wallet.png';
import Loader from "../../components/Loader/Loader";
import translate from "../../i18n/translate";

export default function WalletContainer() {
    const wallet = useSelector(state => state.general.wallet);
    const dispatch = useDispatch();
    const [loading, ] = useState(true);

    useEffect(() => {
        let interval = null;
        let currentWallet = 0;

        getWallet().then(({data: {server_response}}) => {
            let wallet = server_response[0].TransporterBalance;
            interval = setInterval(() => {
                if (!(currentWallet >= wallet)) {
                    currentWallet += (wallet / 7);
                    dispatch(setWallet(currentWallet.toFixed(2)));
                } else {
                    dispatch(setWallet(wallet));
                    clearInterval(interval);
                }
            }, 100);
        }).catch(err => {
            dispatch(toastMessage(err));
        }).finally(() => {
            //setLoading(false);
        });

        return () => clearInterval(interval);
    }, [dispatch]);

    return (
        <Flex {...styles.container} style={{direction: "ltr"}}>
            <Flex alignItems="center" position="relative">
                <Image
                    src={walletImage}
                    w={300}
                    position="fixed"
                    zIndex={1}
                />
                <Box {...styles.balanceContainer}>
                    {loading ? <Loader/> : (
                        <>
                            <Text {...styles.title}>{translate("WALLET.BALANCE")}</Text>
                            <Text {...styles.balance}>{wallet}</Text>
                        </>
                    )}
                </Box>
            </Flex>
        </Flex>
    );
};
