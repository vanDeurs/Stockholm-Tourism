import React, {Component} from 'react';
import {FaMapPin} from 'react-icons/fa';
import './marker.css';

export const Marker = ({text, onClick}) => {
    return (
        <div className="marker" onClick={onClick(text)}><FaMapPin /></div>
    );
};
