import React, { useState, Fragment } from "react";
import { Dropdown, FormControl, Spinner } from "react-bootstrap";
import { useIntl } from "react-intl";
import translate from "../i18n/translate";

export default function MyNetworkDropDown({ network, onSearch, onSelect, selectedMember, loading, typeLoad }) {

    // console.log(selectedMember)

    return (
        <Dropdown
            className="togo-dropdown mt-2"
            onSelect={(event) => {

                if (typeLoad != "2" && network[event].PhoneNumber == "+972569719850") {
                    alert("Small Package & Envelop only for Al-Barq!");
                } else {
                    onSelect(network[event]);
                }
                
                //setSelectedPickUpAddress(deliverAddresses[event]);
            }}
        >
            <Dropdown.Toggle variant="transparent" className="w-100 text-start">
                <div className="d-inline-block" style={{ width: "97%" }}>
                    <div>{(selectedMember && selectedMember.FullName) || translate("TEMP.SELECT_MEMBER")}</div>
                    { /*<div>{(selectedNetworkMember && selectedNetworkMember.PhoneNumber)}</div>*/}
                </div>
            </Dropdown.Toggle>
            <Dropdown.Menu variant="light" renderOnMount={true} as={CustomMenu} onSearch={onSearch} className="w-100">
                {loading &&
                    <Dropdown.Item >
                        <Spinner size="lg" animation="border" variant="light" />
                    </Dropdown.Item>
                }
                {/* asign to all commented */}
                {/* <Dropdown.Item eventKey="-1">
                    <div>{translate("TEMP.TO_ALL_MEMBERS")}</div>
                </Dropdown.Item> */}
                <Dropdown.Divider />
                {network.map?.((networkMember, index) => {
                    return (
                        <Fragment key={index}>
                            <Dropdown.Item eventKey={index}>
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <div>{networkMember.FullName}</div>
                                        <div>{networkMember.PhoneNumber}</div>
                                    </div>
                                    <div>
                                        {networkMember.deliveryPrice + " NIS"}
                                    </div>
                                </div>
                            </Dropdown.Item>
                            <Dropdown.Divider />
                        </Fragment>
                    )
                })}
            </Dropdown.Menu>
        </Dropdown>
    )
}

const CustomMenu = React.forwardRef(
    ({ children, style, className, onSearch, 'aria-labelledby': labeledBy }, ref) => {
        const [value, setValue] = useState('');
        const intl = useIntl();
        return (
            <div
                ref={ref}
                style={style}
                className={className}
                aria-labelledby={labeledBy}
            >
                <FormControl
                    autoFocus
                    className="mx-3 my-2"
                    style={{ width: "93%" }}
                    placeholder={intl.formatMessage({ id: "TEMP.MEMBER_SEARCH" })}
                    onChange={(e) => {
                        //setValue(e.target.value);
                        onSearch(e.target.value);
                    }}
                //value={value}
                />
                <ul className="list-unstyled">
                    {React.Children.toArray(children).filter(
                        (child) =>
                            !value || child.props.children.toLowerCase().startsWith(value),
                    )}
                </ul>
            </div>
        );
    },
);