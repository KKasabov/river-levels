import { MapControl } from "react-leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import L from 'leaflet';
import addressMarker from '../resources/addressMarker.png';


class AddressControl extends MapControl {
  createLeafletElement() {
    const provider = new OpenStreetMapProvider();
    return GeoSearchControl({
      provider: provider,
      style: 'bar',
      showMarker: true,
      showPopup: false,
      marker: {
        icon: L.icon({
          iconUrl: addressMarker,
          iconSize: [41, 41],
          iconAchor: [22, 94],
          popupAnchor: [0, -10]
        }),
        draggable: true
      },
      popupFormat: ({ query, result }) => result.label,   // optional: function    - default returns result label
      maxMarkers: 4,
      retainZoomLevel: false,
      animateZoom: true,
      autoClose: true,
      searchLabel: 'Enter address, then drag the marker to adjust ...',
      keepResult: true
    });
  }
}

export default AddressControl;
