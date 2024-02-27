import React, {useEffect, useState} from "react";
import {convert24TimeTo12} from "../../Util";
import {Box, Flex, Grid} from "@chakra-ui/layout";
import styles from "./Styles";
import Loader from "../../components/Loader/Loader";
import {Input, InputGroup, InputLeftElement} from "@chakra-ui/input";
import {Button} from "@chakra-ui/button";
import {useDisclosure} from "@chakra-ui/hooks";
import {Popover, PopoverArrow, PopoverCloseButton, PopoverContent, PopoverTrigger} from "@chakra-ui/popover";
import TimeKeeper from "react-timekeeper";
import {getWorkingTime, updateWorkingTime} from "../../Actions/ProfileActions";
import {useDispatch, useSelector} from 'react-redux';
import {IoIosTime} from 'react-icons/io';
import translate from "../../i18n/translate";
import './WorkingTime.css';


export default function WorkingTime() {
    const dispatch = useDispatch();
    const workingTime = useSelector(state => state.profile.workingTime);
    const [workingTimeList, setWorkingTimeList] = useState([]);
    const [loading, setLoading] = useState(true);
    const onUpdateTime = () => {
        dispatch(updateWorkingTime(workingTimeList));
    };

    useEffect(() => {
        dispatch(getWorkingTime());
    }, [dispatch]);

    useEffect(() => {
        const {
            SatTimeStart, SatTimeFinish, SunTimeStart, SunTimeFinish, MonTimeStart,
            MonTimeFinish, TueTimeStart, TueTimeFinish, WenTimeStart, WenTimeFinish,
            ThuTimeStart, ThuTimeFinish, FriTimeStart, FriTimeFinish
        } = workingTime;

        let workingTimeList = [
            {
                title: translate("WORKING_TIME.SATURDAY"),
                id: "Sat",
                from: formatTime(SatTimeStart),
                to: formatTime(SatTimeFinish)
            },
            {
                title: translate("WORKING_TIME.SUNDAY"),
                id: "Sun",
                from: formatTime(SunTimeStart),
                to: formatTime(SunTimeFinish)
            },
            {
                title: translate("WORKING_TIME.MONDAY"),
                id: "Mon",
                from: formatTime(MonTimeStart),
                to: formatTime(MonTimeFinish)
            },
            {
                title: translate("WORKING_TIME.TUESDAY"),
                id: "Tue",
                from: formatTime(TueTimeStart),
                to: formatTime(TueTimeFinish)
            },
            {
                title: translate("WORKING_TIME.WEDNESDAY"),
                id: "Wen",
                from: formatTime(WenTimeStart),
                to: formatTime(WenTimeFinish)
            },
            {
                title: translate("WORKING_TIME.THURSDAY"),
                id: "Thu",
                from: formatTime(ThuTimeStart),
                to: formatTime(ThuTimeFinish)
            },
            {
                title: translate("WORKING_TIME.FRIDAY"),
                id: "Fri",
                from: formatTime(FriTimeStart),
                to: formatTime(FriTimeFinish)
            }
        ];
        setWorkingTimeList(workingTimeList);
        if (Object.keys(workingTime).length) {
            setLoading(false)
        }
    }, [workingTime]);

    const formatTime = (value) => {
        if (!value) return null;
        let time = value.split(" ")[1].slice(0, -3);
        return convert24TimeTo12(time);
    };

    const onTimeChange = (dayId, type, value) => {
        let workingTimeListClone = [...workingTimeList];
        let workingTimeClone = workingTimeListClone.find(workingTime => workingTime.id === dayId);
        workingTimeClone[type] = value;
        setWorkingTimeList(workingTimeListClone)
    };

    return (
        <Box {...styles.content}>
            {loading ? <Loader/> :
                <Grid {...styles.workTimeContainer}>
                    <Grid gridColumn="1 / span 3" {...styles.workTimeItems} {...styles.subTitle}>
                        <Box justifySelf="start">{translate("WORKING_TIME.DAY")}</Box>
                        <Box>{translate("WORKING_TIME.FROM")}</Box>
                        <Box>{translate("WORKING_TIME.TO")}</Box>
                    </Grid>
                    {workingTimeList?.map((workTime, index) => {
                        return (
                            <React.Fragment key={index}>
                                <Box {...styles.title}>
                                    {workTime.title}
                                </Box>
                                {
                                    [
                                        {
                                            type: "from",
                                            popupPlacement: "bottom-start"
                                        },
                                        {
                                            type: "to",
                                            popupPlacement: "left"
                                        }
                                    ].map(item =>
                                        <Flex justifyContent="center" key={`${workTime.title}-${item.type}`}>
                                            <InputGroup w="120px">
                                                <InputLeftElement
                                                    value={2}
                                                    {...styles.timerIcon}
                                                    pointerEvents="none"
                                                    children={<IoIosTime color="gray.300"/>}
                                                />
                                                {workTime[item.type] &&
                                                <TimePickerPopover placement={item.popupPlacement}
                                                                   value={workTime[item.type]}
                                                                   onChange={(value) => onTimeChange(workTime.id, item.type, value)}/>}
                                            </InputGroup>
                                        </Flex>
                                    )
                                }
                            </React.Fragment>
                        )
                    })}
                    <Button onClick={onUpdateTime} {...styles.workTimeSubmitButton}>
                        {translate("WORKING_TIME.UPDATE")}
                    </Button>
                </Grid>
            }
        </Box>
    )
};
const TimePickerPopover = ({placement, value, onChange}) => {
    const {onOpen, onClose, isOpen} = useDisclosure();
    const [time, setTime] = useState(value);

    const onTimeChange = (value) => {
        setTime(value);
        onChange && onChange(value);
    };

    return (
        <>
            <Popover
                isOpen={isOpen}
                onOpen={onOpen}
                onClose={onClose}
                placement={placement}
            >
                <PopoverTrigger>
                    <Input type="phone" onChange={({target: {value}}) => onTimeChange(value)} value={time}
                           textAlign="center"
                           pl="2rem"/>
                </PopoverTrigger>
                <PopoverContent>
                    <PopoverArrow/>
                    <PopoverCloseButton/>
                    <Box zIndex={5}>
                        <TimeKeeper
                            time={time}
                            onChange={(data) => onTimeChange(data.formatted12)}
                        />
                    </Box>
                </PopoverContent>
            </Popover>
        </>
    )

};
