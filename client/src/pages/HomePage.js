import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './HomePage.css';
import CustomMap from '../components/CustomMap';

class HomePage extends Component {
  render() {
    return (<CustomMap
      sensor_f3_reading={this.props.sensor_f3_reading}
      sensor_45_reading={this.props.sensor_45_reading}
      sensor_E3951_reading={this.props.sensor_E3951_reading}
      sensor_E4060_reading={this.props.sensor_E4060_reading}
      sensor_E3966_reading={this.props.sensor_E3966_reading}/>);
  }
}

export default (HomePage);
