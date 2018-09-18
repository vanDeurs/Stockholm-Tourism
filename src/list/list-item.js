import React from 'react';
import PropTypes from 'prop-types';
import './list-item.css';
import {FaMapPin} from 'react-icons/fa';

export const ListItem = (props) => {
	return (
		<div className="list-item-container">
			<div className="list-item-icon-wrapper">
            <i className="location-icon"><FaMapPin /></i>
			</div>

		<div className="list-item-button-wrapper">
			<div className="list-item-pick-button"
				onClick={() => props.pickLocation()}>
				<p className="place-name">{props.name}</p>
			</div>
		</div>
			<div className="list-item-button-wrapper">
				<div className="delete-button"onClick={() => props.deleteLocation()}>
					<p className="delete-button-text">Ta bort</p>
				</div>
			</div>
		</div>
    );
};

// Proptypes
ListItem.propTypes = {
	name: PropTypes.string.isRequired,
	pickLocation: PropTypes.func.isRequired,
	deleteLocation: PropTypes.func.isRequired,
};

ListItem.defaultProps = {
	name: 'name',
	pickLocation: () => null,
	deleteLocation: () => null,
};
