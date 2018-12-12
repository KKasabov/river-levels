import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './CurrentRiverLevelPage.css';
import DataTable from '../components/DataTable';

const sensor_f3 = "lairdc0ee4000010109f3"; //The sensor with id 'lairdc0ee4000010109f3'
const distance_flood_plain_from_river_bed_sensor_f3 = 1820;
const sensor_45 = "lairdc0ee400001012345"; //The sensor with id 'lairdc0ee400001012345'
const distance_flood_plain_from_river_bed_sensor_45 = 1200;

class CurrentRiverLevelPage extends Component {
  getTableData() {
    let tableData = [];
    this.props.sensorReadings.forEach(reading => {
      let rowData = [];
      rowData.push(reading.sensorID);
      if(reading.sensorID === sensor_f3) {
        rowData.push(reading.latestReading);
        rowData.push(distance_flood_plain_from_river_bed_sensor_f3 - reading.latestReading);
      }
      else if(reading.sensorID === sensor_45) {
        rowData.push(reading.latestReading);
        rowData.push(distance_flood_plain_from_river_bed_sensor_45 - reading.latestReading);
      }
      else {
        rowData.push(reading.latestReading);
        rowData.push("N/A");
      }
      tableData.push(rowData);
    });
    return tableData;
  }



  render() {
    return (
      <DataTable noOfColumns={3} columnTitles={["Sensor ID", "Current water level (in millimeters)", "Distance from floodplain (in millimeters)"]} data={this.getTableData()}/>
    );
  }
}

export default (CurrentRiverLevelPage);
