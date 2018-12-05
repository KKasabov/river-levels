import React, { Component } from 'react';
import { LayerGroup, LayersControl, ZoomControl, Map, TileLayer, Marker, Popup, withLeaflet, Tooltip, Polygon } from 'react-leaflet';
import './CustomMap.css';
import AddressControl from './AddressControl'
import sensorMarker from '../resources/sensorMarker.png';
import sensorMarkerCBlind from '../resources/sensorMarkerCBlind.png';
import L from 'leaflet';
import test from './test'

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
      cityCenter: [51.2802, 1.0789],
      zoom: 12,
      marker: {},
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
      arr = Object.values(this.refs.map.leafletElement._targets);
      if(arr[arr.length - 1] != null && arr.length > sensorPositions.length ) {
        this.setState({marker: arr[arr.length - 1]});
        this.state.marker.on('dragend', e => {
          this.state.marker._popup._content = "Home";
          this.setState({marker: arr[arr.length - 1]});
          this.state.marker._popup._content = "Home";
        });
      }
    });
  }

  componentDidUpdate(prevProps) {
    if(prevProps.isColorBlind !== this.props.isColorBlind) {
      //setIcons for sensors and search
    }
  }

  componentWillUnmount() {

  }

  createPolygon(polyObj) {
    // var arr = polyObj.features[0].geometry.coordinates[0];
    // var revArr = this.reverseArr(arr, 0);
    // console.log(arr);
    // console.log(revArr);
    return (
      <Polygon color="purple" positions={polyObj.features[0].geometry.coordinates} />
    );
  }

  // reverseArr(coordinates, c) {
  //   if(isNaN(coordinates[c])) {
  //     return this.reverseArr(coordinates[c], 0);
  //   } else if(!isNaN(coordinates[c])) {
  //     var buff = coordinates[0];
  //     coordinates[0] = coordinates[1];
  //     coordinates[1] = buff;
  //     return this.reverseArr(coordinates, c++);
  //   } else {
  //     return coordinates;
  //   }
  // }

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

  render() {
    const AddressSearch = withLeaflet(AddressControl);
    return (
      <Map
        className="map"
        minZoom="4"
        maxZoom="19"
        center={this.state.cityCenter}
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
          <Overlay checked name="Active Alerts">
            <LayerGroup>

            </LayerGroup>
          </Overlay>
          <Overlay checked name="Canterbury Flood Areas">
            <LayerGroup>
              {this.createPolygon(test)}
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

export default CustomMap;
