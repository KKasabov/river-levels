import React, { Component } from 'react';
import { Map, TileLayer, Marker, Popup, withLeaflet } from 'react-leaflet';
import './CustomMap.css';
import AddressControl from './AddressControl'
import marker from '../resources/marker.png';
import L from 'leaflet';

var myIcon = L.icon({
  iconUrl: marker,
  iconSize: [25, 41],
  iconAchor: [22, 94],
  popupAnchor: [0, -10]
});

var cityCenter = [51.2802, 1.0789];


class CustomMap extends Component {
  state = {
    cityCenter: [51.2802, 1.0789],
    zoom: 12,
  };


  render() {
    // var position1 = [this.props.lat1, this.props.lng1];
    // var position2 = [this.props.lat2, this.props.lng2];
    // var position3 = [this.props.lat3, this.props.lng3];

    var position1 = [51.296461, 1.129525];
    var position2 = [51.27857, 1.0770049];
    var position3 = [51.280064, 1.0733199];
    const AddressSearch = withLeaflet(AddressControl);
    return (
      <Map className="map" center={this.state.cityCenter} zoom={this.state.zoom}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        <AddressSearch />
        <Marker
          position={position1}
          icon={myIcon}
          >
          <Popup>
            READING1
          </Popup>
        </Marker>

        <Marker
          position={position2}
          icon={myIcon}
          >
          <Popup>
            READING2
          </Popup>
        </Marker>

        <Marker
          position={position3}
          icon={myIcon}
          >
          <Popup>
            READING3
          </Popup>
        </Marker>
      </Map>
    )
  }
}

export default CustomMap;
