import React, { useLayoutEffect, useRef, useState } from 'react';
import { Box, Flex, Text, Input, InputGroup, Icon, InputLeftElement, Image } from "@chakra-ui/react";
import styles from './Styles';
import { CgFacebook } from 'react-icons/cg';
import { MdEmail, MdPhone } from 'react-icons/md';
import { AiFillInstagram, AiFillPhone } from 'react-icons/ai';
import { useHistory, useLocation } from "react-router-dom";

import { ReactComponent as MapSvg } from "../../assets/images/map.svg";
import { ReactComponent as ShippedSvg } from "../../assets/images/shipped.svg";
import { ReactComponent as FastSvg } from "../../assets/images/fast-delivery.svg";
import { ReactComponent as BoxSvg } from "../../assets/images/box.svg";
import GoogleBadge from "../../assets/images/google-play-badge.png";
import { ReactComponent as TrackingSvg } from "../../assets/images/tracking.svg";
import AppleBadge from "../../assets/images/Download_on_the_App_Store_Badge_US-UK_RGB_blk_092917.svg";
import { ReactComponent as UsherSvg } from "../../assets/images/usher.svg";
import { ReactComponent as DownloadSvg } from "../../assets/images/smartphone.svg";
import { ReactComponent as MysterySvg } from "../../assets/images/mystery.svg";
import { ReactComponent as WaitSvg } from "../../assets/images/waiting.svg";
import { ReactComponent as AcceptDealSvg } from "../../assets/images/high-five.svg";
import { ReactComponent as DeliverDeal } from "../../assets/images/tick-box-delivery.svg";
import { ReactComponent as MakeDeal } from "../../assets/images/deal.svg";
import { ReactComponent as WaitDeal } from "../../assets/images/delivery-package.svg";
import { ReactComponent as ThumbsUpSvg } from "../../assets/images/thumbs-up.svg";
import { ReactComponent as CreatePackageSvg } from "../../assets/images/package.svg";
import Steps from 'rsuite/Steps';
import 'rsuite/dist/rsuite.min.css';
import './Home.css';
import { EmailIcon, PhoneIcon, QuestionIcon } from '@chakra-ui/icons';
import whiteLogo from '../../assets/whiteLogo.png';
import translate from '../../i18n/translate';
import LanguageSelector from '../../components/LanguageSelector/LanguageSelector';
import visa_logo from "../../assets/images/visa-mastercard.png";
import { Modal } from 'react-bootstrap';

const barItems = [
    { label: "HOME", url: "/" },
    { label: "CONTACT_US", url: "/contact-us", type: "different-page" },
    { label: "LOGIN", url: "/account/signin", type: "different-page" }
];
function DownloadBadge() {
    return (
        <div>
            <div style={{ /* width: "100px", */ display: "inline-block", verticalAlign: "middle" }}>
                <a href='https://apps.apple.com/us/app/togo-client/id1672008247' target='_blank'>
                    <img src={AppleBadge} height={150} width={120} style={{ padding: "8px" }} alt="android" />
                </a>
            </div>
            <div style={{ /* width: "100px", */ display: "inline-block", verticalAlign: "middle" }}>
                <a href='https://play.google.com/store/apps/details?id=pal.client.pal.togo_client&pcampaignid=web_share' target='_blank'>
                    <img src={GoogleBadge} height={150} width={120} alt="apple" />
                </a>
            </div>
        </div>
    )
}
export default function Home() {


    const history = useHistory();
    const refDownloadSection = useRef();
    const handleNavigation = (url, type) => {
        if (type === "different-page") {
            history.push(url);
        } else {

        }
    };
    const location = useLocation();
    const [showRefundModal, setShowRefundModal] = useState(false);
    const pathname = location.pathname;
    useLayoutEffect(() => {
        if (location.hash) {
            refDownloadSection.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    })
    const stepsIconWidth = "80px", stepsIconHeight = "80px";
    return (
        <>
            <Flex {...styles.barContainer}>
                <Flex w="100%" alignItems="center">
                    <img src={whiteLogo} alt="home" style={{ width: "60px", filter: "brightness(0)" }} />
                    {barItems.map(({ label, url, type }, index) => {

                        return (
                            <Box key={label} {...styles.menubarItem} {...(pathname === url ? styles.menubarItemActive : {})} >
                                <Box
                                    {...styles.menubarItemDiv}
                                    //mx={10}
                                    onClick={() => handleNavigation(url, type)}>
                                    {translate("NAV." + label)}
                                </Box>
                            </Box>);
                    })}
                </Flex>
                <Box>
                    <LanguageSelector />
                </Box>
            </Flex>
            <Box {...styles.mainContainer} overflow="auto">
                <Flex
                    color="white"
                    p="2rem"
                    bgColor="#abe9cd"
                    textAlign="center"
                    alignItems="center"
                    bgImage="linear-gradient(to left, #26A69A,#69D4A5)"
                    h="300px"
                >
                    <Box>
                        <UsherSvg width="250px" height="250px" />
                    </Box>
                    <Box pl="3rem">
                        <Text fontSize="3xl">
                            {translate("HOME.MAIN_HEADER_TEXT")}
                            <span style={{ color: "#ffea92" }}>
                                {translate("HOME.MAIN_HEADER_SUB_TEXT")}
                            </span>
                        </Text>
                    </Box>
                </Flex>

                <Flex bgColor="white" textAlign="center" p="2rem">
                    <Box w="20%">
                        <MapSvg width="100px" height="100px" style={{ margin: "auto" }} />
                        {translate("HOME.DETAIL_ONE")}
                    </Box>
                    <Box w="20%">
                        <TrackingSvg width="100px" height="100px" style={{ margin: "auto" }} />
                        {translate("HOME.DETAIL_TWO")}
                    </Box>
                    <Box w="20%">
                        <ShippedSvg width="100px" height="100px" style={{ margin: "auto" }} />
                        {translate("HOME.DETAIL_THREE")}
                        {/* "المزيد من الخدمات موجوده على تطبيقنا التي توقر عليك الوقت" */}
                    </Box>
                    <Box w="20%">
                        <BoxSvg width="100px" height="100px" style={{ margin: "auto" }} />
                        {translate("HOME.DETAIL_FOUR")}
                    </Box>
                    <Box w="20%">
                        <FastSvg width="100px" height="100px" style={{ margin: "auto" }} />
                        {translate("HOME.DETAIL_FIVE")}
                    </Box>
                </Flex>

                <Flex color="white" bgColor="#abe9cd" id="testdownload" ref={refDownloadSection}
                    bgImage="linear-gradient(315deg, #abe9cd 0%, #3eadcf 74%)">

                    <Box w="100%" /* marginInline="3%" */ className="mainBox">
                        <Steps horizontal current={5} className="my-steps"  >
                            <Steps.Item
                                icon={<DownloadSvg width={stepsIconWidth} height={stepsIconHeight} id="firstIcon" />}
                                title="Download Client app available on"
                                description={ <DownloadBadge />}
                            />
                          
                           
                            <Steps.Item
                                icon={<CreatePackageSvg width={stepsIconWidth} height={stepsIconHeight} />}
                                title="Create orders"

                            />
                            <Steps.Item
                                icon={<WaitSvg width={stepsIconWidth} height={stepsIconHeight} /* style={{ display: "inline-block" }}  */ />}
                                title="Wait for deals" />
                            <Steps.Item
                                icon={<AcceptDealSvg width={stepsIconWidth} height={stepsIconHeight} /* style={{ display: "inline-block" }} */ />}
                                title="Accept a deal"
                            />
                            <Steps.Item
                                icon={<ThumbsUpSvg width={stepsIconWidth} height={stepsIconHeight} /* style={{ display: "inline-block" }} */ />}
                                title="Approve transferance"
                            />

                        </Steps>
                    </Box>
                </Flex>

                <Flex bgColor="white" p="10px">
                    <Box marginY="auto">
                        <Text className="custom-link" onClick={() => {
                            history.push("/privacy-policy")
                        }}>{translate("HOME.PRIVACY_POLICY")}</Text>
                    </Box>
                    <Box marginY="auto"  >
                        <Text style={{ marginInline: "40px" }} className="custom-link" onClick={() => {
                            //  history.push("/privacy-policy")
                            setShowRefundModal(true)
                        }}>{translate("HOME.RETURN_POLICY")}</Text>
                    </Box>
                    <Box>
                        <Image src={visa_logo} alt="Visa Logo" width={200} height={100} />
                    </Box>
                    <Box marginY="auto" display={"flex"} justifyContent={"center"} alignItems={"center"} >
                        <Icon as={MdEmail} w={25} h={25} />

                        <Text style={{ fontSize: "1rem" }}>Info@togo.ps</Text>
                    </Box>

                    <Box marginY="auto" style={{ marginInline: "40px" }} display={"flex"} justifyContent={"center"} alignItems={"center"} >
                        <Icon as={MdPhone} w={25} h={25} />

                        <Text style={{ fontSize: "1rem" }}>0562900322</Text>
                    </Box>


                    {<Box marginY="auto">
                        <Flex {...styles.contactHeaderContainer} className="contact-header">
                            {/* <Text  style={{fontSize: "1rem" ,}}>Follow us</Text> */}
                            <a href="#" target="_blank" style={{ marginInlineEnd: "30px" }}>
                                <Icon as={CgFacebook} w={25} h={25} />
                            </a>
                            <a href='https://www.instagram.com/togo_delivery_pal?igsh=bHJ4bjNkaHFnaGc1' target='_blank'>
                                <Icon as={AiFillInstagram} w={25} h={25} />
                            </a>
                            {/* <Icon as={AiFillPhone} w={25} h={25} /> */}
                            {/* <Icon as={MdEmail} w={25} h={25} /> */}
                        </Flex>
                    </Box>}
                </Flex>
                <Modal show={showRefundModal} centered onHide={() => {
                    setShowRefundModal(false)
                }}>
                    <Modal.Header>
                        <h6 className='display-6'>{translate("HOME.RETURN_POLICY")}</h6>
                    </Modal.Header>
                    <Modal.Body>
                        <p>{translate("HOME.RETURN_POLICY_CONTENT")}</p>
                    </Modal.Body>

                </Modal>
            </Box>
        </>
    );
};
