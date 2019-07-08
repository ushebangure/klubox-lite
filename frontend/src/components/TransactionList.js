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
    getTransactions()
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

  getTransactions = () => {
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
            Array.isArray(response.data.transactions)
          ) {
            this.setState({
              error: '',
              transactions: response.data.transactions
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

  search = () => {
    if (this.state.toDate.getTime() <= this.state.fromDate.getTime()) {
      this.setState({
        error: 'Invalid time range'
      })
      return
    }
    getTransactions()
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
          (this.state.page*10 < this.state.transactions.length ? this.state.page*10 : this.state.transactions.length)
        ).map(trans =>
           <Transaction
            created={trans.CreatedAt}
            ref={trans.ReferenceNumber}
            collectionMethod={trans.CollectionMethod}
            amtRecvd={`${trans.CurrencyToSend} ${trans.AmountToSend}`}
            totalCharge={`${trans.CurrencyToPay} ${trans.Charges}`}
            totalPaid={`${trans.CurrencyToPay} ${trans.TotalToPay}`}
            rcverName={trans.Receiver.Name}
            rcverPhone={trans.Receiver.Phone}
            rcverId={trans.Receiver.ID}
            senderName={trans.Sender.Name}
            senderPhone={trans.Sender.Phone}
            status={trans.Status}
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
