import React from "react";
import { withRouter } from "react-router";
import { URL } from "../config";
import axios from "axios";
import { validateEmail, decodeToken, storeCookie, generatePermissions } from "../utils";
import { FormError } from "./Error";

class Login extends React.Component {
  state = {
    email: "",
    password: "",
    error: "No error"
  };

  handleUserInput = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value
    });
  };

  render() {
    return (
        <form className="Login" method="POST">
          <label>
            <i>Email:</i><br />
            <input className="TextBox" type="email" name="email" placeholder="email@klu.org" onChange={this.handleUserInput} />
          </label>
          <br />
          <label>
            <i>Password:</i><br />
            <input className="TextBox" type="password" name="password" onChange={this.handleUserInput} />
          </label>
          <br />
          {(this.state.error !== "No error") && <FormError style={{"color": "red"}} error={this.state.error} /> }
          <br />
          <button
            className="LoginButton"
            onClick={e => {
              e.preventDefault();

              if (validateEmail(this.state.email) && this.state.password) {
                axios
                  .post(`http://35.241.227.14/auth/jwt`, {
                    email: this.state.email,
                    password: this.state.password
                  })
                  .then((response) => {
                    if (
                      response.status === 200 &&
                      response.data &&
                      response.data.token
                    ) {

                      const token = response.data.token
                      const user = decodeToken(token);

                      generatePermissions(user)

                      const location = {
                        pathname: '/dashboard'
                      }
                      this.setState({password: ''})
                      storeCookie(token)
                      storeAgentId(user.ID)
                      this.props.history.push(location)
                    }
                  }).catch(err => {
                    if (err.message === 'Request failed with status code 400') {
                      this.setState({
                        error: 'Username/Password incorrect'
                      })
                    }
                  });
                }
              }
            }
          >
            login
          </button>
        </form>
    );
  }
}

export default withRouter(Login);
