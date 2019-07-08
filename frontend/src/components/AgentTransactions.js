import React from 'react'
import { Container, Button, ListGroup, ListGroupItem, Collapse,
  Pagination, PaginationItem, Spinner,
  InputGroup, InputGroupAddon, Toast, ToastBody,
  Input } from 'reactstrap'
import { URL } from '../config'

export class AgentTransactions extends React.Component {
  componentDidMount() {
    const token = getToken()
    if (!token) {
      this.props.history.push('/')
    } else {
      this.token = token
    }
    getAgents()
  }

  state = {
    agents: [],
    transactions: [],
    pagesPrevTrans: false,
    pagesNextTrans: false,
    pagesPrev: false,
    pagesNext: false,
    displaySpinner: false,
    filter: '',
    displayNoAgents: true,
    page: 1,
    displayTransactions: false,
    pageTrans: 1,
    pages: [1,2,3,4,5,6,7,8,9,10],
    pagesTrans: [1,2,3,4,5,6,7,8,9,10]
  }

  getAgents = () => {
    this.setState({
      displaySpinner: true
    })
    axios({
      baseUrl: `${URL}/agents`,
      method: 'get',
      headers: { 'token': this.token },
      data: {
        filter: this.state.filter
      }
    })
    .then(response => {
      if (
        (response.status === 200) &&
        Array.isArray(response.data.agents)
      ) {
        this.setState({
          displayNoAgents: false,
          displaySpinner: false,
          agents: response.data.agents
        })
      }
    })
    .catch(err => {
      this.setState({
        displaySpinner: false,
        errorMsg: err.message
      })
      setTimeout(() => this.setState({
        errorMsg: ''
      }), 5000)
    })
  }

  getTransactions = e => {
    const id = e.target.id

    axios({
      baseUrl: `${URL}/agent/transactions/${id}`,
      method: 'get',
      headers: { 'token': this.token }
    })
    .then(response => {
      if (response.status === 200 ) {
        const response = JSON.parse(response.data.transactions)
        if (Array.isArray(response) && response.length > 0) {
          this.setState({
            transactions: response,
            displayTransactions: true,
            errorMsg: ''
        })
        } else {
          this.setState({
            errorMsg: 'No transactions found',
            displayTransactions: false
          })
        }
      }
    })
    .catch(err => this.setState({
      displayTransactions: false,
      errorMsg: err.message
    }))
  }

  pagesNext = (pageCounter, agents, pagesPrev, pagesNext, pages) => {
    if (this.state[pageCounter] !== (Math.ceil(this.state[agents].length/10) - 1)) {
      this.setState({
        [pagesPrev]: true,
        [pageCounter]: this.state[pageCounter] + 1,
        [pages]: this.state[pages].map(value => value + 10)
      })
    } else {
      const numPages = this.state[agents].length % 10
      this.setState({
        [pagesNext]: false,
        [pages]: this.state[pages].slice(0, numPages + 1).map(value => value + 10)
      })
    }
  }

  pagesPrev = (pageCounter, agents, pagesNext, pagesPrev, pages) => {
    if (this.state[pageCounter] !== 1) {
      if (!this.state[pagesNext]) {
        const numPages = Math.floor(this.state[agents].length/10)
        this.setState({
          [pages]: [1,2,3,4,5,6,7,8,9,10].map(v => v + 10*numPages),
          [pageCounter]: this.state[pageCounter] - 1
        })
      } else {
        this.setState({
          [pagesNext]: true,
          [pageCounter]: this.pages[pageCounter] - 1,
          [pages]: this.state[pages].map(v => v - 10)
        })
      }
    } else {
      this.setState({
        [pagesPrev]: false,
        [pages]: this.state[pages].map(v => v - 10)
      })
    }
  }

  changePage = (page, pg) => {
    this.setState({
      [page]: pg
    })
  }

  handlePagination = (agents, pagesPrev, pagesNext, pagesPrev, pages, page) => {
    return(
      <Pagination aria-label="Page navigation example">
        <PaginationItem disabled={this.state[pagesPrev]}>
          <Button color="link" onClick={() => {
              this.pagesPrev(pageCounter, agents, pagesNext, pagesPrev, pages)
            }}><<</Button>
        </PaginationItem>
        {() => {
          if (this.state[agents]/10 < 1) {
            const numPages = this.state[agents] % 10
            this.setState({
              [pages]: this.state[pages].slice(0, numPages + 1),
              [pagesPrev]: false,
              [pagesNext]: false
            }, () => this.state[pages].map(pg =>
              <PaginationItem>
                <Button color="link" onClick={this.changePage(page, pg)}>{pg}</Button>
              </PaginationItem>
            ))
          } else {
            this.state[pages].map(pg =>
              <PaginationItem>
                <Button color="link" onClick={this.changePage(page, pg)}>{pg}</Button>
              </PaginationItem>
            )
          }
          }()
        }
        <PaginationItem disabled={this.state[pagesNext]}>
          <Button color="link" onClick={() =>
              this.pagesNext(pageCounter, agents, pagesPrev, pagesNext, pages)
            }>>></Button>
        </PaginationItem>
      </Pagination>
    )
  }

  render () {
    return (
      <Container>
        <h3>Agents Transactions</h3>
        <br/><br/><br/>
          <Collapse isOpen={this.state.displaySpinner}>
            <Spinner style={{width: "4rem", height: "4rem"}} color="primary">
          </Collapse>
          <Collapse isOpen={!this.state.displaySpinner}>
            <ListGroup>
              <ListGroupItem>
                <InputGroup id="search">
                    <InputGroupAddon addOnType="append">
                      <Button color="primary" onClick={this.getAgents}>Get</Button>
                    </InputGroupAddon>
                    <Input placeholder="search agent" onChange={e => {
                      this.setState({
                        filter: e.target.value
                      })
                    }}/>
                </InputGroup>
              </ListGroupItem>
            </ListGroup>
            <br/>
            {
              (this.state.agents.length > 0) &&
              this.handlePagination('agents', 'pagesPrev', 'pagesNext', 'pagesPrev', 'pages', 'page')
            }
            <br /> <br /> <br />
            <ListGroup>
              {
                (this.state.agents.length < 1 || this.state.displayNoAgents) &&
                <ListGroupItem color="danger">
                  <ListGroupItemText>No agents found</ListGroupItemText>
                </ListGroupItem>
              }
              {
                (this.state.agents.length > 0) &&
                <ListGroupItem>
                  <tr>
                    <th>Name</th>
                    <th>Surname</th>
                    <th>Email</th>
                    <th></th>
                  </tr>
                </ListGroupItem>
              }
              {this.state.agents.slice((this.state.page -1)*5, 5)map((agent) => {
                return (
                  <ListGroupItem>
                    <tr>
                      <td>{agent.name}</td>
                      <td>{agent.surname}</td>
                      <td>{agent.email}</td>
                      <td>
                        <Button id={agent.id} color="primary" onClick={this.getTransactions}>transactions</Button>
                      </td>
                    </tr>
                  </ListGroupItem>
                )
              })}
            </ListGroup>
          </Collapse>
          <br/><br/><br/>
          <Toast isOpen={this.state.errorMsg} toggle={() => this.setState({errorMsg: ''})}>
            <ToastBody color="danger">{this.state.errorMsg}</ToastBody>
          </Toast>
          <br/><br/><br/>
          <Collapse isOpen={this.state.displayTransactions}>
            <h3>Transactions</h3>
            <br/><br/>
            <ListGroup>
              <ListGroupItem>
                <tr>
                  <th>Date</th>
                  <th>Reference</th>
                  <th>Sender</th>
                  <th>Reciever</th>
                  <th>Amount Sent</th>
                  <th>Total Paid</th>
                  <th>Location</th>
                  <th>Status</th>
                </tr>
              </ListGroupItem>
              {this.state.transactions.slice((this.state.pageTrans -1)*10, 10).map(trans => {
                if (trans) {
                  return (
                    <ListGroupItem>
                      <tr>
                        <td>{trans.date.transact.toString()}</td>
                        <td>{trans.ref}</td>
                        <td>{`${trans.senderName} ${trans.senderSurname}`}</td>
                        <td>{`${trans.receiverName} ${${trans.receiverSurname}}`}</td>
                        <td>{`${trans.currencyToSend}: ${trans.amountSent}`}</td>
                        <td>{`${trans.currencyToPay}: ${trans.totalPaid}`}</td>
                        <td>{trans.location}</td>
                        <td>{trans.status}</td>
                      </tr>
                    </ListGroupItem>
                  )
                }
              })}
            </ListGroup>
            <br/>
            {
              (this.state.transactions.length > 0) &&
              this.handlePagination('transactions', 'pagesPrevTrans', 'pagesNextTrans', 'pagesPrevTrans', 'pagesTrans', 'pageTrans')
            }
          </Collapse>
      </Container>
    )
  }
}}
