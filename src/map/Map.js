import React, {Component} from 'react';
import './Map.css';
import googleApiKey from '.././config/keys';
import PropTypes from 'prop-types';
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

	componentDidMount() {
		// We load the map on mount
		this.loadMap();
	}

	loadMap = () => {
		if (this.props && this.props.google) {
			// If google is available
			return (
				<Map google={this.props.google} zoom={this.props.zoom}
					onClick={this.mapClicked}
					// Center of map
					initialCenter={this.props.initialCenter}
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
		} else {
			return alert('Google maps is not available at this moment.');
		}
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
	// We return the loadMap func
  render() {
		return (
			<div>
				{this.loadMap()}
			</div>
    );
  };
}

export default GoogleApiWrapper({
	apiKey: (googleApiKey)
})(MapContainer);

MapContainer.propTypes = {
	google: PropTypes.object,
  zoom: PropTypes.number,
  initialCenter: PropTypes.object,
};

MapContainer.defaultProps = {
  zoom: 11,
  // Stockholm
  initialCenter: {
    lat: 59.334591,
    lng: 18.063240,
  },
};
