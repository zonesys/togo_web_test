import React from "react"
import { orderPackages } from "../CreateOrder_v2/CreateOrder_v2";
import { Dropdown } from "react-bootstrap";
export const PackageTypesDropdown = ({handler,selectedItem}) => {
    return (<div className="col-lg-4" style={{ margin: '5px' }}>
        {<Dropdown
            style={{ width: "100%" }}
            className="togo-dropdown shadow"
            data-test="package-types-dropdown"
            onSelect={(eve) => {
                handler(eve)
               
            }}>
            <Dropdown.Toggle variant="" className="w-100 text-start d-flex align-items-center">

                {selectedItem.icon}

                <div style={{ width: "97%", marginInlineStart: "5px" }}>

                    {selectedItem.name}
                    (x{selectedItem.mul})
                </div>
            </Dropdown.Toggle>

            <Dropdown.Menu className="w-100" data-test="package-types-dropdown-menu"
            >
                {orderPackages.map((item) => {
                    return (
                        <Dropdown.Item eventKey={item.id} className="d-flex">
                            {item.icon}
                            <dev style={{ marginInlineStart: "5px" }}>
                                {item.name}
                                (x{item.mul})
                            </dev>

                        </Dropdown.Item>
                    )

                })}


            </Dropdown.Menu>

        </Dropdown>}
    </div>)

}