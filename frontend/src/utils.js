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

// store the id in session storage
export const storeAgentId = id => {
  sessionStorage.setItem('id', id)
}

// Get the token
export const getToken = () => {
  const token = sessionStorage.getItem('token')
  if (token) {
    return token
  }
  return null
}

// Get the agent id
export const getAgentId = () => {
  const id = sessionStorage.getItem('id')
  if (id) {
    return id
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

// Validate phone number

const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
export const validatePhoneNumber = number => {
  phoneRegex.test(number)
}

// Validate transaction
export const validateTransaction = (trans) => {
  if (!trans.ref) {
    return null
  }
  if (!trans.status) {
    return null
  }
  if (!trans.receiverName) {
    return null
  }
  if (!trans.receiverSurname) {
    return null
  }
  if (!trans.receiverId) {
    return null
  }
  if (!trans.senderName) {
    return null
  }
  if (!trans.receiverPhoneNumber) {
    return null
  }
  if (!trans.senderPhoneNumber) {
    return null
  }
  if (!trans.senderSurname) {
    return null
  }
  if (!trans.collectionMethod) {
    return null
  }
  return true
}

// Method for extracting transaction
export const getTransactionFromState = trans => {
  const transaction = {}
  transaction.Receiver = {}
  transaction.Sender = {}

  if (trans.receiverGender) {
    transaction.Receiver.Gender = trans.receiverGender
  } else {
    return null
  }
  if (trans.receiverId) {
    transaction.Receiver.IdNumber = trans.receiverId
  } else {
    return null
  }
  if (trans.receiverName) {
    transaction.Receiver.Name = trans.receiverName
  } else {
    return null
  }
  if (trans.receiverPhoneNumber) {
    transaction.Receiver.Phone = trans.receiverPhoneNumber
  } else {
    return null
  }
  if (trans.receiverSurname) {
    transaction.Receiver.Surname = trans.receiverSurname
  } else {
    return null
  }
  if (trans.senderName) {
    transaction.Sender.Name = trans.senderName
  } else {
    return null
  }
  if (trans.senderSurname) {
    transaction.Sender.Surname = trans.senderSurname
  } else {
    return null
  }
  if (trans.senderPhoneNumber) {
    transaction.Sender.Phone = trans.senderPhoneNumber
  } else {
    return null
  }
  if (trans.senderGender) {
    transaction.Sender.Gender = trans.senderGender
  } else {
    return null
  }
  if (trans.amount) {
    transaction.AmountToSend = trans.amount
  } else {
    return null
  }
  if (trans.totalToPay) {
    transaction.TotalToPay = trans.totalToPay
  } else {
    return null
  }
  if (trans.charges) {
    transaction.Charges = trans.charges
  } else {
    return null
  }
  if (trans.currencyToSend) {
    transaction.CurrencyToSend = trans.currencyToSend
  } else {
    return null
  }
  if (trans.currencyForPayment) {
    transaction.CurrencyToPay = trans.currencyForPayment
  } else {
    return null
  }
  if (trans.location){
    transaction.PickUpLocation = trans.location
  } else {
    return null
  }

  return transaction
}

// Method for logging out
export const logout = () => {
  sessionStorage.removeItem('token')
}

// Method for calculating the equivalent amount in a different currency
export const changeCurrency = (currencies, amount, currency, currencyTo) => {
  return amount*currencies[`${currencyTo.value}`]/currencies[`${currency.value}`]
}

// Agent form validation
export const validateAgent = state => {
  let valid = true
  [
    'name', 'surname', 'permissions', 'email',
    'password', 'password2',
    'confirmPassword', 'validPassword',
    'validName', 'validEmail', 'validSurname'
  ].forEach(v => {
    if (v !== 'permissions') {
      if (!state[v]) {
        valid = false
      }
    } else {
      if (state[v].length > 1) {
        valid = false
      }
    }
  })

  return valid
}
