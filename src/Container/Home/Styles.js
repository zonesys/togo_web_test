import homeBg from '../../assets/images/home-bg.jpg';

export default {
    mainContainer: {
        w: "100%",
        h: "92vh",
        bgImage: `url(${homeBg})`,
        bgPosition: "center",
        bgRepeat: "no-repeat",
        bgSize: "cover",
        //color: "white",
        position: "fixed"
    },
    contactHeaderContainer: {
        justifyContent: "flex-end"
    },
    barContainer: {
        //mx: "10rem",
        p: "0.5rem",
        bg: "#FFF",
        alignItems: "center",
        justifyContent: "space-between"
    },
    clickable: {
        cursor: "pointer",
        _hover: {
            transform: "scale(1.1)"
        }
    },
    separator: {
        opacity: 0.5
    },
    searchInput: {
        variant: "flushed",
        h: "inherit",
        w: 300,
        borderBottom: "2px solid",
        borderColor: "#cecece40",
        focusBorderColor: "#cecece",
        _focus:{
            borderColor: "#cecece85",
            boxShadow: "unset"
        }
    },
    menubarItemActive: {
        background: "linear-gradient(to left, #26A69A,#69D4A5)",
    },
    menubarItem: { 
        padding: "3px",
        borderRadius: "5px",
        ml: "10px",
        _hover: {
            cursor: "pointer",
            background: "linear-gradient(to left, #26A69A,#69D4A5)",
        }
    },
    menubarItemDiv: {
        background: "white",
        borderRadius: "2px",
        padding: "2px 15px",
    }
}
