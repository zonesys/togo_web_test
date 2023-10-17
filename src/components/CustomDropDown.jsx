import React, { useEffect, useState, useRef } from "react";
import './CustomDropDown.css';
import { ListGroup } from 'react-bootstrap';
import { useHistory } from "react-router-dom";

export default function CustomDropDown({ dropList, x_pos, y_pos, fromDirection, close, action }) {

    const history = useHistory();
    const wrapperRef = useRef(null);

    const [styles, setStyles] = useState({
        wrapperFromLeft: {
            left: x_pos + 'px',
            top: y_pos + 'px',
        },
        wrapperFromRight: {
            right: x_pos + 'px',
            top: y_pos + 'px',
        },
    });

    useEffect(() => {
        // Function to handle clicks outside the component
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                close();
            }
        }
        // Add event listener to detect clicks outside the component
        document.addEventListener("mousedown", handleClickOutside);
        // Clean up the event listener on unmount
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    return (
        <div ref={wrapperRef} style={fromDirection === "left" ? styles.wrapperFromLeft : styles.wrapperFromRight} className="custom-drop">
            <ListGroup className="custom-list-group">
                {
                    dropList?.map((item, index) => {
                        return <ListGroup.Item key={index} onClick={() => { action(item.action, item.link) }}><i className={item.iconClass}></i>{item.text}</ListGroup.Item>
                    })
                }
            </ListGroup>
        </div>
    )
}