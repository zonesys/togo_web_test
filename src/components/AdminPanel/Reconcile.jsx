import React, { useRef, useState } from "react";
import { Button } from "react-bootstrap";
import CustomIcon from "../../assets/icons";
import XLSX, { read } from "sheetjs-style";
import { reconcileOrders } from "../../APIs/AdminPanelApis";
import Loader from "../Loader/Loader"
import { JsonToTable } from "react-json-to-table";
import { useDispatch } from "react-redux";
import { toastMessage, toastNotification } from "../../Actions/GeneralActions";
import BootstrapTable from "react-bootstrap-table-next";
import { VStack } from "@chakra-ui/react";
export default function Reconcile() {
    const dispatch = useDispatch();
    const inputRef = useRef(null);
    const [loading, setLoading] = useState(false)
    const [resultData, setResult] = useState(null);
    const [columns, setColumns] = useState([]);
    const clickHiddenInput = () => {
        inputRef.current.click();
    }
    const isExcelFile = (file) => {
        return file.type === 'application/vnd.ms-excel' || // .xls
            file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'; // .xlsx
    };

    const handleInput = (e) => {
        try {
            const file = e.target.files[0];
            if (!isExcelFile(file)) {
                dispatch(toastMessage("The selected file is not Excel", "File Error"));
                return;
            }
            const reader = new FileReader();
            setLoading(true);
            reader.onload = (event) => {
                try {
                    const data = new Uint8Array(event.target.result);
                    const excelRead = XLSX.read(data, { type: "array" });
                    let jsonArray = [];
                    excelRead.SheetNames.forEach((val, index) => {
                        const sheet = excelRead.Sheets[val];
                        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 0,})
                        jsonData.forEach((val) => {
                            jsonArray.push(val);
                        })
                    })
                    
                    let filtered = jsonArray.filter((val) => val.التسلسل || val.Barcode);
                    const Idkey =  filtered[0].hasOwnProperty("التسلسل")?"التسلسل":
                    filtered[0].hasOwnProperty("Barcode")?"Barcode":"";

                    filtered = filtered.map(order => {
                            order[Idkey] = parseInt(order[Idkey])
                            return order
                        });
                    //let ids = filtered.map(val => val[Idkey]).join(",");    

                    console.log(filtered);
                    reconcileOrders(filtered).then((response) => {
                        try {
                            setLoading(false);
                            console.log(response.data);
                            if (!response) {
                                console.log("response undefined or null")
                                dispatch(toastMessage("Something Wrong"));
                                return;
                            }
                            if (typeof response.data === 'string') {
                                console.log("Response data is not a json array");
                                dispatch(toastMessage("Invalid response"));
                                return;
                            }
                            JSON.parse(JSON.stringify(response.data));
                            if (response.data.length == 0) {
                                setResult([]);
                                return;
                            }
                            const cols = Object.keys(response.data[0]).map((val) => {
                                return {
                                    dataField: val,
                                    text: val == "togoId" ? "Togo Id" : val,
                                    headerStyle: {
                                        fontSize: "1em"

                                    },
                                    formatter:
                                        val != "togoId" ? null :
                                            (cell, row) => {
                                                return (
                                                    <a style={{
                                                        fontWeight: "bold",
                                                        color: "blue"
                                                    }} href={"/adminapp/orderDetails/" + row.togoId} target="_blank">
                                                        {cell}
                                                    </a>)
                                            },

                                }
                            });
                            setColumns(cols);
                            setResult(response.data);

                        } catch (e) {
                            console.log("reconcileOrders api error: " + e)
                            dispatch(toastMessage("Invalid response"))

                        }
                    });
                } catch (e) {
                    setLoading(false);
                    dispatch(toastMessage("Error Reading Excel File", "File Error"))
                    console.log("reader.onload error: " + e)
                }

            }
            reader.readAsArrayBuffer(file);
        } catch (e) {
            console.log("handleInput error : " + e);
        }

    }

    return (

        <div style={{ height: (resultData && resultData.length > 0) ? null : "80%" }} className="d-flex flex-column justify-content-center align-items-center" >
            {loading ? <Loader width={"200px"} height={"200px"} />

                :
                <div >

                    {
                        resultData ?
                            resultData.length > 0 ?
                                <div style={{ margin: "5%" }}>
                                    <BootstrapTable keyField={'togoId'} data={resultData} columns={columns} />
                                </div>
                                :
                                <div className="d-flex justify-content-center" style={{ margin: "2%", fontSize: "2rem", width: "300px" }} >
                                    No Problems
                                    <CustomIcon iconName={"done"} />
                                </div>
                            : null
                    }
                    <div style={{ marginBottom: "2%" }} className="d-flex justify-content-center align-items-end ">

                        <Button
                            onClick={clickHiddenInput}
                        >
                            <div className="d-flex">
                                Upload Excel File
                                <CustomIcon iconName={"upload"} />
                            </div>
                        </Button>
                        <input ref={inputRef} onChange={handleInput} style={{ display: "none" }} type="file" accept=".xls,.xlsx" />


                    </div>

                </div>


            }


        </div>)

}