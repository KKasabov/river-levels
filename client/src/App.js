import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import CustomMap from './components/customMap';

class App extends Component {
  state  = {
    floodData: {}
  }

  // Redirects. At times of high load or in future versions of this API the service may redirect to an alternative URL.
  // Client code should be written so as to follow standard HTTP redirects.
  //
  // Caching. API responses may be cached for a short period within the serving infrastructure or a content delivery network.
  // At times of high load then limiting API use to common patterns (avoiding custom filtering) will improve the chances of
  //cache hits and so good response times. These common patterns are:
  //
  // http://environment.data.gov.uk/flood-monitoring/id/floods
  // http://environment.data.gov.uk/flood-monitoring/id/floods?min-severity={x}
  // http://environment.data.gov.uk/flood-monitoring/id/3dayforecast
  // http://environment.data.gov.uk/flood-monitoring/id/3dayforecast/image/{day}
  // http://environment.data.gov.uk/flood-monitoring/data/readings?latest
  // Recent updates



  componentDidMount() {
    // axios.get(`https://environment.data.gov.uk/flood-monitoring/id/stations/E3826/measures?parameter=level`)
    // axios.get(`https://environment.data.gov.uk/flood-monitoring/id/stations/E3826/readings?latest`)
    axios.get('http://environment.data.gov.uk/flood-monitoring/id/stations?lat=51.280233&long=1.0789089&dist=5')
      .then(res => {
        const floodData = res.data;
        console.log(floodData);
        // console.log("Latest reading for "+ floodData.items[0].stationReference + " at: " + floodData.items[0].latestReading.dateTime
                  // +  "\nDistance: " + floodData.items[0].latestReading.value + "m")
        this.setState({ floodData });
      })
  }

  render() {
    // console.log(this.state.floodData.it[0].latestReading.dateTime);
    return (
      <CustomMap />
    );
  }
}

export default App;
