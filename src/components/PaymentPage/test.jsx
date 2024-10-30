import React, { useState, useEffect, useRef } from 'react';
import styles from './PaymentPage.module.css';

export default function PaymentPage2() {

    return (

        <div>
            <iframe
                src={"https://api.dev.togo.ps/aseel"}
                sandbox="allow-scripts allow-same-origin allow-popups"
            /> 
        </div>
    );
}



