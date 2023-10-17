import React, { useRef, useState } from "react";
import { useEffect } from "react";

import { Button, FormControl, Spinner } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { ActivateUser, ResendCode } from "../APIs/LoginAPIs";
import { setAuth } from "../Actions/GeneralActions";
import TogoContainer from "./TogoContainer";
import { useDispatch } from "react-redux";
import CryptoJS from "crypto-js";

export default function ActivationCodeForm(){
    const firstNumRef = useRef();
    const dispatch = useDispatch();
    const secNumRef = useRef();
    const thirdNumRef = useRef();
    const forthNumRef = useRef();
    const [disableResend, setDisableResend] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const history = useHistory();

    useEffect(()=>{
        let timer;
        if(disableResend){
            timer = setTimeout(()=>{
                setDisableResend(false)
            }, 60000);
        }
        return () => {
            clearTimeout(timer);
        }
    }, [disableResend]);

    return (
        <TogoContainer>
            <p>Please enter the activation code that was sent to Phone number {localStorage.getItem("PhoneNumber")}</p>
            <div className="d-flex justify-content-evenly my-3">
                <div className="togo-outling" style={{width: "44px"}}>
                    <FormControl
                        maxLength={1}
                        onInput={(ev)=>{
                            ev.target.value = ev.target.value.replace(/[^0-9]/gi, "");
                        }}
                        type="text"
                        className="rounded-circle text-center"
                        ref={firstNumRef}
                    />
                </div>
                <div className="togo-outling" style={{width: "44px"}}>
                    <FormControl
                        maxLength={1}
                        onInput={(ev)=>{
                            ev.target.value = ev.target.value.replace(/[^0-9]/gi, "");
                        }}
                        type="text"
                        className="rounded-circle text-center"
                        ref={secNumRef}
                    />
                </div>
                <div className="togo-outling" style={{width: "44px"}}>
                    <FormControl
                        maxLength={1}
                        onInput={(ev)=>{
                            ev.target.value = ev.target.value.replace(/[^0-9]/gi, "");
                        }}
                        type="text"
                        className="rounded-circle text-center"
                        ref={thirdNumRef}
                    />
                </div>
                <div className="togo-outling" style={{width: "44px"}}>
                    <FormControl
                        maxLength={1}
                        onInput={(ev)=>{
                            ev.target.value = ev.target.value.replace(/[^0-9]/gi, "");
                        }}
                        type="text"
                        className="rounded-circle text-center"
                        ref={forthNumRef}
                    />
                </div>
            </div>
            <div className="d-flex justify-content-between">
                <Button variant="" disabled={disableResend} onClick={()=>{
                    setDisableResend(true);
                    ResendCode().then(()=>{

                    });
                }}>
                    Resend code
                </Button>
                <Button variant="" onClick={()=>{
                    history.push("/login");
                }}>
                    Change mobile number
                </Button>
            </div>
            <div>
                <Button
                    variant=""
                    className="togo-button w-75 rounded-22"
                    disabled={loadingSubmit}
                    onClick={()=>{
                        setLoadingSubmit(true);
                        let code = `${firstNumRef.current.value}${secNumRef.current.value}${thirdNumRef.current.value}${forthNumRef.current.value}`;
                        const currentTime = +(new Date());
                        const hash = CryptoJS.SHA1(currentTime + "");
                        var shasum = CryptoJS.enc.Hex.stringify(hash);

                        ActivateUser(localStorage.getItem("RegPostCode") + localStorage.getItem("PhoneNumber"), code, shasum).then((res)=>{
                            const userInfo = res.data.server_response?.[0];

                            if(userInfo){
                                localStorage.setItem("userId", userInfo.id);
                                localStorage.setItem("TokenDevice", shasum);
                                localStorage.setItem("UserType", userInfo.IsClient === "1" ? "client" : "transporter");
                                dispatch(setAuth(true));
                            }
                            if(userInfo.FlagRegistration === "ClientPersonalInfo"){ //"ClientRegistration"
                                history.push("/personal-info");
                                return;
                            }
                            //TransporterPersonalInfo
                            //TrsnsporterCarInfo
                            //TransporterWorkCityInfo
                            //TransporterWorkTimeInfo
                            //TransporterCompletedRegistration
                            
                            // localStorage.setItem("IsTransporterMaster", response.data.ResultArray[0].IsTransporterMaster);
                            // localStorage.setItem("IsTeamMember", response.data.ResultArray[0].IsTeamMember)
                            setLoadingSubmit(false);
                            history.push("/dashboard");
                        })
                    }}
                >
                    {loadingSubmit && <Spinner animation="border" size="sm"/>}
                    Accept
                </Button>
            </div>
        </TogoContainer>
    )
}
