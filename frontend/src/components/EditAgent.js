import React from 'react'
import axios from 'axios'
import { URL } from '../config'
import { Collapse, Form, FormGroup, Input, Label, FormFeedBack, Toast, ToastBody } from 'reactstrap'
import { validEmail, getToken, validateAgent } from '../utils'

export class EditAgent extends React.Component {
  componentDidMount () {
    const token = getToken()
    if (!token) {
      this.props.history.push('/')
    } else {
      this.token = token
    }
  }

  state = {
    userUpdate: false,
    userUpdateFail: false,
    name: this.props.name
    validName: true,
    surname: this.props.surname,
    validSurname: true
    validEmail: true,
    email: this.props.email,
    validPassword: true,
    password: '',
    confirmPassword: true,
    password2: '',
    permissions: this.props.permissions,
    errorMsg: ''
  }

  editAgent = (e) => {
    e.preventDefault()
    if (validateAgent(this.state) {
      this.setState({
        errorMsg: 'Missing field',
      })
      return
    } else {
      this.setState({
        errorMsg: ''
      })
    }
    const update = {}
    if (this.state.name !== this.props.name) {
      update.name = this.state.name
    }
    if (this.state.surname !== this.props.surname) {
      update.surname = this.state.surname
    }
    if (this.state.email !== this.props.email) {
      if(validEmail(this.state.email)) {
        update.email = this.state.email
        this.setState({
          validEmail: true
        })
      } else {
        this.setState({
          validEmail:  true
        })
        return
      }
    }
    if (this.state.permissions !== this.props.permissions) {
      if (this.state.permissions.length > 0) {
        this.setState({
          validPermissions: true
        })
        update.permissions = this.state.permissions
      } else {
        this.setState({
          validPermissions: false
        })
        return
      }
    }
    if (this.state.password) {
      if (validPassword(this.state.password)) {
        this.setState({
          validPassword: true
        })
      } else {
        this.setState({
          validPassword: false
        })
        return
      }
      if (this.state.password2 === this.state.password) {
        update.password = this.state.password
      } else {
        this.setState({
          passwordConfirm: false
        })
      }
    }

    axios({
      aseUrl: `${URL}/agents/${this.props.id}`,
      method: 'put',
      headers: { 'token': this.token },
      data: update
    })
    .then(response => {
      if (response.status === 202) {
        // Add toast for success
        this.setState({
          userUpdate: true,
        })
        setTimeout(() => {
          this.setState({
            userUpdate: false
          })
        }, 3000)
      } else {
        // Add toast for failure
        this.setState({
          userUpdateFail: true
        })
        setTimeout(() => {
          this.setState({
            userUpdateFail: false
          })
        }, 3000)
      }
    })
    .catch(err => {
      // Toast for failure
      this.setState({
        errorMsg: err.message,
      })
      setTimeout(() => {
        this.setState({
          errorMsg: ''
        })
      }, 3000)
    })
  }

  handleInput = e => {
    if(!e.target.value) {
      this.setState({
        [e.target.name]: false
      })
    } else {
      this.setState({
        [e.target.id]: e.target.value,
        [e.target.name]: true
      })

  }

  handlePermissions = e => {
    let role = e.target.name
    let perms this.state.permissions
    if (this.state.permissions.includes(role)) {
      perms.push(role)
      this.setState({
        permissions: perms,
        validPermissions: false
      })
    } else {
      this.setState({
        permissions: perms.slice(perms.indexOf(e.target.name))
      })
    }
  }

  handleEmailInput = e => {
    if(!e.target.value || !validateEmail(e.target.value)) {
      this.setState({
        [e.target.name]: false
      })
    } else {
      this.seState({
        [e.target.id]: e.target.value,
        [e.target.name]: true
      })
    }
  }

  confirmPassword = e => {
    if (!e.target.value || e.target.value !== this.state.password) {
      this.setState({
        [e.target.name]: false
      })
    } else {
      this.setState({
        [e.target.id]: e.target.value,
        [e.target.name]: true
      })
    }
  }

  render () {
    return (
      <div>
        <h3>Edit Agent</h3>
        <Form>
          <FormGroup>
            <Label for="name">Name</Label>
            <Input
              id="name"
              name="validName"
              value={this.state.name}
              onChange={this.handleInput}
              type="textArea"
              invalid={!this.state.validName}
            />
            <FormFeedBack invalid>
              Invalid name
            </FormFeedBack>
          </FormGroup>
          <FormGroup>
            <Label for="surname">Surname</Label>
            <Input
              id="surname"
              name="validSurname"
              value={this.state.surname}
              onChange={this.handleInput}
              type="textArea"
              invalid={!this.state.validSurname}
            />
            <FormFeedBack invalid>
              Invalid surname
            </FormFeedBack>
          </FormGroup>
          <FormGroup>
            <Label for="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="validEmail"
              value={this.state.email}
              onChange={this.handleEmailInput}
              invalid={!this.state.validEmail}
            />
          <FormFeedBack invalid>
            Invalid email
          </FormFeedBack>
          </FormGroup>
          <FormGroup row>
            <Label for="permissions">Permissions</Label>
            <FormGroup id="permissions">
              <Label style={{'font-size': '7px'}} for="admin">Admin</Label>
              <Input
                id="admin"
                name="admin"
                type="checkbox"
                checked={this.state.permissions.includes("admin")}
                onChange={this.handlePermissions}
                invariant={this.state.validPermissions}
              />
            </FormGroup>
            <FormGroup>
              <Label style={{'font-size': '7px'}} for="transact">Transact</Label>
              <Input
                id="transact"
                type="checkbox"
                checked={this.state.permissions.includes("transact")}
                onChange={this.handlePermissions}
                invariant={this.state.validPermissions}
              />
            </FormGroup>
            <FormGroup>
              <Label style={{'font-size': '7px'}} for="payout">Payout</Label>
              <Input
                id="payout"
                name="payout"
                type="checkbox"
                checked={this.state.permissions.includes("payout")}
                onChange={this.handlePermissions}
                invariant={this.state.validPermissions}
              />
            </FormGroup>
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input
              id="password"
              type="password"
              name="validPassword"
              onChange={this.handlePasswordInput}
              invalid={this.state.validPassword}
            />
          <FormFeedBack invalid>
            Invalid password
          </FormFeedBack>
          <FormText color="muted">
            password must contain at least one lower case,<br />
            one upper case letter,
            one number and a special character
          </FormText>
          </FormGroup>
          <FormGroup>
            <Label for="passwordConfirm">Re-enter password</Label>
            <Input
              id="passwordConfirm"
              name="confirmPassword"
              type="password"
              onChange={this.confirmPassword}
              invalid={this.state.confirmPassword}
            />
          <FormFeedBack invalid>
            Password mismatch
          </FormFeedBack>
          </FormGroup>
          <Button color="primary" onClick={this.editAgent}>Edit agent</Button>
        </Form>
        <br />
        <br />
        <br />
        <Toast color="success" isOpen={this.state.userUpdate}>
          <ToastBody>
            User updated
          </ToastBody>
        </Toast>
        <Toast color="danger" isOpen={this.state.userUpdateFail}>
          <ToastBody>
            User update failed
          </ToastBody>
        </Toast>
        <Toast color="danger" isOpen={this.state.errorMsg}>
          <ToastBody>
            {this.state.errorMsg}
          </ToastBody>
        </Toast>
      </div>
    )
  }
}
