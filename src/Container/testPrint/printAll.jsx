import React, { useEffect, useRef, useState } from "react";
import * as htmlToImage from "html-to-image"
import { useReactToPrint } from "react-to-print";
import { WayBill3 } from "./wayBill";
import Loader from "../../components/Loader/Loader"
import { getBidAcceptedPrintInfo } from "../../APIs/OrdersAPIs";
import { imgBaseUrl } from "../../Constants/GeneralCont";
let device, zebraPrinter;
let refIndex = 0;
let readyStatus;

async function getDefaultDevice(callbackFun) {
    window.BrowserPrint.getDefaultDevice("printer", async (dev) => {
        try {
            device = dev;
            zebraPrinter = new window.Zebra.Printer(device);
            console.log("default printer: " + device.name)
            if (callbackFun !== undefined)
                callbackFun();
        } catch (error) {
            console.log("getDefaultDevice error: " + error);
        }

    });
}


async function printImg(img, arr = []) {
    try {
        console.log("device: " + device.name + ", connection status: " + device.connection);
        if (readyStatus === undefined) {
            console.log("ready staus undefined")
            readyStatus = await zebraPrinter.isPrinterReady();

        }

        console.log("is printer ready: " + readyStatus);
        zebraPrinter.printImageAsLabel(img,
            {},
            async (success) => {
                console.log("printImageAslabel success: " + success)
                refIndex++;
                if (refIndex != arr.length) {

                    console.log("printNext")
                    const img = await convertImg(arr[refIndex]);
                    printImg(img, arr);
                }

            },
            (error) => console.error("printImageAslabel error : " + error)
        )

    } catch (error) {
        console.error("isPrinterReady error: " + error);
    }
}

function convertImg(component) {
    return htmlToImage.toPng(component, {
        quality: 1.0,
        backgroundColor: "white",
        pixelRatio: 10,
    });
}

export default function PrintAll() {
   

    const componentRef = useRef([]);
    const containerRef = useRef();
    const printService = useReactToPrint({
        content: () => containerRef.current,
    });

    let [isLoading, setLoading] = useState(true);
    let [wayBillList, setWaybillList] = useState([]);

    useEffect(() => {
        getDefaultDevice();

        getBidAcceptedPrintInfo().then((res) => {
            console.log(res.data)
            setLoading(false);
            try {
              let updatedWayBill = res.data.slice(0,5).map((order, index) => {
                    return(
                        <div ref={ele => componentRef.current[index] = ele} key={index}>
                            <WayBill3
                                transporterImgSrc={imgBaseUrl+order.transporterImgSrc}
                                clientImgSrc={imgBaseUrl+order.clientImgSrc}
                                clientName={order.clientName}
                                clientPhone={order.clientPhone}
                                receiverName={order.receiverName}
                                foreignBarcode={order.foreignBarcode}
                                receiverAddress={order.receiverAddress}
                                receiverCity={order.receiverCity}
                                receiverPhone={order.receiverPhone}
                                cod={order.cod}
                                date={order.date.toString().split(" ")[0]}
                                orderId={order.orderId}
                                note={order.note}
                            />
                        </div>
                    )
                })

                setWaybillList(updatedWayBill)
            } catch (error) {
                console.log("loading orders error: " + error);
            }
        })
    }, [])


    const printhtmlToImage = async () => {
        try {
            refIndex = 0;
            const result = await convertImg(componentRef.current[0])
            if (device === undefined) {
                getDefaultDevice(async () => {
                    printImg(result, componentRef.current)
                })
                return;
            }
            printImg(result, componentRef.current);
        } catch (error) {
            console.log("printhtmlToImage error: " + error)
        }












    }



    return (
        <div className="d-flex flex-column align-items-center justify-content-start">
            {isLoading ? <Loader />
                :
                <>

                    <button
                        style={{ width: "200px", margin: "5%", backgroundColor: "grey", color: "white" }}
                        onClick={printhtmlToImage}>Print</button>


                    <div ref={containerRef} style={{ minWidth: "12cm", maxWidth: "12cm", }}>
                        {wayBillList}
                    </div>
                </>


            }



        </div>


    )
}