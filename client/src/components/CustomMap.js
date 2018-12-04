import React, { createRef, Component } from 'react';
import { LayerGroup, LayersControl, ZoomControl, Map, TileLayer, Marker, Popup, withLeaflet } from 'react-leaflet';
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

const { BaseLayer, Overlay } = LayersControl

class CustomMap extends Component {
  state = {
    cityCenter: [51.2802, 1.0789],
    zoom: 12,
  }
  
  mapRef = createRef()

  handleLocationFound = (e: Object) => {
    console.log(e);
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
        ref={this.mapRef}
        onLocationfound={this.handleLocationFound}
        zoomControl={false}>
        <ZoomControl position="topleft" />
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
            </LayerGroup>
          </Overlay>
        </LayersControl>
        <AddressSearch />

      </Map>
    )
  }
}

export default CustomMap;
