import React, { useEffect, useState } from "react";
import { Button } from 'react-bootstrap';
import { nonoTest } from '../../APIs/AdminPanelApis';

function Test2() {

    /* const [numbers, setNumbers] = useState([]);

    const testHandler = () => {
        nonoTest(1).then((res) => {
            // console.log(res.data.response);
            // setNumbers(res.data.response);
        });
    } */

    const [refresh, serRefresh] = useState(false);

    useEffect(() => {
        console.log("start");
        /* console.log("---------------------------");

        nonoTest(1).then((res) => {
            console.log(res.data.response);
            console.log("---------------------------");
            console.log("end");
        });

        console.log("---------------------------");
        console.log("out"); */
    }, [refresh])

    return (
        <div>
            <Button onClick={() => {serRefresh(!refresh)}} variant="outline-success">test</Button>

        </div>
    )
}

export default Test2;