import React from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { URL } from '../config'
import { validatePhoneNumber, getTransactionFromState } from '../utils'
import { FormError } from '/Error'

export class Transact extends React.Component {
  componentDidMount() {
    // const token = getToken()
    // if (!token) {
    //   this.props.history.push('/')
    // } else {
    //   this.token = token
    // }
    this.token = "EFMVKSDSmdldmsl"
    // Get currencies from backend
    this.currencies = ['ZAR', 'USD']
  }

  state = {
    receiverGender: '',
    receiverId: '',
    receiverName: '',
    receiverPhoneNumber: '',
    receiverSurname: '',
    senderName: '',
    senderPhoneNumber: '',
    senderGender: '',
    senderSurname: '',
    amount: '',
    reference: '',
    totalToPay: '',
    charges: '',
    currencyToSend: '',
    currencyForPayment: '',
    error: '',
    errorRecPhoneNumber: '',
    errorSenPhoneNumber: ''
  }

  handleInput =  (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
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

    const transaction = getTransactionFromState(this.state)

    if (!transaction) {
      this.setState({
        error: 'Empty field'
      })
      return
    } else {
      this.setState({
        error: ''
      })
    }
    var create = confirm('Create transaction')

    if (create === true) {
      axios({
        baseUrl: `${URL}/transactions/create`,
        method: 'post',
        headers: {'token', this.token},
        data: {
          transaction: this.state
        }
      })
      .then(response => {
        if (response.status === 201) {
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

  currencyOptions = (currency) => {
    this.currencies.map((curr) =>
      <input type="select" name={currency} value=`${curr}` onChange={handleInput} />
    )
  }

  locationOptions = () => {
    this.locations.map(location =>
      <input type="select" name="location" value=`${loaction}` onChange={handleInput} />
    )
  }

  render () {
    return (
      <div>
        <div>
          <h3>Receiver</h3>
          <tr>
            <td>Gender</td>
            <td>
              <div>
                <input type="select" name="receiverGender" value="male" onChange={handleInput} />
                <input type="radio" name="receiverGender" value="female" onChange={handleInput} />
              </div>
            </td>
          </tr>
          <tr>
            <td>Name</td>
            <td>
              <input type="text" name="receiverName" onChange={handleInput} />
            </td>
          </tr>
          <tr>
            <td>Surname</td>
            <td>
              <input type="text" name="receiverSurname" onChange={handleInput} />
            </td>
          </tr>
          <tr>
            <td>Id No.</td>
            <td>
              <input type="text" name="receiverId" onChange={handleInput} />
            </td>
          </tr>
          <tr>
            <td>Phone No.</td>
            <td>
              <input type="text" name="receiverPhoneNumber" onChange={handleInput />
            </td>
          </tr>
          {this.state.errorRecPhoneNumber && <FormError error={this.state.errorRecPhoneNumber} />}
        </div>
        <div>
          <h3>Sender</h3>
          <tr>
            <td>Gender</td>
            <td>
              <div>
                <input type="select" name="senderGender" value="male" onChange={handleInput} />
                <input type="select" name="senderGender" value="female" onChange={handleInput} />
              </div>
            </td>
          </tr>
          <tr>
            <td>Name</td>
            <td>
               <input type="text" name="senderName" onChange={handleInput} />
            </td>
          </tr>
          <tr>
            <td>Surname</td>
            <td><input type="text" name="senderSurname" onChange={handleInput} /></td>
          </tr>
          <tr>
            <td>Phone No.</td>
            <td><input type="text" name="senderPhoneNumber" onChange={handleInput} /></td>
          </tr>
          {this.state.errorSenPhoneNumber && <FormError error={this.state.errorSenPhoneNumber} />}
        </div>
        <div>
          <h3>Transaction Details</h3>
          <tr>
            <td>Collection Method</td>
            <td>
              <div>
                <input type="select" name="collectionMethod" value="Cash" onChange={handleInput} />
                <input type="select" name="collectionMethod" value="Mobile" onChange={handleInput} />
              </div>
            </td>
          </tr>
          <tr>
            <td>Transaction Ref.</td>
            <td>
              {this.state.reference}
            </td>
          </tr>
          <tr>
            <td>Currency To Send</td>
            <td>
              <div>
                {currencyOptions("currencyToSend")}
              </div>
            </td>
          </tr>
          <tr>
            <td>Amount To send</td>
            <td>
              <input type="number" name="amount" onChange={handleInput} />
            </td>
          </tr>
          <tr>
            <td>Payment Currency</td>
            <td>
              <div>
                {currencyOptions("currencyForPayment")}
              </div>
            </td>
          </tr>
          <tr>
            <td>Charges</td>
            <td>{this.state.charges}</td>
          </tr>
          <tr>
            <td>Total To Pay</td>
            <td>{this.state.totalToPay}</td>
          </tr>
          <tr>
            <td>Pickup Location</td>
            <td>
              {locationOtions()}
            </td>
          </tr>
          <tr>
            <td></td>
            <td>
              <button
                onClick={
                  createTransaction()
                }
                >Create</button>
            </td>
            {this.state.error && <FormError error={this.state.error} />}
          </tr>
        </div>
      </div>
    )
  }
}
