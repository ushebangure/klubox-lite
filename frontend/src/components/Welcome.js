import React from 'react'
import '../App.css'
import *as config from '../config'
import Login from './Login'

export const Welcome = () => {
  return (
    <div className="App">
      <header className="Welcome" >
        <h1><b>Welcome to {config.APP_NAME}</b></h1>
      </header>
      <Login />
    </div>

  )
}
