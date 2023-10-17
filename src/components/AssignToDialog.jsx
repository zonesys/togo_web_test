import React, { useState, useEffect } from 'react';
import { Button, Modal } from "react-bootstrap";
import translate from "../i18n/translate";
import MyNetworkDropDown from "./MyNetworkDropDown";
import { GetAllNetworkMembers } from "../APIs/OrdersAPIs";
import { AssginOrderToMemberOnNetwork } from "../APIs/OrdersAPIs";

export default function AssignToDialog({ ordersIds, onSuccess }) {
    const [openAssignModal, setOpenAssignModal] = useState(false);
    const handleAssignModalClose = () => { setOpenAssignModal(false); }

    const [inputValue, setInputValue] = useState('');
    const [selectedMember, setSelectedMember] = useState("");
    const [loading, setLoading] = useState(false);
    const [allNetworkMembers, setAllNetworkMembers] = useState([]);

    const handleAssign = () => {
        /* if (selectedMember === '' || selectedMember === undefined) {
           
            for (let i = 0; i < ordersIds.length; i++) {
                for (let j = 0; j < allNetworkMembers.length; j++) {
                    AssginOrderToMemberOnNetwork(ordersIds[i], allNetworkMembers[j]).then(()=>{
                        // console.log("order-" + ordersIds[i] + " assigned to " + allNetworkMembers[j].FullName)
                    });
                }
            }

            alert("order/s assigned to all");
            
        } else { */

            for (let i = 0; i < ordersIds.length; i++) { // to be fixed 
                AssginOrderToMemberOnNetwork(ordersIds[i], selectedMember.memberId).then(()=>{
                    // console.log("order-" + ordersIds[i] + " assigned to " + selectedMember.FullName)
                });
            }

            onSuccess();
            alert("order/s assigned");
        // }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            if (openAssignModal) {
                setLoading(true);

                GetAllNetworkMembers().then((res) => {
                    setLoading(false);

                    setAllNetworkMembers(res.data.server_response.filter(member => member.FullName.toLowerCase().replaceAll("أ", 'ا').replaceAll("إ", 'ا').includes(inputValue.toLowerCase()) || member.PhoneNumber.includes(inputValue)));
                });
            }
        }, 500)

        return () => {
            return clearTimeout(timer)
        }
    }, [inputValue, openAssignModal]);

    return <>
        <Button /* className={"btn-grad text-white ms-2 me-2"} */ variant="outline-primary" onClick={() => { ordersIds.length > 0 ? setOpenAssignModal(true) : alert("Select order/s first!") }}>{translate("TEMP.ASSIGN_TO")}</Button>
        <Modal size="lg" show={openAssignModal} onHide={handleAssignModalClose} centered animation={true} backdrop="static">

            <Modal.Header closeButton>
                <Modal.Title>{translate("TEMP.ASSIGN_TO")}</Modal.Title>
            </Modal.Header>

            <Modal.Body>

                <MyNetworkDropDown
                    loading={loading}
                    network={allNetworkMembers}
                    onSearch={setInputValue}
                    onSelect={setSelectedMember}
                    selectedMember={selectedMember}
                />

            </Modal.Body>

            <Modal.Footer>
                <Button /* style={{ position: "absolute", left: "1rem" }} */ onClick={() => {handleAssign(); handleAssignModalClose()}}>{translate("TEMP.ASSIGN")}</Button>
                <Button variant="danger" onClick={handleAssignModalClose}>{translate("GENERAL.CLOSE")}</Button>
            </Modal.Footer>

        </Modal>
    </>
}