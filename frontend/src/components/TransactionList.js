import React from "react";
import ReactPaginate from "react-paginate";
import axios from 'axios'
import { Transaction } from "./Transaction";
import { ListHeader } from "./ListHeader";
import { TransactionListManagementTab } from "./TransactionListManagementTab";
import { START_DATE, END_DATE } from "../config";
import { getToken } from '../utils'
import { URL } from '../config'
import { FormError } from './Error'

export class TransactionList extends React.Component {
  componentDidMount() {
    const token = getToken()
    if (!token) {
      this.props.history.push('/')
    } else {
      this.token = token
    }
  }

  state = {
    page: 1,
    filter: "",
    fromDate: START_DATE,
    toDate: END_DATE,
    transactions: [],
    getTrans: true
  };

  changeList = (name, value) => {
    this.setState({
      [name]: value
    });

  };

  search = () => {
    if (this.state.toDate.getTime() <= this.state.fromDate.getTime()) {
      this.setState({
        error: 'Invalid time range'
      })
      return
    }

    axios({
      baseUrl: `${URL}/transactions`,
      method: 'get',
      headers: { 'token': this.token },
      data: {
        filter: this.state.filter,
        dateTo: this.state.toDate,
        dateFrom: this.state.fromDate
      }
    }).then((response) => {
        if (response.status === 200) {
          if (
            response.data &&
            Array.isArray(response.data)
          ) {
            this.setState({
              error: '',
              transactions: response.data
            })
          }
        } else {
          this.setState({
            error: 'Could not retrieve transactions'
          })
        }
    })
    .catch(err => {
      // TODO: log errors somewhere
      this.setState({
        error: err.message
      })
    })
  }

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
        {this.state.error && <FormError error={this.state.error} />}
        {this.state.transactions.slice(
          (this.state.page -1)*10,
          (this.state.page*10 < this.transactions.length ? this.state.page*10 : this.state.transactions.length)
        ).map(trans =>
           <Transaction
            created={trans.date.transact}
            ref={trans.ref}
            collectionMethod={trans.collectionMethod}
            amtRecvd={trans.amountSent}
            totalCharge={trans.totalCharge}
            totalPaid={trans.totalPaid}
            rcverName={trans.receiverName}
            rcverPhone={trans.receiverPhone}
            rcverId={trans.receiverId}
            senderName={trans.senderName}
            senderPhone={trans.senderPhone}
            status={trans.status}
          />
        )}
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
