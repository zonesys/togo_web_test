import React, { useRef, useState } from "react"
import { useEffect } from "react";
import { Button, Dropdown, Form, FormControl, InputGroup, Spinner } from "react-bootstrap";
import { GetCountryCode, LoginUser } from "../APIs/LoginAPIs";
import TogoContainer from "./TogoContainer";
import locicon from "../assets/locationn.png";
import { useHistory } from "react-router-dom";

export default function Login(){
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [countryCodes, setCountryCodes] = useState([]);
    const [selectedCountryCode, setSelectedCountryCode] = useState();
    const history = useHistory();
    const phoneRef = useRef();
    
    useEffect(()=>{
        GetCountryCode().then((res)=>{
            setCountryCodes(res.data.server_response);
            setSelectedCountryCode(res.data.server_response[0]);
            localStorage.setItem("RegId", res.data.server_response[0].regId);
            localStorage.setItem("RegPostCode", res.data.server_response[0].postValue);
        });
    }, []);
    
    return (
        <TogoContainer>
            <div className="togo-outling">
                <Dropdown 
                    className="rounded-22 bg-white" 
                    onSelect={(eve)=>{
                        setSelectedCountryCode(countryCodes[eve]);
                        localStorage.setItem("RegId", countryCodes[eve].regId);
                        localStorage.setItem("RegPostCode", countryCodes[eve].postValue);
                    }}
                >
                    <Dropdown.Toggle variant="" className="w-100 text-start d-flex align-items-center shadow-none">
                        <img src={locicon} style={{width: "24px", height: "24px"}} className="me-1" alt="worldicon" />
                        <div style={{width: "97%"}}>    
                            {`${selectedCountryCode?.regName} (${selectedCountryCode?.postValue})`}
                        </div>
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="w-100">
                        {countryCodes.map((country, index)=>{
                            return (
                                <Dropdown.Item eventKey={index} key={index} className="d-flex">
                                    {`${country.regName} (${country.postValue})`}
                                </Dropdown.Item>
                            )
                        })}
                        
                    </Dropdown.Menu>
                </Dropdown>
            </div>

            <Form.Group controlId="formGridEmail" className="m-inline-e-2">
                <Form.Label>Enter mobile number</Form.Label>
                <InputGroup className="mb-2 togo-outling">

                    <FormControl 
                        maxLength={9}
                        onInput={(ev)=>{
                            ev.target.value = ev.target.value.replace(/[^0-9]/gi, "");
                        }} 
                        type="text" 
                        className="bg-white rounded-22"
                        ref={phoneRef} 
                    />
                    
                </InputGroup>
                
            </Form.Group>

            Activation code will be sent to your mobileNumber

            <Button
                variant="" 
                className="togo-button w-75 rounded-22" 
                disabled={loadingSubmit}
                onClick={()=>{
                    let phoneNumber = phoneRef.current.value;
                    if(phoneNumber.length === 9){
                        setLoadingSubmit(true);
                        LoginUser(localStorage.getItem("RegPostCode") + phoneRef.current.value).then((res)=>{
                            localStorage.setItem("PhoneNumber", phoneNumber);
                            setLoadingSubmit(false);
                            history.push("/activate");
                        })
                    }
                }}
            >
                {loadingSubmit && <Spinner animation="border" size="sm"/>} 
                Send
            </Button>
        </TogoContainer>
    )
}