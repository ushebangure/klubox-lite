import React from 'react';
import './App.css';
import { toast } from 'react-toastify'
import { Welcome } from './components/Welcome'
import DashBoard from './components/DashBoard'
import { ListHeader } from './components/ListHeader'
import { TransactionList } from './components/TransactionList'
import Login from './components/Login'
import { createBrowserHistory } from 'history'
import { Router, Route, Switch } from 'react-router-dom'
import { Transact } from './components/Transact'
import { PayoutTemplate } from './components/PayoutTemplate'

toast.configure()
const history = createBrowserHistory()

class App extends React.Component {
  state = {
    date: Date.now()
  }

  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route exact path='/' component={Login} />
          <Route path='/dashboard' component={PayoutTemplate} />
        </Switch>
      </Router>
    );
  }
}

export default App;
