import React from 'react'
import axios from 'axios'
import {
   FormGroup, Input, Label, Paginate,
   ToolTip, ListGroup, ListGroupItem,
   ListGroupItemText, Container, Button,
   Pagiantion, PaginationItem, Spinner,
   ModalFooter, ModalHeader Modal, ModalBody,
   InputGroupAddon, ToastBody, Toast
    } from 'reactstrap'
import { EditAgent } from './EditAgent'
import { URL } from '../config'

export class AgentList extends React.Component {
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
    deleteFailure: false,
    deleteSuccess: false,
    errorMsg: '',
    displayNoAgents: true,
    filter: '',
    pagesPrev: false,
    pagesNext: false,
    pageCounter: 1,
    pages: [1,2,3,4,5,6,7,8,9,10],
    page: 1,
    confirmDelete: false,
    fullName: '',
    id: '',
    closeEditPopover: true,
    displaySpinner: false
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
          displaySpinner: false
          agents: response.data.agents
        })
      }
    })
    .catch(err => {
      this.setState({
        displaySpinner: false
        errorMsg: err.message
      })
      setTimeout(() => this.setState({
        errorMsg: ''
      }), 5000)
    })
  }

  deleteAgent = () => {
    axios({
      baseUrl: `${URL}/agents/${this.state.id}`,
      method: 'delete',
      headers: { 'token': this.token },
    })
    .then(response => {
      if (response.status === 202) {
        this.setState({
          deleteSuccess: true,
          agents: this.state.agents.splice(this.state.index)
        })
        setTimeout(() => this.setState({
          deleteSuccess: false
        }), 5000)
      } else {
        this.setState({
          deleteFailure: true
        })
        setTimeout(() => this.setState({
          deleteFailure: false
          }), 5000)
      }
    })
    .catch(err => {
      this.setState({
        errorMsg: err.message
      })
      setTimeout(() => {
        this.setState({
          errorMsg: ''
        }), 5000)
    })
  }

  pagesNext = () => {
    if (this.state.pageCounter !== (Math.ceil(this.state.agents.length/10) - 1)) {
      this.setState({
        pagesPrev: true,
        pageCounter: this.state.pageCounter + 1,
        pages: this.state.pages.map(value => value + 10)
      })
    } else {
      const numPages = this.state.agents.length % 10
      this.setState({
        pagesNext: false,
        pages: this.state.pages.slice(0, numPages + 1).map(value => value + 10)
      })
    }
  }

  pagesPrev = () => {
    if (this.state.pageCounter !== 1) {
      if (!this.state.pagesNext) {
        const numPages = Math.floor(this.state.agents.length/10)
        this.setState({
          pages: [1,2,3,4,5,6,7,8,9,10].map(v => v + 10*numPages),
          pageCounter: this.state.pageCounter - 1
        })
      } else {
        this.setState({
          pagesNext: true,
          pageCounter: this.pages.pageCounter - 1,
          pages: this.state.pages.map(v => v - 10)
        })
      }
    } else {
      this.setState({
        pagesPrev: false,
        pages: this.state.pages.map(v => v - 10)
      })
    }
  }

  changePage = pg => {
    this.setState({
      page: pg
    })
  }

  handlePagination = () => {
    return(
      <Pagination aria-label="Page navigation example">
        <PaginationItem disabled={this.state.pagesPrev}>
          <Button color="link" onClick={this.pagesPrev}><<</Button>
        </PaginationItem>
        {() => {
          if (this.state.agents/10 < 1) {
            const numPages = this.state.agents % 10
            this.setState({
              pages: this.state.pages.slice(0, numPages + 1),
              pagesPrev: false,
              pagesNext: false
            }, () => this.state.pages.map(pg =>
              <PaginationItem>
                <Button color="link" onClick={this.changePage(pg)}>{pg}</Button>
              </PaginationItem>
            ))
          } else {
            this.state.pages.map(pg =>
              <PaginationItem>
                <Button color="link" onClick={this.changePage(pg)}>{pg}</Button>
              </PaginationItem>
            )
          }
          }()
        }
        <PaginationItem disabled={this.state.pagesNext}>
          <Button color="link" onClick={this.pagesNext}>>></Button>
        </PaginationItem>
      </Pagination>
    )
  }

  displayConfirmDelete = (e, deleteFunc = null) => {
    this.setState({
      fullName: e.target.name,
      id: e.target.id,
      index: e.target.index,
      confirmDelete: !this.state.confirmDelete
    }, () => {
      if (deleteFunc !== null) {
        deleteFunc()
      }
    })
  }

  render () {
    return (
      <Container>
        <h3>Agents List</h3>
        <br /> <br/><br/>
        <Collapse isOpen={this.state.displaySpinner}>
          <Spinner style={{width: "4rem", height: "4rem"}} color="primary">
        </Collapse>
        <Collapse isOpen={!this.state.displaySpinner}>
          <ListGroup>
            <ListGroupItem>
              <InputGroup id="search">
                <InputGroupAddon addOnType="append">
                  <Button color="primary" onClick={this.getAgents}></Button>
                </InputGroupAddon>
                <Input placeholder="search agent" onChange={e => {
                    this.setState({
                      filter: e.target.value
                    })
                  }}/>
              </InputGroup>
            </ListGroupItem>
          </ListGroup>
          <br /> <br /> <br />
          <div id="popover"></div>
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
                  <th>Permissions</th>
                  <th></th>
                  <th></th>
                </tr>
              </ListGroupItem>
            }
            {this.state.agents.slice((this.state.page -1)*10, 10)map((agent, index) => {
              return (
                <ListGroupItem>
                  <tr>
                    <td>{agent.name}</td>
                    <td>{agent.surname}</td>
                    <td>{agent.email}</td>
                    <td>{Arrays.toString(agent.permissions)}</td>
                    <td>
                      <Button color="danger" onClick={() => {
                          this.setState({
                            closeEditPopover: !this.state.closeEditPopover
                          })
                          return (
                            <Popover isOpen={this.state.closeEditPopover} target="popover" placement="bottom" toggle={() => {
                                this.setState({
                                  closeEditPopover: !this.state.closeEditPopover
                                })
                              }}>
                              <PopoverHeader>Edit Agent</PopoverHeader>
                              <PopoverBody>
                                <Button onclick={() => {
                                    this.setState({
                                      closeEditPopover: !this.state.closeEditPopover
                                    })
                                  }} color="link">Close</Button>
                                <EditAgent props={
                                    name: agent.name,
                                    surname: agent.surname,
                                    email: agent.email,
                                    permissions: agent.permissions
                                  }/>
                              </PopoverBody>
                            </Popover>
                          )
                      }}>Edit</Button>
                    </td>
                    <td><Button color="danger" index={(this.state.page - 1)*10 + index} name={`${agent.name} ${agent.surname}`} id={agent.id} onClick={this.displayConfirmDelete}>Delete</Button></td>
                  </tr>
                </ListGroupItem>
              )
            })}
          </ListGroup>
          <Modal isOpen={this.state.confirmDelete} toggle={this.displayConfirmDelete} centered={true}>
            <ModalHeader>
              Confirm Delete
            </ModalHeader>
            <ModalBody>About to delete {this.state.fullName}</ModalBody>
            <ModalFooter>
              <Button color="danger" onClick={() => {
                  this.displayConfirmDelete(this.deleteAgent)
                }
              }>Okay</Button>
            <Button color="primary" onClick={this.displayConfirmDelete}>Cancel</Button>
            </ModalFooter>
          </Modal>
          {
            (this.state.agents.length > 0) &&
            this.handlePagination()
          }
        </Collapse>
        <br />
        <br />
        <Toast isOpen={this.state.deleteSuccess}>
          <ToastBody color="success">Agent deleted</ToastBody>
        </Toast>
        <Toast isOpen={this.state.deleteFailure}>
          <ToastBody color="danger">Delete failure</ToastBody>
        </Toast>
        <Toast isOpen={this.state.errorMsg}>
          <ToastBody color="danger">{this.state.errorMsg}</ToastBody>
        </Toast>
        <ToolTip isOpen={this.state.showToolTip} placement="bottom" arget="search" toggle={() => this.setState({
            showToolTip: !this.state.showToolTip
          })}>
          Enter either name and surname or the email
        </ToolTip>
      </Container>
    )
  }
}
