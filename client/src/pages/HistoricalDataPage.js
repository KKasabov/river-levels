import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './HistoricalDataPage.css';
import Chart from '../components/Chart';

class HistoricalDataPage extends Component {
  render() {
    return (
      <div className="container">
        <Chart sensorIds={this.props.sensorIds} labels={this.props.sensorIds} type="line" hasDatePicker/>
      </div>
    );
  }
}

export default (HistoricalDataPage);
