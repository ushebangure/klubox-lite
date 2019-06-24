import React from 'react'
import axios from 'axios'
import { Button, InputGroup, Input, Toast, ToastBody,
  ListGroupItem, ListGroup, ListGroupItemText, Fade,
  Collapse
 } from 'reactstrap'
import { URL } from '../config'

export class Currencies extends React.Component {
  componentDidMount() {
    const token = getToken()
    if (!token) {
      this.props.history.push('/')
    } else {
      this.token = token
    }
    getCurrencies()
  }

  state = {
    currencies: [],
    displaySpinner: false,
    displayFade: false,
    exchangeRate: 0,
    displayToast: '',
    newCurrency: '',
    newCurrencyRate: '',
    currency: ''
  }

  changeXchangeRate = e => {
    this.setState({
      currency: e.target.name
    })

    return (
      <Fade in={this.state.displayFade}>
        <Button color="link" onClick={() => this.setState({
            displayFade: false
          })}>Close</Button>
        <Input onChange={e => {
            this.setState({
              exchangeRate: e.target.value
            })
          }}>
        <Button color="primary" onClick={() => {
            if (this.state.currency && !isNaN(this.state.exchangeRate)) {
              axios({
                baseUrl: `${URL}/currencies/${this.state.currency}`,
                method: 'put',
                headers: { 'token': this.token },
                data: {
                  name: this.state.currency,
                  exchangeRate: this.state.exchangeRate
                }
              })
              .then(response => {
                if (response.status === 202) {
                  this.setState({
                    displayToast: `${e.target.name} has been changed to ${this.state.exchangeRate}`
                  })
                  setTimeout(() => this.setState({
                    this.setState({
                      displayToast: ''
                    })
                  }), 5000)
                } else {
                  this.setState({
                    displayToast: `Exchange rate not updated`
                  })
                  setTimeout(() => this.setState({
                    this.setState({
                      displayToast: ''
                    })
                  }), 5000)
                }
              })
              .catch(err => {
                this.setState({
                  displayToast: `Exchange rate not updated: ${err.message}`
                })
                setTimeout(() => this.setState({
                  this.setState({
                    displayToast: ''
                  })
                }), 5000)
              })}
          }}>Change rate</Button>
    </Fade>
    )
  }

  getCurrencies = () => {
    this.setState({
      displaySpinner: true
    })

    axios({
      baseUrl: `${URL}/currencies`,
      method: 'get',
      headers: { 'token': this.token },
    })
    .then(response => {
      if (response.status === 200 && Array.isArray(response.data.currencies)) {
        this.setState({
          currencies: response.data.currencies,
          displaySpinner: false
        })
      } else {
        this.setState({
          displayToast: `Could not retrieve currencies`,
          displaySpinner: false
        })
        setTimeout(() => this.setState({
          this.setState({
            displayToast: ''
          })
        }), 5000)
      }
    })
    .catch(err => {
      this.setState({
        displayToast: `Could not retrieve currencies: ${err.message}`
      })
      setTimeout(() => this.setState({
        this.setState({
          displayToast: ''
        })
      }), 5000)
    })
  }


  addCurrency = () => {
    if (this.state.newCurrency && !isNaN(this.state.newCurrencyRate)) {
      axios({
        baseUrl: `${URL}/currencies`,
        method: 'post',
        headers: { 'token': this.token },
        data: {
          name: this.state.newCurrency,
          exchangeRate: this.state.newCurrencyRate
        }
      })
      .then (response => {
        if (response.status === 201 && response.data.currency) {
          const curs = this.state.currencies
          curs.push(this.state.currency)
          this.setState({
            currencies: curs
          })

          this.setState({
            displayToast: `New currency has been added: ${response.data.currency.name}: ${response.data.currency.rateToUsd}`
          })
          setTimeout(() => this.setState({
            this.setState({
              displayToast: ''
            })
          }), 5000)
        } else {
          this.setState({
            displayToast: `Currency could not be added`
          })
          setTimeout(() => this.setState({
            this.setState({
              displayToast: ''
            })
          }), 5000)
        }
      })
      .catch(err => {
        this.setState({
          displayToast: `Currency could not be added: error ${err.message}`
        })
        setTimeout(() => this.setState({
          this.setState({
            displayToast: ''
          })
        }), 5000)
      })
    }
  }

  deleteCurrency = e => {
    axios({
      baseUrl: `${URL}/currencies/${e.target.name}`,
      method: 'delete',
      headers: { 'token': this.token },
    })
    .then(resp => {
      if (resp.status === 200) {
        this.setState({
          displayToast: `Currency '${e.target.name}' has been deleted`,
          currencies: this.state.currencies.splice(e.target.index, 1)
        })
        setTimeout(() => this.setState({
          this.setState({
            displayToast: ''
          })
        }), 5000)
      } else {
        this.setState({
          displayToast: `Currency '${e.target.name}' could not be deleted`
        })
        setTimeout(() => this.setState({
          this.setState({
            displayToast: ''
          })
        }), 5000)
      }
    })
    .catch(err => {
      this.setState({
        displayToast: `Currency '${e.target.name}' could not be deleted error: ${err.message}`
      })
      setTimeout(() => this.setState({
        this.setState({
          displayToast: ''
        })
      }), 5000)
    })
  }

  render () {
    return (
      <div>
        <h3>Manage Currencies</h3>
        <br/><br/>
        <Collapse isOpen={this.state.displaySpinner}>
          <Spinner style={{width: "4rem", height: "4rem"}} color="primary">
        </Collapse>
        <br/><br/>
        <Toast isOpen={this.state.displayToast}>
          <ToastBody>{this.state.displayToast}</ToastBody>
        </Toast>
        <br/>
        <Collapse isOpen={!this.state.displaySpinner}>
          <ListGroup>
            <ListGroupItem>
              <InputGroup row>
                <Input onChange={(e) => {
                    this.setState({
                      newCurrency: e.target.value
                    })
                  }}>
                <Input onChange={(e) => {
                  this.setState({
                    newCurrencyRate: e.target.value
                  })
                  }} />
                <Button onclick={this.addCurrency}>add currency</Button>
              </InputGroup>
            </ListGroupItem>
            <br/><br/><br/>
            {
              (this.state.currencies.length < 1) &&
              <ListGroupItem>
                <ListGroupItemText color="danger">
                  No currencies found
                </ListGroupItemText>
              </ListGroupItem>
            }
            {
              (this.state.currencies > 0) &&
              <ListGroupItem>
                <tr>
                  <th>Name</th>
                  <th>Exchange Rate</th>
                  <th></th>
                  <th></th>
                </tr>
              </ListGroupItem>
            }
            {
              (this.state.currencies > 0) &&
              this.state.currencies.map((curr, index) => {
                if (curr) {
                  return (
                    <ListGroupItem>
                      <tr>
                        <td>{curr.name}</td>
                        <td>{curr.rateToUsd}</td>
                        <td>
                          <Button onClick={this.changeXchangeRate}>Change</Button>
                        </td>
                        <td>
                          <Button index={index} name={curr.name} color="danger" onClick={this.deleteCurrency}>delete</Button>
                        </td>
                      </tr>
                    </ListGroupItem>
                  )
                }
              })
            }
          </ListGroup>
        </Collapse>
      </div>
    )
  }
}
