import React, {Component} from 'react';
import './Map.css';
import googleApiKey from '.././config/keys';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

// Component containing the google maps
class MapContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedPlace: {
        name: 'Bell',
      },
    };
	}
	// We init google maps below
  render() {
		let stockholmLongitude = 18.063240;
		let stockholmLatitude = 59.334591;
		return (
			// Actual map
			<Map google={this.props.google} zoom={11}
			initialCenter={{
					lat: stockholmLatitude,
					lng: stockholmLongitude,
				}}
			>

        <Marker onClick={this.onMarkerClick}
          name={'Current location'} />

        <InfoWindow onClose={this.onInfoWindowClose}>
          <div>
            <h1>{this.state.selectedPlace.name}</h1>
          </div>
        </InfoWindow>
      </Map>
    );
  };
}

export default GoogleApiWrapper({
  apiKey: (googleApiKey)
})(MapContainer);
