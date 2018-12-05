import React, { createRef, Component } from 'react';
import { LayerGroup, LayersControl, ZoomControl, Map, TileLayer, Marker, Popup, withLeaflet } from 'react-leaflet';
import './CustomMap.css';
import AddressControl from './AddressControl'
import sensorMarker from '../resources/sensorMarker.png';
import L from 'leaflet';

var myIcon = L.icon({
  iconUrl: sensorMarker,
  iconSize: [41, 41],
  iconAchor: [22, 94],
  popupAnchor: [0, -10]
});

const { BaseLayer, Overlay } = LayersControl

class CustomMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cityCenter: [51.2802, 1.0789],
      zoom: 12
    }
  }



  componentDidMount() {
    console.log(this.refs.map.leafletElement);
    this.refs.map.leafletElement.on('move', e => {
      console.log(e.target._animateToCenter);
    });
  }

  componentDidUpdate(prevProps) {

  }

  componentWillUnmount() {

  }

  render() {
    // var position1 = [this.props.lat1, this.props.lng1];
    // var position2 = [this.props.lat2, this.props.lng2];
    // var position3 = [this.props.lat3, this.props.lng3];
    var position1 = [51.296461, 1.129525];
    var position2 = [51.27857, 1.0770049];
    var position3 = [51.280064, 1.0733199];

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
          <BaseLayer checked name="Colour">
            <TileLayer attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          </BaseLayer>
          <BaseLayer name="Black And White">
            <TileLayer attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png" />
          </BaseLayer>
          <Overlay checked name="Sensors">
            <LayerGroup>
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
                  {this.props.sensor_f3_reading}
                </Popup>
              </Marker>

              <Marker
                position={position3}
                icon={myIcon}
                >
                <Popup>
                  {this.props.sensor_45_reading}
                </Popup>
              </Marker>
            </LayerGroup>
          </Overlay>
        </LayersControl>
      </Map>
    )
  }
}

export default CustomMap;
