import React from 'react'
import {
  NavBar,
  Nav,
  NavItem,
  Container,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
 } from 'reactstrap'
import { AddAgent } from './AddAgent'
import { Locations } from './Locations'
import { Currencies } from './Currencies'
import { AgentsList } from './AgentsList'
import { AgentTransacts } from './AgentTransactions'
import { AgentPayouts } from './AgentPayouts'

export class AdminOperations extends React.Component {
  state = {
    adminDropdown: false,
    agentDropdown: false,
    manageCurrency: false,
    manageLocations: false,
    addAgent: false,
    agentTransacts: false,
    agentPayouts: false,
    agentsList: true
  }

  handleDropdown = drop => {
    Object.keys(this.state).forEach(key => {
      this.setState({
        [key]: false
      })
    })
    this.setState({
      [drop]: !this.state[drop]
    })
  }

  handleContentToDisplay = e => {
    Object.keys(this.state).forEach(key => {
      this.setState({
        [key]: false
      })
    })
    this.setState({
      [e.tagert.name]: true
    })
  }

  render() {
    return(
      <Container>
        <NavBar color="light" light expand="md">
          <Nav className='m1-auto' navbar>
            <NavItem>
              <Dropdown isOpen={this.state.adminDropdown} toggle={this.handleDropdown('adminDropdown')}>
                <DropdownToggle caret>
                  Admin
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem name="addAgent" onClick={this.handleContentToDisplay}>Add User</DropdownItem>
                  <DropdownItem name="manageCurrency" onClick={this.handleContentToDisplay}>Manage currencies</DropdownItem>
                  <DropdownItem name="manageLocations" onClick={this.handleContentToDisplay}>Manage locations</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </NavItem>
            <NavItem>
              <Dropdown isOpen={this.state.agentDropdown} toggle={this.handleDropdown('agentDropdown')}>
                <DropdownToggle caret>Transactions</DropdownToggle>
                <DropdownMenu>
                  <DropdownItem name="agentsList" onClick={this.handleContentToDisplay}>List agents</DropdownItem>
                  <DropdownItem name="agentTransacts" onClick={this.handleContentToDisplay}>Agent transactions</DropdownItem>
                  <DropdownItem name="agentPayouts" onClick={this.handleContentToDisplay}>Agent payouts</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </NavItem>
          </Nav>
        </NavBar>
        <Collapse isOpen={this.state.addAgent}>
          <AddAgent />
        </Collapse>
        <Collapse isOpen={this.state.ListAgents}>
          <AgentsList />
        </Collapse>
        <Collapse isOpen={this.state.agentTransacts}>
          <AgentTransactions />
        </Collapse>
        <Collapse isOpen={this.state.agentPayouts}>
          <AgentPayouts />
        </Collapse>
        <Collapse isOpen={this.state.manageCurrency}>
          <Currencies />
        </Collapse>
        <Collapse isOpen={this.state.manageLocations}>
          <Locations />
        </Collapse>
      </Container>
    )
  }
}
