import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.css';
import axios from 'axios';
import CustomMap from './components/CustomMap';
import Chart from './components/Chart';

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

class App extends Component {
  state  = {
    tabIndex: 0
  }

  handleChange = (event, value) => {
   this.setState({ tabIndex: value });
  };

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
              <Tab label="Item One" />
              <Tab label="Item Two" />
              <Tab label="Item Three" />
            </Tabs>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
        {this.state.tabIndex === 0 && <CustomMap />}
        {this.state.tabIndex === 1 && <Chart />}
      </div>
    );
  }
}

export default (App);
