import React from "react";
import { withRouter } from 'react-router'
import { Body } from "./Body"
import { getActiveTab } from "../utils"

class DashBoard extends React.Component {
  componentDidMount() {
    this.token = sessionStorage.getItem('token')
  }

  constructor () {
    super()
    const permissions = {
      transView: sessionStorage.getItem('transView'),
      transact: sessionStorage.getItem('transact'),
      payout: sessionStorage.getItem('payout')
    }

    this.permissions = permissions
    this.state = {
      activeTab: getActiveTab(permissions)
    }
  }


  changeTab = e => {
    this.setState({
      activeTab: e.target.name
    });
  };

  render() {
    return (
      <body className="App">
        <div className="TopNav">
        {
          this.permissions.transView && (<button className="NavButton" style={
              (this.state.activeTab === 'transactions' && this.permissions.transView) ? {'borderBottom': 'solid', "borderWidth": "2px", 'borderColor': 'red', 'color': 'blue'} : {}
            }
              name="transactions" onClick={this.changeTab}>
            View Transactions
          </button>)}
        {
          this.permissions.transact && (
            <button className="NavButton" style={
                  (this.state.activeTab === 'transact' && this.permissions.transact) ? {'borderBottom': 'solid', "borderWidth": "2px", 'borderColor': 'red', 'color': 'blue'} : {}
                }
                name="transact" onClick={this.changeTab}>
                Transact
              </button>
          )
        }
        {
          this.permissions.payout && (
            <button className="NavButton" style={
                (this.state.activeTab === 'payout' && this.permissions.payout) ? {'borderBottom': 'solid', "borderWidth": "2px", 'borderColor': 'red', 'color': 'blue'} : {}
              }
              name="payout" onClick={this.changeTab}>
              Pay Out
            </button>
          )
        }
        {
          (
            this.permissions.transView ||
            this.permissions.transact ||
            this.permissions.payout
          ) && (
            <div style={{"align-items": "right"}}>
              <button
                name="logout"
                className="LogoutButton"
                onClick={() => {
                  //// TODO: method for logging out
                }}
              >
                logout
              </button>
            </div>

          )
        }
        </div>
        {(this.state.activeTab === 'transactions') && <Body activeTab="transactions" />}
        {(this.state.activeTab === 'payout') && <Body activeTab="payout" />}
        {(this.state.activeTab === 'transact') && <Body activeTab="transact" />}
      </body>
    );
  }
}

export default withRouter(DashBoard)
