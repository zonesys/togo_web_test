import React, { useState, Fragment }  from "react";
import { Dropdown, FormControl, Spinner } from "react-bootstrap";
import { useIntl } from "react-intl";
import translate from "../i18n/translate";

export default function ClientDropdown({clients, onSearch, onSelect, selectedClient, loading}) {
    
    return (
        <Dropdown
            className="togo-dropdown mt-2 shadow"
            onSelect={(event) => {
                onSelect(clients[event])
                //setSelectedPickUpAddress(deliverAddresses[event]);
            }}
        >
            <Dropdown.Toggle variant="transparent" className="w-100 text-start">
                <div className="d-inline-block" style={{width: "97%"}}>
                    <div>{(selectedClient && selectedClient.FullName) || translate("ORDERS.SELECT_CLIENT")}</div>
                   { /*<div>{(selectedClient && selectedClient.PhoneNumber)}</div>*/ }
                </div>
            </Dropdown.Toggle>
            <Dropdown.Menu variant="light" renderOnMount={true} as={CustomMenu} onSearch={onSearch} className="w-100">
                {loading && 
                    <Dropdown.Item >
                        <Spinner size="lg" animation="border" variant="light" />
                    </Dropdown.Item>
                }
                {clients.map?.((client, index) => {
                    return (
                        <Fragment key={index}>
                            <Dropdown.Item eventKey={index}>
                                <div>{client.FullName}</div>
                                <div>{client.PhoneNumber}</div>
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
                    style={{width: "93%"}}
                    placeholder={intl.formatMessage({id: "ORDERS.ADDRESS_SEARCH"})}
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