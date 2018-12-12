import React, { Component } from 'react';
import Iframe from 'react-iframe'
import PropTypes from 'prop-types';
import './HomePage.css';
import CustomMap from '../components/CustomMap';

import Typography from '@material-ui/core/Typography';

class HomePage extends Component {
  render() {
    return (
      <div className="homePageContainer">
        <Typography
          className="grow"
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
        >
          Current water level and flood areas (hover over any marker to see the latest sensor reading)
        </Typography>
        <div className="contentContainer">
          <CustomMap
            sensor_f3_reading={this.props.sensor_f3_reading}
            sensor_45_reading={this.props.sensor_45_reading}
            sensor_E3951_reading={this.props.sensor_E3951_reading}
            sensor_E4060_reading={this.props.sensor_E4060_reading}
            sensor_E3966_reading={this.props.sensor_E3966_reading}
          />
          <Iframe frameborder="0" width="160px" height="380px" scrolling="no" url="https://environment.data.gov.uk/flood-widgets/widgets/widget-England-vertical.html" />
        </div>
      </div>
  );
  }
}

export default (HomePage);
