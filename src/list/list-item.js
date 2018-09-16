import React, { Component } from 'react';
import PropTypes from 'prop-types';

export const ListItem = (props) => {
	return (
		<div
			style={{
				minHeight: 45,
				paddingVertical: 5,
				justifyContent: 'center',
				width: '100%',
				borderBottomWidth: 1,
			}}
			onClick={() => props.pickLocation(props.fullAddress)}
		>
			<div style={{flexDirection: 'row', justifyContent: 'flex-start'}} >
				<div style={{width: '10%', justifyContent: 'center', alignItems: 'center'}}>
					<h1> - </h1>
				</div>

				<div style={{justifyContent: 'space-around', alignItems: 'flex-start', flex: 1}}>
					<p style={styles.nameText}>{props.name}</p>
				</div>
				<div style={{justifyContent: 'center', alignItems: 'flex-start', width: '20%'}}>
					<button onClick={() => props.deleteLocation()}>
						<p style={styles.deleteText}>Ta bort</p>
					</button>
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
