import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.css';
import HomePage from './pages/HomePage';
import CurrentRiverLevelPage from './pages/CurrentRiverLevelPage';
import PredictedRiverLevelPage from './pages/PredictedRiverLevelPage';
import HistoricalDataPage from './pages/HistoricalDataPage';

import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const sensor_f3 = "lairdc0ee4000010109f3"; //The sensor with id 'lairdc0ee4000010109f3'
const sensor_45 = "lairdc0ee400001012345"; //The sensor with id 'lairdc0ee400001012345'

class App extends Component {
  state  = {
    currentLocation: [],
    tabIndex: 0,
    sensor_f3_reading: "",
    sensor_45_reading: ""
  }

  handleChange = (event, value) => {
   this.setState({ tabIndex: value });
  };

  getSensorReading = (deviceName) => {
    var that = this;
    let deviceId = ((deviceName === 'sensor_f3') ? sensor_f3 : sensor_45);
    fetch("/api/getData/" + deviceId)
      .then(res => {
        return res.json();
      })
      .then(function(parsedData) {
        that.setState({[deviceName + "_reading"]: parsedData[0].distanceToSensor});
      })
  }

  componentDidMount() {
    this.getSensorReading('sensor_f3');
    this.getSensorReading('sensor_45');
  }

  render() {
    return (
      <div className="root">
        <CssBaseline />
        <AppBar
          position="static"
        >
          <Toolbar>
            <Typography
              className="grow"
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
            >
              Dashboard
            </Typography>
            <Tabs value={this.state.tabIndex} onChange={this.handleChange}>
              <Tab label="Home" />
              <Tab label="Current River Level" />
              <Tab label="Predicted River Levels" />
              <Tab label="Historical Data" />
            </Tabs>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
        {this.state.tabIndex === 0 && <HomePage sensor_f3_reading={this.state.sensor_f3_reading} sensor_45_reading={this.state.sensor_45_reading} />}
        {this.state.tabIndex === 1 &&
          <div>
            <CurrentRiverLevelPage
              sensorReadings={[
                {"sensorID": sensor_f3, "latestReading": this.state.sensor_f3_reading},
                {"sensorID": sensor_45, "latestReading": this.state.sensor_45_reading},
              ]}
            />
          </div>
        }
        {this.state.tabIndex === 2 &&
          <div>
            <PredictedRiverLevelPage />
          </div>
        }
        {this.state.tabIndex === 3 && <HistoricalDataPage sensorIds={[sensor_f3, sensor_45]}/>}
      </div>
    );
  }
}

export default (App);
