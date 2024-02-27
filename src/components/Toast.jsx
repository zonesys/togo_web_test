import { useToast } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
export default function Toast() {
    const toast = useToast();
    const toastData = useSelector(state => state.general.toastData);
    const intl = useIntl();
    useEffect(() => {
        if (toastData) {
            const {title, description, status, position} = toastData;
            toast({
                title: (typeof title === 'string' || title instanceof String) ? intl.formatMessage({
                    id: title,
                    defaultMessage: title
                }) : title,
                description: description.toString(),
                status: status,
                duration: 9000,
                isClosable: true,
                position: "top-right"
            })
        }
    }, [toastData, toast]);

    return (
        <div></div>
    );
}