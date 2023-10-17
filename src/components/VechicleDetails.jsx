import React, { useEffect, useRef, useState } from "react";
import { Button, Dropdown, Form, FormControl, InputGroup, Spinner } from "react-bootstrap";
import { GetVehicleImgs, SetVehicleInfo } from "../APIs/LoginAPIs";

export default function VehicleDetails(){
    const vehicleImgRef = useRef();
    const registrationImgCode = useRef();
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [vehicleColors, setVehicleColors] = useState([]);
    
    const [selectedVehicleColor, setSelectedVehicleColor] = useState();
    
    const [vehiclePhotos, setVehiclePhotos] = useState([]);
    const [selectedVehiclePhotos, setSelectedVehiclePhotos] = useState();

    function onFileChange(event){
        
        let reader = new FileReader();
        let fileInputName = event.target.name;
        reader.onload = function (e) {
            let dataUri = e.target.result;
            let base64 = dataUri.substr(dataUri.indexOf(",") + 1);
            if(fileInputName === "registrationImg"){
                registrationImgCode.current = base64;
            }else{
                vehicleImgRef.current = base64;
            }
        }
        if(event.currentTarget.files[0]){
            reader.readAsDataURL(event.currentTarget.files[0]);
        }

    }

    useEffect(() => {
        GetVehicleImgs().then((res) => {
            setVehicleColors(res.data.Color);
            setSelectedVehicleColor(res.data.Color[0]);
            
            setVehiclePhotos(res.data.Photos);
            setSelectedVehiclePhotos(res.data.Photos[0]);
        });
    }, []);
    return (
        <div className="mainbg">
            <div className="h1 p-3 text-center togo-button">
                Create account / transporter
            </div>
            <Form
                className="m-auto w-75" 
                onSubmit={(event) => {
                    event.preventDefault();
                    //console.log(event.target);
                    SetVehicleInfo(
                        event.target, 
                        selectedVehicleColor.ColorId,
                        selectedVehiclePhotos.vehicleId,
                        registrationImgCode.current, 
                        vehicleImgRef.current
                    );
                    // console.log(event.target[0].value)
                    // console.log(event.target.elements.FirstName.value)
                    // console.log(event.target.FirstName.value)
                    
                }}
            >
                <p className="text-center togo-border h4">Vehicle details</p>
                <div className="container">
                    <div className="row row-cols-3 align-items-center">
                        {vehiclePhotos.map((photo)=>{
                            return (
                                <div 
                                    onClick={() => {
                                        setSelectedVehiclePhotos(photo);
                                    }}
                                    className={`col p-2 rounded-circle
                                        ${selectedVehiclePhotos?.vehicleId === photo.vehicleId ? 
                                            "btn-grad" : ""}`
                                    }
                                >
                                    <img src={`/togo/public/img/${photo.PhotoUrl}`} alt={photo.Name} />
                                </div>
                            )
                        })}
                        
                        
                    </div>
                </div>

                <Form.Group controlId="regNumber" className="m-inline-e-2">
                    <Form.Label>Registration number</Form.Label>
                    <InputGroup className="mb-2 togo-outling">
                        <FormControl
                            type="text" 
                            className="bg-white rounded-22"
                            name="RegNumber" 
                        />
                    </InputGroup> 
                </Form.Group>

                <Form.Group controlId="RegExpDate" className="m-inline-e-2">
                    <Form.Label>Registration expiration date</Form.Label>
                    <InputGroup className="mb-2 togo-outling">
                        <FormControl
                            type="date" 
                            className="bg-white rounded-22"
                            name="RegDate" 
                        />
                    </InputGroup> 
                </Form.Group>

                <Form.Group controlId="vehicleName" className="m-inline-e-2">
                    <Form.Label>Vehicle number</Form.Label>
                    <InputGroup className="mb-2 togo-outling">
                        <FormControl
                            type="text" 
                            className="bg-white rounded-22"
                            name="VehicleNumber" 
                        />
                    </InputGroup> 
                </Form.Group>

                <Form.Group controlId="vehicleColor" className="m-inline-e-2">
                    <Form.Label>Vehicle color</Form.Label>
                    <div className="togo-outling mb-2">
                        <Dropdown
                            className="rounded-22 bg-white"
                            onSelect={(eve)=>{
                                setSelectedVehicleColor(vehicleColors[eve])
                            }}
                        >
                            <Dropdown.Toggle variant="" className="w-100 text-start d-flex align-items-center shadow-none">
                                <div style={{width: "97%"}}>
                                    {
                                        selectedVehicleColor?.Name
                                    }
                                </div>
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="w-100">
                                {vehicleColors.map((color, index) => {
                                    return (
                                        <Dropdown.Item eventKey={index} key={index} className="d-flex">
                                            {`${color.Name}`}
                                        </Dropdown.Item>
                                    )
                                })}

                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </Form.Group>

                <p>Delivery Types</p>

                <Form.Check
                    label="Food"
                    type="checkbox"
                    id={`inline-1`}
                    name="foodPkg"
                    value={"1"}
                    className="togo-checkbox"
                />
                <Form.Check
                    label="Small Package & Envelops"
                    type="checkbox"
                    id={`sm-pkg`}
                    name="smPkg"
                    value={"2"}
                    className="togo-checkbox"
                />
                <Form.Check
                    label="Medium Package"
                    type="checkbox"
                    id={`inline-2`}
                    name="mdPkg"
                    value={"3"}
                    className="togo-checkbox"
                />
                <Form.Check
                    label="Large Package"
                    type="checkbox"
                    id={`inline-3`}
                    name="lgPkg"
                    value={"4"}
                    className="togo-checkbox"
                />
                
                <Form.Group controlId="formGridEmail" className="m-inline-e-2">
                    <InputGroup className="mb-2 togo-outling">
                        <FormControl
                            type="file"
                            className="bg-white rounded-22"
                            accept="image/*"
                            name="vehicleImg"
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
                            name="registrationImg"
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
    )
}