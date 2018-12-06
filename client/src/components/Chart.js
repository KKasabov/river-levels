import React, { Component } from 'react';
import './Chart.css';
import RC2 from 'react-chartjs2';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';

class Chart extends Component {
  state  = {
    startDate: null,
    endDate: null,
    focusedInput: null,
    labels: [],
    data: []
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.state.startDate !== null && this.state.endDate !== null) {
      if (this.state.startDate !== prevState.startDate || this.state.endDate !== prevState.endDate) {
        this.getDataFromDb(this.state.startDate.format(), this.state.endDate.format());
      }
    }
  }

  // fetch data from our data base
  getDataFromDb = (startDate, endDate) => {
    var that = this;
    fetch("/api/getData/" + this.props.sensorId + "/" + startDate + "/" + endDate)
      .then(res => {
        console.log("response");
        return res.json();
      })
      .then(function(parsedData) {
        console.log(parsedData);
        let timestamp;
        parsedData.forEach(row => {
          timestamp = new Date(row.timestamp);
          row.timestamp = [timestamp.toLocaleDateString(), timestamp.toLocaleTimeString()];
        });
        that.setState({ labels: parsedData.map(row => row.timestamp), data: parsedData.map(row => row.distanceToSensor) });
      })
  };

  render() {
    let chartData = {
      labels: this.state.labels,
      datasets: [
        {
          label: this.props.sensorId,
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: this.state.data,
        }
      ]
    };

    let options = {
      responsive: true,
      scales: {
        yAxes: [{
            ticks: {
                fontSize: 20
            }
        }],
        xAxes: [{
            ticks: {
                fontSize: 20,
                autoSkip : true,
                maxTicksLimit: 7
            }
        }]
      }
    };

    return (
      <div className="container">
        <DateRangePicker
          startDate = {this.state.startDate} // momentPropTypes.momentObj or null,
          startDateId = "myStartDateId" // PropTypes.string.isRequired,
          endDate = {this.state.endDate} // momentPropTypes.momentObj or null,
          endDateId = "myEndDateId" // PropTypes.string.isRequired,
          onDatesChange = {({ startDate, endDate }) => this.setState({ startDate, endDate })} // PropTypes.func.isRequired,
          focusedInput = {this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
          onFocusChange = {focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
          isOutsideRange = {date => date.isAfter(new Date().toJSON().slice(0, 10))}
        />
        <RC2 data={chartData} options={options} type='line' />
      </div>
    );
  }
}

export default Chart;
