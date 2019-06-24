import React from 'react'
import axios from 'axios'
import { URL } from '../config'
import { Collapse, Form, FormGroup, Input, Label, FormFeedBack, Toast, ToastBody } from 'reactstrap'
import { validEmail, validateAgent } from '../utils'

let initialState = {
  userCreated: false,
  userCreateFail: false,
  validName: true,
  name: ''
  validSurname: true,
  surname: '',
  validEmail: true,
  email: '',
  validPassword: true,
  password: '',
  confirmPassword: true,
  password2: '',
  permissions: [],
  validForm: false,
  errorMsg: '',
  serverError: false
}

export class AddAgent extends React.Component {
  componentDidMount() {
    const token = getToken()
    if (!token) {
      this.props.history.push('/')
    } else {
      this.token = token
    }
  }

  state = initialState

  addAgent = (e) => {
    e.preventDefault()
    if (!this.state.confirmPassword) {
      return
    }
    axios({
      aseUrl: `${URL}/agents`,
      method: 'post',
      headers: { 'token': this.token },
      data: {
        name: this.state.name,
        surname: this.state.surname,
        email: this.state.email,
        password: this.state.password,
        permissions: this.state.permissions
      }
    })
    .then(response => {
      if (response.status === 201) {
        // toast for success
        this.setState(initialState)
        this.setState({
          userCreated: true,
        })
        setTimeout(() => {
          this.setState({
            userCreated: false
          })
        }, 3000)
      } else {
        // toast for failure
        this.setState({
          userCreateFail: true
        })
        setTimeout(() => {
          this.setState({
            userCreateFail: false
          })
        }, 3000)
      }
    })
    .catch(err => {
      // toast for failure
      this.setState({
        errorMsg: err.message
        serverError: true
      })
      setTimeout(() => {
        this.setState({
          serverError: false
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
    checkForm()
  }

  checkForm = () =>
    setTimeout(() => {
      if (validateAgent(this.state) {
        this.setState({
          validForm: true
        })
      } else {
        this.setState({
          validForm: false
        })
      }
    }, 300)

  handlePasswordInput = e => {
    if (!e.target.value || !validatePassword(e.target.value)) {
      this.setState({
        [e.target.name]: false
      })
    } else {
      this.setState({
        [e.target.id]: e.target.value,
        [e.target.name]: true
      })
    }
    checkForm()
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
    checkForm()
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
    checkForm()
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
    checkForm()
  }

  render () {
    return (
      <div>
        <h3>Add Agent</h3>
        <Form>
          <FormGroup>
            <Label for="name">Name</Label>
            <Input
              id="name"
              name="validName"
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
                onChange={this.handlePermissions}
                invariant={this.state.validPermissions}
              />
            </FormGroup>
            <FormGroup>
              <Label style={{'font-size': '7px'}} for="transact">Transact</Label>
              <Input
                id="transact"
                type="checkbox"
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
          <Button color="primary" disabled={this.state.validForm} onClick={this.addAgent}>Add agent</Button>
        </Form>
        <br />
        <br />
        <br />
        <Toast color="success" isOpen={this.state.userCreated}>
          <ToastBody>
            User created
          </ToastBody>
        </Toast>
        <Toast color="danger" isOpen={this.state.userCreateFail}>
          <ToastBody>
            User creation failed
          </ToastBody>
        </Toast>
        <Toast color="danger" isOpen={this.state.serverError}>
          <ToastBody>
            {this.state.errorMsg
          </ToastBody>
        </Toast>
      </div>
    )
  }
}
