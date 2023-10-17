import React from "react";
import gear from "../assets/gear.png";
function Item({imgSrc, title, onClick}){
    return (
        <div onClick={onClick} className="align-items-center d-flex">
            <img src={imgSrc} alt={title} />
            <div className="flex-grow-1 py-3 togo-border">
                {title}
            </div>
        </div>
    )
}

export default function UserSettings(){
    return (
        <div>
            <Item title={"Account Details"} imgSrc={gear} />
        </div>
    )
}