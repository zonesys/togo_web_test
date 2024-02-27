import React, { useEffect, useState } from 'react'
import { Spinner, Table } from 'react-bootstrap'
import {
  getLoans
} from "../../APIs/AdminPanelApis"

function Loans() {

  const [loans, setLoans] = useState([]);
  const [loansLoading, setLoansLoading] = useState(false);

  useEffect(() => {
    /* setLoansLoading(true)
    getLoans().then((res) => {
      console.log(res.data)

      setLoans(res.data.loans)

      setLoansLoading(false)
    }) */
  }, [])

  function formatAmount(number) {
    return !!number ? parseFloat(number).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "0.00"
  }

  return (
    <div className='container-fluid p-3'>
      <div className="row">
        <div className="col">
          <Table striped bordered>
            <thead>
              <tr>
                <th>User ID</th>
                <th>User Name</th>
                <th>Loan Balance</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td colSpan={3}>Paused</td>
              </tr>
              {loansLoading ? <tr><td colSpan={3} className='text-center'><Spinner animation="border" size="lg" /></td></tr> :
                loans?.map((loan, index) =>
                  <tr key={index}>
                    <td className='text-center'>
                      {loan.user_id}
                    </td>
                    <td className='text-center'>
                      {loan.user_name}
                    </td>
                    <td className='text-center'>
                      {formatAmount(loan.loan_balance)}
                    </td>
                  </tr>
                )
              }
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  )
}

export default Loans