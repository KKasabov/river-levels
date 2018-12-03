import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import CustomMap from './components/CustomMap';

class App extends Component {
  state  = {
    floodData: {}
  }

  componentDidMount() {
    axios.get(`https://environment.data.gov.uk/flood-monitoring/id/floods`)
      .then(res => {
        const floodData = res.data;
        this.setState({ floodData });
      })
  }

  render() {
    console.log(this.state.floodData);
    return (
      <CustomMap />
    );
  }
}

export default App;
