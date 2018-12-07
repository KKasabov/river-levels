import React, { Component } from 'react';
import { LayerGroup, LayersControl, ZoomControl, Map, TileLayer, Marker, Popup, withLeaflet, Tooltip, Polygon, GeoJSON } from 'react-leaflet';
import './CustomMap.css';
import AddressControl from './AddressControl'
import sensorMarker from '../resources/sensorMarker.png';
import sensorMarkerCBlind from '../resources/sensorMarkerCBlind.png';
import L from 'leaflet';
import { connect } from "react-redux";
import { getLocation } from "../actions/actions";

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

const multiPolygon = [
  [[51.51, -0.12], [51.51, -0.13], [51.53, -0.13]],
  [[51.51, -0.05], [51.51, -0.07], [51.53, -0.07]],
]

const polygon = [[51.515452323423452345, -0.093452323423423452345], [51.52123123423423423123, -0.15323423423445345], [51.52123123423823423123, -0.15323493423445345], [51.23423423423423423, -0.121231523423423421535]]

const { BaseLayer, Overlay } = LayersControl

class CustomMap extends Component {

  constructor(props) {
    super(props);
    this.state = {
      zoom: 12,
      marker: {},
      floodAlertAreasItems: [],
      floodAlertAreas: [],
      currentAlertAreasItems: [],
      currentAlertAreas: []
    }

    this.myIcon = L.icon({
      iconUrl: this.props.isColorBlind ? sensorMarkerCBlind : sensorMarker,
      iconSize: [41, 41],
      iconAchor: [22, 94],
      popupAnchor: [0, -10]
    });
  }

  componentDidMount() {
    let arr;
    this.refs.map.leafletElement.on('moveend', e => {
      arr = Object.values(this.refs.map.leafletElement._targets).filter(target => target.hasOwnProperty("_latlng"));
      if(arr[arr.length - 1] != null && arr.length > sensorPositions.length ) {
        this.setState({marker: arr[arr.length - 1]});
        this.state.marker._popup._content = "Home";
        this.state.marker.on('dragend', e => {
          this.setState({marker: arr[arr.length - 1]});
          this.props.getLocation({
            location: [this.state.marker._latlng.lat, this.state.marker._latlng.lng]
          });
        });
      }
    });

    this.getGeoJSON();
  }

  componentDidUpdate(prevProps) {
    if(prevProps.isColorBlind !== this.props.isColorBlind) {
      //setIcons for sensors and search
    }
  }

  componentWillUnmount() {

  }

  createPolygon(polyObj) {
    return (
      <Polygon color="purple" positions={polyObj.features[0].geometry.coordinates} />
    );
  }

  // fetch data from our data base
  getGeoJSON = () => {
    var that = this;
    Promise.all([
      fetch("/api/getFloodAreas/"),
      fetch("/api/getFloodAreas?current=1")
    ])
    .then(([res1, res2]) => Promise.all([res1.json(), res2.json()]))
    .then(([floodAreas, currentAlertAreas]) => that.setState({
        floodAlertAreasItems: floodAreas[0],
        floodAlertAreas: floodAreas[1],
        currentAlertAreasItems: currentAlertAreas[0],
        currentAlertAreas: currentAlertAreas[1]
    }));
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
    // console.log(areas);
    return areas.map((el, idx) => {
      return (<GeoJSON key={idx + "_fla"} data={el} style={this.stylePolFl}/>);
    });
  }

  createCurrentAlertAreas(areas) {
    // console.log(areas);
    return areas.map((el, idx) => {
      return (<GeoJSON key={idx + "_fla"} data={el} style={this.stylePolCur}/>);
    });
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

  render() {
    const AddressSearch = withLeaflet(AddressControl);
    return (
      <Map
        className="map"
        minZoom="4"
        maxZoom="19"
        center={this.props.location}
        zoom={this.state.zoom}
        ref='map'
        zoomControl={false}>
        <ZoomControl position="topleft" />
        <AddressSearch />
        <LayersControl position="topright">
          <BaseLayer checked={!this.props.isColorBlind} name="Colour">
            <TileLayer attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          </BaseLayer>
          <BaseLayer checked={this.props.isColorBlind} name="Black And White">
            <TileLayer attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png" />
          </BaseLayer>
          <Overlay checked name="Active Alerts in UK">
            <LayerGroup>
              {this.createCurrentAlertAreas(this.state.currentAlertAreas)}
            </LayerGroup>
          </Overlay>
          <Overlay checked name="Canterbury Flood Areas">
            <LayerGroup>
              {this.createFloodAlertAreas(this.state.floodAlertAreas)}
            </LayerGroup>
          </Overlay>
          <Overlay checked name="Sensors">
            <LayerGroup>
              {this.createSensorMarkers(sensorPositions[0], "Reading_EA_0")}
              {this.createSensorMarkers(sensorPositions[1], "Reading_EA_1")}
              {this.createSensorMarkers(sensorPositions[2], "Reading_EA_2")}
              {this.createSensorMarkers(sensorPositions[3], "Reading_EA_3")}
              {this.createSensorMarkers(sensorPositions[4], "Reading_EA_4")}
              {this.createSensorMarkers(sensorPositions[5], "Reading_EA_5")}
              {this.createSensorMarkers(sensorPositions[6], this.props.sensor_f3_reading)}
              {this.createSensorMarkers(sensorPositions[7], this.props.sensor_45_reading)}
            </LayerGroup>
          </Overlay>
        </LayersControl>
      </Map>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getLocation: location => dispatch(getLocation(location))
  };
};

const mapStateToProps = state => {
  return { location: state.getMapInputReducer.location };
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomMap);
