import React from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

export class TransactionListManagementTab extends React.Component {
  state = {
    fromDate: this.props.fromDate,
    toDate: this.props.toDate,
    filter: this.props.filter,
    reportType: "salesType",
    salesType: true,
    agentsType: false
  };

  handleInput = (input, property) => {
    this.setState({
      [property]: input
    })
    this.props.changeList(property, input)
  };

  handleFilterInput = e => {
    this.handleInput(e.target.value, 'filter')
  }

  handleReportInput = e => {
    ["salesType", "agentsType"].forEach(type => {
      if (type !== e.target.name) {
        this.setState({
          [type]: false
        });
      } else {
        this.setState({
          [type]: !this.state[type],
          reportType: type
        });
      }
    });
  };

  render() {
    return (
      <div className="TransListManage">
          <input
            type="text"
            name="filter"
            placeholder="Enter name or transaction reference"
            onKeyDown={this.handleFilterInput}
            style={{width: 400}}
          />&nbsp;
        <b>Range</b>: &nbsp; from &nbsp;
        <DatePicker
            selected={this.state.fromDate}
            onChange={(date) => {
              this.handleInput(date, 'fromDate')
            }}
          />
        &nbsp; to &nbsp;
        <DatePicker
          selected={this.state.toDate}
          onChange={(date) => {
            this.handleInput(date, 'toDate')
          }}
        />
      <button
        className="TransactionSearch"
        onClick={this.props.search}
      >Search</button>  
        <div className="ReportType">
          Report Type:
          <div>
            <input
              type="checkbox"
              name="salesType"
              checked={this.state.salesType}
              onChange={this.handleReportInput}
            />
            Sales
          </div>
          <div>
            <input
              type="checkbox"
              name="agentsType"
              checked={this.state.agentsType}
              onChange={this.handleReportInput}
            />
            Agents
          </div>
        </div>
        <button onClick={() => {
            // TODO: add the method to generate}} />
          }} className="GenerateButton">
         Generate Report
       </button>
      </div>
    );
  }
}
