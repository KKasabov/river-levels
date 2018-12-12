import React, { Component } from 'react';
import L from 'leaflet';
import { LayerGroup, LayersControl, ZoomControl, Map, TileLayer, Marker, Popup, withLeaflet, Tooltip, Polygon, GeoJSON } from 'react-leaflet';
import Control from 'react-leaflet-control';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { connect} from "react-redux";
import { getLocation, getAreasData } from "../actions/actions";
import './CustomMap.css';
import InfoDialog from './InfoDialog.js'
import AddressControl from './AddressControl';
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import 'react-leaflet-markercluster/dist/styles.min.css';
import sensorMarker from '../resources/sensorMarker.png';
import sensorMarkerCBlind from '../resources/sensorMarkerCBlind.png';
import { Values } from "redux-form-website-template";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import sendResult from "./sendResult";
import MaterialUiForm from "./MaterialUiForm";
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';

const sensorPositions = [
  [51.257785, 1.030079], //E3951 Water level
  [51.258144, 1.145929], //E4060 Water level
  [51.295660, 1.088238], //E3966 Water level

  [51.258867, 1.033447], //E4080 Reinfall
  [51.297928, 1.053239], //E4090 Reinfall

  [51.278570, 1.0770049], //MQTT F3
  [51.280064, 1.0733199], //MQTT 45
];

const { BaseLayer, Overlay } = LayersControl

const styles = theme => ({
  typography: {
    margin: theme.spacing.unit * 2,
  },
});

//The map to be rendered on the home page
class CustomMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zoom: 12,
      marker: {},
      isSubscribeVisible: false,
      anchorEl: null,
      dialogOpen: false,
    }

    this.myIcon = L.icon({
      iconUrl: this.props.isColorBlind ? sensorMarkerCBlind : sensorMarker,
      iconSize: [41, 41],
      iconAchor: [22, 94],
      popupAnchor: [0, -10]
    });
  }

  componentDidMount() {
    //event listeners for when a location is plotted on the map
    this.refs.map.leafletElement.on('geosearch/showlocation', (e) => {
      this.handleLocationFound(false, e.target._targets);
    });
    //listener for marker drag
    this.refs.map.leafletElement.on('geosearch/marker/dragend', (e) => {
      this.handleLocationFound(true, e.target._targets);
    });
    this.getGeoJSON();
  }

  componentDidUpdate(prevProps) {
  }

  componentWillUnmount() {
  }

  //updates the state of the user's home position in the store
  handleLocationFound(isDragged, targets) {
    let arr;
    if(!isDragged) {
      this.refs.map.leafletElement.removeLayer(this.state.marker);
    }
    arr = Object.values(targets).filter(target => target.options.draggable === true);
    if(arr.length === 1) {
      this.setState({marker: arr[0]});
      this.props.getLocation({
        location: [this.state.marker._latlng.lat, this.state.marker._latlng.lng]
      });
    }
    if(isDragged) {
      var marker = this.state.marker;
      marker._popup._content = "Home";
      this.setState({marker: marker});
    } else {
      this.refs.map.leafletElement.scrollWheelZoom.enable()
      this.refs.map.leafletElement.dragging.enable();
    }
  }

  // fetch data from our data base
  getGeoJSON = () => {
    var that = this;
    Promise.all([
      fetch("/api/getFloodAreas/"),
      fetch("/api/getFloodAreas?current=1")
    ])
    .then(([res1, res2]) => Promise.all([res1.json(), res2.json()]))
    .then(([floodAreas, currentAlertAreas]) =>
    that.props.getAreasData({
      floodAlertAreasItems: floodAreas[0],
      floodAlertAreas: floodAreas[1],
      currentAlertAreasItems: currentAlertAreas[0],
      currentAlertAreas: currentAlertAreas[1]
    })
  );
};

//create the markers for the sensors together with the tooltips
createSensorMarkers(position, reading) {
  return (
    <Marker
      position={position}
      icon={this.myIcon}
      >
      <Tooltip>
        {reading}
      </Tooltip>
    </Marker>
  );
}

// create the flood alert(just aroud Canterbury) and the currently active alert and warning areas (England)
createGEOjsonAreas(areas, isAlert) {
  return areas.map((el, idx) => {
    if((idx < 9 && !isAlert) || isAlert) {
      return (
        <GeoJSON
          ref={'area' + el.features[0].properties.FWS_TACODE} // unique identifier for the ref
          key={idx + "_fla"}
          data={el}
          style={isAlert ? this.styleGEOjsonAlert : this.styleGEOjsonInfo}
          onEachFeature={isAlert ? this.onEachFeatureAlert.bind(this) : this.onEachFeatureInfo.bind(this)}
          />);
        }
      });
    }

    onEachFeatureAlert(feature, layer) {
      this.onEachFeature(feature, layer, true)
    }

    onEachFeatureInfo(feature, layer) {
      this.onEachFeature(feature, layer, false)
    }

    //sets the style and the popup content for each polygon
    onEachFeature(feature, layer, isAlert) {
      layer.on({
        mouseover: isAlert ? this.highlightFeatureAlert.bind(this) : this.highlightFeatureInfo.bind(this),
        mouseout: this.resetHighlight.bind(this)
      });
      if (feature.properties && feature.properties.DESCRIP) {
        var arr1 = this.props.currentAlertAreasItems.filter(el => {
          return el.floodAreaID == feature.properties.FWS_TACODE
        });
        var arr2 = this.props.floodAlertAreasItems.filter(el => {
          return el.notation == feature.properties.FWS_TACODE
        });
        var txt= "";
        if(arr1.length > 0) {
          txt = arr1[0].description + "<br /><br />Severity: " + arr1[0].severity + "<br /> Level: " + arr1[0].severityLevel;
        } else if(arr2.length > 0) {
          txt = arr2[0].label;
        }
        layer.bindPopup(txt);
      }
    }

    //changes the style when the mouse hoovers on the Polygon
    highlightFeature(e, color) {
      var layer = e.target;
      layer.setStyle({
        weight: 2,
        opacity: 1,
        color: color,
        fillOpacity: 0.6
      });
    }

    highlightFeatureAlert(e) {
      this.highlightFeature(e, "red")
    }

    highlightFeatureInfo(e) {
      this.highlightFeature(e, "blue")
    }

    //resets the highlight
    resetHighlight(e) {
      var layer = e.target;
      // get ref to geojson obj using the unique id which we get from the event
      this.refs['area' + e.target.feature.properties.FWS_TACODE].leafletElement.resetStyle(layer);
    }

    //set the style for the info polygons
    styleGEOjsonInfo(feature) {
      return {
        weight: 2,
        opacity: 1,
        color: 'blue',
        fillOpacity: 0.3
      };
    }
    //set the style for the alert polygons
    styleGEOjsonAlert(feature) {
      return {
        weight: 2,
        opacity: 1,
        color: 'red',
        fillOpacity: 0.3
      };
    }

    //returns the subscribe form
    getSubscribeFrom() {
      return (
        <MuiThemeProvider muiTheme={getMuiTheme()}>
          <div style={{ padding: 15 }}>
            <MaterialUiForm onSubmit={this.attachLocationBeforeSubmit.bind(this)} />
          </div>
        </MuiThemeProvider>
      );
    }

    //mediator for the submit button
    //attaches the current coordinates to the
    //submit object
    attachLocationBeforeSubmit(genValues) {
      var newValues = {
        name: genValues.name,
        email: genValues.email,
        phone: genValues.phone,
        location: {
          lat: this.props.location[0],
          long: this.props.location[1]
        }
      };
      sendResult(newValues);
      this.setState({
        isSubscribeVisible: false
      });
      this.setState({
        dialogOpen: true
      });
    }

    //close the dialog
    onDialogClose() {
      this.setState({
        dialogOpen: false
      });
    }

    //main function, which renders the custom map object
    render() {
      const AddressSearch = withLeaflet(AddressControl);
      const { classes } = this.props;
      const { anchorEl } = this.state;
      const open = Boolean(anchorEl);
      return (
        <Map
          className="map"
          minZoom="3"
          maxZoom="19"
          center={this.props.location}
          zoom={this.state.zoom}
          ref='map'
          zoomControl={false}>
          <ZoomControl position="topleft" />
          <InfoDialog open={this.state.dialogOpen} onClose={this.onDialogClose.bind(this)}/>
          <AddressSearch />
          <LayersControl position="topright">
            <BaseLayer checked name="Default">
              <TileLayer attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            </BaseLayer>
            <BaseLayer name="Black And White">
              <TileLayer attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png" />
            </BaseLayer>
            <Overlay checked name="Active in England">
              <LayerGroup>
                {this.createGEOjsonAreas(this.props.currentAlertAreas, true)}
              </LayerGroup>
            </Overlay>
            <Overlay checked name="Canterbury Flood Areas">
              <LayerGroup>
                {this.createGEOjsonAreas(this.props.floodAlertAreas, false)}
              </LayerGroup>
            </Overlay>
            <Overlay checked name="Sensors">
              <LayerGroup>
                <MarkerClusterGroup>
                  {this.createSensorMarkers(sensorPositions[0], this.props.sensor_E3951_reading)}
                  {this.createSensorMarkers(sensorPositions[1], this.props.sensor_E4060_reading)}
                  {this.createSensorMarkers(sensorPositions[2], this.props.sensor_E3966_reading)}
                  {this.createSensorMarkers(sensorPositions[5], this.props.sensor_f3_reading)}
                  {this.createSensorMarkers(sensorPositions[6], this.props.sensor_45_reading)}
                </MarkerClusterGroup>
              </LayerGroup>
            </Overlay>
          </LayersControl>
          <Control position="topleft" >
            <div>
              <Button
                ref='subscribeButton'
                aria-owns={open ? 'Search for location first!' : undefined}
                aria-haspopup="true"
                variant="contained" color="primary" onClick={(event) => {
                  if(this.state.marker.hasOwnProperty("options")) {
                    this.setState({isSubscribeVisible: !this.state.isSubscribeVisible});
                  } else {
                    this.setState({
                      anchorEl: event.currentTarget,
                    });
                  }
                }}>
                Subscribe
              </Button>
              <Popover
                id="simple-popper"
                open={open}
                anchorEl={anchorEl}
                onClose={() => {
                  this.setState({
                    anchorEl: null,
                  });
                }}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
                >
                <Typography className={classes.typography}>Search for location first!</Typography>
              </Popover>
            </div>
            {this.state.isSubscribeVisible && this.getSubscribeFrom()}
          </Control>
        </Map>
      )
    }
  }

  CustomMap.propTypes = {
    classes: PropTypes.object.isRequired,
  };

  const mapDispatchToProps = dispatch => {
    return {
      getLocation: location => dispatch(getLocation(location)),
      getAreasData: areasData => dispatch(getAreasData(areasData))
    };
  };

  const mapStateToProps = state => {
    return {
      location: state.getMapInputReducer.location,
      floodAlertAreasItems: state.getMapInputReducer.floodAlertAreasItems,
      floodAlertAreas: state.getMapInputReducer.floodAlertAreas,
      currentAlertAreasItems: state.getMapInputReducer.currentAlertAreasItems,
      currentAlertAreas: state.getMapInputReducer.currentAlertAreas
    };
  };

  export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(CustomMap));
