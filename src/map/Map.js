import React, {Component} from 'react';
import './Map.css';
import googleApiKey from '.././config/keys';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

class MapContainer extends Component {
  render() {
    return (
      <Map google={this.props.google} zoom={11}>
        <Marker onClick={this.onMarkerClick}
          name={'Current location'} />

        <InfoWindow onClose={this.onInfoWindowClose}>
          <div>
						{/* <h1>{this.state.selectedPlace.name}</h1> */}
						<h1>Some place</h1>
          </div>
        </InfoWindow>
      </Map>
    );
  };
}

export default GoogleApiWrapper({
  apiKey: (googleApiKey)
})(MapContainer)
