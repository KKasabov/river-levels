import React, { Component } from 'react';
import './App.css';
import HomePage from './pages/HomePage';
import CurrentRiverLevelPage from './pages/CurrentRiverLevelPage';
import PredictedRiverLevelPage from './pages/PredictedRiverLevelPage';
import HistoricalDataPage from './pages/HistoricalDataPage';

import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const sensor_f3 = "lairdc0ee4000010109f3"; //The sensor with id 'lairdc0ee4000010109f3'
const sensor_45 = "lairdc0ee400001012345"; //The sensor with id 'lairdc0ee400001012345'
const CALLBACK_INTERVAL_MILLISECONDS = 900000;

class App extends Component {

  constructor(props) {
    super(props);
    this.state  = {
      currentLocation: [],
      tabIndex: 0,
      sensor_f3_reading: "",
      sensor_45_reading: "",
      E3951_reading: "",
      E4060_reading: "",
      E3966_reading: ""
    }

    this.interval;
  }

  handleChange = (event, value) => {
   this.setState({ tabIndex: value });
  };

  getSensorReading(deviceName) {
    let deviceId, route;
    route = "/api/getData/";
    if(deviceName === 'sensor_f3') {
      deviceId = sensor_f3;
    } else if(deviceName === 'sensor_45') {
      deviceId = sensor_45;
    } else {
      deviceId = deviceName;
      route = "/api/getEAData/";
    }

    fetch(route + deviceId)
      .then(res => {
        return res.json();
      })
      .then(function(parsedData) {
        if(route === "/api/getEAData/") {
          this.setState({[deviceName + "_reading"]: parsedData[0].readingValue});
        } else {
          this.setState({[deviceName + "_reading"]: parsedData[0].waterLevel});
        }
      }.bind(this))
  }

  componentDidMount() {
    this.getSensorData();
    this.interval = setInterval(this.getSensorData.bind(this), CALLBACK_INTERVAL_MILLISECONDS);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getSensorData() {
    this.getSensorReading('sensor_f3');
    this.getSensorReading('sensor_45');
    this.getSensorReading('E3951');
    this.getSensorReading('E4060');
    this.getSensorReading('E3966');
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
              Great River Stour Condition
            </Typography>
            <Tabs value={this.state.tabIndex} onChange={this.handleChange}>
              <Tab label="Home" />
              <Tab label="Current River Level" />
              <Tab label="Predicted River Levels" />
              <Tab label="Historical Data" />
            </Tabs>
          </Toolbar>
        </AppBar>
        {this.state.tabIndex === 0 && <HomePage
           sensor_f3_reading={this.state.sensor_f3_reading}
           sensor_45_reading={this.state.sensor_45_reading}
           sensor_E3951_reading={this.state.E3951_reading}
           sensor_E4060_reading={this.state.E4060_reading}
           sensor_E3966_reading={this.state.E3966_reading}
           />}
        {this.state.tabIndex === 1 &&
          <div>
            <CurrentRiverLevelPage
              sensorReadings={[
                {"sensorID": sensor_f3, "latestReading": this.state.sensor_f3_reading},
                {"sensorID": sensor_45, "latestReading": this.state.sensor_45_reading},
                {"sensorID": "E3951", "latestReading": this.state.E3951_reading},
                {"sensorID": "E4060", "latestReading": this.state.E4060_reading},
                {"sensorID": "E3966", "latestReading": this.state.E3966_reading}
              ]}
            />
          </div>
        }
        {this.state.tabIndex === 2 &&
          <div>
            <PredictedRiverLevelPage />
          </div>
        }
        {this.state.tabIndex === 3 && <HistoricalDataPage sensorIds={[sensor_f3, sensor_45, "E3951", "E4060", "E3966", "E3826"]}/>}
      </div>
    );
  }
}

export default (App);
