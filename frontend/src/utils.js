// Utility functions for the components
import { URL } from "./config";
import { Cookies } from "react-cookie";

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const validateEmail = email =>
  emailRegex.test(String(email).toLowerCase());

// Decode token
export const decodeToken = token => {
  try {
    token = token.split('.')[1]
    return atob(token);
  } catch (e) {
    throw new Error(`Error: ${e.message}`)
  }
}

// Set token in session
export const storeCookie = token => {
  sessionStorage.setItem('token', token)
}

// Get the token
export const getToken = () => {
  const token = sessionStorage.getItem('token')
  if (token) {
    return token
  }
  return null
}

// generate permissions
export const generatePermissions = user => {
  const permissions = []

  if (!user) {
    return ['', '', '']
  }

  user = JSON.parse(user)

  if (user.iup) {
    if(user.iup.includes('agent')) {
      permissions.push(true)
    } else {
      permissions.push('')
    }

    if (user.iup.includes('payout')) {
      permissions.push(true)
    } else {
      permissions.push('')
    }

    if(user.iup.includes('admin')) {
      permissions.push(true)
    } else {
      permissions.push('')
    }
  } else {
    permissions = ['', '', '']
  }

  const perms = {
    transView: permissions[2],
    transact: permissions[0] || permissions[2],
    payout: permissions[1] || permissions[2]
  }

  sessionStorage.setItem('transView', perms.transView)
  sessionStorage.setItem('transact', perms.transact)
  sessionStorage.setItem('payout', perms.payout)
}

export const getActiveTab = perms => {
  var activeTab
  console.log(perms);
  if (perms.transView) {
    return "transactions"
  }
  if (perms.transact) {
    return "transact"
  }
  if (perms.agent) {
    return "payout"
  }

  return ""
}

// Method for printing receipt
// TODO: complete method
export const printReceipt = (name, id, sender, amount, currency, ref, sentDate) => {

}

// Method for validating transaction
export const validateTransaction = trans => {
  
}
