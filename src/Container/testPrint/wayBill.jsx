import Barcode from "react-barcode";
import logo from "../../assets/logo.png";
import "./style/waybill2.css";
import React from "react";





const styles = {
  clientInfoStyle: {
    height: "3.5cm",
    maxHeight: "3.5cm"
  },
  receiverInfo: {
    height: "4.5cm", maxHeight: "4.5cm"
  },
  barcodeStyle: {
    height: "3.5cm", maxHeight: "3.5cm"
  },
  logoStyle: {
    height: "1cm", maxHeight: "1cm", padding: "1%"
  }
}

export function WayBill3(
  {
    clientImgSrc = "",
    transporterImgSrc = "",
    clientName = "",
    clientPhone = "",
    foreignBarcode = "",
    receiverName ="",
    receiverCity = "",
    receiverAddress = "",
    receiverPhone,
    cod = "",
    orderId = "",
    date = "",
    note = "",
  }
) {



  return (
    <div className="d-flex flex-column" id="way_bill">

          {/* section: client info*/}
          <div className="d-flex align-items-center borderCustom" style={styles.clientInfoStyle}>
            <div className="col-4 d-flex justify-content-center">
              <div style={{ maxHeight: "2cm", maxWidth: "2cm" }}>
                <img src={clientImgSrc} alt="Client Logo" />
              </div>
            </div>

            <div className="col-8 d-flex-justify-content-center">
              <div className="d-flex flex-column align-items-end" >
                <div className="h4 text-end">{clientName}</div>
                <div className="h4">{clientPhone}</div>
              </div>
            </div>

          </div>

          {/* section: receiver info and money*/}
          <div className="borderCustom" style={styles.receiverInfo}>
            <div className="d-flex" dir="rtl">
              <div className="col-6">
                <div className="h5">تفاصيل المستلم</div>
                <div className="h6">{receiverName} </div>
                <div className="h6">{receiverCity}</div>
                <div>{receiverAddress}</div>
                <div className="text-end" dir="ltr">{receiverPhone} </div>
              </div>
              <div className="col-6 sideBorder">
                <div className="d-flex flex-column ">
                  <div className="h6">قيمة التحصيل : {<span style={{ fontWeight: "bold" }}>{cod + " " + "شيكل"}</span>}</div>
                  <div className="h6" >تاريخ الانشاء: {<span style={{ fontWeight: "bold" }}>{date}</span>}</div>
                  <div className="h6" >رقم الطرد: {<span style={{ fontWeight: "bold" }}>{orderId}</span>}</div>
                  <div className="fw-medium" >ملاحظات: {note}</div>
                </div>
              </div>
            </div>
          </div>

          {/* section: barcode-transporter logo */}
          <div className="d-flex align-items-center borderCustom" style={styles.barcodeStyle}>
            <div className="col-6 d-flex justify-content-center align-items-center">
              <div style={{ height: "2cm", width: "2cm" }}>
                <img src={transporterImgSrc} alt="Transporter Logo" />
              </div>
            </div>
            <div className="col-6 d-flex justify-content-center">
              <Barcode value={foreignBarcode!=""?foreignBarcode:orderId} textAlign="center" height={100} width={1.5} fontSize={12} />
            </div>
          </div>

          {/* section: togo logo */}
          <div className="col-12 d-flex justify-content-end borderCustom" style={styles.logoStyle}>
            <div style={{ height: "1.5cm", width: "1.5cm" }}>
              <img src={logo} alt="Togo Logo" />
            </div>
          </div>
        </div>
  
   


  );

  
}


