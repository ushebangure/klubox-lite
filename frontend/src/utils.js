// Utility functions for the components
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

// Method for extracting transaction
export const getTransactionFromState = trans => {
  const transaction = {}

  if (trans.receiverGender) {
    transaction.receiverGender = trans.receiverGender
  } else {
    return null
  }
  if (trans.receiverId) {
    transaction.receiverId = trans.receiverId
  } else {
    return null
  }
  if (trans.receiverName) {
    transaction.receiverName = trans.receiverName
  } else {
    return null
  }
  if (trans.receiverPhoneNumber) {
    transaction.receiverPhoneNumber = trans.receiverPhoneNumber
  } else {
    return null
  }
  if (trans.receiverSurname) {
    transaction.receiverSurname = trans.receiverSurname
  } else {
    return null
  }
  if (trans.senderName) {
    transaction.senderName = trans.senderName
  } else {
    return null
  }
  if (trans.senderSurname) {
    transaction.senderSurname = trans.senderSurname
  } else {
    return null
  }
  if (trans.senderPhoneNumber) {
    transaction.senderPhoneNumber = trans.senderPhoneNumber
  } else {
    return null
  }
  if (trans.senderGender) {
    transaction.senderGender = trans.senderGender
  } else {
    return null
  }
  if (trans.amount) {
    transaction.amount = trans.amount
  } else {
    return null
  }
  if (trans.totalToPay) {
    transaction.totalToPay = trans.totalToPay
  } else {
    return null
  }
  if (trans.charges) {
    transaction.charges = trans.charges
  } else {
    return null
  }
  if (trans.currencyToSend) {
    transaction.currencyToSend = trans.currencyToSend
  } else {
    return null
  }
  if (trans.currencyForPayment) {
    transaction.currencyForPayment = trans.currencyForPayment
  } else {
    return null
  }

  return transaction
}
