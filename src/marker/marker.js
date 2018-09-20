import React, {Component} from 'react';
import {FaMapPin} from 'react-icons/fa';
import './marker.css';

export const Marker = ({text}) => {
    return (
        <div className="marker"><FaMapPin /></div>
    );
};
