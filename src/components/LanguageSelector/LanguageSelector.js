import React from 'react';
import {
    Box, Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger, Text,
    useDisclosure
} from "@chakra-ui/react";
import {LOCALES} from "../../i18n";
import translate from "../../i18n/translate";
import {changeLanguage} from "../../Actions/GeneralActions";
import {useDispatch, useSelector} from "react-redux";
import { refreshPage } from "../../Functions/CommonFunctions";

const styles = {
    languageItem: {
        p: "0.2rem",
        cursor: "pointer",
        _hover: {
            bg: "#ebf1f9"
        }
    },
};

export default function LanguageSelector() {
    const language = useSelector(state => state.general.language);
    const dispatch = useDispatch();
    const { onOpen, onClose, isOpen } = useDisclosure();

    const handleClick = (language) => {
        // refreshPage();
        dispatch(changeLanguage(language));
        onClose();
    };

    return (
        <Popover
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
        >
            <PopoverTrigger>
                <Box mx={7} cursor="pointer">{LOCALES[language].text}</Box>
            </PopoverTrigger>
            <PopoverContent className="popover-content" w={200} color="black">
                <PopoverArrow/>
                <PopoverCloseButton/>
                <PopoverHeader textColor="left"
                               fontSize="15px">{translate("HEADER.CHOOSE_LANGUAGE")}</PopoverHeader>
                <PopoverBody fontSize="md" fontWeight={100}>
                    {Object.keys(LOCALES).map(key => {
                        const locale = LOCALES[key];
                        return <Text key={key} {...styles.languageItem}
                                     onClick={() => handleClick(key)}>{locale.text}</Text>
                    })}
                </PopoverBody>
            </PopoverContent>
        </Popover>
    );
};
