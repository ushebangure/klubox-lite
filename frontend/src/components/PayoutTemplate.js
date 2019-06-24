import React from 'react'
import axios from 'axios'
import { URL } from '../config'
import { FormError } from './Error'
import { printReceipt } from '../utils'

export class PayoutTemplate extends React.Component {
  state ={
    status: this.props.status,
    error: '',
    print: true
  }

  handlePayout = () => {
    if (this.state.status === 'Pending') {
      this.setState({
        print: false
      })
      return(
        <button
         className="PayoutButton"
         onClick={
            () => {
              axios({
                baseUrl: `${URL}/transactions/${this.props.transRef}`,
                method: 'put',
                headers: {'token': this.props.token}
              }).then(response => {
                if (
                  response &&
                  response.status === 202
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

  render () {
   return (
     <frags>
       {this.state.error && <FormError error={this.state.error} />}
       {
         !this.state.error &&
         <div className="PayoutTemplate">
           <div style={{width: '50%', margin: '0 auto', 'justify-content': 'center'}}>
           <div className="TransactRow" style={{background: 'lightblue'}}><h3 style={{color: 'blue'}}>Transaction Details</h3></div>
           <tr className="TransactRow">
             <td className="td1">Transacton Ref:</td>
             <td className="td1">{this.props.transRef}</td>
           </tr>
           <tr className="TransactRow">
             <td className="td1">Name:</td>
             <td className="td1">{this.props.receiverName}</td>
           </tr>
           <tr className="TransactRow">
             <td className="td1">Surname:</td>
             <td className="td1">{this.props.receiverSurname}</td>
           </tr>
           <tr className="TransactRow">
             <td className="td1">Phone No:</td>
             <td className="td1">{this.props.receiverPhoneNumber}</td>
           </tr>
           <tr className="TransactRow">
             <td className="td1">ID No:</td>
             <td className="td1">{this.props.id}</td>
           </tr>
           <tr className="TransactRow">
             <td className="td1">Sender:</td>
             <td className="td1">{this.props.senderName}</td>
           </tr>
           <tr className="TransactRow">
             <td className="td1">Amount:</td>
             <td className="td1">{this.props.amount}</td>
           </tr>
           <tr className="TransactRow">
             <td className="td1">Currency:</td>
             <td className="td1">{this.props.currency}</td>
           </tr>
           <tr className="TransactRow">
             <td className="td1">Location:</td>
             <td className="td1">{this.props.pickUpLocation}</td>
           </tr>
           <tr className="TransactRow">
             <td className="td1">Status:</td>
             <td className="td1">{this.state.status}</td>
           </tr>
           <tr className="TransactRow">
             <td className="td1"></td>
             <td className="td1">
               {this.handlePayout}
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
              </td>
            </tr>
          </div>
         </div>
       }
    </frags>
   )
  }

}
