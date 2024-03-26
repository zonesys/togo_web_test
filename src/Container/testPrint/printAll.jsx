import React, { useRef } from "react";
import * as htmlToImage from "html-to-image"
import { useReactToPrint } from "react-to-print";
import { WayBill3 } from "./wayBill";
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
    getDefaultDevice();
    const printService = useReactToPrint({
        content: () => containerRef.current,
    });


    const printhtmlToImage = async () => {
        try{
            refIndex = 0;
            const result = await convertImg(componentRef.current[0])
            if (device === undefined) {
                getDefaultDevice(async () => {
                    printImg(result, componentRef.current)
                })
                return;
            }
            printImg(result, componentRef.current);
        }catch(error){
            console.log("printhtmlToImage error: "+error)
        }












    }
    const orders = [
        {
            transporterImgSrc: "https://dev.togo.ps/togo/MobileAPi/img/PersonalImg/image1660121614124.jpg?t=0.6941913539420765",
            clientImgSrc: "https://dev.togo.ps/togo/MobileAPi/img/BusinessLogo/image1634560141266.jpg?t=0.869448993020816",
            clientName: "شركة الارض الفلسطينية",
            clientPhone: "+972599876543",
            foreignBarcode: "8754345202366",
            receiverAddress: "Near Rafidia Hostpital",
            receiverCity: "Nablus",
            receiverPhone: "+972599233432",
            cod: "30323",
            date: "03/02/2022",
            orderId: "1198642",
            note: "التوصيل عند الساعة ١٠ صباحا ",
        },
        {
            transporterImgSrc: "https://dev.togo.ps/togo/MobileAPi/img/PersonalImg/image1660121614124.jpg?t=0.6941913539420765",
            clientImgSrc: "https://dev.togo.ps/togo/MobileAPi/img/BusinessLogo/image1634560141266.jpg?t=0.869448993020816",
            clientName: "شركة الارض الفلسطينية",
            clientPhone: "+972599876543",
            foreignBarcode: "56423444243",
            receiverAddress: "AL Masyon",
            receiverCity: "Ramallah",
            receiverPhone: "+972598062708",
            cod: "3500",
            date: "07/08/2023",
            orderId: "1182352",
            note: "التوصيل عند الساعة ١٠ صباحا ",
        },



    ]

    const wayBillList = orders.map((order, index) => {
        //componentRef.current[index] = React.createRef();
        return (
            <div ref={ele => componentRef.current[index] = ele} key={index}>
                <WayBill3
                    transporterImgSrc={order.transporterImgSrc}
                    clientImgSrc={order.clientImgSrc}
                    clientName={order.clientName}
                    clientPhone={order.clientPhone}
                    foreignBarcode={order.foreignBarcode}
                    receiverAddress={order.receiverAddress}
                    receiverCity={order.receiverCity}
                    receiverPhone={order.receiverPhone}
                    cod={order.cod}
                    date={order.date}
                    orderId={order.orderId}
                    note={order.note}
                />
            </div>

        )
    })
    return (
        <div className="d-flex flex-column align-items-center justify-content-start">
            <button
                style={{ width: "200px", margin: "5%", backgroundColor: "grey", color: "white" }}
                onClick={printhtmlToImage}>Print</button>


            <div ref={containerRef} style={{ minWidth: "12cm", maxWidth: "12cm", }}>
                {wayBillList}
            </div>

        </div>


    )
}