import React from 'react'
import axios from 'axios'
import { URL } from '../config'
import { validatePhoneNumber, validateTransaction } from '../utils'

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
    currencyForPayment: ''
  }

  handleInput =  (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handlePhoneNumber = (e) => {
    if (validatePhoneNumber(e.target.value)) {
      handleInput(e)
    }
  }

  createTransaction = () => {
    var create = confirm('Create transaction')

    if (create === true && validateTransaction(this.state)) {
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
          
        }
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
          Gender: M <input type="select" name="receiverGender" value="male" onChange={handleInput} />
        F <input type="radio" name="receiverGender" value="female" onChange={handleInput} />
         <br />
        Name: <input type="text" name="receiverName" onChange={handleInput} /> <br />
      Surname: <input type="text" name="receiverSurname" onChange={handleInput} /> <br />
    Id No. <input type="text" name="receiverId" onChange={handleInput} /> <br />
  Phone No. <input type="text" name="receiverPhoneNumber" onChange={handlePhoneNumber />
        </div>
        <div>
          <h3>Sender</h3>
            Gender: M <input type="select" name="senderGender" value="male" onChange={handleInput} />
          F <input type="select" name="senderGender" value="female" onChange={handleInput} />
           <br />
          Name <input type="text" name="senderName" onChange={handleInput} /> <br />
        Surname <input type="text" name="senderSurname" onChange={handleInput} /> <br />
      Phone No. <input type="text" name="senderPhoneNumber" onChange={handlePhoneNumber />
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
                {currencyOptions(currencyToSend)}
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
                {currencyOptions(currencyForPayment)}
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
          </tr>
        </div>
      </div>
    )
  }
}
