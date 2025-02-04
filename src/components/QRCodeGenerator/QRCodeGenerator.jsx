import React, { Component } from "react";
import "./QRCodeGenerator.css";
import { getAuthenticationQR } from "../../APIs/AuthenticationAPIs";

import { checkAccess } from "../../Actions/authenticationActions";
import { connect } from "react-redux";
import AuthOne from '../../assets/images/auth1.jpg';
import AuthTOW from '../../assets/images/auth2.jpg';
import { Image, ListGroup, Accordion, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

import { refreshPage } from "../../Functions/CommonFunctions";

var QRCode = require("qrcode.react");

class QRCodeGenerator extends Component {
    state = { qrUUID: null };

    getAuthenticationQR = () => {
        getAuthenticationQR().then((qrUUID) => {
            
            this.setState({
                qrUUID,
            });
        });
    };

    componentDidMount = () => {
        let { history, checkAccess } = this.props;

        this.getAuthenticationQR();
        this.qrCodeGeneratorInterval = setInterval(
            this.getAuthenticationQR,
            300000000
        );
        this.checkSuccessInterval = setInterval(() => {
            checkAccess(this.state.qrUUID.trim()).then((res) => {
                
                res && history.push("/account/main/");
                // res && console.log("logged in !!!!!!!!!!!!");
                // res && refreshPage();
            });
        }, 5000);
    };

    componentWillUnmount = () => {
        clearInterval(this.qrCodeGeneratorInterval);
        clearInterval(this.checkSuccessInterval);
    };

    render() {
        let { qrUUID } = this.state;
        return (
            <div style={{ position: "relative" }}>
                <div className="upperBackground"></div>
                <Card className="main-card shadow rounded-22 pb-5">
                    <Card.Body>
                        <div className="d-flex justify-content-evenly p-2 w-100 w-75">

                            <Accordion defaultActiveKey="0" style={{ width: "40%" }} className="mt-5">
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>1. Get Started</Accordion.Header>
                                    <Accordion.Body>
                                        <span>Have you got the app ? if not please download from </span>
                                        <Link to="/#testdownload" style={{ color: "#0d6efd" }}>here</Link>
                                    </Accordion.Body>
                                </Accordion.Item>
                                <Accordion.Item eventKey="1">
                                    <Accordion.Header>2. Register an account</Accordion.Header>
                                    <Accordion.Body>
                                        <ListGroup as="ol" numbered variant="flush">
                                            <ListGroup.Item as="li">
                                                Choose your language
                                            </ListGroup.Item>
                                            <ListGroup.Item as="li">
                                                Check TOGO privacy agreement
                                            </ListGroup.Item>
                                            <ListGroup.Item as="li">
                                                Enter your mobile number and create your account
                                            </ListGroup.Item>
                                        </ListGroup>
                                    </Accordion.Body>
                                </Accordion.Item>
                                <Accordion.Item eventKey="2">
                                    <Accordion.Header>3. Click on user icon</Accordion.Header>
                                    <Accordion.Body>
                                        <Image src={AuthOne} alt="stepone" rounded className="m-auto" style={{ maxWidth: "210px" }} />
                                    </Accordion.Body>
                                </Accordion.Item>
                                <Accordion.Item eventKey="3">
                                    <Accordion.Header>4. Select scan bar code</Accordion.Header>
                                    <Accordion.Body>
                                        <Image src={AuthTOW} alt="steptwo" rounded className="m-auto" style={{ maxWidth: "210px", }} />
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>

                            {qrUUID && (
                                <div style={{ position: "relative" }}>
                                    <div className="qr-code-canvas">
                                        <QRCode
                                            value={qrUUID}
                                            size={256}
                                            //fgColor="green"
                                            imageSettings={{
                                                //src: whiteLogo,
                                                height: 30 * 256 / 100,
                                                width: 30 * 256 / 100,
                                                excavate: false
                                            }}
                                        //includeMargin={true}
                                        />
                                    </div>
                                    <div className="login-num">
                                        <Button className="btn-grad" onClick={() => { window.location.href = '/account/loginByPhoneNumber'; }}>
                                            Login With Mobile Number
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card.Body>
                </Card>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
    checkAccess: (qrUUID) => dispatch(checkAccess(qrUUID))
});

export default connect(mapStateToProps, mapDispatchToProps)(QRCodeGenerator);
