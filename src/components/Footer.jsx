import React from "react";
import { NavLink, useRouteMatch } from "react-router-dom";
import home from "../assets/home.png";
import money from "../assets/money.png";
import createorder from "../assets/create-order.png";
import user from "../assets/user.png"
import { CreateNewOrder } from "./CreateNewOrder";

export default function Footer(){
  let { url } = useRouteMatch();
  return (
    <div
      className="align-items-center d-flex justify-content-evenly togo-button text-decoration-none"
      style={{flexBasis: "20%"}}
    >
      <NavLink to={`${url}/`} className={"text-center text-decoration-none"}>
        <img src={home} className="m-auto" style={{width: "30px", height: "30px"}} />
        Home
      </NavLink>
      <NavLink to={`${url}/wallet`} className={"text-center text-decoration-none"}>
        <img src={money} className="m-auto" style={{width: "30px", height: "30px"}} />
        Wallet
      </NavLink>
      <CreateNewOrder>
        <div className={"text-center text-white"}>
          <img src={createorder} className="m-auto" style={{width: "30px", height: "30px"}} />
          Create New Order
        </div>
      </CreateNewOrder>
      <NavLink to={`${url}/settings`} className={"text-center text-decoration-none"}>
        <img src={user} className="m-auto" style={{width: "30px", height: "30px"}} />
        Settings
      </NavLink>
    </div>
  )
}
