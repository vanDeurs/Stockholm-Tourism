import React from 'react';
import PropTypes from 'prop-types';
import './list-item.css';
import {FaBeer, FaStar} from 'react-icons/fa';

export const ListItem = (props) => {
	return (
		<div className="list-item-container">
			<div className="list-item-icon-wrapper">
            <i className="location-icon"><FaStar /></i>
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

const styles = {
    dropdownWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        width: '100%',
        borderColor: '#b9b9b9',
        backgroundColor: 'rgba(255,255,255,.8)',

    },
    list: {
        width: '100%',
        borderBottomWidth: 1,
        borderColor: '#b9b9b9',
    },
    locationText: {
        color: '#c3c3c3',
    },
    locationTextFull: {
        fontSize: 13,
        color: '#ccc',
        display: 'flex',
        flexWrap: 'wrap',
    },
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
