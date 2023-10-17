import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { Button, Dropdown, Form, FormControl, InputGroup, Spinner } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { GetTypeBusiness, SetBusinessInfo } from "../APIs/LoginAPIs";

export default function BusinessInfoForm(){
    const BNameRef = useRef();
    const BLocRef = useRef();
    const imgRef = useRef();
    const [types, setTypes] = useState([]);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [selectedType, setSelectedType] = useState();
    const history = useHistory();
    function onFileChange(event){
        console.log(imgRef.current)
        let reader = new FileReader();

        reader.onload = function (e) {
            imgRef.current.src = e.target.result
        }
        if(event.currentTarget.files[0]){
            reader.readAsDataURL(event.currentTarget.files[0]);
        }

    }


    useEffect(() => {
        GetTypeBusiness().then((res) => {
            setTypes(res.data.server_response);
            setSelectedType(res.data.server_response[0]);
        })
    }, []);

    return (
        <>
            <div className=" mainbg">
                <div className="h1 p-3 text-center togo-button">
                    Create account /client
                </div>
                <div className="m-auto w-75">
                    <p className="text-center togo-border h4">Business information</p>
                    <Form.Group controlId="formGridEmail" className="m-inline-e-2">
                        <Form.Label>Business name</Form.Label>
                        <InputGroup className="mb-2 togo-outling">
                            <FormControl
                                type="text"
                                className="bg-white rounded-22"
                                ref={BNameRef}
                            />
                        </InputGroup>
                    </Form.Group>

                    <Form.Group controlId="formGridEmail" className="m-inline-e-2">
                        <Form.Label>Business location</Form.Label>
                        <InputGroup className="mb-2 togo-outling">
                            <FormControl
                                type="text"
                                className="bg-white rounded-22"
                                ref={BLocRef}
                            />
                        </InputGroup>
                    </Form.Group>

                    <Form.Group controlId="formGridEmail" className="m-inline-e-2">
                        <Form.Label>Business type</Form.Label>
                        <div className="togo-outling mb-2">
                            <Dropdown
                                className="rounded-22 bg-white"
                                onSelect={(eve)=>{
                                    setSelectedType(types[eve])
                                }}
                            >
                                <Dropdown.Toggle variant="" className="w-100 text-start d-flex align-items-center shadow-none">
                                    <div style={{width: "97%"}}>
                                        {selectedType?.Name}
                                    </div>
                                </Dropdown.Toggle>

                                <Dropdown.Menu className="w-100">
                                    {types.map((type, index) => {
                                        return (
                                            <Dropdown.Item eventKey={index} key={index} className="d-flex">
                                                {`${type.Name}`}
                                            </Dropdown.Item>
                                        )
                                    })}

                                </Dropdown.Menu>
                            </Dropdown>
                        </div>

                        <InputGroup className="mb-2 togo-outling">
                            <FormControl
                                type="file"
                                className="bg-white rounded-22"
                                accept="image/*"
                                onChange={onFileChange}
                            />

                        </InputGroup>
                    </Form.Group>
                    <div className="mb-2" style={{maxHeight: "150px"}}>
                        <img ref={imgRef} className="border border-2" style={{height: "150px",margin: "auto",padding: "2px"}} />
                    </div>
                    <div>
                        <Button
                            variant=""
                            className="d-block m-auto rounded-22 togo-button w-25"
                            disabled={loadingSubmit}
                            onClick={()=>{
                                let dataUri = imgRef.current.src;
                                let base64 = dataUri.substr(dataUri.indexOf(",") + 1);
                                setLoadingSubmit(true);
                                SetBusinessInfo(
                                    BNameRef.current.value,
                                    BLocRef.current.value,
                                    selectedType.id,
                                    base64
                                ).then((res) => {
                                    setLoadingSubmit(false);
                                    history.push("/dashboard");
                                });
                            }}
                        >
                            {loadingSubmit && <Spinner animation="border" size="sm"/>}
                            Send
                        </Button>
                        <Button
                            variant=""
                            className="d-block m-auto rounded-22 togo-button w-25"
                            onClick={()=>{
                                history.push("/business-info")
                            }}
                        >
                            Skip
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
