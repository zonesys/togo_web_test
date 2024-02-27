import React, {useEffect, useRef, useState} from "react";
import {Button, Form, FormControl, Modal, Spinner} from "react-bootstrap";
import {SetWorkingHours} from "../APIs/LoginAPIs";
import {GetCityRegion} from "../APIs/OrdersAPIs";
import locationImg from "../assets/locationn.png";

var DAYS = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

function FromToFields({id, children, time, onChangeStartTime, onChangeEndTime}) {

    return (
        <div className="align-items-center d-flex">
            {children}
            <p className="me-2">From</p>
            <FormControl
                type="time"
                className="bg-white rounded-22 w-auto"
                name="from"
                value={time.from}
                onChange={onChangeStartTime}
            />
            <p className="me-2">to</p>
            <FormControl
                type="time"
                className="bg-white rounded-22 w-auto"
                name="to"
                value={time.to}
                onChange={onChangeEndTime}
            />
        </div>
    )
}

export default function WorkInfo() {
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [open, setOpen] = useState(false);
    const [cities, setCities] = useState([]);
    const [selectedCities, setSelectedCities] = useState([]);
    const [isAllTime, setIsAllTime] = useState("1")
    const [selectedDays, setSelectedDays] = useState(DAYS)
    const [selectedTimeRange, setSelectedTimeRange] = useState("1");
    const [time, setTime] = useState({
        from: "",
        to: "",
    })
    const handleChangeEndTime = e => {
        setTime({
            from: time.from, to: e.target.value,
        })
    }
    const handleChangeStartTime = e => {
        setTime({
            from: e.target.value, to: time.to,
        })
    }
    const formRef = useRef();
    useEffect(() => {
        GetCityRegion().then((res) => {
            setCities(res.data.server_response);
        });
    }, [])
    const getTime = {
        Saturday: {SatTimeStart: "", SatTimeFinish: ""},
        Sunday: {SunTimeStart: "", SunTimeFinish: ""},
        Monday: {MonTimeStart: "", MonTimeFinish: ""},
        Tuesday: {TueTimeStart: "", TueTimeFinish: ""},
        Wednesday: {WenTimeStart: "", WenTimeFinish: ""},
        Thursday: {ThuTimeStart: "", ThuTimeFinish: ""},
        Friday: {FriTimeStart: "", FriTimeFinish: ""}
    }
    useEffect(() => {
        const data = DAYS.map(day => ({day, isChecked: false, ...getTime[day]}));
        setSelectedDays(data);
    }, []);

    let locationsArray = Array.from(selectedCities, item => ({...item[1]}))
    return (
        <div className="mainbg">
            <div className="h1 p-3 text-center togo-button">
                Create account / transporter
            </div>
            <Form
                className="m-auto w-75"
                onSubmit={(event) => {
                    event.preventDefault();
                    const result = selectedDays.reduce((obj, cur) => ({...obj, ...cur}), {});
                    delete result.day;
                    delete result.isChecked;
                    const requestTime = {
                        ...result,
                        AllTimeFlag: isAllTime,
                    }
                    const requestAllTime = {
                        AllTimeFlag: isAllTime,
                        AllTimeStart: time.from,
                        AllTimeFinish: time.to,
                    }
                    const request = isAllTime === "0" ? requestTime : requestAllTime;
                    SetWorkingHours(locationsArray, request);
                    //console.log(event.target);
                    // console.log(event.target[0].value)
                    // console.log(event.target.elements.FirstName.value)
                    // console.log(event.target.FirstName.value)

                }}
                onChange={(event) => {
                    console.log(event.target);
                    if (event.target.name) {
                        setSelectedTimeRange(event.target.value);
                    }
                }}
            >
                <p className="text-center togo-border h4">Work information</p>
                <p>Work area</p>
                <div className="togo-outling" onClick={() => {
                    setOpen(true);
                }}>
                    <div className="d-flex text-center bg-white rounded-22">
                        <img src={locationImg} style={{width: "24px", height: "24px"}} className="me-1"
                             alt="worldicon"/>
                        <span className="flex-grow-1">Select Work areas</span>
                    </div>
                </div>
                <p>Select working time</p>
                <FromToFields time={time} onChangeStartTime={handleChangeStartTime}
                              onChangeEndTime={handleChangeEndTime}>
                    <Form.Check
                        label="All Days"
                        type="radio"
                        id="allDays"
                        name="time"
                        value={"1"}
                        checked={isAllTime === "1"}
                        onChange={(e) => setIsAllTime(e.target.value)}
                        className="togo-checkbox flex-grow-1"
                        // defaultChecked
                    />
                </FromToFields>

                <Form.Check
                    label="Days of the week"
                    type="radio"
                    id={`someDays`}
                    name="time"
                    value={"0"}
                    checked={isAllTime === "0"}
                    onChange={(e) => setIsAllTime(e.target.value)}
                    className="togo-checkbox"
                />
                {isAllTime === "0" && <div>
                    {
                        selectedDays.map((day) => {
                            return (
                                <div className="align-items-center d-flex" key={day.day}>
                                    <Form.Check
                                        label={day.day}
                                        type="checkbox"
                                        id={`${day.day}someDays`}
                                        name={`${day.day}time`}
                                        checked={day.isChecked}
                                        onChange={e => {
                                            const newData = selectedDays.map(selectedDay => selectedDay?.day === day.day ? ({
                                                ...day,
                                                isChecked: e.target.checked
                                            }) : selectedDay);
                                            setSelectedDays(newData);
                                        }}
                                        className="togo-checkbox flex-grow-1"
                                    />

                                    <p className="me-2">From</p>
                                    <FormControl
                                        type="time"
                                        className="bg-white rounded-22 w-auto"
                                        name={day.day && Object.keys(getTime[day.day])[0]}
                                        // value={day.day && Object.values(getTime[day.day])?.[0]}
                                        onChange={e => {
                                            const newData = selectedDays.map(selectedDay => selectedDay?.day === day.day ? ({
                                                ...day,
                                                [Object.keys(getTime[day.day])[0]]: e.target.value
                                            }) : selectedDay);
                                            setSelectedDays(newData);
                                        }}
                                        disabled={!day.isChecked}
                                    />
                                    <p className="me-2">to</p>
                                    <FormControl
                                        type="time"
                                        className="bg-white rounded-22 w-auto"
                                        name={day.day && Object.keys(getTime[day.day])[1]}
                                        // value={day.day && Object.values(getTime[day.day])?.[1]}
                                        onChange={e => {
                                            const newData = selectedDays.map(selectedDay => selectedDay?.day === day.day ? ({
                                                ...day,
                                                [Object.keys(getTime[day.day])[1]]: e.target.value
                                            }) : selectedDay);

                                            setSelectedDays(newData);
                                        }}
                                        disabled={!day.isChecked}
                                    />
                                </div>
                            )
                        })
                    }
                </div>}
                <Button
                    variant=""
                    type="submit"
                    className="d-block m-auto rounded-22 togo-button w-25"
                    disabled={loadingSubmit}
                    // onClick={(event)=>{
                    //     setLoadingSubmit(true);
                    //     // SetTransporterPersonalInfo(
                    //     // ).then((res) => {
                    //     //     setLoadingSubmit(false);
                    //     //     history.push("/business-info")
                    //     // });
                    // }}
                >
                    {loadingSubmit && <Spinner animation="border" size="sm"/>}
                    Accept
                </Button>
            </Form>
            <Modal show={open} onHide={() => {
                setOpen(false);
            }}>
                <Modal.Header>
                    <Modal.Title>Select areas</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form ref={formRef}>
                        {cities.map((city) => {
                            return (
                                <Form.Check
                                    label={city.Name}
                                    type="checkbox"
                                    id={`${city.Name}-someDays`}
                                    name={city.Name}
                                    key={city.IdCity}
                                    value={city.IdCity}
                                    className="togo-checkbox"
                                    defaultChecked={selectedCities?.get?.(city.IdCity)}
                                />
                            )
                        })}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        setOpen(false);
                    }}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => {
                        let selected = new Map();
                        Array.from(formRef.current.elements).forEach((elem) => {
                            if (elem.checked) {
                                selected.set(elem.value, {
                                    IdCity: elem.value
                                });
                            }
                        })
                        setSelectedCities(selected);
                        setOpen(false);
                    }}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}