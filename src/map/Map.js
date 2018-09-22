import React, {Component} from 'react';
import './Map.css';
import googleApiKey from '.././config/keys';
import GoogleMapReact from 'google-map-react';
import PropTypes from 'prop-types';
import {Map, InfoWindow, GoogleApiWrapper, Marker} from 'google-maps-react';
import List from '../list/list';
import Modal from 'react-modal';
import Filter from '../filter/filter';
// import {Marker} from '../marker/marker';
// Bind modal to appElement (http://reactcommunity.org/react-modal/accessibility/)
// For screen readers
Modal.setAppElement('#root');

class MapContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showingInfoWindow: false,
				// activeMarker: {},
				locations: [],
				markers: [],
				// selectedPlace: {},

				inputModalOpen: false,
				value: '',
				filterString: '',

				lat: '',
				lng: '',

				center: {
					lat: 59.334591,
					lng: 18.063240,
				},
				zoom: 11,

				map: null,
				maps: null,
        };
	}

	// Load in the google maps.
	loadMap = () => {
		if (this.props && this.props.google) {
			// If google is available
			return (
				<div style={{height: '100vh', width: '100%'}}>
					<GoogleMapReact
						bootstrapURLKeys={{key: googleApiKey}}
						center={this.state.center}
						zoom={this.state.zoom}
						onClick={this.onMapClicked}
						onGoogleApiLoaded={({map, maps}) => this.setMapState(map, maps)}
						yesIWantToUseGoogleMapApiInternals={true}

						
						>
						{this.renderMarkers()}
					</GoogleMapReact>>
				</div>
			);
		} else {
			return alert('Google maps is not available at this moment.');
		}
	}

	setMapState = (map, maps) => {
		this.setState({
			map,
			maps,
		});
	}

	openOrCloseInfoBox = () => {
		this.state.showingInfoWindow
			? this.setState({
				showingInfoWindow: false,
			})
			: this.setState({
				showingInfoWindow: true,
			});
	}

	renderMarkers = () => {
		const {map, maps, locations} = this.state;
		if (!map || !maps) {
			return;
		}
		let marker;
		let markers = [];
		for (let i = 0; i < locations.length; i++) {
			marker = marker = new maps.Marker({
				position: locations[i].position,
				map,
				// key: locations[i].key,
			});
			markers.push(marker);
		}
		return markers;
	}

	// Triggers when the user clicks on the location in the list
	pickLocation = (lat, lng, index) => {
		// Here we clone the original array, modify the state for
		// the clicked location, and then set the state again
		// using the cloned array.
		const newLocations = [...this.state.locations];
		newLocations[index].showingInfoWindow = true;
		this.setState({
			center: {
				lat,
				lng,
			},
			zoom: 13,
			locations: newLocations,
		}, () => {
			// Clears the center and zoom state so we can re-click on the
			// same last location
			this.clearOptions();
		});
	}

	// Triggers in a callback after the user has clicked on a
	// location from the map.
	clearOptions = () => {
		this.setState({
			center: {
				lat: null,
				lng: null,
			},
			zoom: null,
		});
	}

	// Triggers when the user clicks on the map
	onMapClicked = ({lat, lng}) => {
		this.openInputModal(lat, lng);
	}
	// Is triggered in the onMapClicked functions,
	// which runs when the user clicks on the map
	openInputModal = (lat, lng) => {
		this.setState({
			inputModalOpen: true,
			lat,
			lng,
		});
	}
	// Triggers when the user opens the info window
	openInfoWindow = () => {
		this.setState({
			showingInfoWindow: true,
		});
	}
	// Triggers when the user closes the info window
	closeInfoWindow = () => {
		this.setState({
			showingInfoWindow: false,
		});
	}
	// Removed locaton from the location array. Triggers when the user
	// clicks the delete button.
	deleteLocation = (key, position) => {
		console.log('Locations: ', this.state.locations);
		let locations = this.state.locations.filter((locations) => {
			return locations.key !== key;
		});
		this.setState({
			locations,
		});
		this.removeMarkerFromMap(position);
	}
	removeMarkerFromMap = (markerPosition) => {
		for (let i = 0; i < 10; i++) {
			if (this.state.markers[i].key === markerPosition) {
				return;
			}
		}
	}
	// Triggers when the user tries to close the info modal window
	onCloseInputModal = () => {
		this.setState({inputModalOpen: false});
	}
	// Dynamic change handler
	handleChange = (event) => {
		this.setState({[event.target.name]: event.target.value});
	}
	// Triggers when the user saves the location in the modal
	onSubmitModalForm = (event) => {
		event.preventDefault();
		const {locations, value, markers} = this.state;
		this.setState({
			locations: [
				{
					key: Date.now(),
					name: value,
					position: {
						lat: this.state.lat,
						lng: this.state.lng,
					},
				},
				...locations,
			],
			value: '',
			inputModalOpen: false,
		});
	}

	// Modal for saving a location
	inputModal = () => {
		const {
			inputModalOpen,
			value,
		} = this.state;
		return (
		<div>
			<Modal
				isOpen={inputModalOpen}
				onRequestClose={this.onCloseInputModal}
				style={styles.modalStyles}
			>
				<form className="modal-form" onSubmit={this.onSubmitModalForm}>
					<p>Spara plats</p>
					<label> Namn:
						<input type="text"
							className="name-input"
							name="value" value={value}
							onChange={this.handleChange} />
					</label>
					<input type="submit" className="save-button" value="Spara" />
				</form>
			</Modal>
		</div>
		);
	}


    render() {
		// We filter out the locations based on the search input
		let locationsToRender = this.state.locations
			.filter((location) =>
				location.name.toLowerCase().includes(
				this.state.filterString.toLowerCase())
			);
		return (
			<div>
				{/* Google maps */}
				{this.loadMap()}
				<div style={styles.listWrapper}>
					<div className="items-search-wrapper">
						{/* Search Field input */}
						<Filter onTextChange={(text) => {
							this.setState({filterString: text});
						}}/>
						{/* List of filtered locations  */}
						<List locations={locationsToRender}
							pickLocation={(address, index) => this.pickLocation(address.lat, address.lng, index)}
							deleteLocation={(key, address) => this.deleteLocation(key, address)}
						/>
					</div>
				</div>
				{this.inputModal()}
			</div>
		);
	};
}

Modal.defaultStyles.overlay.backgroundColor = 'rgba(200,200,200,.4)';
const styles = {
	listWrapper: {
		position: 'absolute',
		top: '7%',
		left: 10,
	},
	modalStyles: {
		content: {
			top: '42.5%',
			bottom: '42.5%',
			left: '37.5%',
			right: '37.5',
			// marginRight: '-50%',
			// transform: 'translate(-50%, -50%)',
			width: '25%',
			height: '15%',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			borderRadius: 10,
		},
	},
};

export default GoogleApiWrapper({
	apiKey: (googleApiKey)
})(MapContainer);
// export default MapContainer;

// Proptypes
MapContainer.propTypes = {
	google: PropTypes.object,
  zoom: PropTypes.number,
  initialCenter: PropTypes.object,
};

MapContainer.defaultProps = {
  // Stockholm
  initialCenter: {
    lat: 59.334591,
    lng: 18.063240,
  },
};
