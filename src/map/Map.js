import React, {Component} from 'react';
import './Map.css';
import googleApiKey from '.././config/keys';
import PropTypes from 'prop-types';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import List from '../list/list';
// Component containing the google maps
class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showingInfoWindow: false,
			activeMarker: {},
			locations: [],
			selectedPlace: {},
    };
	}

	componentDidMount() {
		// We load the map on mount
		this.loadMap();
	}

	loadList = () => {
		this.setState({
			locations: [
				...this.state.locations,
			],
		});
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps !== nextState) {
			return true;
		}
	}

	// Load in the google maps
	loadMap = () => {
		if (this.props && this.props.google) {
			// If google is available
			return (
				<Map google={this.props.google} zoom={this.props.zoom}
					onClick={this.onMapClicked}
					initialCenter={this.props.initialCenter}
					>
					<Marker onClick={this.onMarkerClick}
						name={'Current location'}
					/>
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

	handleClick(event) {
		let lat = event.latitude.lat();
		let lng = event.longitude.lng();
		console.log(lat, lng);
	}

	onMarkerClick = (props, marker, e) => {
		console.log(props);
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true,
		});
	}
	// // Triggers when the user clicks on the map
  // onMapClicked = (props) => {
	// 	console.log(props);
  //   if (this.state.showingInfoWindow) {
  //     this.setState({
  //       showingInfoWindow: false,
	// 			activeMarker: null,
	// 		});
	// 	}
	// };
	onMapClicked = (event) => {
		const {locations} = this.state;
		this.setState({
			locations: [
				{
					position: event,
					key: Date.now(),
					defaultAnimation: 2,
				},
				...locations,
			],
		});
		console.log(this.state.locations);
	}
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
	deleteLocation = (key) => {
		let locations = this.state.locations.filter((locations) => {
			return locations.key !== key;
		});
		this.setState({
			locations,
		});
	}
	// We return the loadMap func
  render() {
		return (
			<div>
				{this.loadMap()}
				<div style={styles.listWrapper}>
					<List locations={this.state.locations}
						pickLocation={(address) => console.log('Hello: ' + address )}
						deleteLocation={(key) => this.deleteLocation(key)}
					/>
				</div>
			</div>
    );
  };
}

const styles = {
	wrapper: {

	},
	listWrapper: {
		position: 'absolute',
		top: '7%',
		left: 10,
	},
};

export default GoogleApiWrapper({
	apiKey: (googleApiKey)
})(MapContainer);

// Proptypes
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
