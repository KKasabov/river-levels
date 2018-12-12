import React, { Component } from 'react';
import './Chart.css';
import RC2 from 'react-chartjs2';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import { isInclusivelyBeforeDay } from 'react-dates';
import moment from 'moment';

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

  componentDidMount() {
    if(this.props.for && this.props.for === "weather") {
      this.getWeatherData();
    }
  }

  // fetch data from our data base
  getDataFromDb = (startDate, endDate) => {
    console.log(startDate);
    var that = this;
    var sensorData;
    Promise.all([
      fetch("/api/getData/" + this.props.sensorIds[0] + "/" + startDate + "/" + endDate),
      fetch("/api/getData/" + this.props.sensorIds[1] + "/" + startDate + "/" + endDate),
      fetch("/api/getEAData/" + this.props.sensorIds[2] + "/" + startDate + "/" + endDate),
      fetch("/api/getEAData/" + this.props.sensorIds[3] + "/" + startDate + "/" + endDate),
      fetch("/api/getEAData/" + this.props.sensorIds[4] + "/" + startDate + "/" + endDate),
      fetch("/api/getEAData/" + this.props.sensorIds[5] + "/" + startDate + "/" + endDate)
    ])
    .then(([res1, res2, res3, res4, res5, res6]) => Promise.all([res1.json(), res2.json(), res3.json(), res4.json(), res5.json(), res6.json()]))
    .then(([res1Data, res2Data, res3Data, res4Data, res5Data, res6Data]) => {
      that.setState({
        labels: [startDate, endDate],
        data: [
          res1Data.map(row => row.waterLevel),
          res2Data.map(row => row.waterLevel),
          res3Data.map(row => row.readingValue),
          res4Data.map(row => row.readingValue),
          res5Data.map(row => row.readingValue),
          res6Data.map(row => row.readingValue)
        ]
      });
    })
  };

  getWeatherData = () => {
    var that = this;
    fetch("/api/weather")
      .then(res => {
        console.log("response");
        return res.json();
      })
      .then(function(parsedData) {
        console.log(parsedData);
        // get labels for next 5 days of the week
        let labels = that.getNext5Days();
        let averages = [];
        let count;
        // we get 5 forecasts a day, create an average for each day
        parsedData.map((value,index) => {
          if(index % 5 !== 0) {
            count += value;
          }
          else {
            averages.push(count/5);
            count = 0;
          }
        });
        that.setState({ labels: labels, data: [averages] });
      })
  };

  getNext5Days() {
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var result = [];
    for (var i = 0; i < 5; i++) {
        var d = new Date();
        d.setDate(d.getDate() + i);
        result.push(days[d.getDay()]);
    }
    return result;
  }

  render() {
    let dataset;
    let chartData = {
      labels: this.state.labels,
      datasets: []
    };

    this.state.data.forEach((ds, i) => {
      dataset = {
        label: this.props.labels[i],
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
        data: ds
      }
      chartData.datasets.push(dataset);
    })

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

    let datePicker = (
      (this.props.hasDatePicker) ?
        (<DateRangePicker
          startDate = {this.state.startDate} // momentPropTypes.momentObj or null,
          startDateId = "myStartDateId" // PropTypes.string.isRequired,
          endDate = {this.state.endDate} // momentPropTypes.momentObj or null,
          endDateId = "myEndDateId" // PropTypes.string.isRequired,
          onDatesChange = {({ startDate, endDate }) => this.setState({ startDate, endDate })} // PropTypes.func.isRequired,
          focusedInput = {this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
          onFocusChange = {focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
          isOutsideRange={day => !isInclusivelyBeforeDay(day, moment())}
        />) :
        " ");

    return (
      <div className="container">
        {datePicker}
        <RC2 data={chartData} options={options} type={this.props.type} />
      </div>
    );
  }
}

export default Chart;
