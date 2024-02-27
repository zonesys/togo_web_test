import React, { useEffect, useState } from "react";
import './MainOrdersNavs.css';
import { useHistory } from "react-router-dom";
import translate from "../../i18n/translate";

export default function MainOrdersNavs({ navsArr, updateNavsArr }) {

    let history = useHistory();
    const [navs, setNavs] = useState([]);

    useEffect(() => {
        setNavs(navsArr);
        // console.log(navsArr);
    }, [])

    const updateNavsArrHandler = (index, linkEvent) => {
        const tempArr = navs;
        tempArr.forEach((item) => { item.isActive = false });
        tempArr[index].isActive = true;
        updateNavsArr(tempArr);

        history.push(`/account/main/${linkEvent}`);
    }

    return (
        <>
            <div className="upperNavContainer d-flex">
                {
                    navs?.map((item, index) => {
                        return <div key={index} className="upperNavItemContainer flex-grow-1">
                            <div className={"upperNavItem " + (item.isActive ? "activeItem" : "nonActiveItem")} onClick={() => { updateNavsArrHandler(index, item.linkEventKey) }}>
                                <div className="mainImage">
                                    <img src={item.isActive ? item.hoverImageSrc : item.mainImageSrc} alt="" />
                                </div>
                                <div className="title">
                                    {translate("ORDERS." + item.title)}
                                </div>
                                {/* <div className="backImage">
                                    <img src={item.isActive ? item.hoverImageSrc : item.mainImageSrc} alt="" />
                                </div> */}
                            </div>
                        </div>
                    })
                }
            </div>
        </>
    )
}