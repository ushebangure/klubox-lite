import React from 'react'
import { Container, Button, ListGroup, ListGroupItem, Collapse,
  Pagination, PaginationItem, Spinner,
  InputGroup, InputGroupAddon, Toast, ToastBody,
  Input } from 'reactstrap'
import { URL } from '../config'

export class AgentPayouts extend React.Component {
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
    payouts: [],
    displayPayouts: false,
    displaySpinner: false
  }

  getPayouts = e => {
    const id = e.target.id

    axios({
      baseUrl: `${URL}/agent/payouts/${id}`,
      method: 'get',
      headers: { 'token': this.token }
    })
    .then(response => {
      if (
        response.status === 200
      ) {
        const response = JSON.parse(response.data.payouts)
        if (Array.isArray(response) && response.length > 0) {
          this.setState({
            payouts: response,
            errorMsg: '',
            displayPayouts: true
          })
        } else {
          this.setState({
            errorMsg: 'No payouts found',
            displayPayouts: false
          })
        }
      }
    })
    .catch(err => {
      this.setState({
        displayPayouts: false
      })
    })
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
        <h3>Agent payouts</h3>
        <br/><br/><br/>
        <Collapse isOpen={this.state.displaySpinner}>
          <Spinner style={{width: "4rem", height: "4rem"}} color="primary">
        </Collapse>
        <Collapse isOpen={!this.state.displaySpinner}>
          <ListGroup>
            <ListGroupItem>
              <InputGroup>
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
      </Collapse>
    </Container>)
  }
}
