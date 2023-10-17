import ReactPaginate from 'react-paginate';
import React from 'react';
import "./Pagination.css";

export default function PaginateComp({totalNumOfRecs, activePage, pageSize, setActive}){
    
    return (
        <div style={{textAlign: "center"}}>
        {totalNumOfRecs / pageSize !== 0 && <ReactPaginate
            previousLabel={'<'}
            nextLabel={'>'}
            breakLabel={'...'}
            breakClassName={'dots-break'}
            pageCount={Math.ceil(totalNumOfRecs / pageSize)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={(data)=>{
                setActive(data.selected);
            }}
            initialPage={activePage}
            containerClassName={'paginate'}
            activeClassName={'active-page'}
            nextClassName="next-li"
            pageClassName="page-li"
            previousClassName="prev-li"
        />}
        </div>
    )
}


/* import React, { useMemo } from "react";
import Pagination from "react-bootstrap/Pagination";
function CustomPagination({totalNumOfRecs, activePage, pageSize, setActive}){

    const pagesArr = useMemo(() => {
        const numOfPages = Math.ceil(totalNumOfRecs / pageSize);
        return { 
            numOfPages,
            items: Array.from({length: numOfPages}, (_, i) => i + 1)
        };
    }, [totalNumOfRecs, pageSize]);

    return (
        <div style={{textAlign: "center"}}>
            <Pagination style={{display: "inline-flex"}}>
                <Pagination.First 
                    disabled={activePage === 0}
                    onClick={()=>{
                        setActive(0);
                    }}
                />
                <Pagination.Prev 
                    disabled={activePage === 0}
                    onClick={()=>{
                        setActive(activePage - 1 < 0 ? 0 : activePage -1 );
                    }}
                />
                {
                    pagesArr.items.map((_, i) => {
                        return (
                            <Pagination.Item 
                                onClick={()=>setActive(i)}
                                active={i === activePage}
                            >
                                {i + 1}
                            </Pagination.Item>
                        )}
                    )
                }
                <Pagination.Next 
                    disabled={activePage === pagesArr.numOfPages - 1}
                    onClick={()=>{
                        let numOfPages = pagesArr.numOfPages - 1;
                        setActive(activePage + 1 > numOfPages ? numOfPages : activePage + 1);
                    }}
                />
                <Pagination.Last 
                    disabled={activePage === pagesArr.numOfPages - 1}
                    onClick={()=>{
                        setActive(pagesArr.numOfPages - 1);
                    }}
                />
            </Pagination>
        </div>
    );
}
 */