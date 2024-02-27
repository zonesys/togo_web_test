import { FormControl } from "react-bootstrap";
import translate from "../i18n/translate";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import { AddTeamMember, CreateTeam, DeleteMember, DeleteTeam, GetTeam, GetTransporterTeam, UpdateTeam } from "../APIs/OrdersAPIs";
import { useIntl } from "react-intl";
import { Box } from "@chakra-ui/layout";
import DynamicTable from "./DynamicTable/DynamicTable";
import DeleteTeamDialog from "./DeleteTeam";
import TransferBtn from "./TransferBtn";
import { EditTeamDialog } from "./EditTeamDialog";
import { getWallet } from "../APIs/ProfileAPIs";
import { setWallet } from "../Actions/GeneralActions";
import { useDispatch } from "react-redux";

export default function AdminBoard(){
    const [teams, setTeams] = useState([]);
    const [members, setMembers] = useState([
        //{FullName: "test", PhoneNumber: "sdfsdf", TeamStatus: "sdf", TransporterId: "44"}
    ]);
    const [selected, setSelected] = useState(-1);
    const intl = useIntl();
    const createRef = useRef();
    const ref = useRef();
    const getTrans = useCallback(()=>{
        return GetTransporterTeam().then((res)=>{
            setTeams(res.data.server_response);
            return res.data.server_response;
        });
    }, []);
    const getMembers = useCallback(()=>{
        return GetTeam(teams[selected]?.id).then((res) => {
            setMembers(res.data.server_response);
            return res.data.server_response;
        });
    }, [teams, selected]);
    const columns = [
        {label: translate("ADMIN.TEAM_NAME"), key: "Name"},
        {label: "", key: "id", format: ({id, Name}) => {
            return <DeleteTeamDialog teamName={Name} onConfirm={()=>{
                DeleteTeam(id).then(()=>{
                     getTrans();
                });}
            } 
            />
        }},
        {label: "", key: "id", format: ({id, Name})=>{
            return (
            <EditTeamDialog teamName={Name} onConfirm={(teamName)=>{
                UpdateTeam(teamName, id).then(()=>{
                    getTrans();
                });
            }} />
            )
        }}
    ];
    const dispatch = useDispatch();
    const membersColumns = [
        {label: translate("ADMIN.MEMBER_NAME"), key: "FullName"},
        {label: translate("ADMIN.MOBILE_NUMBER"), key: "PhoneNumber"}, 
        {label: translate("ADMIN.STATUS"), key: "TeamStatus"},
        //{label: translate("ADMIN.BALANCE"), key: "Balance"},
        {label: "", key: "TransporterId", format: ({TransporterId, FullName})=>{
            return <DeleteTeamDialog teamName={FullName} onConfirm={()=>{
                DeleteMember(TransporterId).then(()=>{
                    getMembers();
                });
            }}
            />
        }},
        {label: "", key: "TransporterId", format: ({TransporterId})=>{
            return <TransferBtn TransporterId={TransporterId} onSuccess={()=>{
                getMembers().then(()=>{
                    getWallet().then(({data: {server_response}}) => {
                        dispatch(setWallet(server_response[0].TransporterBalance));
                    })
                })
            }} />
        }}
    ];
    
    useEffect(()=>{
        getTrans().then((server_response)=>{
            setSelected(server_response.length ? 0 : -1);
        })
    }, []);

    useEffect(()=>{
        if(selected !== -1){
            getMembers();
        }
    }, [selected]);

    return (
        <div style={{display: "block", width: "90%", margin: "0 auto"}}>
            <Box w="40%" d="inline-block" borderInlineEnd="1px solid #dee2e6" paddingInlineEnd="1%">
                <Box d="flex" borderBottom="1px solid #dee2e6" pb="10px" mb="10px">
                    <FormControl
                        ref={createRef}
                        defaultValue=""
                        style={{flex: "1", marginInlineEnd: "10px"}}
                        placeholder={intl.formatMessage({id:"ADMIN.ENTER_TEAM_NAME"})}
                    />
                    
                    <Button
                        variant="primary"
                        onClick={() => {
                            if(createRef.current.value.trim() === ""){
                                return;
                            }
                            CreateTeam(createRef.current.value).then(()=>{
                                GetTransporterTeam().then((res)=>{
                                    setTeams(res.data.server_response);
                                    createRef.current.value = "";
                                });
                            });
                        }}
                    >
                        {translate("ADMIN.CREATE_TEAM")}
                    </Button>
                </Box>
                <DynamicTable 
                    columns={columns} 
                    data={teams} 
                    onRowSelect={(info, selectedIdx)=>{
                        setSelected(selectedIdx);
                    }}
                    selected={selected}
                />
            </Box>
            <Box w="59%" d="inline-block" verticalAlign="top" marginInlineStart="1%">
                <Box d="flex" borderBottom="1px solid #dee2e6" pb="10px" mb="10px">
                    <FormControl
                        ref={ref}
                        defaultValue=""
                        style={{flex: "1", marginInlineEnd: "10px"}}
                        placeholder={intl.formatMessage({id:"ADMIN.ENTER_MEMBER_NAME"})}
                        disabled={selected === -1}
                    />
                    
                    <Button
                        variant="primary"
                        onClick={()=>{
                            if(ref.current.value.trim() === ""){
                                return;
                            }
                            AddTeamMember(teams[selected].id, ref.current.value).then(() => {
                                GetTeam(teams[selected].id).then((res) => {
                                    setMembers(res.data.server_response);
                                });
                            });
                            ref.current.value = "";
                        }}
                        disabled={selected === -1}
                    >
                        {translate("ADMIN.ADD_MEMBER")}
                    </Button>
                </Box>
                <DynamicTable columns={membersColumns} data={members} />
            </Box>
        </div>
    )
}