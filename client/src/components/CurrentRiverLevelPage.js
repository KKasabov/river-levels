import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './CurrentRiverLevelPage.css';
import DataTable from './DataTable';

class CurrentRiverLevelPage extends Component {
  render() {
    return (
      <DataTable noOfColumns columnTitles data/>
    );
  }
}

export default (CurrentRiverLevelPage);
