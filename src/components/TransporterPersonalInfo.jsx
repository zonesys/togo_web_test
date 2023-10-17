import React, { useEffect, useRef, useState } from "react";
import { Button, Dropdown, Form, FormControl, InputGroup, Spinner } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { GetLicenceAndIdentity, SetTransporterPersonalInfo } from "../APIs/LoginAPIs";

export default function TransporterPersonalInfo(){
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    
    const [licenses, setLicenses] = useState([]);
    const [selectedLicense, setSelectedLicense] = useState();
    const [places, setPlaces] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState();
    useEffect(() => {
        GetLicenceAndIdentity().then((res) => {
            setLicenses(res.data.license);
            setSelectedLicense(res.data.license[0]);
            setPlaces(res.data.place);
            setSelectedPlace(res.data.place[0]);
        });
    }, []);

    const licenceImgRef = useRef();
    const personalImgCode = useRef();
    
    function onFileChange(event){
        
        let reader = new FileReader();
        let fileInputName = event.target.name;
        reader.onload = function (e) {
            let dataUri = e.target.result;
            let base64 = dataUri.substr(dataUri.indexOf(",") + 1);
            if(fileInputName === "personalImg"){
                personalImgCode.current = base64;
            }else{
                licenceImgRef.current = base64;
            }
        
        }
        if(event.currentTarget.files[0]){
            reader.readAsDataURL(event.currentTarget.files[0]);
        }

    }

    return (
        <div className="mainbg">
            <div className="h1 p-3 text-center togo-button">
                Create account / transporter
            </div>
            <Form 
                className="m-auto w-75" 
                onSubmit={(event) => {
                    event.preventDefault();
                    SetTransporterPersonalInfo(event.target, selectedPlace.IdPlace, selectedLicense.IdTypeLicence, 
                        personalImgCode.current, 
                        licenceImgRef.current
                    );
                    // console.log(event.target[0].value)
                    // console.log(event.target.elements.FirstName.value)
                    // console.log(event.target.FirstName.value)
                    
                }}
            >
                <p className="text-center togo-border h4">Personal information</p>

                <Form.Group controlId="transName" className="m-inline-e-2">
                    <Form.Label>Name</Form.Label>
                    <InputGroup className="mb-2 togo-outling">
                        <FormControl
                            type="text" 
                            className="bg-white rounded-22"
                            name="FirstName" 
                        />
                    </InputGroup>    
                </Form.Group>

                <Form.Group controlId="transFamilyName" className="m-inline-e-2">
                    <Form.Label>Family name</Form.Label>
                    <InputGroup className="mb-2 togo-outling">
                        <FormControl 
                            type="text" 
                            className="bg-white rounded-22"
                            name="LastName"
                        />
                        
                    </InputGroup>    
                </Form.Group>

                <Form.Group controlId="PlaceIdentity" className="m-inline-e-2">
                    <Form.Label>Place of issuing identity</Form.Label>
                    <div className="togo-outling mb-2">
                        <Dropdown
                            className="rounded-22 bg-white"
                            onSelect={(eve)=>{
                                setSelectedLicense(licenses[eve])
                            }}
                        >
                            <Dropdown.Toggle variant="" className="w-100 text-start d-flex align-items-center shadow-none">
                                <div style={{width: "97%"}}>
                                    {
                                        selectedLicense?.TypeName
                                    }
                                </div>
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="w-100">
                                {licenses.map((licence, index) => {
                                    return (
                                        <Dropdown.Item eventKey={index} key={index} className="d-flex">
                                            {`${licence.TypeName}`}
                                        </Dropdown.Item>
                                    )
                                })}

                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </Form.Group>

                <Form.Group controlId="transIDNumber" className="m-inline-e-2">
                    <Form.Label>ID Number</Form.Label>
                    <InputGroup className="mb-2 togo-outling">

                        <FormControl
                            maxLength={9}
                            onInput={(ev)=>{
                                ev.target.value = ev.target.value.replace(/[^0-9]/gi, "");
                            }} 
                            type="text" 
                            className="bg-white rounded-22"
                            name="IDNumber" 
                        />
                        
                    </InputGroup>    
                </Form.Group>

                <Form.Group controlId="transLicenceNumber" className="m-inline-e-2">
                    <Form.Label>Driver licence number</Form.Label>
                    <InputGroup className="mb-2 togo-outling">

                        <FormControl 
                            type="text" 
                            className="bg-white rounded-22"
                            name="LicenceNumber" 
                        />
                        
                    </InputGroup>    
                </Form.Group>
                
                <Form.Group controlId="transLicenceType" className="m-inline-e-2">
                    <Form.Label>Driver licence type</Form.Label>
                    <div className="togo-outling mb-2">
                        <Dropdown
                            className="rounded-22 bg-white"
                            onSelect={(eve)=>{
                                setSelectedPlace(places[eve])
                            }}
                        >
                            <Dropdown.Toggle variant="" className="w-100 text-start d-flex align-items-center shadow-none">
                                <div style={{width: "97%"}}>
                                    {
                                        selectedPlace?.NamePlace
                                    }
                                </div>
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="w-100">
                                {places.map((place, index) => {
                                    return (
                                        <Dropdown.Item eventKey={index} key={index} className="d-flex">
                                            {`${place.NamePlace}`}
                                        </Dropdown.Item>
                                    )
                                })}

                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </Form.Group>

                <Form.Group controlId="transEmail" className="m-inline-e-2">
                    <Form.Label>Email</Form.Label>
                    <InputGroup className="mb-2 togo-outling">

                        <FormControl 
                            type="text" 
                            className="bg-white rounded-22"
                            name="Email" 
                        />
                    </InputGroup>    
                </Form.Group>

                <Form.Group controlId="transAccountName" className="m-inline-e-2">
                    <Form.Label>Account name</Form.Label>
                    <InputGroup className="mb-2 togo-outling">

                        <FormControl 
                            type="text" 
                            className="bg-white rounded-22"
                            name="AccountName"
                        />
                        
                    </InputGroup>    
                </Form.Group>
                <Form.Group controlId="formGridEmail" className="m-inline-e-2">
                    <InputGroup className="mb-2 togo-outling">
                        <FormControl
                            type="file"
                            className="bg-white rounded-22"
                            accept="image/*"
                            name="personalImg"
                            onChange={onFileChange}
                        />

                    </InputGroup>
                </Form.Group>

                <Form.Group controlId="formGridEmail" className="m-inline-e-2">
                    <InputGroup className="mb-2 togo-outling">
                        <FormControl
                            type="file"
                            className="bg-white rounded-22"
                            accept="image/*"
                            name="licenseImg"
                            onChange={onFileChange}
                        />

                    </InputGroup>
                </Form.Group>
                <Button
                    variant="" 
                    type="submit"
                    className="d-block m-auto rounded-22 togo-button w-25" 
                    disabled={loadingSubmit}
                    // onClick={(event)=>{
                    //     setLoadingSubmit(true);
                    //     // SetTransporterPersonalInfo(
                    //     // ).then((res) => {
                    //     //     setLoadingSubmit(false);
                    //     //     history.push("/business-info")
                    //     // });
                    // }}
                >
                    {loadingSubmit && <Spinner animation="border" size="sm"/>} 
                    Accept
                </Button>
            </Form>
 
        </div>
    );
}