import React, { useEffect, useState } from "react";
import { getWallet } from "../APIs/ProfileAPIs";

export default function WalletView() {
    const [balance, setBalance] = useState({TransporterBalance: 0});
    useEffect(()=>{
        
        getWallet().then((res)=>{
            setBalance(res.data.server_response[0]);
        });

    }, []);
    
    return (
        <>        
            
            <div className="p-2">
            
                <div className="d-flex justify-content-around fs-4" style={{backgroundColor: "var(--bs-gray-300)"}}>
                    <div className="fw-bold">Wallet</div>
                    <div>{balance.TransporterBalance} NIS</div>
                </div>
                <div className="text-center">
                    TOGO application users can top up their balance via PALPAY point of sale agents or
                    by using the PALPAY Application or via Back of Palestine, Arab Islamic Bank and Arab Bank.
                </div>
            </div>
        </>
        
    )
}