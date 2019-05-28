import React from "react";
import { TransactionList } from "./TransactionList";

export class Body extends React.Component {
  state = {
    active: this.props.activeTab
  };

  render() {
    return (
      <div>
        {(this.state.active === 'transactions') && <TransactionList />}
      </div>
    );
  }
}
