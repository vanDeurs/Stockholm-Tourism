
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {ListItem} from './list-item';
import './list.css';

class List extends Component {
	// Render each saved location in the list-item component
  renderLocation(location) {
			let key = location.key;
			let name = location.name;
      return (
        <ListItem
          name={name ? name : 'Undefined name'}
					pickLocation={() => this.props.pickLocation(location)}
					deleteLocation={() => this.props.deleteLocation(key)}
					key={key}
        />
      );
	}
  // Render the full list of saved locations
  renderResultList(locations) {
		return (
			<div className="locations-container">
        {locations.map((location) => {
          return (
            this.renderLocation(location)
          );
        })}
			</div>
		);
  }

  renderEmptyListMessage = () => {
    return (
      <div className="empty-locations-list">
        <p>Du har inga sparade platser</p>
      </div>
    );
  }
    render() {
      return (
        <div className="list-container">
          {this.props.locations.length > 0
            ? this.renderResultList(this.props.locations)
            : this.renderEmptyListMessage()
          }
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

export default List;
