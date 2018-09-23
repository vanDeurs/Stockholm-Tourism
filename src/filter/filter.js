import React from 'react';
import {Component} from 'react';
import './filter.css';

class Filter extends Component {
  render() {
    return (
      <div className="filter-container">
        <input className="filter-input"
          type="text"
          placeholder="Sök bland sparade platser..."
          onKeyUp={(event) =>
            this.props.onTextChange(event.target.value)}/>
      </div>
    );
  }
}

export default Filter;
