import React, { useRef, useState } from "react";
import { Button, Form, FormControl, InputGroup, Spinner } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { SetPersonalInfo } from "../APIs/LoginAPIs";

export default function PersonalInfoForm(){
    const firstNameRef = useRef();
    const familyNameRef = useRef();
    const IDNumRef = useRef();
    const emailRef = useRef();
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const history = useHistory();
    return (
        <>
            <div className="mainbg">
                <div className="h1 p-3 text-center togo-button">
                    Create account /client
                </div>
                <div className="m-auto w-75">
                    <p className="text-center togo-border h4">Personal information</p>

                    <Form.Group controlId="formGridEmail" className="m-inline-e-2">
                        <Form.Label>First name</Form.Label>
                        <InputGroup className="mb-2 togo-outling">
                            <FormControl
                                type="text" 
                                className="bg-white rounded-22"
                                ref={firstNameRef} 
                            />
                        </InputGroup>    
                    </Form.Group>

                    <Form.Group controlId="formGridEmail" className="m-inline-e-2">
                        <Form.Label>Family name</Form.Label>
                        <InputGroup className="mb-2 togo-outling">
                            <FormControl 
                                type="text" 
                                className="bg-white rounded-22"
                                ref={familyNameRef} 
                            />
                            
                        </InputGroup>    
                    </Form.Group>

                    <Form.Group controlId="formGridEmail" className="m-inline-e-2">
                        <Form.Label>ID Number</Form.Label>
                        <InputGroup className="mb-2 togo-outling">

                            <FormControl
                                maxLength={9}
                                onInput={(ev)=>{
                                    ev.target.value = ev.target.value.replace(/[^0-9]/gi, "");
                                }} 
                                type="text" 
                                className="bg-white rounded-22"
                                ref={IDNumRef} 
                            />
                            
                        </InputGroup>    
                    </Form.Group>

                    <Form.Group controlId="formGridEmail" className="m-inline-e-2">
                        <Form.Label>Email</Form.Label>
                        <InputGroup className="mb-2 togo-outling">

                            <FormControl 
                                type="text" 
                                className="bg-white rounded-22"
                                ref={emailRef} 
                            />
                            
                        </InputGroup>    
                    </Form.Group>
                    <Button
                        variant="" 
                        className="d-block m-auto rounded-22 togo-button w-25" 
                        disabled={loadingSubmit}
                        onClick={()=>{
                            setLoadingSubmit(true);
                            SetPersonalInfo(
                                firstNameRef.current.value,
                                familyNameRef.current.value,
                                IDNumRef.current.value,
                                emailRef.current.value
                            ).then((res) => {
                                setLoadingSubmit(false);
                                history.push("/business-info")
                            });
                        }}
                    >
                        {loadingSubmit && <Spinner animation="border" size="sm"/>} 
                        Send
                    </Button>
                </div>
            </div>
        </>
    )
}