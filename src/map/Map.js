import React, {Component} from 'react';
import './Map.css';
import googleApiKey from '.././config/keys';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

// Component containing the google maps
class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showingInfoWindow: false,
			activeMarker: {},
			selectedPlace: {},
    };
	}

	onMarkerClick = (props, marker, e) => {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true,
		});
		console.log(props);
	}
	// Triggers when the user clicks on the map
  onMapClicked = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null,
      }, () => {
				this.setState({
					showingInfoWindow: true,
				});
			});
    }
	};
	// Triggers when the user closes the info window
	InfoWindowHasOpened = () => {
		this.setState({
			showingInfoWindow: true,
		});
	}
	// Triggers when the user opens the info window
	infoWindowHasClosed = () => {
		this.setState({
			showingInfoWindow: false,
		});
	}
	// We init google maps below
  render() {
		let stockholmLongitude = 18.063240;
		let stockholmLatitude = 59.334591;
		return (
			// Actual map
			<Map google={this.props.google} zoom={11}
				onClick={this.mapClicked}
				// Center of map
				initialCenter={{
						lat: stockholmLatitude,
						lng: stockholmLongitude,
					}}
				>
				<Marker onClick={this.onMarkerClick}
          name={'Current location'} />

        <InfoWindow
				  onOpen={this.InfoWindowHasOpened}
				  onClose={this.infoWindowHasClosed}
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}>
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
