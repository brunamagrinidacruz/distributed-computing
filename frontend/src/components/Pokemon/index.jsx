import React from "react";

import './style.scss';

export default function Pokemon(props) {
	return (
		<div className="pokemon">
			<div className={"container " + props.className}>
				<div className="pokemon-image-container">
					<img src="https://www.pngall.com/wp-content/uploads/2016/06/Pokemon-PNG-HD.png" alt="Pokemon" />
				</div>
				<div className="name-container">
					<span>Piplup</span>
				</div>
				<div className="types-container">
					<span className="type">WATER</span>
				</div>
			</div>
		</div>
	)
}