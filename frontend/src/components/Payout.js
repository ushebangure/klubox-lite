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
    }
  }

  state = {
    transRef: '',
    error: '',
    displayPrint: false
    transaction: ''
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
          this.setState({
            transaction: response.data.transaction,
            error: ''
          })
        } else {
          this.setState({
            error: 'Invalid transaction',
            transaction: '',
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
                  error: `Error: could not get transaction`,
                  displayPrint: false
                })
              }
            }
        }}>Get</button>
        {this.state.error && <FormError error={this.state.error}/>}
        {
          (
            this.state.tranRef &&
            this.state.transaction &&
            this.state.displayPrint
          ) &&
          <PayoutTemplate
            agentId={this.id}
            transRef={this.state.transaction.ReferenceNumber}
            senderName={`${this.state.transaction.Sender.Name} ${this.state.transaction.Sender.Surname}`}
            receiverId={this.state.transaction.Receiver.ID}
            amount={this.state.transaction.AmountToSend}
            currency={this.state.transaction.CurrencyToSend}
            pickUpLocation={this.state.transaction.PickLocation.Name}
            status={this.state.transaction.Status}
            receiverName={this.state.transaction.Receiver.Name}
            receiverSurname={this.state.transaction.Receiver.Surname}
            receiverPhoneNumber={this.state.transaction.Receiver.Phone}
            token={this.token}
          />
        }
      </div>
    )
  }
}
