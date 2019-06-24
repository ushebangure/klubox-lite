import React from 'react'

export class FormError extends React.Component {
  render() {
    return(
      <div style={{'color': 'red', 'font-size': '8px'}}>{this.props.error}</div>
    )
  }
}
