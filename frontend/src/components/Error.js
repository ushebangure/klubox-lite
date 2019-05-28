import React from 'react'

export class FormError extends React.Component {
  render() {
    return(
      <div style={{'color': 'red'}}>{this.props.error}</div>
    )
  }
}
