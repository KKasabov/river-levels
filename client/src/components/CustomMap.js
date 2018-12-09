import React, { Component } from 'react';
import L from 'leaflet';
import { LayerGroup, LayersControl, ZoomControl, Map, TileLayer, Marker, Popup, withLeaflet, Tooltip, Polygon, GeoJSON } from 'react-leaflet';
import Control from 'react-leaflet-control';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { connect} from "react-redux";
import { getLocation, getAreasData } from "../actions/actions";
import './CustomMap.css';
import AddressControl from './AddressControl';
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import 'react-leaflet-markercluster/dist/styles.min.css';
import sensorMarker from '../resources/sensorMarker.png';
import sensorMarkerCBlind from '../resources/sensorMarkerCBlind.png';
import { Values } from "redux-form-website-template";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import showResults from "./showResults";
import MaterialUiForm from "./MaterialUiForm";
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';

const sensorPositions = [
  [51.257785, 1.030079],
  [51.258144, 1.145929],
  [51.296693, 1.105983],
  [51.258867, 1.033447],
  [51.297928, 1.053239],
  [51.296461, 1.129525],
  [51.278570, 1.0770049],
  [51.280064, 1.0733199],
];

const { BaseLayer, Overlay } = LayersControl

const styles = theme => ({
  typography: {
    margin: theme.spacing.unit * 2,
  },
});

class CustomMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zoom: 12,
      marker: {},
      isSubscribeVisible: false,
      subscribeButtonText: "Show Subscribe",
      anchorEl: null,
    }

    this.myIcon = L.icon({
      iconUrl: this.props.isColorBlind ? sensorMarkerCBlind : sensorMarker,
      iconSize: [41, 41],
      iconAchor: [22, 94],
      popupAnchor: [0, -10]
    });
  }

  componentDidMount() {
    // console.log(this.refs.map.leafletElement);
    this.refs.map.leafletElement.on('baselayerchange', function(e) {
      if(e.name == "Default") {
        console.log("c");
      } else {
        //black & white
        console.log("bw");
      }
    });
    this.refs.map.leafletElement.on('geosearch/showlocation', (e) => {
      this.handleLocationFound(false, e.target._targets);
    });
    this.refs.map.leafletElement.on('geosearch/marker/dragend', (e) => {
      this.handleLocationFound(true, e.target._targets);
    });
    this.getGeoJSON();
  }

  componentDidUpdate(prevProps) {
  }

  componentWillUnmount() {
  }

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

createFloodAlertAreas(areas) {
  return areas.map((el, idx) => {
    if(idx < 9) {
      return (
        <GeoJSON
          ref={'area' + el.features[0].properties.FWS_TACODE} // unique identifier for the ref
          key={idx + "_fla"}
          data={el}
          style={this.stylePolFl}
          onEachFeature={this.onEachFeature.bind(this)}
          />);
        }
      });
    }

    createCurrentAlertAreas(areas) {
      return areas.map((el, idx) => {
        return (
          <GeoJSON
            ref={'area' + el.features[0].properties.FWS_TACODE} // unique identifier for the ref
            key={idx + "_fla"}
            data={el}
            style={this.stylePolCur}
            onEachFeature={this.onEachFeature.bind(this)}
            />);
          });
        }

        onEachFeature(feature, layer) {
          layer.on({
            mouseover: this.highlightFeature.bind(this),
            mouseout: this.resetHighlight.bind(this)
          });
          if (feature.properties && feature.properties.DESCRIP) {
            layer.bindPopup(feature.properties.DESCRIP);
          }
        }

        highlightFeature(e) {
          var layer = e.target;
          layer.setStyle({
            color: 'blue'
          });
        }

        resetHighlight(e) {
          var layer = e.target;
          // get ref to geojson obj using the unique id which we get from the event
          this.refs['area' + e.target.feature.properties.FWS_TACODE].leafletElement.resetStyle(layer);
        }

        stylePolFl(feature) {
          return {
            fillColor: "yellow",
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.3
          };
        }

        stylePolCur(feature) {
          return {
            fillColor: "red",
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.3
          };
        }

        getSubscribeFrom() {
          return (
              <MuiThemeProvider muiTheme={getMuiTheme()}>
                <div style={{ padding: 15 }}>
                  <MaterialUiForm onSubmit={showResults} />
                </div>
              </MuiThemeProvider>
          );
        }

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
              <AddressSearch />
              <LayersControl position="topright">
                <BaseLayer checked={!this.props.isColorBlind} name="Default">
                  <TileLayer attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                </BaseLayer>
                <BaseLayer checked={this.props.isColorBlind} name="Black And White">
                  <TileLayer attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png" />
                </BaseLayer>
                <Overlay checked name="Active Alerts in UK">
                  <LayerGroup>
                    {this.createCurrentAlertAreas(this.props.currentAlertAreas)}
                  </LayerGroup>
                </Overlay>
                <Overlay checked name="Canterbury Flood Areas">
                  <LayerGroup>
                    {this.createFloodAlertAreas(this.props.floodAlertAreas)}
                  </LayerGroup>
                </Overlay>
                <Overlay checked name="Sensors">
                  <LayerGroup>
                    <MarkerClusterGroup>
                      {this.createSensorMarkers(sensorPositions[0], "Reading_EA_0")}
                      {this.createSensorMarkers(sensorPositions[1], "Reading_EA_1")}
                      {this.createSensorMarkers(sensorPositions[2], "Reading_EA_2")}
                      {this.createSensorMarkers(sensorPositions[3], "Reading_EA_3")}
                      {this.createSensorMarkers(sensorPositions[4], "Reading_EA_4")}
                      {this.createSensorMarkers(sensorPositions[5], "Reading_EA_5")}
                      {this.createSensorMarkers(sensorPositions[6], this.props.sensor_f3_reading)}
                      {this.createSensorMarkers(sensorPositions[7], this.props.sensor_45_reading)}
                    </MarkerClusterGroup>
                  </LayerGroup>
                </Overlay>
              </LayersControl>
              <Control position="topleft" >
                <div>
                  <Button
                    aria-owns={open ? 'Search for location first!' : undefined}
                    aria-haspopup="true"
                     variant="contained" color="primary" onClick={(event) => {
                      if(this.state.marker.hasOwnProperty("options")) {
                        this.setState({isSubscribeVisible: !this.state.isSubscribeVisible});
                        this.setState({subscribeButtonText: (this.state.isSubscribeVisible ? "Show Subscribe" : "Hide Subscribe")});
                      } else {
                        this.setState({
                              anchorEl: event.currentTarget,
                            });
                      }
                    }}>
                    {this.state.subscribeButtonText}
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
