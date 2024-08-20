import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import "./Header.css";
import {
    Menu,
    Button,
    MenuButton,
    MenuList,
    MenuItem,
    Box,
    Icon,
    Text,
    Flex,
    Image
} from "@chakra-ui/react";
import { SettingsIcon } from '@chakra-ui/icons';
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { IoIosWallet, IoIosCard, IoMdPerson, IoIosExit, IoMdGitNetwork } from 'react-icons/io';
import { FaUsersGear } from 'react-icons/fa6';
import { MdOutlinePriceCheck } from 'react-icons/md';
import { IoCaretBack } from 'react-icons/io5';
import { AiFillHome } from 'react-icons/ai';
import { RiTeamFill } from 'react-icons/ri';
import { FaBoxes } from 'react-icons/fa';
import { Link } from "react-router-dom";
import { getWallet, updateWebNotificationToken, getViewBalalnce, getTransporterStatById } from "../../APIs/ProfileAPIs";
import { getTotalOrdersNum } from "../../APIs/OrdersAPIs";
import { setWallet, toastMessage } from "../../Actions/GeneralActions";
import { LOGOUT } from "../../Actions/ActionsTypes";
import whiteLogo from '../../assets/whiteLogo.png';
import phoenixLogo from '../../assets/phoenix_logo_white.png';
import person_img_placeholder from '../../assets/person_img_placeholder.jpg';
import translate from "../../i18n/translate";
import LanguageSelector from "../LanguageSelector/LanguageSelector";
import Loader from "../Loader/Loader";

import CustomDropDown from '../CustomDropDown';
import { FaWallet } from 'react-icons/fa'

import { CreateNewOrder } from "../CreateNewOrder"; /* edited (new import) */
import { isTransporter } from "../../Util"; /* edited (new import) */
import { useLocation } from "react-router"; /* edited (new import) */

import { getPersonalInfo } from "../../Actions/ProfileActions"; /* edited (new import) */

import { apiUrl } from "../../Constants/GeneralCont";

import { io } from "socket.io-client";

import { HiOutlineDotsHorizontal } from 'react-icons/hi';


const styles = {
    settingsButton: {
        variant: "ghost",
        size: "lg",
        iconSpacing: 0,
        lineHeight: "0.2",
        _active: {
            background: "none",
            transform: "scale(1.3)",
            color: "black",
            opacity: "0.5"
        },
        _hover: { transform: "scale(1.3)" },
        _focus: { outline: "none" }
    },
    actionsContainer: {
        position: "absolute",
        top: "1rem",
        right: "1rem",
        alignItems: "center",
        background: "#00000036",
        borderRadius: "29px"
    },
    headerItemsContainer: {
        alignItems: "center",
        cursor: "pointer",
        px: "1.5rem",
        _hover: {
            transform: "scale(1.1)",
            underline: "unset",
        }
    },
    horizontalBreakLine: {
        w: "3px",
        h: "20px",
        bgColor: "white",
        borderRadius: 999,
        opacity: 0.5
    },
    link: {
        color: "white",
        textDecoration: "none"
    },
    backBtnContainer: {
        position: "absolute",
        left: "1rem",
        top: "1rem",
        alignItems: "center",
        pt: "0.2rem"
    },
    logo: {
        position: "absolute",
        top: "40%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        _hover: {
            opacity: 0.5,
            transform: "scale(1.2) translate(-40%, -40%)"
        }
    },
    headerStyle: {
        position: "relative",
        background: (localStorage.getItem("transId") == "178" && !!!localStorage.getItem("transId")) ? "#129CD5" : "linear-gradient(to left, #26A69A,#69D4A5)",
        color: "#fff",
        textAlign: "center",
        padding: "40px 0",
        height: "140px",
        direction: "ltr"
    },
    addNewOrderContainer: { /* edited (position 'Create New Order') button container */
        position: "absolute",
        bottom: "1rem",
        right: "1rem",
        alignItems: "center",
        zIndex: "1"
    },
    customerType: {
        position: "absolute",
        bottom: "1rem",
        right: "0",
        left: "0",
        fontSize: "1.5rem",
        zIndex: "0"
    },
    nameDisplay: {
        position: "absolute",
        bottom: "1rem",
        right: "1rem",
        fontSize: "1rem",
    }
};

function Header({/* socket */ }) {

    /* edited (fetch full-name to current user's name in the header) */

    /*console.log(localStorage.getItem("fullName"))

    const [loaded, setLoaded] = useState(false);

    let dispatch = useDispatch();
    const {FullName} = useSelector(state => state.profile.personalInfo);
    const [loading, setLoading] = useState(true);
    const isTransporterVal = isTransporter();

    useEffect(() => {
        dispatch(getPersonalInfo(() => {
            setLoading(false);
        }));
    }, [loaded]);

    const name = FullName;*/

    /* edited (to greet the user) */

    let myDate = new Date();
    let hrs = myDate.getHours();

    let greet;

    if (hrs < 12)
        greet = 'Good Morning';
    else if (hrs >= 12 && hrs <= 17)
        greet = 'Good Afternoon';
    else if (hrs >= 17 && hrs <= 24)
        greet = 'Good Evening';

    // const location = useLocation(); /* edited (use useLocation) */

    const authenticated = useSelector(state => state.general.authenticated);
    //const [wallet, setWallet] = useState(null);
    const wallet = useSelector(state => state.general.wallet);
    const history = useHistory();
    const [isHomePage, setIsHomePage] = useState(history.location.pathname === '/orders' || history.location.pathname === '/');
    let dispatch = useDispatch();

    const [totalOrdersNum, setTotalOrdersNum] = useState(0);

    const [openProfileDialog, setOpenProfileDialog] = useState(false);
    const [openStatsDialog, setOpenStatsDialog] = useState(false);
    const [transporterStats, setTransporterStats] = useState({});

    const [profileDropList, setProfileDropList] = useState([
        { id: 1, text: "Profile Settings", iconClass: "bi bi-gear-fill me-2", link: "profile", action: "profile" },
        { id: 2, text: "Log Out", iconClass: "bi bi-box-arrow-right me-2", action: "logout" },
    ]);

    const handleOpenProfileDropdown = () => {
        setOpenProfileDialog(!openProfileDialog);
    }

    const actionHandler = (action, link) => {
        if (action === "logout") {
            alert("Log Out");
        } else if (action === "profile") {

            clearNavs();

            history.push("/account/" + link);
        }

        handleOpenProfileDropdown();
    }

    const handleLogout = () => {
        // document.title = "TOGO"; /* edited (change document title to TOGO) */

        dispatch({
            type: LOGOUT
        });

        /*  const socket = io("http://togo.ps:5000");
         socket.emit("logout", localStorage.getItem("userId"), localStorage.getItem("UserType"));
         // console.log(socket) */

        updateWebNotificationToken(null).then((res) => {
            console.log(res.data);
        })

        localStorage.removeItem("userId");
        localStorage.removeItem("fullName");
        localStorage.removeItem("TokenDevice");
        localStorage.removeItem("UserType");

        history.push("/");
    };

    useEffect(() => {
        getTotalOrdersNum().then((res) => {
            setTotalOrdersNum(res.data.ordersNum);
        })
    }, [authenticated, dispatch])

    useEffect(() => {
        /*setLoaded(!loaded);*/
        if (authenticated) {
            /* localStorage.getItem("userId") != 41 */ /* isTransporter() */ true ? 
            getWallet().then(({ data: { server_response } }) => {
                dispatch(setWallet(server_response[0].TransporterBalance));
            }).catch(err => {
                dispatch(toastMessage(err));
            })
            :
            getViewBalalnce().then((res) => {
                dispatch(setWallet(res.data.balance));
            }).catch(err => {
                dispatch(toastMessage(err));
            })
            getTransporterStatById().then(({ data: { transporters } }) => {
                console.log({transporters})
                setTransporterStats(transporters)
            })
        }
        return () => setWallet(null);
    }, [authenticated, dispatch]);

    useEffect(() => {
        let historyUnListen = history.listen(location => {
            setIsHomePage(location.pathname === '/account/orders' || location.pathname === '/');
            // console.log("routed");
        });
        return () => historyUnListen();
    }, [history]);

    return (
        <>{localStorage.getItem("userId") == 255 ?
            <div className="custom-header">
                <div className="left">
                    <div onClick={() => { history.goBack() }}>
                        <div className="icon"><IoCaretBack /></div>
                        <span>{translate("HEADER.BACK")}</span>
                    </div>
                    <div onClick={() => { history.push("/account/main/all-orders") }}>
                        <div className="icon"><AiFillHome /></div>
                        <span>{translate("HEADER.HOME")}</span>
                    </div>
                </div>
                <div className="center">
                    <div>
                        <img src={whiteLogo} className="logo-img" />
                        <span className="client-type">{isTransporter() === true ? 'Transporter' : 'Client'}</span>
                    </div>
                </div>
                <div className="right">
                    <div>
                        <div className="wallet">
                            <FaWallet /> {isNaN(wallet) ? <Loader color="white" width="40px" height="40px" /> : <Text fontSize="14px">{wallet} NIS</Text>}
                        </div>
                        <div style={{ backgroundColor: openProfileDialog ? "#3CB49C" : "white", transform: openProfileDialog ? "scale(1.1)" : "" }} className='profile-img'>
                            <img src={person_img_placeholder} alt="" onClick={handleOpenProfileDropdown} />
                            {openProfileDialog && <div className="close-div"></div>}
                        </div>
                    </div>
                </div>
            </div>
            :
            <header style={styles.headerStyle} className="togo-header" >
                {authenticated && (
                    <Box>
                        {/* edited (display name) */}
                        <div className="d-flex justify-content-between" style={styles.nameDisplay}>
                            {greet === "Good Morning" ? <svg style={{ marginTop: "2px", marginRight: "5px", color: "yellow" }} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-brightness-high" viewBox="0 0 16 16">
                                <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z" />
                            </svg> : greet === "Good Afternoon" ? <svg style={{ marginTop: "2px", marginRight: "5px", color: "orange" }} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-brightness-alt-high" viewBox="0 0 16 16">
                                <path d="M8 3a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 3zm8 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zm-13.5.5a.5.5 0 0 0 0-1h-2a.5.5 0 0 0 0 1h2zm11.157-6.157a.5.5 0 0 1 0 .707l-1.414 1.414a.5.5 0 1 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm-9.9 2.121a.5.5 0 0 0 .707-.707L3.05 5.343a.5.5 0 1 0-.707.707l1.414 1.414zM8 7a4 4 0 0 0-4 4 .5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5 4 4 0 0 0-4-4zm0 1a3 3 0 0 1 2.959 2.5H5.04A3 3 0 0 1 8 8z" />
                            </svg> : <svg style={{ marginTop: "2px", marginRight: "5px", color: "blue" }} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-moon-stars" viewBox="0 0 16 16">
                                <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278zM4.858 1.311A7.269 7.269 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.316 7.316 0 0 0 5.205-2.162c-.337.042-.68.063-1.029.063-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286z" />
                                <path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z" />
                            </svg>}
                            {greet}
                            <span style={{ fontWeight: "lighter", marginRight: "10px", marginLeft: "10px" }}>
                                {/*PersonalDetailsOut()[0].value*/}
                                {/* {localStorage.getItem("fullName")} */}
                            </span>
                        </div>
                        {!isHomePage && <Flex {...styles.backBtnContainer}>
                            {/* {toggleBack === "back" && <Flex {...styles.headerItemsContainer} onClick={() => { history.goBack() }}>
                            <Icon as={IoCaretBack} mr={2} fontSize="2xl" />
                            <Text>{translate("HEADER.BACK")}</Text>
                        </Flex>}
                        {toggleBack === "home" && <Flex {...styles.headerItemsContainer} onClick={() => { history.push("/account/main/all-orders"); changeBack("back") }}>
                            <Icon as={AiFillHome} mr={2} fontSize="2xl" />
                            <Text>{translate("HEADER.HOME")}</Text>
                        </Flex>} */}
                            <Flex {...styles.headerItemsContainer} onClick={() => { history.goBack() }}>
                                <Icon as={IoCaretBack} mr={2} fontSize="2xl" />
                                <Text>{translate("HEADER.BACK")}</Text>
                            </Flex>
                            <Flex {...styles.headerItemsContainer} onClick={() => { history.push("/account/main/all-orders") }}>
                                <Icon as={AiFillHome} mr={2} fontSize="2xl" />
                                <Text>{translate("HEADER.HOME")}</Text>
                            </Flex>
                        </Flex>}
                        <Flex {...styles.actionsContainer}>
                            <Flex {...styles.headerItemsContainer} onClick={() => isTransporter() ? setOpenStatsDialog(true) : null}>
                                <Icon as={FaBoxes} mr={2} fontSize="2xl" />
                                <Text>{translate("HEADER.TOTAL_ORDERS")}: {totalOrdersNum}</Text>
                            </Flex>
                            <Box {...styles.horizontalBreakLine} />
                            {localStorage.getItem("userId") != 97 && localStorage.getItem("userId") != 361 && <Link to='/account/financial-management' style={styles.link}>
                                <Flex {...styles.headerItemsContainer}>
                                    <Icon as={IoIosWallet} fontSize="2xl" />
                                    {isNaN(wallet) ? <Loader color="white" width="40px" height="40px" /> : <Text fontSize="14px">{wallet} NIS</Text>}
                                </Flex>
                            </Link>}
                            <Box {...styles.horizontalBreakLine} />
                            <LanguageSelector />
                            <Box {...styles.horizontalBreakLine} />
                            <Menu>
                                <MenuButton {...styles.settingsButton} as={Button} rightIcon={<HiOutlineDotsHorizontal />} />
                                <MenuList style={{ position: "relative", zIndex: "2" }} color="black">
                                    <MenuItem icon={<IoMdPerson />}
                                        onClick={() => { history.push("/account/account-details") }}>{translate("HEADER.ACCOUNT_PROFILE")}</MenuItem>
                                    {isTransporter() && <MenuItem icon={<MdOutlinePriceCheck />}
                                        onClick={() => { history.push("/account/cities-prices") }}>{translate("HEADER.CITIES_PRICES")}</MenuItem>}
                                    <MenuItem icon={<IoMdGitNetwork />}
                                        onClick={() => { history.push("/account/my-network") }}>{translate("NETWORK.NETWORK_TITLE")}</MenuItem>
                                    {!isTransporter() && localStorage.getItem("userId") != 361 && <MenuItem icon={<IoMdGitNetwork />}
                                        onClick={() => { history.push("/account/my-users") }}>{translate("HEADER.MANAGE_SUBUSERS")}</MenuItem>}
                                    {/* {localStorage.getItem("userId") == "40" && <MenuItem icon={<RiTeamFill />}
                                    onClick={() => { history.push("/account/team-admin") }}>{translate("TEMP.MANAGE_TEAMS")}</MenuItem>} */}
                                   {localStorage.getItem("userId") != 361 && <MenuItem icon={<IoIosCard />}
                                        onClick={() => history.push("/account/financial-management")}>{translate("HEADER.REQUEST_WITHDRAWAL")}</MenuItem>}
                                    {isTransporter() && <MenuItem icon={<FaUsersGear />}
                                        onClick={() => history.push("/account/manage-clients")}>{translate("HEADER.MANAGE_CLIENTS")}</MenuItem>}
                                    <MenuItem icon={<IoIosExit />}
                                        onClick={handleLogout}>{translate("HEADER.LOGOUT")}</MenuItem>
                                </MenuList>
                            </Menu>
                        </Flex>
                        {/* edited (on-header "CreateNewOrder" button commented) */}
                        {/* edited (add 'Create New Order' button container) */}
                        {/*location.state?.currentPage === undefined && location.state?.currentPage !== "all-orders" && isTransporter() && <Flex {...styles.addNewOrderContainer}>
                        <CreateNewOrder />
                    </Flex>*/}
                        {<span style={styles.customerType}>{isTransporter() === true ? 'Transporter' : 'Client'}</span>}
                    </Box>
                )
                }
                <Link to="/">
                    <Image
                        {...styles.logo}
                        src={(localStorage.getItem("transId") == "178" && !!!localStorage.getItem("transId")) ? phoenixLogo : whiteLogo}
                        w={100} />
                </Link>
            </header >
        }
            {openProfileDialog && <CustomDropDown dropList={profileDropList} x_pos={15} y_pos={70} fromDirection="right" close={handleOpenProfileDropdown} action={(action, link) => { actionHandler(action, link) }} />}
            {openStatsDialog && <Modal show={openStatsDialog} onHide={() => setOpenStatsDialog(false)} contentClassName="togo-button">
                
                {/* <Modal.Header>
                    <h1><strong>Transporter Stats</strong></h1>
                </Modal.Header> */}

                <Modal.Body>
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: "black", background: "white" }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Total Active Orders</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Total Active COD</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Loan Balance</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>To Pay</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transporterStats.length ? transporterStats.map((transporter) => (
                            <tr key={transporter.id}>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{transporter.orders_count}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{transporter.total_cod}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{transporter.loan_balance}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{transporter.loan_balance - transporter.total_cod - transporter.balance}</td>
                            </tr>
                            )) : null}
                        </tbody>
                    </table>
                </Modal.Body>

                <Modal.Footer className="justify-content-center border-0 pt-0">
                    <Button variant="secondary" className="border rounded-22 togo-button" onClick={() => setOpenStatsDialog(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>}
        </>
    );
}

export default Header;
