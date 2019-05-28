import React from 'react'

export const ListHeader = () =>
        <tbody>
        <tr className="ListHeader">
          <td className="ColumnTransact" colSpan={7} >Transaction</td>
          <td className="ColumnReciever" colSpan={3} >Receiver</td>
          <td className="ColumnSender" colSpan={2}>Sender</td>
          <td className="ColumnStatus" colSpan={1}>Status</td>
        </tr>
        <tr className="Transaction">
          <td style={{width: "5%"}}>Created</td>
          <td style={{width: "10%"}}>Transaction Ref</td>
          <td style={{width: "10%"}}>Collection Method</td>
          <td style={{width: "10%"}}>Amount Recieved</td>
          <td style={{width: "10%"}}>Exchange Rate</td>
          <td style={{width: "10%"}}>Total Charges</td>
          <td style={{width: "7%"}}>Total Paid</td>
          <td style={{width: "5%"}}>Name</td>
          <td style={{width: "5%"}}>Phone No.</td>
          <td style={{width: "10%"}}>Id No.</td>
          <td style={{width: "10%"}}>Name</td>
          <td style={{width: "10%"}}>Phone No.</td>
          <td style={{width: "10%"}}></td>
        </tr>
        </tbody>
