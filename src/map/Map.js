import React, {Component} from 'react';
import './Map.css';
import googleApiKey from '.././config/keys';
import PropTypes from 'prop-types';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import List from '../list/list';
import Modal from 'react-modal';
import Filter from '../list/filter';

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
        };
	}

	componentDidMount() {
		// We load the map on mount
		this.loadMap();
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
	onMapClicked = (mapProps, map, clickEvent) => {
		console.log(mapProps);
		this.setState({inputModalOpen: true});
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

	onOpenInputModal = () => {
		this.setState({inputModalOpen: true});
	}
	onCloseInputModal = () => {
		this.setState({inputModalOpen: false});
	}
	handleChange = (event) => {
		this.setState({[event.target.name]: event.target.value});
		// console.log(event.target.value);
	}
	onSubmitModalForm = (event) => {
		event.preventDefault();
		const {locations, value} = this.state;
		this.setState({
			locations: [
				{
					position: event,
					key: Date.now(),
					defaultAnimation: 2,
					name: value,
				},
				...locations,
			],
			value: '',
			inputModalOpen: false,
		});
	}

	inputModal = (address) => {
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


	// We return the loadMap func
    render() {
		let locationsToRender = this.state.locations
			.filter((location) =>
				location.name.toLowerCase().includes(
				this.state.filterString.toLowerCase())
			);
		return (
			<div>
				{this.loadMap()}
				<div style={styles.listWrapper}>
					<div className="items-search-wrapper">
						<Filter onTextChange={(text) => {
							this.setState({filterString: text});
						}}/>
						<List locations={locationsToRender}
							pickLocation={(address) => console.log('Hello: ' + address )}
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
