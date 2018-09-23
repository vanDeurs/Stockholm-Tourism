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
				markers: [],
				infoWindow: null,

				inputModalOpen: false,
				value: '',
				filterString: '',

				lat: '',
				lng: '',

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
						center={this.props.center}
						zoom={this.props.zoom}
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

	// Is called when the google api has loaded in
	setMapState = (map, maps) => {
		this.setState({
			map,
			maps,
		});
	}
	// Called in loadMap function
	renderMarkers = () => {
		const {map, maps, markers} = this.state;
		if (!map || !maps) {
			return;
		}
		markers.map((marker) => {
			return marker;
		});
	}

	// Is called in the pickLocation function, which is called when a user clicks
	// on a location in the list
	renderInfoWindow = (marker) => {
		this.state.infoWindow.setContent(marker.name);
		this.state.infoWindow.open(this.state.map, marker);
	}

	// Called when the user clicks on a location im the list
	pickLocation = (marker) => {
		this.state.map.panTo(marker.getPosition());
		this.state.map.setZoom(13);

		this.renderInfoWindow(marker);
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
	// clicks the delete button on a location.
	deleteLocation = (key) => {
		let updatedMarkers = this.state.markers.filter((marker) => {
			return marker.key !== key;
		});
		this.setState({
			markers: updatedMarkers,
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
		const {value, markers, map, maps, lat, lng} = this.state;
		// Create new marker for the location
		let dateKey = Date.now();
		let marker = new maps.Marker({
			position: {lat, lng},
			lat,
			lng,
			map,
			key: dateKey,
			name: value,
			title: value,
		});
		let infoWindow = new maps.InfoWindow();
		// // We copy the current markers state and
		// // replace it with the new updated one
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
							deleteLocation={(key) => this.deleteLocation(key)}
						/>
					</div>
				{this.inputModal()}
			</div>
		);
	};
}

// Overlay when modal is open
Modal.defaultStyles.overlay.backgroundColor = 'rgba(200,200,200,.5)';

export default GoogleApiWrapper({
	apiKey: (googleApiKey),
})(MapContainer);

// Proptypes
MapContainer.propTypes = {
	google: PropTypes.object,
	zoom: PropTypes.number,
	center: PropTypes.object,
};

MapContainer.defaultProps = {
  // Stockholm
  center: {
    lat: 59.334591,
    lng: 18.063240,
  },
  zoom: 11,
};
