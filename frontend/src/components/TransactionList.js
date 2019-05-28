import React from "react";
import ReactPaginate from "react-paginate";
import { Transaction } from "./Transaction";
import { ListHeader } from "./ListHeader";
import { TransactionListManagementTab } from "./TransactionListManagementTab";
import { START_DATE, END_DATE } from "../config";

const transactions = [];

export class TransactionList extends React.Component {
  state = {
    page: 1,
    filter: "",
    fromDate: START_DATE,
    toDate: END_DATE
  };

  changeList = (name, value) => {
    this.setState({
      [name]: value
    });
  };

  render() {
    return (
      <div>
        <TransactionListManagementTab
          filter={this.state.filter}
          fromDate={this.state.fromDate}
          toDate={this.state.toDate}
          changeList={this.changeList}
        />
        <ListHeader />
        {transactions.map(trans => (
          <Transaction
            created={trans.created}
            ref={trans.ref}
            collectionMethod={trans.collectionMethod}
            amtRecvd={trans.amtRecvd}
            totalCharge={trans.totalCharge}
            totalPaid={trans.totalPaid}
            rcverName={trans.rcverName}
            rcverPhone={trans.rcverPhone}
            rcverId={trans.rcverId}
            senderName={trans.senderName}
            senderPhone={trans.senderPhone}
            status={trans.status}
          />
        ))}

    </div>

    );
  }
}

// Todo - add pagination

// <ReactPaginate
//   pageCount={8}
//   pageRangeDisplayed={3}
//   marginPagesDisplayed={3}
//   onPageChange={page => {
//     this.setState({
//       page: page
//     });
//   }}
// />
