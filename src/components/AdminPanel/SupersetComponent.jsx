import React, { useEffect, useState } from "react";
import { Spinner, Container } from "react-bootstrap";
import { embedDashboard } from "@superset-ui/embedded-sdk";
import { fetchSupersetGusetToken } from "../../APIs/SupersetAPIs";
import { Tab, Tabs, Nav } from 'react-bootstrap';
import "./AdminPanel.css";

function Dashboard({ dashboardId }) {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log("nonononononononononononononononononononononononononononononon");
        setLoading(true);
        const embed = async () => {
            const token = await fetchSupersetGusetToken().then(res => res.data.token)
            embedDashboard({
                id: dashboardId, // given by the Superset embedding UI
                supersetDomain: "https://superset.zone.ps",
                mountPoint: document.getElementById("superset-container"), // any html element that can contain an iframe
                fetchGuestToken: () => token,
                dashboardUiConfig: { hideTitle: true } // dashboard UI config: hideTitle, hideTab, hideChartControls (optional)
            });
        }
        embed()
        setLoading(false);
    }, []);

    return (
        !loading ? /* superset container */
            <div className="" id="superset-container"></div> :
            <div className="d-flex mt-5 justify-content-center"><Spinner animation="border" size="lg" /></div>
    )
}


// dynamically generate navbar tabs given a list of tab names
function SupersetComponent() {

    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);

    const dashboards = [
        { "name": "Operations", "id": "f03e7777-89ae-4351-af5d-33b160745694" },
        { "name": "Audits", "id": "d3dfeaa0-45b5-4298-b93c-f520029b81ae" },
        { "name": "Transporters", "id": "6346ab5e-ccfb-4878-97d7-77a1a39389de" },
        { "name": "Metrics", "id": "63e35e3d-df1b-4c89-b9ce-bdc0a691e2a6" },
        { "name": "Ibtikar", "id": "699ee2b3-f616-4f95-ba81-d2639ff53c2e" },
    ]

    // const [key, setKey] = useState('Operations');

    const [currentActive, setCurrentActive] = useState(dashboards[0].id);

    useEffect(() => {
        const interval = setInterval(() => {
            setRefresh(!refresh)
            console.log("refresh interval")
        }, 10000);

        return () => clearInterval(interval);
    }, [])

    useEffect(() => {

        // console.log(currentActive);

        setLoading(true);
        const embed = async () => {
            const token = await fetchSupersetGusetToken().then(res => res.data.token)
            embedDashboard({
                id: currentActive, // given by the Superset embedding UI
                supersetDomain: "https://superset.zone.ps",
                mountPoint: document.getElementById("superset-container"), // any html element that can contain an iframe
                fetchGuestToken: () => token,
                dashboardUiConfig: { hideTitle: true } // dashboard UI config: hideTitle, hideTab, hideChartControls (optional)
            });
        }
        embed()

        setLoading(false);

    }, [currentActive, refresh]);

    return (
        <div className="h-100">
            <Nav
                className="super-nav"
                justify
                variant="tabs"
                defaultActiveKey={dashboards[0].id}
                activeKey={currentActive}
                onSelect={(eventKey) => { setCurrentActive(eventKey) }}
            >
                <div className="container-fluid">
                    <div className="row">
                        {
                            dashboards.map((navItem, index) => {
                                return <div className="col" key={index}>
                                    <Nav.Item>
                                        <Nav.Link eventKey={navItem.id}>
                                            {navItem.name}
                                        </Nav.Link>
                                    </Nav.Item>
                                </div>
                            })
                        }
                    </div>
                </div>

            </Nav>

            {!loading ? /* superset container */
                <div className="" id="superset-container"></div> :
                <div className="d-flex mt-5 justify-content-center"><Spinner animation="border" size="lg" /></div>}

            {/* <Tabs id="tabs" activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
                {dashboards.map(dashboard => (
                    <Tab eventKey={dashboard.name} key={dashboard.name} title={dashboard.name} className="h-100">
                        <Dashboard dashboardId={dashboard.id} />
                    </Tab>
                ))}
            </Tabs> */}
        </div>
    )
}



export default SupersetComponent;