import React from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { confirmAlert } from 'react-confirm-alert'
import Select from 'react-dropdown-select'
import { URL } from '../config'
import {
  validatePhoneNumber,
  getTransactionFromState,
  changeCurrency,
  getToken,
  getAgentId
 } from '../utils'
import { FormError } from './Error'

export class Transact extends React.Component {
  componentDidMount() {
    const token = getToken()
    const id = getAgentId()
    if (!token || !id) {
      this.props.history.push('/')
    } else {
      this.token = token
      this.id = id
    }
    const currencies = getCurrencies()
    const locations = getLocations()
    this.setState({
      locations: locations,
      currencies: currencies
    })
  }

  constructor() {
    super()
    this.state = {
      currencies: [],
      locations: [],
      receiverGender: '',
      receiverId: '',
      receiverName: '',
      receiverPhoneNumber: '',
      receiverSurname: '',
      senderName: '',
      senderPhoneNumber: '',
      senderGender: '',
      senderSurname: '',
      amount: 0,
      reference: '',
      totalToPay: 0,
      charges: '',
      currencyToSend: '',
      currencyForPayment: '',
      error: '',
      errorRecPhoneNumber: '',
      errorSenPhoneNumber: '',
      collectionMethod: '',
      displayTotalInput: true,
      displayAmountInput: true,
      location: ''
    }

    this.handleInput = this.handleInput.bind(this)
    this.currencyOptions = this.currencyOptions.bind(this)
    this.locationOptions = this.locationOptions.bind(this)
    this.createTransaction = this.createTransaction.bind(this)
    this.totalToPayInput = this.totalToPayInput.bind(this)
    this.amountToSendInput = this.amountToSendInput.bind(this)
    this.handleSendInput = this.handleSendInput.bind(this)
    this.handlePaymentInput = this.handlePaymentInput.bind(this)
  }

  handleInput =  (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  totalToPayInput = () => {
    if(this.state.displayTotalInput) {
      return <input type="number" name="totalToPay" onChange={e =>
          this.handlePaymentInput(e)} />
    } else {
      return this.state.totalToPay
    }
  }

  handleSendInput = (e) => {
    if (isNaN(e.target.value)) {
      this.setState({error: 'Invalid amount'})
      return
    }
    this.setState({error: ''})

    this.handleInput(e)

    if (!e.target.value) {
      this.setState({
        displayTotalInput: true
      })
    } else {
      if (!this.state.currencyToPay || !this.state.currencyToSend) {
        this.setState({error: 'Enter the currency'})
      } else {
        const totalToPay = changeCurrency(this.state.currencies, e.target.value, this.state.currencyToSend, this.state.currencyToPay)
        this.setState({
          totalToPay: totalToPay
        })
      }
      this.setState({
        displayTotalInput: false
      })
    }
  }


  handlePaymentInput = (e) => {
    if (isNaN(e.target.value)) {
      this.setState({error: 'Invalid amount'})
      return
    }
    this.setState({error: ''})
    this.handleInput(e)

    if (!e.target.value) {
      this.setState({
        displayAmountInput: true
      })
    } else {
      if (!this.state.currencyToPay || !this.state.currencyToSend) {
        this.setState({error: 'Enter the currency'})
      } else {
        const amount = changeCurrency(this.state.currencies, e.target.value, this.state.currencyToPay, this.state.currencyToSend)
        this.setState({
          amount: amount
        })
      }
      this.setState({
        displayAmountInput: false
      })
    }
  }

  amountToSendInput = () => {
    if(this.state.displayAmountInput) {
      return <input type="number" name="amount" onChange={this.handleSendInput} />
    } else {
      return this.state.amount
    }
  }

  createTransaction = () => {
    if (!validatePhoneNumber(this.state.receiverPhoneNumber)) {
      this.setState({
        errorRecPhoneNumber: 'Invalid phone number'
      })
      return
    } else {
      this.setState({
        errorRecPhoneNumber: ''
      })
    }
    if (!validatePhoneNumber(this.state.receiverPhoneNumber)) {
      this.setState({
        errorSenPhoneNumber: 'Invalid phone number'
      })
      return
    } else {
      this.setState({
        errorSenPhoneNumber: ''
      })
    }

    let transaction = getTransactionFromState(this.state)
    transaction.getAgentId = this.id

    if (!transaction) {
      this.setState({
        error: 'Empty fields'
      })
      return
    } else {
      this.setState({
        error: ''
      })
    }

    var create
    confirmAlert({
      title: 'Confirm to submit',
      message: 'Complete transaction',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            create = true
          }
        },
        {
          label: 'No',
          onClick: () => {
            create = false
          }
        }
      ]
    })

    if (create === true) {
      axios({
        baseUrl: `${URL}/transactions`,
        method: 'post',
        headers: {token: this.token},
        data: {
          transaction: transaction
        }
      })
      .then(response => {
        if (response.status === 202) {
          return toast.success("Transaction successful", {
            position: toast.POSITION.BOTTOM_LEFT
          })
        }
        return toast.error("Transaction not successful", {
          position: toast.POSITION.BOTTOM_LEFT
        })
      })
      .catch(err => {
        return toast.error("Error in sending transaction", {
          position: toast.POSITION.BOTTOM_LEFT
        })
      })
    }
  }

  getCurrencies = () => {
    axios({
      baseUrl: `${URL}/currencies`,
      method: 'get',
      headers: {token: this.token},
    })
    .then(response => {
      if (response.status === 200) {
        this.setState({
          currencies: response.data.currencies
        })
        return
      } else {
        this.setState({
          currencies: response.data.currencies
        })
        return toast.error("Error in getting currencies", {
          position: toast.POSITION.BOTTOM_LEFT
        })
      }
    })
    .catch(err => {
      return toast.error(`Error in getting currencies: ${err.message}`, {
        position: toast.POSITION.BOTTOM_LEFT
      })
    })
  }

  getLocations = () => {
    axios({
      baseUrl: `${URL}/locations`,
      method: 'get',
      headers: {token: this.token}
    })
    .then(response => {
      if (response.status === 200) {
        this.setState({
          currencies: response.data.locations
        })
        return
      } else {
        this.setState({
          locations: response.data.locations
        })
        return toast.error("Error in getting locations", {
          position: toast.POSITION.BOTTOM_LEFT
        })
      }
    })
    .catch(err => {
      return toast.error(`Error in getting locations: ${err.message}`, {
        position: toast.POSITION.BOTTOM_LEFT
      })
    })
  }

  currencyOptions = () => {
    const currs = []
    Object.keys(this.state.currencies).map(curr => {
      currs.push({'value': curr, 'label': curr})
    })
    return currs
  }

  locationOptions = () => {
    const locations = []
    this.state.locations.map(location =>
      locations.push({'value': location.Name, 'label': location.Name})
    )
    return locations
  }

  render () {
    return (
      <div style={{margin: '35px'}}>
        <div className="Transact">
          <div className="TransactReceiver">
            <h3 style={{color: 'green'}}>Receiver</h3>
            <tr className='TransactRow'>
              <td className="td">Gender</td>
              <td  className="td">
                <Select
                  name="receiverGender"
                  options={[{value: 'Male', label: 'M'}, {value: 'Female', label: 'F'}]}
                  onChange={(values) => this.setState({receiverGender: values[0]})}
                  style={{height: "10%", width: "50%"}}
                />
              </td>
            </tr>
            <tr className='TransactRow'>
              <td className="td">Name</td>
              <td className="td">
                <input type="text" name="receiverName" onChange={this.handleInput} />
              </td>
            </tr>
            <tr className='TransactRow' >
              <td className="td">Surname</td>
              <td className="td">
                <input type="text" name="receiverSurname" onChange={this.handleInput} />
              </td>
            </tr>
            <tr className='TransactRow'>
              <td className="td">Id No.</td>
              <td className="td">
                <input type="text" name="receiverId" onChange={this.handleInput} />
              </td>
            </tr>
            <tr className='TransactRow'>
              <td className="td" >Phone No.</td>
              <td className="td">
                <input type="text" name="receiverPhoneNumber" onChange={this.handleInput} />
              </td>
            </tr>
            <tr>
              <td></td>
              <td>{this.state.errorRecPhoneNumber && <FormError error={this.state.errorRecPhoneNumber} />}</td>
            </tr>
          </div>
          <div className="TransactSender">
            <h3 style={{color: 'orange'}}>Sender</h3>
            <tr className='TransactRow'>
              <td className="td">Gender</td>
              <td className="td">
                <Select
                  name="receiverGender"
                  options={[{value: 'Male', label: 'M'}, {value: 'Female', label: 'F'}]}
                  onChange={(values) => this.setState({senderGender: values[0]})}
                  style={{height: "10%", width: "50%"}}
                />
              </td>
            </tr>
            <tr className='TransactRow'>
              <td className="td">Name</td>
              <td className="td">
                 <input type="text" name="senderName" onChange={this.handleInput} />
              </td>
            </tr>
            <tr className='TransactRow'>
              <td className="td">Surname</td>
              <td className="td"><input type="text" name="senderSurname" onChange={this.handleInput} /></td>
            </tr>
            <tr className='TransactRow'>
              <td className="td">Phone No.</td>
              <td className="td"><input type="text" name="senderPhoneNumber" onChange={this.handleInput} /></td>
            </tr>
            <tr className="TransactRow">
              <td className="td"></td>
              <td className="td">{this.state.errorSenPhoneNumber && <FormError error={this.state.errorSenPhoneNumber} />}</td>
            </tr>
          </div>
        </div>
        <div className="TransactDetails">
          <h3 style={{color: 'blue'}}>Transaction Details</h3>
          <tr className='TransactRow'>
            <td className="td">Collection Method</td>
            <td className="td">
              <Select
                name="collectionMethod"
                options={[{value: 'Cash', label: 'Cash'}, {value: 'Mobile', label: 'Mobile'}]}
                onChange={(values) => this.setState({receiverGender: values[0]})}
                style={{height: '10%', width: "50%"}}
              />
            </td>
          </tr>
          <tr className='TransactRow'>
            <td className="td">Transaction Ref.</td>
            <td className="td">
              {this.state.reference}
            </td>
          </tr>
          <tr className='TransactRow'>
            <td className="td">Currency To Send</td>
            <td className="td">
              <Select
                options={this.state.currencies.length > 0 ? this.currencyOptions() : []}
                onChange={(values) => {
                  this.setState({
                    currencyToSend: values[0],
                    error: ''
                  })
                }}
                style={{width: "50%"}}
              />
            </td>
          </tr>
          <tr className='TransactRow'>
            <td className="td">Payment Currency</td>
            <td className="td">
              <Select
                options={this.state.currencies.length > 0 ? this.currencyOptions() : []}
                onChange={(values) => {
                  this.setState({
                    currencyToPay: values[0],
                    error: ''
                  })
                }}
                style={{width: "50%"}}
              />
            </td>
          </tr>
          <tr className='TransactRow'>
            <td className="td">Amount To send</td>
            <td className="td">
              {this.amountToSendInput()}
            </td>
          </tr>
          <tr className='TransactRow'>
            <td className="td">Charges</td>
            <td className="td">{this.state.charges}</td>
          </tr>
          <tr className='TransactRow'>
            <td className="td">Total To Pay</td>
            <td className="td">
              {this.totalToPayInput()}
            </td>
          </tr>
          <tr className='TransactRow'>
            <td className="td">Pickup Location</td>
            <td className="td">
              <Select
                options={this.state.locations.length > 0 ? this.locationOptions(), []}
                onChange={(values) => {
                  this.setState({
                    location: values[0],
                    error: ''
                  })
                }}
                style={{width: "50%"}}
              />
            </td>
          </tr>
          <tr className='TransactRow'>
            <td  className="td"></td>
            <td className="td">
              <button
                className='TransactButton'
                onClick={this.createTransaction}
                >Create</button>
            </td>
          </tr>
          <tr className="TransactRow">
            <td className="td"></td>
            <td className="td">{this.state.error && <FormError error={this.state.error} />}</td>
          </tr>
        </div>
      </div>
    )
  }
}
