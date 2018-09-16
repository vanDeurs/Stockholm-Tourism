
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {ListItem} from './list-item';

class List extends Component {
	// Render each saved location in the list-item component
  renderLocation(location) {
			let addressPosition = location.position;
			let key = location.key;
			let name = location.name;
      return (
        <ListItem
          name={name ? name : 'Name'}
					pickLocation={() => this.props.pickLocation(addressPosition)}
					deleteLocation={() => this.props.deleteLocation(key)}
					key={key}
        />
      );
	}
	// Render the full list of saved locations
  renderResultList(locations) {
		return (
			<div>
				{locations.map((location) => this.renderLocation(location))}
			</div>
		);
  }
    render() {
      return (
				// Run the render function with the locations prop
        <div style={styles.dropdownWrapper}>
            {this.renderResultList(this.props.locations)}
        </div>
      );
    }
  }


List.propTypes = {
    inputFocused: PropTypes.bool,
    locations: PropTypes.array,
    pickLocation: PropTypes.func,
};

List.defaultProps = {
    inputFocused: false,
    locations: [],
    pickLocation: () => null,
};


const styles = {
    dropdownWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        width: '100%',
        borderColor: '#b9b9b9',
        backgroundColor: 'rgba(255,255,255, 1)',
    },
};

export default List;
