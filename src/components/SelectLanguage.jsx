import React, { useEffect } from "react";
import { useState } from "react";
import { Button, Dropdown } from "react-bootstrap";
import { GetLangs } from "../APIs/LoginAPIs";
import TogoContainer from "./TogoContainer";
import worldicon from "../assets/language.png";
import { useHistory, useLocation } from "react-router-dom";

export default function SelectLanguage() {

    let search = useLocation().search;
    let params = new URLSearchParams(search);
    //device=mobile&type=client
    console.log(params.get("device"));
    console.log();
    const [items, setItems] = useState([]);
    const [selectedLang, setSelectedLang] = useState();
    const history = useHistory();

    useEffect(()=>{
        localStorage.setItem("UserType", params.get("usertype") || "Client");
        GetLangs().then((res)=>{
            setItems(res.data.server_response);
            localStorage.setItem("LanguageId", res.data.server_response[0].id);
            setSelectedLang(res.data.server_response[0]);
        });

    }, []);

    return (
        <TogoContainer>
            <div className="togo-outling my-4">
                <Dropdown
                    className="rounded-22 bg-white"
                    onSelect={(eve)=>{
                        localStorage.setItem("LanguageId", items[eve].id);
                        setSelectedLang(items[eve]);
                    }}
                >
                    <Dropdown.Toggle variant="" className="w-100 text-start d-flex align-items-center shadow-none">
                        <img src={worldicon} style={{width: "24px", height: "24px"}} className="me-1" alt="worldicon" />
                        <div style={{width: "97%"}}>
                            {selectedLang?.Name}
                        </div>
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="w-100">
                        {items.map((item, index)=>{
                            return (
                                <Dropdown.Item key={item.id} eventKey={index} className="d-flex">
                                    {item.Name}
                                </Dropdown.Item>
                            )
                        })}
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <Button
                variant=""
                className="togo-button w-75 rounded-22"
                onClick={()=>{
                    history.push("/login");
                }}
            >
                Accept
            </Button>
        </TogoContainer>
    )
}
