import React, {Component} from 'react';
import {FaMapPin} from 'react-icons/fa';
import './marker.css';

export const InfoBox = ({text, visible}) => {
    if (visible) {
        return (
            <div className="info-box">
                <p>{text}</p>
            </div>
        );
    } else {
        return null;
    }
};

export const Marker = ({text, onClick, infoBoxVisible}) => {
    return (
        <div>
            <InfoBox visible={infoBoxVisible} text={text}/>
            <div
                // onClick={() => onClick()}
                className="marker">
                <FaMapPin />
            </div>
        </div>
    );
};
