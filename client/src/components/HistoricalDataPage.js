import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './HistoricalDataPage.css';
import Chart from './Chart';

class HistoricalDataPage extends Component {
  render() {
    return (
      <div className="container">
        {this.props.sensorIds.map((sensorId, index) => {
          return (<div className="chart" key={index}>
            <Chart sensorId={sensorId} label={sensorId} type="line" hasDatePicker/>
          </div>
          );
        })}
      </div>
    );
  }
}

export default (HistoricalDataPage);
