import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

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
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
