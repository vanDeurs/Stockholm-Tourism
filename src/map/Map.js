import React, {Component} from 'react';
import './Map.css';
import googleApiKey from '.././config/keys';
import GoogleMapReact from 'google-map-react';
import PropTypes from 'prop-types';
import {GoogleApiWrapper} from 'google-maps-react';
import List from '../list/list';
import Modal from 'react-modal';
import Filter from '../filter/filter';

// For screen readers
Modal.setAppElement('#root');

class MapContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
				showingInfoWindow: false,
				markers: [],
				infoWindow: null,

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
						// Sets the map and maps instance in state,
						// so we can more easily use it in other places
						onGoogleApiLoaded={({map, maps}) => this.setMapState(map, maps)}
						yesIWantToUseGoogleMapApiInternals={true}
						>
						{this.renderMarkers()}
					</GoogleMapReact>
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
	renderMarkers = () => {
		const {map, maps, markers} = this.state;
		if (!map || !maps) {
			return;
		}
		markers.map((marker) => {
			return marker;
		});
	}

	renderInfoWindow = (marker) => {
		this.state.infoWindow.open(this.state.map, marker);
		this.forceUpdate();
	}

	// Triggers when the user clicks on the location in the list
	pickLocation = (address) => {
		this.setState({
			center: {
				lat: address.lat,
				lng: address.lng,
			},
			zoom: 13,
		}, () => {
			// Clears the center and zoom state so we can re-click on the
			// same last location
			this.clearOptions();
			this.renderInfoWindow(address);
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
	// Removes marker from the marker array in state. Triggers when the user
	// clicks the delete button.
	deleteLocation = (key) => {
		let markers = this.state.markers.filter((marker) => {
			return marker.key !== key;
		});
		this.setState({
			markers,
		});
		this.removeMarkerFromMap(key);
	}
	// Removes the marker from the map
	removeMarkerFromMap = (key) => {
		const {markers} = this.state;
		for (let i = 0; i < markers.length; i++) {
			if (markers[i].key === key) {
				markers[i].setMap(null);
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
		const {value, markers, map, maps} = this.state;
		// Create new marker for the location
		let marker = marker = new maps.Marker({
			position: {lat: this.state.lat, lng: this.state.lng},
			lat: this.state.lat,
			lng: this.state.lng,
			map,
			key: Date.now(),
			name: value,
		});
		let infoWindow = new maps.InfoWindow({
			content: value,
		});
		// We copy the current markers state and
		// replace it with the new updated one
		const newMarkers = [...markers];
		newMarkers.push(marker);
		this.setState({
			markers: newMarkers,
			value: '',
			inputModalOpen: false,
			infoWindow,
		});
	}

	// Modal for saving a location
	inputModal = () => {
		const {inputModalOpen, value} = this.state;
		return (
		<div>
			<Modal
				isOpen={inputModalOpen}
				onRequestClose={this.onCloseInputModal}
				className="modal-content"
			>
				<form className="modal-form" onSubmit={this.onSubmitModalForm}>
					<p>Spara plats</p>
					<label> Namn:
						<input type="text"
							className="name-input"
							name="value" value={value}
							onChange={this.handleChange}
						/>
					</label>
					<input type="submit" className="save-button" value="Spara" />
				</form>
			</Modal>
		</div>
		);
	}

    render() {
		// We filter out the locations based on the search input
		let locationsToRender = this.state.markers
			.filter((marker) =>
				marker.name.toLowerCase().includes(
				this.state.filterString.toLowerCase())
			);
		return (
			<div>
				<div className="information-box">
					<p>Klicka på en plats på kartan för att spara den till din lista.
						Där kan du även söka genom
						dina sparade platser.
					</p>
				</div>
				{this.loadMap()}
					<div className="items-search-wrapper">
						<Filter onTextChange={(text) => {
							this.setState({filterString: text});
						}}/>
						<List locations={locationsToRender}
							pickLocation={(address) => this.pickLocation(address)}
							deleteLocation={(key, address) => this.deleteLocation(key, address)}
						/>
					</div>
				{this.inputModal()}
			</div>
		);
	};
}

Modal.defaultStyles.overlay.backgroundColor = 'rgba(200,200,200,.5)';

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
