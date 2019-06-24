import React from 'react'
import axios from 'axios'
import { FormError } from './Error'
import { URL } from '../config'
import { getToken, validateTransaction, getAgentId } from '../utils'
import { PayoutTemplate } from './PayoutTemplate'

export class Payout extends React.Component {
  componentDidMount() {
    const token = getToken()
    const id = getAgentId()

    if (!token) {
      this.props.history.push('/')
    } else {
      this.token = token
      this.id = id
      this.transaction = {}
    }
  }

  state = {
    transRef: '',
    error: '',
    displayPrint: false
    transaction: {}
  }

  handleInput =  (e) => {
    this.setState({
      transRef: e.target.value
    })
  }

  getTransaction = (ref) => {
    axios({
      baseUrl: `${URL}/transactions/${this.state.transRef}`,
      method: 'get',
      headers: { 'token': this.token }
    })
    .then(response => {
      if (
        response &&
        (response.status === 200) &&
        response.data &&
        response.data.transaction
      ) {
        if (validateTransaction(response.data.transaction)) {
          this.state.transaction = response.data.transaction
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
      <div className="Payout">
        <input type="text" name="reference" placeholder="transaction reference" onChange={this.handleInput} />
        <button onClick={() => {
            if (this.state.transRef !== '') {
              try {
                 this.getTransaction(this.state.transRef)
                 this.setState({
                   displayPrint: true
                 })
              } catch (e) {
                this.setState({
                  error: `Error: could not get transaction`
                })
              }
            }
        }}>Get</button>
        {this.state.error && <FormError error={this.state.error}/>}
        {
          (
            this.state.tranRef &&
            this.transaction
            this.state.displayPrint
          ) &&
          <PayoutTemplate
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
      </div>
    )
  }
}
