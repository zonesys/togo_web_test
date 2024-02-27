import React from 'react';
import translate from "../../i18n/translate";
import './Invoice.css';
import DynamicTable from '../DynamicTable/DynamicTable';
import { isTransporter } from '../../Util';

export default function Invoice({invoices}) {

    const columns = [
        {
            label: translate("INVOICES.ORDER_ID"),
            key: "orderId",
        },
        {
            label: translate("ORDERS.ORDER_DATE"),
            key: "invoiceDate",
            format: ({invoiceDate, invoiceTime}) => {
                return `${invoiceDate} - ${invoiceTime}`;
            }
        },
        {
            label: translate("INVOICES.SENDER"),
            key: isTransporter() ? "ClientName" : "TransporterName",
        },
        {
            label: translate("INVOICES.TRANS_VAL"),
            key: "amount"
        },
        {
            label: translate("INVOICES.TOGO_COMM"),
            key: "ToGoDiscount"
        },
        {
            label: translate("INVOICES.TAX"),
            key: "tax"
        },
        {
            label: translate("INVOICES.TOTAL"),
            key: "ToGoDiscount",
            format: ({amount, ToGoDiscount, tax}) => {
                return amount - ToGoDiscount - tax;
            }
        },
    ];
    return (
        <DynamicTable columns={columns} data={invoices}/>        
    );
};
