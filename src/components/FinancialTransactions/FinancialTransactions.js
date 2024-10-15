import React, { useEffect, useState } from 'react';
import translate from "../../i18n/translate";
import './FinancialTransactions.css';
import { getFinancialTransactions, invoicesTest } from '../../APIs/OrdersAPIs';
import "./FinancialTransactions.css";
import { Link } from "react-router-dom";
import Loader from "../Loader/Loader";
import { Box } from "@chakra-ui/layout";
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';

/* convert order number to a link to display order details */
function orderIdFormatter(value) {
  return <>
    {Number(value) ? <Link
      to={{
        pathname: `/account/Order/${value}`,
      }}
      className="orderLink"
    >
      {value}
    </Link> : value}
  </>
}

/* time formatter, to convert from 24 hrs system to 12 hrs system */
function timeFormatter(value) {
  const tempStr = value.split(":");
  let time = value;
  if (tempStr[0].length === 1)
    time = "0".concat(value);

  // Check correct time format and split into components
  time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

  if (time.length > 1) { // If time format correct
    time = time.slice(1);  // Remove full string match value
    time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
    time[0] = +time[0] % 12 || 12; // Adjust hours
  }
  return time.join(''); // return adjusted time or original string
}

export default function Transactions() {
  const [data, setData] = useState([]);
  const [totalSize, setTotalSize] = useState(null); // Total number of records
  const [currentPage, setCurrentPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [refFilter, setRefFilter] = useState(undefined)

  const paginationOptions = {
    page: currentPage,            // Initialize the current page
    sizePerPage: sizePerPage,               // The number of rows per page
    totalSize: totalSize,
    showTotal: true,              // Show total number of records
    alwaysShowAllBtns: true,      // Always show next and previous buttons
    sizePerPageList: [10, 25, 100], // Options for rows per page
    onPageChange: (page, sizePerPage) => {
      setCurrentPage(page)
      setSizePerPage(sizePerPage)
    },
    onSizePerPageChange: (sizePerPage, page) => {
      setSizePerPage(sizePerPage);  // Update size per page
      setCurrentPage(page);  // Reset to the first page of the new size
    }
  };

  // Handle filter changes
  const handleFilterChange = (filterObj) => {
    setRefFilter(filterObj); // Update the filters state
    setCurrentPage(1);  // Reset to the first page whenever filters change
  };

  useEffect(() => {
    let isMounted = true;
    getFinancialTransactions(localStorage.getItem("userId"), currentPage, sizePerPage, refFilter).then(res => {
      setTotalSize(res.data.server_response.count)

      if (isMounted) {
        setData(res.data.server_response.data.result.response);
      }
    })
    return () => { isMounted = false };
  }, [currentPage, sizePerPage, refFilter]);

  /* table columns */
  const columns = [
    {
      dataField: 'ref',
      text: translate("TRANSACTIONS.ORDER_ID"),
      formatter: orderIdFormatter,
      filter: textFilter({ style: { width: '100px', marginLeft: "10px", marginRight: "10px" }, placeholder: 'ID...' }),
      style: { width: "250px" }
    },
    {
      dataField: 'move_name',
      text: translate("TRANSACTIONS.NAME")
    },
    {
      dataField: 'date',
      text: translate("TRANSACTIONS.DATE")
    },
    {
      dataField: 'time',
      text: translate("TRANSACTIONS.TIME"),
      formatter: timeFormatter
    },
    {
      dataField: 'journal_id_name',
      text: translate("TRANSACTIONS.JOURNAL_NAME")
    },
    {
      dataField: 'credit',
      text: translate("TRANSACTIONS.IN"),
      style: function callback(cell) { return { fontWeight: parseFloat(cell) > 0 ? 'bold' : '', color: parseFloat(cell) === 0 ? 'lightgray' : '' } }
    },
    {
      dataField: 'debit',
      text: translate("TRANSACTIONS.OUT"),
      style: function callback(cell) { return { fontWeight: parseFloat(cell) > 0 ? 'bold' : '', color: parseFloat(cell) === 0 ? 'lightgray' : '' } }
    }
  ];

  /* clear the borders for table headers */
  for (let i = 0; i < columns.length; i++) {
    columns[i].headerStyle = { border: 'none' }
  }

  if (totalSize > 0 || totalSize == 0) {
    return (
      <div className="pe-4 ps-4 pt-2">

        <BootstrapTable
          keyField='id'
          data={data}
          columns={columns}
          pagination={paginationFactory(paginationOptions)}
          rowClasses={"custom-row-class"}
          columnClasses={"custom-column-class"}
          filter={filterFactory()}
          remote={{
            pagination: true, // Enable server-side pagination
            filter: true // Enable server-side filtering
          }}
          onTableChange={(type, { page, sizePerPage, filters }) => {
            console.log({ type, page, sizePerPage, filters })
            if (type === 'pagination') {
              setCurrentPage(page);
              setSizePerPage(sizePerPage);
            }
            if (type === 'filter') {
              handleFilterChange(filters); // Capture filter changes
            }
          }}
        />

      </div>
    );
  } else if (totalSize == null) {
    return <Box height="400px"><Loader /></Box>
  }

  return <div className="w-100 d-flex justify-content-center mt-5">There are no Transactions</div>

};