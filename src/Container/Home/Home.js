import React, { useLayoutEffect, useRef } from 'react';
import { Box, Flex, Text, Input, InputGroup, Icon, InputLeftElement } from "@chakra-ui/react";
import styles from './Styles';
import { CgFacebook } from 'react-icons/cg';
import { MdEmail } from 'react-icons/md';
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

const barItems = [
    { label: "HOME", url: "/" },
    { label: "CONTACT_US", url: "/contact-us", type: "different-page" },
    { label: "LOGIN", url: "/account/signin", type: "different-page" }
];
function DownloadBadge() {
    return (
        <div>
            <div style={{ width: "100px", display: "inline-block", verticalAlign: "middle" }}>
                <img src={AppleBadge} style={{ padding: "8px" }} alt="android" />
            </div>
            <div style={{ width: "100px", display: "inline-block", verticalAlign: "middle" }}>
                <img src={GoogleBadge} alt="apple" />
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
    const pathname = location.pathname;
    useLayoutEffect(() => {
        if (location.hash) {
            refDownloadSection.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    })
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
                    <Box
                        w="55%"
                        p="2rem"
                        bgImage="linear-gradient(-55deg, transparent 26%, #eb6b9d 26%, #ee8c68 100%, #eb6b9d 43%)"
                    >
                        <Text textAlign="center" size="2xl">
                            Join Transporter team
                        </Text>
                        <Steps vertical current={5} className="my-steps">
                            <Steps.Item
                                icon={<DownloadSvg width="30px" height="30px" style={{ display: "inline-block" }} />}
                                title="Download Transporters app available on"
                                description={<DownloadBadge />}
                            />
                            <Steps.Item
                                icon={<MysterySvg width="30px" height="30px" style={{ display: "inline-block" }} />}
                                title="Check available orders"
                            />
                            <Steps.Item
                                icon={<MakeDeal width="30px" height="30px" style={{ display: "inline-block" }} />}
                                title="Make a deal"
                            />
                            <Steps.Item
                                icon={<WaitDeal width="30px" height="30px" style={{ display: "inline-block" }} />}
                                title="Wait for approval"
                            />
                            <Steps.Item
                                icon={<DeliverDeal width="30px" height="30px" style={{ display: "inline-block" }} />}
                                title="Deliver the order"
                            />
                        </Steps>

                    </Box>
                    <Box w="45%" p="2rem">
                        <Text textAlign="center" size="2xl">Join Client Team</Text>
                        <Steps vertical current={5} className="my-steps">
                            <Steps.Item
                                icon={<DownloadSvg width="30px" height="30px" style={{ display: "inline-block" }} />}
                                title="Download Client app available on"
                                description={<DownloadBadge />}
                            />
                            <Steps.Item
                                icon={<CreatePackageSvg width="30px" height="30px" style={{ display: "inline-block" }} />}
                                title="Create orders"
                            />
                            <Steps.Item
                                icon={<WaitSvg width="30px" height="30px" style={{ display: "inline-block" }} />}
                                title="Wait for deals" />
                            <Steps.Item
                                icon={<AcceptDealSvg width="30px" height="30px" style={{ display: "inline-block" }} />}
                                title="Accept a deal"
                            />
                            <Steps.Item
                                icon={<ThumbsUpSvg width="30px" height="30px" style={{ display: "inline-block" }} />}
                                title="Approve transferance"
                            />
                        </Steps>
                    </Box>
                </Flex>

                <Flex color="white" p="2rem" alignItems="center" id="contactus">
                    <Box w="40%">
                        <Text size="3xl">
                            Get in touch let us know about your thoughts and suggestions!
                        </Text>
                    </Box>
                    <Box flex="1" marginLeft="2rem">
                        <InputGroup id="email" marginBottom="10px">
                            <InputLeftElement
                                pointerEvents="none"
                                children={<EmailIcon color="gray.300" />}
                            />
                            <Input type="email" placeholder="Email address" />
                        </InputGroup>
                        <InputGroup marginBottom="10px">
                            <InputLeftElement
                                pointerEvents="none"
                                children={<PhoneIcon color="gray.300" />}
                            />
                            <Input type="tel" placeholder="Enter your phone number for later contact" />
                        </InputGroup>
                        <InputGroup marginBottom="10px">
                            <InputLeftElement
                                pointerEvents="none"
                                children={<QuestionIcon color="gray.300" />}
                            />
                            <Input type="text" placeholder="Enter your comments, ideas or questions here" />
                        </InputGroup>


                    </Box>
                </Flex>
                <Flex bgColor="white" p="2rem">
                    <Box marginY="auto">
                        <Text className="custom-link" onClick={() => {
                            history.push("/privacy-policy")
                        }}>Privacy Policy</Text>
                    </Box>
                    <Box marginLeft="auto">
                        <Text>Follow us</Text>
                        <Flex {...styles.contactHeaderContainer} className="contact-header">
                            <Icon as={CgFacebook} w={25} h={25} />
                            <Icon as={AiFillInstagram} w={25} h={25} />
                            <Icon as={AiFillPhone} w={25} h={25} />
                            <Icon as={MdEmail} w={25} h={25} />
                        </Flex>
                    </Box>
                </Flex>
            </Box>
        </>
    );
};
