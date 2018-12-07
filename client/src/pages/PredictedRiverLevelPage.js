import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import './PredictedRiverLevelPage.css';
import Chart from '../components/Chart';

class PredictedRiverLevelPage extends Component {

  render() {
    return (
      <Chart label="Rain Forecast" type="bar" for="weather"/>
    );
  }
}

export default (PredictedRiverLevelPage);
