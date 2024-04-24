import React, { useRef, useState } from "react";
import { Button } from "react-bootstrap";
import CustomIcon from "../../assets/icons";
import XLSX, { read } from "sheetjs-style";
import { reconcileOrders } from "../../APIs/AdminPanelApis";
import Loader from "../Loader/Loader"
import { JsonToTable } from "react-json-to-table";
import { useDispatch } from "react-redux";
import { toastMessage } from "../../Actions/GeneralActions";
import BootstrapTable from "react-bootstrap-table-next";
export default function Reconcile() {
    const dispatch = useDispatch();
    const inputRef = useRef(null);
    const [loading, setLoading] = useState(false)
    const [resultData, setResult] = useState(null);
    const [columns, setColumns] = useState([]);
    const clickHiddenInput = () => {
        inputRef.current.click();
    }
    const handleInput = (e) => {
        try {
            const file = e.target.files[0];
            const reader = new FileReader();
            setLoading(true);
            reader.onload = (event) => {
                try {
                    const data = new Uint8Array(event.target.result);
                    const excelRead = XLSX.read(data, { type: "array" });
                    let jsonArray = [];
                    excelRead.SheetNames.forEach((val, index) => {
                        const sheet = excelRead.Sheets[val];
                        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 0 })
                        jsonData.forEach((val) => {
                            jsonArray.push(val);
                        })
                    })

                    let filtered = jsonArray.filter((val) => val.التسلسل);
                    console.log(filtered);
                    reconcileOrders(filtered).then((response) => {
                        try {
                            console.log(response.data);
                            setLoading(false);


                            /*   response.data.forEach((val)=>{
                                  JSON.parse(val)
                              }) */
                            if(response.data.length == 0){
                                setResult([]);
                                return;
                            }
                            const cols = Object.keys(response.data[0]).map((val) => {
                                return {
                                    dataField: val,
                                    text: val,
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
                    dispatch(toastMessage("Error Reading Excel File"))
                    console.log("reader.onload error: " + e)
                }

            }
            reader.readAsArrayBuffer(file);
        } catch (e) {
            console.log("handleInput error : " + e);
        }

    }
    return (

        <div style={{ height: resultData && resultData.length > 0 ? null : "60%" }} className="d-flex flex-column justify-content-center align-items-center" >
            {loading ? <Loader width={"200px"} height={"200px"} />

                :
                <div >
                    
                    {
                        resultData ?
                         resultData.length>0 ?
                        <div style={{ margin: "5%" }}>
                                <BootstrapTable keyField={'togoId'} data={resultData} columns={columns} />
                        </div>
                        :
                        <div className="d-flex justify-content-center"style={{margin:"2%", fontSize:"2rem" , width: "300px" }} >
                              No Problems  
                              <CustomIcon iconName={"done"}/>
                        </div>
                        :null
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