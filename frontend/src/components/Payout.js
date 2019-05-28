import React from 'react'
import axios from 'axios'
import FormError from 'Error'
import { URL } from '../config'
import { getToken, validateTransaction } from '../utils'
import { PayoutTemplate } from '/PayoutTemplate'

export class Payout extends React.Component {
  componentDidMount() {
    const token = getToken()
    if (!token) {
      this.props.history.push('/')
    }
    this.token = token
    this.transaction = {}
  }

  state = {
    transRef: '',
    error: '',
    displayPrint: false
  }

  handleInput =  (e) => {
    this.setState({
      transRef: e.target.value
    })
  }

  getTransaction = (ref) => {
    axios({
      baseUrl: `${URL}/transactions/${ref}`,
      method: 'get',
      headers: { 'token': this.token }
    })
    .then(response => {
      if (
        response &&
        response.data &&
        response.data.transaction
      ) {
        if (validateTransaction(response.data.transaction)) {
          this.transaction = response.data.transaction
          this.setState({
            error: ''
          })
        } else {
          this.setState({
            error: 'Invalid transaction'
          })
        }
      }
    })
    .catch(err => {
      if (err.message === 'Request failed with status code 400') {
        this.setState({
          error: `No transaction record for this ref: ${ref}`
        })
      }
    })
  }

  render () {
    return (
      <input type="text" name="reference" placeholder="transaction reference" onChange={this.handleInput} />
      <button onClick={() => {
          if (this.state.transRef !== '') {
            try {
               getTransaction(this.state.transRef)
               this.setState({
                 displayPrint: true
               })
            } catch (e) {
              this.setState({
                error: `Error: could not get transaction`
              })
            }
          }
      }}></button>
      {this.state.error && <FormError error={this.state.error}/>}
      {
        if (
          this.state.tranRef &&
          this.state.displayPrint
        ) {
          return   <PayoutTemplate
                        name={this.transaction.name}
                        senderName={this.transaction.sender}
                        id={this.transaction.receiverId}
                        amount={this.transaction.amount}
                        currency={this.transaction.currency}
                        pickUpLocation={this.transaction.location}
                        status={this.transaction.status}
                        token={this.token}
                    />
        }

      }
    )
  }
}
