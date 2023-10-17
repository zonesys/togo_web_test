import {CheckIcon} from "@chakra-ui/icons";
import React from "react";

export default {
    content: {
        w: "100%",
        h: "calc(100% - 50px)",
        position: "relative",
        d: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    container: {
        h: "200px",
        gap: 4,
        p: 10
    },
    gridItems: {
        bg: "white",
        borderRadius: "md",
        borderWidth: 1,
        boxShadow: "md",
        rounded: "md",
        p: 6,
        position: "relative",
        /*overflowY: "scroll"*/
    },
    title: {
        textAlign: "start",
        mt: "1",
        fontWeight: "bold",
        fontSize: "1rem",
        as: "h4",
        mb: "0.5rem",
        color: "#4abfa0"
    },
    greyTitle: {
        color: "#7a8096",
        opacity: "0.7"
    },
    subTitle: {
        color: "gray.500",
        fontWeight: "semibold",
        fontSize: "md"
    },
    divider: {
        ml: "10px",
        width: "200px",
        border: "1px",
        mb: "1rem"
    },
    personalInfoContainer: {
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 6,
        textAlign: "center",
        h: 225,
        w: "100%",
        alignItems: "center"
    },
    workTimeContainer: {
        gridTemplateRows: "repeat(9, 1fr)",
        gridTemplateColumns: "1fr repeat(2, 2fr)",
        gap: "0.6rem",
        textAlign: "center",
        alignItems: "center"
    },
    workTimeItems: {
        gridTemplateColumns: "90px repeat(2, 2fr)",
        gap: 6
    },
    timerIcon: {
        marginLeft: "-20px",
        opacity: 0.7,
        pl: "1rem",
        w: "3.5rem",
        transform: "scale(1.3)",
    },
    workTimeSubmitButton: {
        leftIcon: <CheckIcon/>,
        h: "2.2rem",
        bg: "#4ab663",
        colorScheme: "teal",
        variant: "solid",
        gridColumn: "2 / span 2"
    },
    clientContainer: {
        gridTemplateColumns: "repeat(2, 1fr)",
        gap:4,
        p:10
    },
    updateButton: {
        bg:"#4ab663",
        w:"100%",
        colorScheme:"teal",
        ml:3,
        mt:5
    }
}
