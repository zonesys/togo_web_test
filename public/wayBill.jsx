
import Barcode from "react-barcode";
import "bootstrap/dist/css/bootstrap.css"
import logo from "../public/assets/logo.png";
import { createElement, useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import "./style/waybill2.css"
import { useReactToPrint } from "react-to-print";
import DomToImage from "dom-to-image";
import * as htmlToImage from "html-to-image";

async function getBlobFromImage(imgUrl) {
  let blob = await fetch(imgUrl).then((response) => {
    return response.blob();

  }).catch((error) => {
    console.error("error fetching image: " + error);
  });
  let res = blob;//URL.createObjectURL(blob);
  console.log("blob from function : " + res);
  return res;
}

async function setupPrinter(blop) {
  BrowserPrint.getDefaultDevice("printer", (device) => {
    console.log("device: " + device.name + ", connection status: " + device.connection);
    
    var zebraPrinter = new Zebra.Printer(device);
  
    zebraPrinter.isPrinterReady().then(function (success) {
      console.log("is printer ready: " + success);
      zebraPrinter.printImageAsLabel(blop,
        {
          scale: 3,
        },
        (success) => console.log("printImageAslabel status: " + success),
        (error) => console.error("printImageAslabel error : " + error)
      );

    }).catch(function (error) {
      console.error("error: " + error);
    })

  });
}



export function WayBill3(
  {
    clientImgSrc = "",
    transporterImgSrc = "",
    clientName = "",
    clientPhone = "",
    foreignBarcode = "",
    senderCity = "",
    senderAddress = "",
    receiverCity = "",
    receiverAddress = "",
    receiverPhone,
    cod = "",
    orderId = "",
    date = "",
    note = "",
  }
) {

  console.log("receiver address num of chars: " + receiverAddress.length)

  const componentRef = useRef();
  const printService = useReactToPrint({
    content: () => componentRef.current,
  });

  const printHtml2canvas = () => {
    const componenet = document.getElementById("way_bill");
    html2canvas(componenet,
{
      scale: 2,
    }).then((canvas) => {

      canvas.toBlob(blob => {
        setupPrinter(blob);
      })
    });
  }

  const printhtmlToImage = () =>{
    htmlToImage.toCanvas(document.getElementById("way_bill"),{
      quality: 1.0,
      backgroundColor: "white"
    }).then(async (result) =>{
    
        document.body.appendChild(result);
       result.toBlob((blob)=>{
        setupPrinter(blob);
       },
       "image/jpeg",
       3.0
       )
    });
  }

  const print = async () => {
    const element = document.getElementById("way_bill");
    const imgOptions = {
      quality: 0.92,
      bgcolor: "white"
    }
    DomToImage.toBlob(element, imgOptions).then((result) => {
      setupPrinter(result)
      return;
      var img = new Image();
      img.src = result;
      document.body.appendChild(img);
    });

  }


  return (
    <>
      <div className="d-flex justify-content-center" id="container">
        <div ref={componentRef} id="way_bill" className="d-flex flex-column">
          <div className="d-flex">
            <div className="col-6  d-flex justify-content-center borderCustom">
              <img src={transporterImgSrc} height={50} alt="Transporter Logo" />
            </div>
            <div className="col-6 d-flex justify-content-center align-items-center borderCustom">
              <img src={clientImgSrc} height={50} alt="Client Logo" />
            </div>
          </div>
          <div className="d-flex flex-column  borderCustom" >
            <div className="h5" dir="rtl">تفاصيل المرسل</div>
            <div className="d-flex justify-content-center" dir="rtl">
              <div className="col-6 text-center" >
                <div className="h6">{clientName}</div>
              </div>
              <div className="col-6 text-center">
                <div className="h6" dir="ltr">{clientPhone}</div>
              </div>
            </div>

          </div>
          <div className="d-flex borderCustom" dir="rtl">
            <div className="col-6">
              <div className="h5">تفاصيل المستلم</div>
              <div className="h6">Abdullah </div>
              <div className="h6">{receiverCity}</div>
              <div className="textLimit">{receiverAddress}</div>
              <div className="text-end" dir="ltr">{receiverPhone} </div>
            </div>
            <div className="col-6 sideBorder">
              <div className="d-flex flex-column ">
                <div className="h6">قيمة التحصيل : {<span style={{ fontWeight: "bold" }}>{cod + " " + "شيكل"}</span>}</div>
                <div className="h6" >تاريخ الانشاء: {<span style={{ fontWeight: "bold" }}>{date}</span>}</div>
                <div className="h6" >رقم الطرد: {<span style={{ fontWeight: "bold" }}>{orderId}</span>}</div>
                {note != "" && <div className="fw-medium" >ملاحظات: {note}</div>}
              </div>
            </div>



          </div>

          <div className="d-flex">
            <div className="col-12 d-flex justify-content-center borderCustom">
              <Barcode value={foreignBarcode} textAlign="center" height={100} width={1.5} fontSize={12}/>
            </div>
          </div>
          <div className="d-flex">
            <div className="col-12 d-flex justify-content-end borderCustom">
              <img src={'/assets/logo.png'} height={32} alt="Togo Logo" />
            </div>
          </div>
        </div>
      </div>

      <button
        style={{ width: "200px", margin: "5%" }}
        onClick={printHtml2canvas}>Print SDK</button>
      {/*  <button
        style={{ width: "200px", margin: "5%" }}
        onClick={async ()=>{
         
        }}>Get BLOB</button> */}
    </>


  );

}


export function WayBill2(
  {
    clientImgSrc = "",
    clientName = "",
    foreignBarcode = "",
    senderCity = "",
    senderAddress = "",
    receiverCity = "",
    receiverAddress = "",
    cod = "",
    orderId = "",
    date = "",
    note = "",
  }
) {
  const componentRef = useRef();
  const print = () => {
    html2canvas(componentRef.current).then((value) => {

      value.toBlob(blob => {
        setupPrinter(blob);
      })
    });

  }
  const printDefault = useReactToPrint({
    content: () => componentRef.current,

  })
  return (
    <>
      <div className="d-flex justify-content-center" id="container">
        <div ref={componentRef} id="way_bill" className="d-flex flex-column">
          <div className="d-flex">
            <div className="col-6  d-flex justify-content-center borderCustom">
              <img src={clientImgSrc} height={50} alt="Client Logo" />
            </div>
            <div className="col-6 d-flex justify-content-center align-items-center borderCustom">
              <div className="h4">{clientName}</div>
            </div>
          </div>
          {/*   <div className="d-flex">
            <div className="col-12 d-flex justify-content-center borderCustom">
              <Barcode value={foreignBarcode} textAlign="center" height={50} width={1.5} fontSize={15} />
            </div>
          </div> */}
          <div className="d-flex ">
            <div className="col-6 borderCustom">
              <div className="h5">من</div>
              <div className="h6">{senderCity}</div>
              <div className="p">{senderAddress}</div>
            </div>
            <div className="col-6 borderCustom">
              <div className="h5">الى</div>
              <div className="h6">{receiverCity}</div>
              <div className="p">{receiverAddress}</div>
            </div>
          </div>

          <div className="d-flex flex-column borderCustom" dir="rtl">
            <div className="d-flex flex-row justify-content-between">
              <div className="h6">المبلغ المطلوب</div>
              <div className="h6">{cod} شيكل</div>
            </div>
            <div className="d-flex flex-row justify-content-between">
              <div className="h6">التاريخ</div>
              <div className="h6">{date}</div>
            </div>
            <div className="d-flex flex-row justify-content-between">
              <div className="h6">رقم الطرد</div>
              <div className="h6">{orderId}</div>
            </div>
          </div>

          {note !== "" && (
            <div className="d-flex" dir="rtl">
              <div className="col-3 borderCustom p">
                ملاحظات
              </div>
              <div className="col-9 borderCustom p">
                {note}
              </div>
            </div>
          )}

          <div className="d-flex">
            <div className="col-12 d-flex justify-content-center borderCustom">
              {/* <img src={logo} height={40} alt="Company Logo" /> */}
              <Barcode value={foreignBarcode} textAlign="center" height={60} width={1.5} fontSize={15} />

            </div>
          </div>
          <div className="d-flex">
            <div className="col-12 d-flex justify-content-end borderCustom">
              <img src={logo} height={30} alt="Company Logo" />
            </div>
          </div>
        </div>
      </div>

      <button
        style={{ width: "200px", margin: "5%" }}
        onClick={print}>Print Test</button>
    </>


  );

}


export function WayBill({
  clientImgSrc = "",
  clientName = "",
  foreignBarcode = "",
  senderCity = "",
  senderAddress = "",
  receiverCity = "",
  receiverAddress = "",
  cod = "",
  orderId = "",
  date = "",
  note = "",
}) {
  const componentRef = useRef();
  const print = () => {

    html2canvas(componentRef.current).then((value) => {
      value.toBlob(blob => {
        setupPrinter(blob);
      })
    })

  }
  const printDefault = useReactToPrint({
    content: () => componentRef.current,

  }
  )


  return (
    <div>
      <div ref={componentRef} id="way_bill">
        <table >
          <tr>
            <td colSpan={2}>
              <div className="tableCell">
                <img src={clientImgSrc} height={50}></img>
              </div>
            </td>
            <td colSpan={2}>
              <div className="tableCell">
                <h3 style={{ fontWeight: "bold" }}>
                  {clientName}
                </h3>
              </div>
            </td>
          </tr>
          <tr>
            <td colSpan={4}>
              <div className="tableCell" >
                <Barcode value={foreignBarcode} textAlign="center" height={30} width={1} fontSize={15} />
              </div>
            </td>
          </tr>

          <tr className="addressRow">
            <td colSpan={2}>
              <div className="tableCell">
                <h2>من</h2>
                <h3>{senderCity}</h3>
                <p>{senderAddress}</p>
              </div>

            </td>
            <td colSpan={2}>
              <div className="tableCell">
                <h2>الى</h2>
                <h3>{receiverCity}</h3>
                <p>{receiverAddress}</p>
              </div>

            </td>
          </tr>
          <tr>
            <td colSpan={4} dir="rtl">
              <div className="tableCell">
                <div className="codRow">
                  <h5>المبلغ المطلوب</h5>
                  <h2>{cod} شيكل</h2>
                </div>
                <div className="codRow">
                  <h5>التاريخ</h5>
                  <h4>{date}</h4>
                </div>
                <div className="codRow">
                  <h5>رقم الطرد</h5>
                  <h4>{orderId}</h4>
                </div>
              </div>

            </td>
          </tr>
          {note != "" ? (
            <tr dir="rtl">
              <td colSpan={3} style={{ textAlign: "start" }}>
                <div className="tableCell">
                  {note}
                </div>
              </td>
              <td colSpan={1} style={{ fontWeight: "bold" }}>
                <div className="tableCell">
                  ملاحظات
                </div>
              </td>

            </tr>
          ) : (
            <></>
          )}
          <tr>
            <td colSpan={4}>
              <div className="tableCell">
                <img src={logo} height={20}></img>
              </div>
            </td>
          </tr>
        </table>
      </div>

      <button
        style={{ width: "200px", margin: "5%" }}
        onClick={print}>Print Test</button>
    </div>

  );
}

