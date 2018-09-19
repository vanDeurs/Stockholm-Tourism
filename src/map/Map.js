import React, {Component} from 'react';
import './Map.css';
import googleApiKey from '.././config/keys';
import GoogleMapReact from 'google-map-react';
import PropTypes from 'prop-types';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import List from '../list/list';
import Modal from 'react-modal';
import Filter from '../filter/filter';

// Bind modal to appElement (http://reactcommunity.org/react-modal/accessibility/)
// For screen readers
Modal.setAppElement('#root');

class MapContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showingInfoWindow: false,
				activeMarker: {},
				locations: [],
				selectedPlace: {},

				inputModalOpen: false,
				value: '',
				filterString: '',

				lat: '',
				lng: '',
        };
	}

	componentDidMount() {
		// We load the map on mount
		this.loadMap();
	}

	// Load in the google maps
	loadMap = () => {
		if (this.props && this.props.google) {
			// If google is available
			return (
				<div style={{height: '100vh', width: '100%'}}>
					<GoogleMapReact
						bootstrapURLKeys={{key: googleApiKey}}
						defaultCenter={this.props.initialCenter}
						defaultZoom={this.props.zoom}
						onClick={this.onMapClicked}
						>
					</GoogleMapReact>
				</div>
			);
		} else {
			return alert('Google maps is not available at this moment.');
		}
	}

	onMarkerClick = (props, marker, e) => {
		console.log(props);
		this.setState({
		selectedPlace: props,
		activeMarker: marker,
		showingInfoWindow: true,
			});
		}
	// Triggers when the user clicks on the map
	onMapClicked = ({lat, lng}) => this.openInputModal(lat, lng);
	openInputModal = (lat, lng) => {
		this.setState({
			inputModalOpen: true,
			lat,
			lng,
		});
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

	onCloseInputModal = () => {
		this.setState({inputModalOpen: false});
	}
	handleChange = (event) => {
		this.setState({[event.target.name]: event.target.value});
	}
	onSubmitModalForm = (event) => {
		event.preventDefault();
		const {locations, value} = this.state;
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
				contentLabel="Spara plats"
			>
				{/* <h2>{address}</h2> */}
				<form className="modal-form" onSubmit={this.onSubmitModalForm}>
					<label> Name:
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
				{/* We load the map */}
				{this.loadMap()}
				<div style={styles.listWrapper}>
					<div className="items-search-wrapper">
						{/* Search Field input */}
						<Filter onTextChange={(text) => {
							this.setState({filterString: text});
						}}/>
						{/* List of filtered locations  */}
						<List locations={locationsToRender}
							pickLocation={(address) => console.log(address.lat + ' ' + address.lng)}
							deleteLocation={(key) => this.deleteLocation(key)}
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
  zoom: 11,
  // Stockholm
  initialCenter: {
    lat: 59.334591,
    lng: 18.063240,
  },
};
