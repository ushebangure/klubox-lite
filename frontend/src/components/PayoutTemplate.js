import React from 'react'
import axios from 'axios'
import { URL } from '../config'
import FormError from 'Error'
import { printReceipt } from '../utils'

export class Template extends React.Component {
  state ={
    status: this.props.status,
    error: '',
    print: true
  }

  render () {
   return (
     <div>
       <h3>Transaction Details</h3>
       Transacton Ref: {this.props.transRef}
       Name: {this.props.recverName}
       ID No: {this.props.id}
       Sender: {this.props.senderName}
       Amount: {this.props.amount}
       Currency: {this.props.currency}
       Location: {this.props.pickUpLocation}
       Status: {this.state.status}
       {if (this.state.status === 'Pending') {
         this.setState({
           print: false
         })
         return(
           <button
            className="PayoutButton"
            onClick={
               () => {
                 axios({
                   baseUrl: `${URL}/transactions/complete/${transRef}`,
                   method: 'put',
                   headers: {'token': this.props.token}
                 }).then(response => {
                   if (
                     response &&
                     response.status === 201
                   ) {
                     this.setState({
                       status: 'Completed',
                       error: '',
                       print: true
                     })
                   } else {
                     this.setState({
                       error: `Error payout could not be completed`
                     })
                   }
                 }).catch(err => {
                   this.setState({
                     error: `Error payout could not be completed`
                   })
                 })
               }
             }
           >
             Pay
           </button>
         )
       }
      }
      {
        this.state.print &&
        <button
          className="PrintButton"
          onClick={
            printReceipt(
              this.props.name,
              this.props.recieverId,
              this.props.sender,
              this.props.amount,
              this.props.currency,
              this.props.transRef,
              this.props.sentDate
            )
          }
        >
          Print
        </button>
      }
     </div>
   )
  }

}
