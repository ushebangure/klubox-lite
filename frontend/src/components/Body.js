import React from "react";
import { TransactionList } from "./TransactionList"
import { Transact } from './Transact'

export class Body extends React.Component {
  state = {
    active: this.props.activeTab
  };

  render() {
    return (
      <div>
        {(this.state.active === 'transactions') && <TransactionList />}
        {(this.state.active === 'transact') && <Transact />}
      </div>
    );
  }
}
