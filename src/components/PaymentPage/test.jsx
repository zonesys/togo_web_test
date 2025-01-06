import React, { useState, useEffect, useRef } from 'react';
import styles from './PaymentPage.module.css';

export default function PaymentPage2() {

    return (

        <div>
            <iframe
                src={`https://${process.env.REACT_APP_NEW_BACKEND_URL}/aseel`}
                sandbox="allow-scripts allow-same-origin allow-popups"
            /> 
        </div>
    );
}



